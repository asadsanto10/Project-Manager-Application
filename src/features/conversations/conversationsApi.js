/* eslint-disable eqeqeq */
import socket from '../../utils/socket';
import { apiSlice } from '../api/apiSlice';
import { messagesApi } from '../messages/messagesApi';

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations/?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,

      // responce modify
      transformResponse(apiResponse, meta) {
        const totalCount = meta.response.headers.get('X-Total-Count');
        // console.log(totalCount);
        return {
          data: apiResponse,
          totalCount,
        };
      },

      async onCacheEntryAdded(args, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded;
          socket.on('conversation', (data) => {
            // updateCachedData((draft) => {
            //   // console.log(data);
            //   // console.log(JSON.stringify(draft));
            //   const conversation = draft.data.find((c) => c.id == data?.data?.id);

            //   if (conversation?.id) {
            //     conversation.message = data?.data?.message;
            //     conversation.timestamp = data?.data?.timestamp;
            //   } else {
            //     //
            //   }
            //   // draft.data.unshift(data.data);
            //   // const index = draft.data(data.data);
            //   // if (index > -1) {
            //   //   // only splice array when item is found
            //   //   console.log(draft.data.splice(index, 1)); // 2nd parameter means remove one item only
            //   // }

            updateCachedData((draft) => {
              // console.log(JSON.stringify(draft));
              // console.log(data?.data);
              if (data.type !== 'conversationAdd') {
                const conversation = draft.data.find((c) => c.id == data?.data?.id);
                if (conversation?.id) {
                  conversation.message = data?.data?.message;
                  conversation.timestamp = data?.data?.timestamp;
                }
                return;
              }

              draft.data.unshift(data.data);
            });

            //   // draft.data.filter((d) => {
            //   //   console.log(JSON.stringify(d.timestamp));
            //   //   return d;
            //   // });
            //   // draft = [];

            //   draft.data.unshift(data.data);
            //   // // console.log(JSON.stringify(draft.data));
            //   // draft.data.filter((d) => {
            //   //   console.log(JSON.stringify(d.timestamp));
            //   //   return d;
            //   // });
            // });
          });
        } catch (err) {
          //
        }

        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getMoreConversations: builder.query({
      query: ({ email, page }) =>
        `/conversations/?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&_limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,
      async onQueryStarted({ email }, { queryFulfilled, dispatch }) {
        try {
          const conversations = await queryFulfilled;

          if (conversations?.data?.length > 0) {
            // update conversation cache  Pessimistic start
            dispatch(
              apiSlice.util.updateQueryData('getConversations', email, (draft) => {
                return {
                  data: [...draft.data, ...conversations.data],
                  totalCount: Number(draft.totalCount),
                };
              })
            );
            // update conversation cache Pessimistic end
          }
        } catch (error) {
          //
        }
      },
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) =>
        `/conversations/?participants_like=${userEmail}-${participantEmail}&participants_like=${participantEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ data }) => ({
        url: `/conversations`,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        // console.log(args);

        // optimistic cache update start
        // const patchResulr1 = dispatch(
        //   apiSlice.util.updateQueryData('getConversations', args.sender, (draft) => {
        //     draft.data.push({ ...args.data, id: args.data.id });
        //   })
        // );
        // optimistic cache update end

        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            // silent entry to message table

            const { users } = args.data;

            const senderUser = users.find((user) => user.email === args.sender);
            const receiverUser = users.find((user) => user.email !== args.sender);

            dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: args.data.message,
                timestamp: args.data.timestamp,
              })
            );
          }
        } catch (error) {
          // patchResulr1.undo();
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conversations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // optimistic cache update start
        const pathResult = dispatch(
          apiSlice.util.updateQueryData('getConversations', arg.sender, (draft) => {
            const draftConversation = draft.data.find((c) => c.id == arg.id);
            draftConversation.message = arg.data.message;
            draftConversation.timestamp = arg.data.timestamp;
          })
        );
        // optimistic cache update end

        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            // silent entry to message table
            const { users } = arg.data;
            const senderUser = users.find((user) => user.email === arg.sender);
            const receiverUser = users.find((user) => user.email !== arg.sender);

            await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            ).unwrap();
          }
        } catch (err) {
          pathResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationsApi;

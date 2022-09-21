/* eslint-disable eqeqeq */
import socket from '../../utils/socket';
import { apiSlice } from '../api/apiSlice';

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) =>
        `/messages/?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,

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
          socket.on('message', (data) => {
            // console.log(data?.data?.conversationId);

            updateCachedData((draft) => {
              // draft.forEach((c) => {
              //   console.log(JSON.stringify(c));
              // });
              const messages = draft.data.find(
                (m) => m.conversationId == data?.data?.conversationId
              );
              if (messages) {
                draft.data.push(data.data);
              }
            });
          });
        } catch (err) {
          await cacheEntryRemoved;
          socket.close();
        }

        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getMoreMessages: builder.query({
      query: ({ id, page }) =>
        `/messages/?conversationId=${id}&_sort=timestamp&_order=desc&_page=${page}&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,

      async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
        try {
          const messages = await queryFulfilled;
          // console.log(messages.data);
          if (messages?.data?.length > 0) {
            dispatch(
              apiSlice.util.updateQueryData('getMessages', id, (draft) => {
                // console.log(JSON.stringify(draft));
                draft.data = [...draft.data, ...messages.data];
              })
            );
          }
        } catch (error) {
          //
        }
      },
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: `/messages`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;

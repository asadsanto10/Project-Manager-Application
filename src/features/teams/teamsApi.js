/* eslint-disable eqeqeq */
import { apiSlice } from '../api/apiSlice';

export const teamApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: (email) => ({
        url: `/teams?assign_like=${email}`,
        method: 'GET',
      }),
      providesTags: ['getTeams'],
    }),

    getTeamName: builder.query({
      query: (teamName) => ({
        url: `/teams?teamName_like=${teamName}`,
        method: 'GET',
      }),
    }),
    addNewTeam: builder.mutation({
      query: (data) => ({
        url: '/teams',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        const { data } = (await queryFulfilled) || {};
        // optimistic cache update start
        const result = dispatch(
          apiSlice.util.updateQueryData('getTeams', args.creator, (draft) => {
            draft.push(data);
          })
        );
        // optimistic cache update end
        try {
          //
        } catch (error) {
          result.undo();
        }
      },
    }),
    updateTeamAssign: builder.mutation({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: 'PATCH',
        body: data !== '' && data,
      }),
      // invalidatesTags: ['getTeams'],
      // async onQueryStarted(args, { queryFulfilled, dispatch }) {
      //   const { data } = (await queryFulfilled) || {};
      //   // optimistic cache update start
      //   dispatch(
      //     apiSlice.util.updateQueryData('getTeams', args.email, (draft) => {
      //       const teams = draft.find((t) => t.id == args.id);
      //       teams.assign = args.data;
      //       console.log(JSON.stringify(teams));
      //     })
      //   );
      //   // optimistic cache update end
      // },
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useAddNewTeamMutation,
  useUpdateTeamAssignMutation,
  useGetTeamNameQuery,
} = teamApi;

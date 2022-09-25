/* eslint-disable eqeqeq */
import { apiSlice } from '../api/apiSlice';

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: `/projects?creator=santo.meridian@gmail.com&_sort=date&_order=desc}`,
        method: 'GET',
      }),
    }),
    addNewProject: builder.mutation({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
      // async onQueryStarted(args, { queryFulfilled, dispatch }) {
      //   const { data } = (await queryFulfilled) || {};
      //   // optimistic cache update start
      //   const result = dispatch(
      //     apiSlice.util.updateQueryData('getTeams', args.creator, (draft) => {
      //       draft.push(data);
      //     })
      //   );
      //   // optimistic cache update end
      //   try {
      //     //
      //   } catch (error) {
      //     result.undo();
      //   }
      // },
    }),
  }),
});

export const { useAddNewProjectMutation, useGetProjectsQuery } = projectsApi;

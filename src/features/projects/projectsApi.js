/* eslint-disable eqeqeq */
import { apiSlice } from '../api/apiSlice';

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (email) => {
        // console.log(email);
        return {
          url: `/projects?_embed=${email}&_sort=date&_order=desc`,
          method: 'GET',
        };
      },
    }),
    addNewProject: builder.mutation({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        const { data } = (await queryFulfilled) || {};
        // console.log(data);
        // console.log(args);
        // optimistic cache update start
        const result = dispatch(
          apiSlice.util.updateQueryData('getProjects', args.creator, (draft) => {
            draft.unshift(data);
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
    updateProject: builder.mutation({
      query: ({ id, data }) => {
        // console.log({ id, data });
        return {
          url: `/projects/${id}`,
          method: 'PATCH',
          body: data,
        };
      },
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        const { data } = (await queryFulfilled) || {};
        // console.log(data);
        // console.log(args);
        // optimistic cache update start
        const result = dispatch(
          apiSlice.util.updateQueryData('getProjects', args.email, (draft) => {
            // eslint-disable-next-line no-return-assign
            return (draft = draft.map((project) =>
              project.id === args.id ? { ...project, stage: args.data.stage } : project
            ));
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
    deleteProject: builder.mutation({
      query: ({ id }) => {
        // console.log({ id, data });
        return {
          url: `/projects/${id}`,
          method: 'DELETE',
        };
      },
      // optimistic cache update start
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        const { data } = (await queryFulfilled) || {};
        // console.log(data);
        // console.log(args);
        // optimistic cache update start
        const result = dispatch(
          apiSlice.util.updateQueryData('getProjects', args.email, (draft) => {
            // eslint-disable-next-line no-return-assign
            return (draft = draft.filter((project) => project.id !== args.id));
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
  }),
});

export const {
  useAddNewProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;

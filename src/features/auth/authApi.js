import { apiSlice } from '../api/apiSlice';
import { userLoggedIn } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem(
            'auth',
            JSON.stringify({
              accessToken: data.accessToken,
              user: data.user,
            })
          );
          dispatch(
            userLoggedIn({
              accessToken: data.accessToken,
              user: data.user,
            })
          );
        } catch (error) {
          // console.log(error);
        }
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          localStorage.setItem(
            'auth',
            JSON.stringify({
              accessToken: data.accessToken,
              user: data.user,
            })
          );
          dispatch(
            userLoggedIn({
              accessToken: data.accessToken,
              user: data.user,
            })
          );
        } catch (error) {
          // console.log(error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

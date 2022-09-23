import { userLoggedOut } from '../auth/authSlice';

const { createApi, fetchBaseQuery } = require('@reduxjs/toolkit/query/react');

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: async (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    // console.log(result);
    if (result?.error?.status === 401) {
      api.dispatch(userLoggedOut);
      localStorage.removeItem('auth');
    }
    return result;
  },
  tagTypes: ['getTeams'],
  endpoints: () => ({}),
});

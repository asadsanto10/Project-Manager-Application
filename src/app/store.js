import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import authSlice from '../features/auth/authSlice';
import conversationsSlice from '../features/conversations/conversationsSlice';

import messagesSlice from '../features/messages/messagesSlice';
import projectsSlice from '../features/projects/projectSlice';
import teamsSlice from '../features/teams/teamsSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
    conversations: conversationsSlice.reducer,
    messages: messagesSlice.reducer,
    teams: teamsSlice.reducer,
    projects: projectsSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddlewares) => getDefaultMiddlewares().concat(apiSlice.middleware),
});

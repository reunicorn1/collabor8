import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import apiConfig from '../../config/apiConfig';
import { LoginUserDto, CreateUserDto, User } from '../../types';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Login user
    loginUser: builder.mutation<{ accessToken: string }, LoginUserDto>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    // Get user profile (for authenticated user)
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
    }),
    // Register new user
    createUser: builder.mutation<User, CreateUserDto>({
      query: (newUser) => ({
        url: '/auth/signup',
        method: 'POST',
        body: newUser,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGetProfileQuery,
  useCreateUserMutation,
} = api;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiConfig from '../config/apiConfig';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: apiConfig.baseUrl }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      { accessToken: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUser: builder.query<any, string>({
      query: (username) => `/users/${username}`,
    }),
  }),
});

export const { useLoginUserMutation, useGetUserQuery } = api;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiConfig from '../config/apiConfig';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:3000',
    credentials: 'same-origin',
    mode: 'cors',
    prepareHeaders(headers, api) {
      headers.set('content-type', 'application/json');
      console.log({ headers, api });
      return headers;
    },
  }),
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

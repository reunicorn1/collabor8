import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@store/store';
import apiConfig from '@config/apiConfig';
import { setCredentials, unsetCredentials } from '@store/slices/authSlice';
import { LoginUserDto, CreateUserDto, User } from '@types';

const baseQuery = fetchBaseQuery({
  baseUrl: apiConfig.baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await api.dispatch(
      api.endpoints.refreshToken.initiate(),
    );
    if (refreshResult.data) {
      const { accessToken } = refreshResult.data;
      api.dispatch(setCredentials({ accessToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(unsetCredentials());
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profile'],
  endpoints: (builder) => ({
    // Login user
    loginUser: builder.mutation<{ accessToken: string }, LoginUserDto>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
    }),
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        credentials: 'include',
      }),
    }),
    // Get user profile (for authenticated user)
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
      providesTags: ['Profile'],
    }),
    // Register new user
    createUser: builder.mutation<User, CreateUserDto>({
      query: (newUser) => ({
        url: '/auth/signup',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGetProfileQuery,
  useCreateUserMutation,
  useRefreshTokenMutation,
} = api;

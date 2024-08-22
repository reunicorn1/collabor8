import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '@store/store';
import apiConfig from '@config/apiConfig';
import { setCredentials, unsetCredentials } from '@store/slices/authSlice';
import { LoginUserDto, CreateUserDto, User } from '@types';

interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * Base query function with default fetch configuration.
 */
const baseQuery = fetchBaseQuery({
  baseUrl: apiConfig.baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = localStorage.getItem('accessToken') || state.auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Base query function with token refresh logic.
 *
 * This function handles automatic token refreshing when a 401 Unauthorized
 * response is encountered. It attempts to refresh the token and retry
 * the original request.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: 'auth/refresh',
        method: 'POST',
        credentials: 'include',
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as RefreshTokenResponse;
      api.dispatch(setCredentials({ accessToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(unsetCredentials());
    }
  }
  return result;
};

/**
 * API service configuration Entry point.
 */
export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profile', 'Environment', 'Project'],
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

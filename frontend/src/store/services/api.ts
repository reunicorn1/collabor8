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
    if (localStorage.getItem('accessToken')) {
      api.dispatch(setCredentials({ accessToken: localStorage.getItem('accessToken') | null }));
      result = await baseQuery(args, api, extraOptions);
      return result;
    }

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
  tagTypes: ['User', 'Profile', 'Environment', 'Project', 'ProjectShare'],
  endpoints: () => ({}),
});

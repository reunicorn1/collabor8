import { api } from './api';
import { LoginUserDto, CreateUserDto, User } from '@types';
import { setCredentials } from '@store/slices/authSlice';
import { setUserDetails } from '@store/slices/userSlice';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    loginUser: builder.mutation<
      { accessToken: string; user: Partial<User> },
      LoginUserDto
    >({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.accessToken }));
          dispatch(setUserDetails(data.user));
        } catch (error) {
          console.error(error);
        }
      },
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
} = authApi;

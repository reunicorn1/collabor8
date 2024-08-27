import { api } from './api';
import { LoginUserDto, CreateUserDto, User } from '@types';
import { setCredentials } from '@store/slices/authSlice';
import { setUserDetails } from '@store/slices/userSlice';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    loginUser: builder.mutation<
      { accessToken: string; user: Partial<User> },
      LoginUserDto & { is_invited?: boolean }
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
    // Verify email
    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: ({ token }) => ({
        url: `/auth/verify`,
        method: 'GET',
        params: { token },
      }),
    }),
    // reset password
    changePassword: builder.mutation<User, { old: string; new: string }>({
      query: (data) => ({
        url: '/auth/me/change-password',
        method: 'PATCH',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<User, { email: string }>({
      query: (email) => ({
        url: '/auth/me/reset-password',
        method: 'POST',
        body: email,
      }),
    }),
    signout: builder.query<void, void>({
      query: () => ({
        url: '/auth/signout',
        method: 'DELETE',
      })
    }),

    // Validate reset token and update password
    validateResetToken: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: ({ token, password }) => ({
        url: '/auth/validate-reset-token',
        method: 'POST',
        body: { password },
        params: { token },
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
// TODO: this is missing a logout endpoint

export const {
  useLoginUserMutation,
  useGetProfileQuery,
  useCreateUserMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useValidateResetTokenMutation,
  useSignoutQuery,
} = authApi;

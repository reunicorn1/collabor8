import { api } from './api';
import { CreateUserDto, User } from '@types';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user profile
    getCurrentUserProfile: builder.query<User, void>({
      query: () => `/users/me`,
      providesTags: ['User'],
    }),
    // Update current user profile
    updateCurrentUserProfile: builder.mutation<User, Partial<CreateUserDto>>({
      query: (data) => ({
        url: `/users/me`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    // Delete current user profile
    deleteCurrentUserProfile: builder.mutation<void, void>({
      query: () => ({
        url: `/users/me`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    // Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
    // Update user by ID
    updateUserById: builder.mutation<
      User,
      { id: string; data: Partial<CreateUserDto> }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    // Delete user by ID
    deleteUserById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCurrentUserProfileQuery,
  useUpdateCurrentUserProfileMutation,
  useDeleteCurrentUserProfileMutation,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} = userApi;

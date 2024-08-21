import { api } from './auth';
import { User } from '@types';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Retrieve all users (admin only)
    findAllUsers: builder.query<User[], void>({
      query: () => ({
        url: '/admin/all',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    // Delete all users (admin only)
    removeAllUsers: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/admin/all',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    // Retrieve a specific user profile by username (admin only)
    findUserAdmin: builder.query<User, string>({
      query: (username) => ({
        url: `/admin/profile/${username}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    // Update a specific user profile by username (admin only)
    updateUserAdmin: builder.mutation<
      User,
      { username: string; data: Partial<User> }
    >({
      query: ({ username, data }) => ({
        url: `/admin/profile/${username}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    // Delete a specific user profile by username (admin only)
    removeUserAdmin: builder.mutation<{ message: string }, string>({
      query: (username) => ({
        url: `/admin/profile/${username}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFindAllUsersQuery,
  useRemoveAllUsersMutation,
  useFindUserAdminQuery,
  useUpdateUserAdminMutation,
  useRemoveUserAdminMutation,
} = adminApi;

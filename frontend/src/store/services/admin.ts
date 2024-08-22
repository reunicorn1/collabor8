import { api } from './api';
import { User, Project, File } from '@types';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Retrieve all users (admin only)
    findAllUsers: builder.query<User[], void>({
      query: () => ({
        url: '/admin/all',
        method: 'GET',
      }),
    }),
    // Delete all users (admin only)
    removeAllUsers: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/admin/all',
        method: 'DELETE',
      }),
    }),
    // Retrieve a specific user profile by username (admin only)
    findUserAdmin: builder.query<User, string>({
      query: (username) => ({
        url: `/admin/profile/${username}`,
        method: 'GET',
      }),
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
    }),
    // Delete a specific user profile by username (admin only)
    removeUserAdmin: builder.mutation<{ message: string }, string>({
      query: (username) => ({
        url: `/admin/profile/${username}`,
        method: 'DELETE',
      }),
    }),
    // Retrieve all projects (admin only)
    findAllProjects: builder.query<Project[], void>({
      query: () => ({
        url: '/admin',
        method: 'GET',
      }),
    }),
    // Retrieve all files (admin only)
    findAllFiles: builder.query<File[], void>({
      query: () => ({
        url: '/admin',
        method: 'GET',
      }),
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
  useFindAllProjectsQuery,
  useFindAllFilesQuery,
} = adminApi;

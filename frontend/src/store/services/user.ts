import { api } from './auth';
import { CreateUserDto, User } from '@types';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get user by username
    getUserByUsername: builder.query<User, string>({
      query: (username) => `/users/${username}`,
      providesTags: (_, __, username) => [{ type: 'User', id: username }],
    }),
    // Update user by username
    updateUserByUsername: builder.mutation<
      User,
      { username: string; data: Partial<CreateUserDto> }
    >({
      query: ({ username, data }) => ({
        url: `/users/${username}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { username }) => [
        { type: 'User', id: username },
      ],
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
      invalidatesTags: (_, __, { id }) => [{ type: 'User', id }],
    }),
    // Delete user by ID
    deleteUserById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'User', id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserByUsernameQuery,
  useUpdateUserByUsernameMutation,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} = userApi;

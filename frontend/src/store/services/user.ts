import { api } from './api';
import { CreateUserDto, User, Project, ProjectSharesOutDto } from '@types';
interface UserFavorite {
  user: Partial<User>;
  favorite_projects: Project[];
  favorite_shares: ProjectSharesOutDto[];
}

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
    getFriendById: builder.query<
      { username: string; profile_picture: string },
      string
    >({
      query: (id) => `/users/friend/${id}`,
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
    getUserByFavorites: builder.query<UserFavorite, void>({
      query: () => `/users/me/favorites`,
      providesTags: ['User'],
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
  useGetUserByFavoritesQuery,
  useLazyGetFriendByIdQuery,
} = userApi;

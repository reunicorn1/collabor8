import { api } from './auth';
import { Environment } from '@types';

export const environmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all environments
    getAllEnvironments: builder.query<Environment[], void>({
      query: () => '/environments',
    }),
    // Get the environment for the current user
    getEnvironmentForCurrentUser: builder.query<Environment, void>({
      query: () => '/environments/me',
      providesTags: ['Environment'],
    }),
    // Delete the environment for the current user
    deleteEnvironmentForCurrentUser: builder.mutation<void, void>({
      query: () => ({
        url: `/environments/me`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Environment'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllEnvironmentsQuery,
  useGetEnvironmentForCurrentUserQuery,
  useDeleteEnvironmentForCurrentUserMutation,
} = environmentApi;

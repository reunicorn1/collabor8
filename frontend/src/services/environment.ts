import { api } from './auth';
import { Project, Environment } from '../types';

const environmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all environments
    getAllEnvironments: builder.query<Environment[], void>({
      query: () => '/environments',
    }),
    // Get environment by ID
    getEnvironmentById: builder.query<Environment, string>({
      query: (id) => `/environments/${id}`,
    }),
    // Get environment projects by username
    getEnvironmentProjectsByUsername: builder.query<Project[], string>({
      query: (username) => `/environments/projects/${username}`,
    }),
    // Delete an environment by ID
    deleteEnvironment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/environments/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllEnvironmentsQuery,
  useGetEnvironmentByIdQuery,
  useGetEnvironmentProjectsByUsernameQuery,
  useDeleteEnvironmentMutation,
} = environmentApi;

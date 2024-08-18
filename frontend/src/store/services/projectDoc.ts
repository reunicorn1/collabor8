import { api } from './auth';
import { ProjectMongo } from '../../types';

export const projectDocApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all projects
    getAllProjects: builder.query<ProjectMongo[], void>({
      query: () => '/project-docs',
    }),
    // Fetch a project by its ID
    getProjectById: builder.query<ProjectMongo, string>({
      query: (id) => `/project-docs/${id}`,
    }),
    // Fetch all projects by username
    getAllProjectsByUsername: builder.query<ProjectMongo[], string>({
      query: (username) => `/project-docs/all/${username}`,
    }),
    // Fetch projects by username with depth
    getProjectsByUsernameDepth: builder.query<
      ProjectMongo[],
      { username: string; depth: number }
    >({
      query: ({ username, depth }) =>
        `/project-docs/${username}/depth?depth=${depth}`,
    }),
    // Delete a project by its ID
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/project-docs/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useGetAllProjectsByUsernameQuery,
  useGetProjectsByUsernameDepthQuery,
  useDeleteProjectMutation,
} = projectDocApi;

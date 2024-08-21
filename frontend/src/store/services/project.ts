import { api } from './auth';
import { Project, CreateProjectDto } from '@types';

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new project
    createProject: builder.mutation<Project, CreateProjectDto>({
      query: (newProject) => ({
        url: '/projects',
        method: 'POST',
        body: newProject,
      }),
    }),
    // Get all projects
    getAllProjects: builder.query<Project[], void>({
      query: () => '/projects',
    }),
    // Get all projects by username
    getProjectsByUsername: builder.query<Project[], string>({
      query: (username) => `/projects/${username}`,
    }),
    // Get a single project by ID
    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
    }),
    // Update a project by ID
    updateProject: builder.mutation<
      Project,
      { id: string; data: Partial<Project> }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    // Delete a project by ID
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useGetProjectsByUsernameQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;

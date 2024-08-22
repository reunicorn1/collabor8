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
    // Get all projects paginated
    // send query params page and limit and sort
      // if sort starts with - it will be descending
      // and must end with the field name
    // returns total, projects, page, limit, totalPages
    getAllProjectsPaginated: builder.query<
      { total: number; projects: Project[]; page: number; limit: number; totalPages: number },
      { page: number; limit: number; sort: string }
    >({
      query: ({ page, limit, sort }) => ({
        url: `/projects?page=${page}&limit=${limit}&sort=${sort}`,
        method: 'GET',
        credentials: 'include',
      }),
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
  useGetAllProjectsPaginatedQuery,
  useLazyGetAllProjectsPaginatedQuery,
  useGetProjectsByUsernameQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;

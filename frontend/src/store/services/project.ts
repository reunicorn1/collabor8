import { api } from './api';
import { Project, CreateProjectDto, UpdateProjectDto } from '@types';

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new project
    createProject: builder.mutation<Project, CreateProjectDto>({
      query: (newProject) => ({
        url: '/projects',
        method: 'POST',
        body: newProject,
        credentials: 'include',
      }),
      invalidatesTags: ['Project'],
    }),
    // Get all projects of the logged-in user by ID
    getAllProjectsByUserId: builder.query<Project[], void>({
      query: () => '/projects',
    }),
    // Retrieve projects by username with depth
    getProjectsByUsernameWithDepth: builder.query<
      Project[],
      { username: string; id: string; depth: number }
    >({
      query: ({ username, id, depth }) =>
        `/projects/${username}/${id}?depth=${depth}`,
    }),
    // Get all projects of the logged-in user, paginated
    getAllProjectsPaginated: builder.query<
      {
        total: number;
        projects: Project[];
        page: number;
        limit: number;
        totalPages: number;
      },
      { page: number; limit: number; sort: string }
    >({
      query: ({ page, limit, sort }) =>
        `/projects/page?page=${page}&limit=${limit}&sort=${sort}`,
      providesTags: ['Project'],
    }),

    // Get all projects by username
    getProjectsByUsername: builder.query<Project[], string>({
      query: (username) => `/projects/${username}`,
    }),
    // Get a single project by ID
    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: ['Project'],
    }),
    // Update a project by ID
    updateProject: builder.mutation<
      Project,
      { id: string; data: Partial<UpdateProjectDto> }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    toggleFavorite: builder.mutation<Project, boolean>({
      query: (id) => ({
        url: `/projects/favorites/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Project', 'User'],
    }),

    // Delete a project by ID
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsByUserIdQuery,
  useGetProjectsByUsernameWithDepthQuery,
  useGetAllProjectsPaginatedQuery,
  useGetProjectsByUsernameQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useToggleFavoriteMutation,
} = projectApi;

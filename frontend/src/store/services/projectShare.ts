import { api } from './api';
import { ProjectShares } from '@types';

export const projectShareApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new project share
    createProjectShare: builder.mutation<ProjectShares, Partial<ProjectShares>>(
      {
        query: (newProjectShare) => ({
          url: '/project-shares',
          method: 'POST',
          body: newProjectShare,
        }),
      },
    ),
    // Retrieve all project shares
    getAllProjectShares: builder.query<ProjectShares[], void>({
      query: () => '/project-shares',
    }),
    // Retrieve a specific project share by ID
    getProjectShareById: builder.query<ProjectShares, string>({
      query: (id) => `/project-shares/${id}`,
    }),
    // Retrieve project shares by project ID
    getProjectSharesByProjectId: builder.query<ProjectShares[], string>({
      query: (project_id) => `/project-shares/project/${project_id}`,
    }),
    // Retrieve project shares by user ID
    getProjectSharesByUserId: builder.query<ProjectShares[], string>({
      query: (user_id) => `/project-shares/user/${user_id}`,
    }),
    // Update a project share
    updateProjectShare: builder.mutation<
      ProjectShares,
      { id: string; data: Partial<ProjectShares> }
    >({
      query: ({ id, data }) => ({
        url: `/project-shares/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    // Delete a project share
    deleteProjectShare: builder.mutation<void, string>({
      query: (id) => ({
        url: `/project-shares/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProjectShareMutation,
  useGetAllProjectSharesQuery,
  useGetProjectShareByIdQuery,
  useGetProjectSharesByProjectIdQuery,
  useGetProjectSharesByUserIdQuery,
  useUpdateProjectShareMutation,
  useDeleteProjectShareMutation,
} = projectShareApi;

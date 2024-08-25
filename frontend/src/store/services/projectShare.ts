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
        invalidatesTags: ['ProjectShare'],
      },
    ),
    // Retrieve all project shares
    getAllProjectShares: builder.query<ProjectShares[], void>({
      query: () => '/project-shares',
        providesTags: ['ProjectShare'],
    }),
    // Retrieve a specific project share by ID
    getProjectShareById: builder.query<ProjectShares, string>({
      query: (id) => `/project-shares/${id}`,
        providesTags: ['ProjectShare'],
    }),
    // Retrieve project shares by project ID
    getProjectSharesByProjectId: builder.query<ProjectShares[], string>({
      query: (_id) => `/project-shares/project/${_id}`,
        providesTags: ['ProjectShare'],
    }),
    // Retrieve project shares by user ID
    getUserProjectShares: builder.query<ProjectShares[], string>({
      query: () => `/project-shares/user/`,
        providesTags: ['ProjectShare'],
    }),
    getProjectSharesPaginated: builder.query<
    ProjectShares[], {page: number; limit: number; sort: string}>({
      query: ({page, limit, sort}) => `/project-shares/page?page=${page}&limit=${limit}&sort=${sort}`,
        providesTags: ['ProjectShare'],
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
        invalidatesTags: ['ProjectShare'],
    }),
    // Delete a project share
    deleteProjectShare: builder.mutation<void, string>({
      query: (id) => ({
        url: `/project-shares/${id}`,
        method: 'DELETE',
      }),
        invalidatesTags: ['ProjectShare'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProjectShareMutation,
  useGetAllProjectSharesQuery,
  useGetProjectShareByIdQuery,
  useGetProjectSharesByProjectIdQuery,
  useGetProjectSharesPaginatedQuery,
  useUpdateProjectShareMutation,
  useDeleteProjectShareMutation,
  useGetUserProjectSharesQuery,
} = projectShareApi;

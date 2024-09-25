import { api } from './api';
import { ProjectShares, ProjectSharesOutDto } from '@types';

type InvitePayload = {
  _id?: string;
  project_id: string;
  inviter_email: string;
  invitee_email: string;
  access_level: string;
};

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
    getRoomToken: builder.query<string, string>({
      query: (id) => `/project-shares/room/token/${id}`,
    }),
    // Retrieve project shares by project ID
    getProjectSharesByProjectId: builder.query<ProjectShares[], string>({
      query: (_id) => `/project-shares/project/${_id}`,
      providesTags: ['ProjectShare'],
    }),
    findMyShare: builder.query<ProjectShares, string>({
      query: (project_id) => `/project-shares/me/${project_id}`,
    }),
    // Retrieve project shares by user ID
    getUserProjectShares: builder.query<ProjectShares[], string>({
      query: () => `/project-shares/user/`,
      providesTags: ['ProjectShare'],
    }),
    getProjectSharesPaginated: builder.query<
      {
        total: number;
        projects: ProjectSharesOutDto[];
        page: number;
        limit: number;
        totalPages: number;
      },
      { page: number; limit: number; sort: string }
    >({
      query: ({ page, limit, sort }) =>
        `/project-shares/page?page=${page}&limit=${limit}&sort=${sort}`,
      providesTags: ['ProjectShare'],
    }),
    toggleShareFavorite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/project-shares/favorites/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Project', 'User'],
    }),
    // Update a project share
    updateProjectShare: builder.mutation<
      ProjectShares,
      { id: string; data: Partial<ProjectShares> }
    >({
      query: ({ id, data }) => ({
        url: `/project-shares/${id}`,
        method: 'PATCH',
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
    updateStatus: builder.mutation<
      ProjectShares | { message: string },
      { share_id: string; status: string }
    >({
      query: ({ share_id, status }) => ({
        url: `/project-shares/status/${share_id}`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: ['ProjectShare'],
    }),
    // Invite a user to collaborate on a project
    inviteUser: builder.mutation<void, InvitePayload>({
      query: ({
        _id,
        project_id,
        inviter_email,
        invitee_email,
        access_level,
      }) => ({
        url: `/project-shares/invite/${project_id}`,
        method: 'POST',
        body: {
          inviter_email,
          invitee_email,
        },
        params: { _id, access_level },
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
  useGetProjectSharesPaginatedQuery,
  useUpdateProjectShareMutation,
  useDeleteProjectShareMutation,
  useGetUserProjectSharesQuery,
  useInviteUserMutation,
  useGetRoomTokenQuery,
  useToggleShareFavoriteMutation,
  useFindMyShareQuery,
  useUpdateStatusMutation,
} = projectShareApi;

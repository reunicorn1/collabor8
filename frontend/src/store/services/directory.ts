import { api } from './auth';
import { CreateDirectoryDto, Directory } from '@types';

export const directoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all directories
    getAllDirectories: builder.query<Directory[], void>({
      query: () => '/directory',
    }),
    // Create a new directory
    createDirectory: builder.mutation<Directory, CreateDirectoryDto>({
      query: (newDirectory) => ({
        url: '/directory',
        method: 'POST',
        body: newDirectory,
      }),
    }),
    // Fetch a specific directory by its ID
    getDirectoryById: builder.query<Directory, string>({
      query: (id) => `/directory/${id}`,
    }),
    // Update a directory by its ID
    updateDirectory: builder.mutation<
      Directory,
      { id: string; data: Partial<Directory> }
    >({
      query: ({ id, data }) => ({
        url: `/directory/${id}`,
        method: 'POST',
        body: data,
      }),
    }),
    // Delete a directory by its ID
    deleteDirectory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/directory/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllDirectoriesQuery,
  useCreateDirectoryMutation,
  useGetDirectoryByIdQuery,
  useUpdateDirectoryMutation,
  useDeleteDirectoryMutation,
} = directoryApi;

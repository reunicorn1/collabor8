import { api } from './auth';
import { DirectoryMongo } from '../../types';

export const projectDocDirApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all directories
    getAllDirectories: builder.query<DirectoryMongo[], void>({
      query: () => '/directory-docs',
    }),
    // Create a new directory
    createDirectory: builder.mutation<DirectoryMongo, Partial<DirectoryMongo>>({
      query: (newDirectory) => ({
        url: '/directory-docs',
        method: 'POST',
        body: newDirectory,
      }),
    }),
    // Fetch a specific directory by its ID
    getDirectoryById: builder.query<DirectoryMongo, string>({
      query: (id) => `/directory-docs/${id}`,
    }),
    // Delete a directory by its ID
    deleteDirectory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/directory-docs/${id}`,
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
  useDeleteDirectoryMutation,
} = projectDocDirApi;

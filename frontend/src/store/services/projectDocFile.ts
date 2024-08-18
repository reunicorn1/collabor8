import { api } from './auth';
import { FileMongo } from '../../types';

export const projectDocFilesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all files
    getAllFiles: builder.query<FileMongo[], void>({
      query: () => '/file-docs',
    }),
    // Fetch a file by its ID
    getFileById: builder.query<FileMongo, string>({
      query: (id) => `/file-docs/${id}`,
    }),
    // Create a new file
    createFile: builder.mutation<FileMongo, Partial<FileMongo>>({
      query: (newFile) => ({
        url: '/file-docs',
        method: 'POST',
        body: newFile,
      }),
    }),
    // Delete a file by its ID
    deleteFile: builder.mutation<void, string>({
      query: (id) => ({
        url: `/file-docs/${id}`,
        method: 'DELETE',
      }),
    }),
    // Fetch files by parent ID
    getFilesByParent: builder.query<FileMongo[], string>({
      query: (parent_id) => `/file-docs?parent_id=${parent_id}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllFilesQuery,
  useGetFileByIdQuery,
  useCreateFileMutation,
  useDeleteFileMutation,
  useGetFilesByParentQuery,
} = projectDocFilesApi;

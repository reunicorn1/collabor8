import { api } from './api';
import { File } from '@types';

export const fileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch a file by its ID
    getFileById: builder.query<File, string>({
      query: (id) => `/files/${id}`,
    }),
    // Create a new file
    createFile: builder.mutation<File, Partial<File>>({
      query: (newFile) => ({
        url: '/files',
        method: 'POST',
        body: newFile,
      }),
    }),
    // Update a file by its ID
    updateFile: builder.mutation<File, { id: string; data: Partial<File> }>({
      query: ({ id, data }) => ({
        url: `/files/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    // Execute a file by its ID
    executeFile: builder.mutation<{ output: { stdout: string, stderr: string } },
    { id: string, language: string }>({
      query: ({ id, language }) => ({
        url: `/files/execute/${id}`,
        method: 'POST',
        body: { language },
      }),
    }),
    // Delete a file by its ID
    deleteFile: builder.mutation<void, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFileByIdQuery,
  useCreateFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
  useExecuteFileMutation,
} = fileApi;

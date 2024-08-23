// projectThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { projectApi } from '@store/services/project';
import { Project } from '@types';

// Define thunk to fetch recent projects
export const fetchRecentProjects = createAsyncThunk(
  'projects/fetchRecentProjects',
  async (params: { page: number; limit: number; sort: string }) => {
    const response = await projectApi.endpoints.getAllProjectsPaginated.initiate(params);
    return response.data;
  }
);

// Define thunk to fetch user projects
export const fetchUserProjects = createAsyncThunk(
  'projects/fetchUserProjects',
  async (params: { page: number; limit: number; sort: string }) => {
    const response = await projectApi.endpoints.getAllProjectsPaginated.initiate(params);
    return response.data;
  }
);

// Define thunk to fetch shared projects
export const fetchSharedProjects = createAsyncThunk(
  'projects/fetchSharedProjects',
  async (params: { page: number; limit: number; sort: string }) => {
    const response = await projectApi.endpoints.getAllProjectsPaginated.initiate(params);
    return response.data;
  }
);

// Define thunk to fetch all projects
export const fetchAllProjects = createAsyncThunk(
  'projects/fetchAllProjects',
  async (params: { page: number; limit: number; sort: string }) => {
    const response = await projectApi.endpoints.getAllProjectsPaginated.initiate(params);
    return response.data;
  }
);


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '@types';
import { projectApi } from '@store/services/project';
import * as projectUtils from '@utils/dashboard.utils';

interface projects {
  project_name: string;
  username: string;
  description: string;
  updated_at: string;
  created_at: string;
  project_id: string;
  projectShares: string[];
}

interface recentProjectsInterface {
  project_name: string;
  username: string;
  description: string;
  updated_at: string;
  created_at: string;
  project_id: string;
  projectShares: string[];
  laseEdited: string;
}

interface recentProjects {
  recentProjects: recentProjectsInterface[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  status?: string;
  error?: string;
}

interface userProjects {
  userProjects: projects[];
  page: number;
  limit: number;
  total: number;
  sort: string;
  totalPages: number;
  status?: string;
  error?: string;
}

interface sharedProjects {
  sharedProjects: Partial<projects[]>;
  page: number;
  limit: number;
  total: number;
  sort: string;
  totalPages: number;
  status?: string;
  error?: string;
}
interface allProjects {
  allProjects: projects[];
  page: number;
  limit: number;
  total: number;
  sort: string;
  totalPages: number;
  status?: string;
  error?: string;
}

interface ProjectsState {
  recentProjects: recentProjects;
  userProjects: userProjects;
  sharedProjects: sharedProjects;
  allProjects: allProjects;
  pagination: {
    recentProjects: { page: number; limit: number; sort: string };
    userProjects: { page: number; limit: number; sort: string };
    allProjects: { page: number; limit: number; sort: string };
    sharedProjects: { page: number; limit: number; sort: string };
  };
}

const initialState: ProjectsState = {
  recentProjects: {
    recentProjects: [],
    page: 1,
    limit: 5,
    total: -1,
    totalPages: 0,
    status: 'idle',
  },
  userProjects: {
    userProjects: [],
    page: 1,
    limit: 10,
    total: -1,
    sort: '-created_at',
    totalPages: 0,
    status: 'idle',
  },
  sharedProjects: {
    sharedProjects: [],
    page: 1,
    limit: 10,
    total: -1,
    sort: '-created_at',
    totalPages: 0,
    status: 'idle',
  },
  allProjects: {
    allProjects: [],
    page: 1,
    limit: 10,
    total: -1,
    sort: '-created_at',
    totalPages: 0,
    status: 'idle',
  },
  pagination: {
    recentProjects: { page: 1, limit: 5, sort: '-updated_at' },
    userProjects: { page: 1, limit: 10, sort: '-created_at' },
    allProjects: { page: 1, limit: 10, sort: '-created_at' },
    sharedProjects: { page: 1, limit: 10, sort: '-created_at' },
  },
};


const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setRecentProjects: (state, action: PayloadAction<recentProjects>) => {
      const payload = action.payload;
      state.recentProjects = {
        recentProjects: projectUtils.setRecentProjectsFromAllProjects(payload.projects),
        page: payload.page,
        limit: payload.limit,
        total: payload.total,
        totalPages: payload.totalPages,
        status: 'succeeded',
      };
    },
    setRecentProjectsPagination: (state, action: PayloadAction<{ page: number; limit: number; sort: string }>) => {
      state.pagination.recentProjects = action.payload;
    },
    setUserProjects: (state, action: PayloadAction<userProjects>) => {
      const payload = action.payload;
      console.log('Setting user projects', payload);
      state.userProjects = {
        userProjects: payload.projects,
        page: payload.page,
        limit: payload.limit,
        total: payload.total,
        sort: payload.sort,
        totalPages: payload.totalPages,
        status: 'succeeded',
      };
    },
    setUserProjectsPagination: (state, action: PayloadAction<{ page: number; limit: number; sort: string }>) => {
      state.pagination.userProjects = action.payload;
    },
    setSharedProjects: (state, action: PayloadAction<sharedProjects>) => {
      state.sharedProjects = action.payload;
    },
    setSharedProjectsPagination: (state, action: PayloadAction<{ page: number; limit: number; sort: string }>) => {
      state.pagination.sharedProjects = action.payload;
    },
    setAllProjects: (state, action: PayloadAction<allProjects>) => {
      state.allProjects = action.payload;
    },
    setAllProjectsPagination: (state, action: PayloadAction<{ page: number; limit: number; sort: string }>) => {
      state.pagination.allProjects = action.payload;
    },
    clearRecentProjects: (state) => {
      state.recentProjects = initialState.recentProjects;
    },
    clearUserProjects: (state) => {
      state.userProjects = initialState.userProjects;
    },
    clearSharedProjects: (state) => {
      state.sharedProjects = initialState.sharedProjects;
    },
    clearAllProjects: (state) => {
      state.allProjects = initialState.allProjects;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addMatcher(
  //       projectApi.endpoints.createProject.matchFulfilled,
  //       (state, action) => {
  //         setRecentProjects(state, action);
  //       })
  // },



});

export const { setRecentProjects, setUserProjects, setSharedProjects,
  setAllProjects, setRecentProjectsPagination, setUserProjectsPagination,
  setSharedProjectsPagination, setAllProjectsPagination, clearRecentProjects,
  clearUserProjects, clearSharedProjects, clearAllProjects } = projectSlice.actions;
export default projectSlice.reducer;

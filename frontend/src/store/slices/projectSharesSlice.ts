import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '@types';
import { projectApi } from '@store/services/project';
import * as projectUtils from '@utils/dashboard.utils';

interface projectShares {
  project_name: string;
  username: string;
  description: string;
  updated_at: string;
  created_at: string;
  project_id: string;
  _id: string;
  projectShares: string[];
}

interface recentProjectsInterface {
  project_name: string;
  username: string;
  description: string;
  updated_at: string;
  created_at: string;
  project_id: string;
  _id: string;
  projectShares: string[];
  laseEdited: string;
}

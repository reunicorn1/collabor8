import { ObjectId } from 'mongodb';

/* eslint-disable no-unused-vars */
export enum Role {
  Admin = 'admin',
  User = 'user',
}
/* eslint-enable no-unused-vars */

/**
 * User-related DTOs and interfaces
 */
export interface CreateUserDto {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  favorite_languages?: string[];
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface User {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  bio?: string;
  profile_picture?: string;
  email: string;
  favorite_languages?: string[];
  created_at: Date;
  updated_at: Date;
  roles: Role[];
}

/**
 * Project-related DTOs and interfaces
 */
export interface CreateProjectDto {
  project_name: string;
  description: string;
}

export interface UpdateProjectDto {
  project_name: string;
  description: string;
  updated_at: Date;
  favorite: boolean;
}

export interface Project {
  project_id: string;
  project_name: string;
  owner_id: string;
  username: string;
  environment_id?: string;
  created_at: Date;
  updated_at: Date;
  _id: string;
  children: any;
}

interface projects {
  project_name: string;
  username: string;
  description: string;
  updated_at: string;
  created_at: string;
  project_id: string;
  _id: string;
  projectShares: string[];
}

export interface ProjectSharesOutDto {
  share_id: string;
  project_id: string;
  user_id: string;
  favorite: boolean;
  access_level: 'read' | 'write';
  created_at: string;
  updated_at: string;
  member_count: number;
  first_name: string;
  last_name: string;
  username: string;
  project_name: string;
  _id?: string;
}
export interface sharedProjects { // multiple mutated
  sharedProjects: Partial<projects[]>;
  page: number;
  limit: number;
  total: number;
  sort: string;
  totalPages: number;
  status?: string;
  error?: string;
}
export interface ProjectShares {
  status: string;
  profile_picture: string; // Declared property
  // singlar
  share_id: string;
  project_id: string;
  _id: string;
  user_id: string;
  favorite: boolean;
  access_level: 'read' | 'write';
  created_at: Date;
  updated_at: Date;
  member_count: number;
  first_name: string;
  last_name: string;
  username: string;
  project_name: string;
}

/**
 * Environment-related interfaces
 */
export interface Environment {
  _id: string;
  username: string;
  projects: Project[];
}

/**
 * Project document structure in MongoDB
 */
export interface ProjectMongo {
  _id: string;
  project_name: string;
  created_at: Date;
  environment_id?: string;
  directories: Directory[];
  files: File[];
  shared_with: Array<{ user_id: string; access_level: 'read' | 'write' }>;
}

/**
 * Directory-related DTOs and interfaces
 */
export interface CreateDirectoryDto {
  name: string;
  username?: string;
  parent_id: string;
  project_id: string;
}

export interface Directory {
  _id: string;
  name: string;
  created_at: Date;
  parent_id?: ObjectId | string;
  children: Directory[];
  files: File[];
}

/**
 * File-related interfaces
 */
export interface File {
  _id: string;
  name: string;
  file_content: string;
  project_id: ObjectId | string;
  parent_id?: ObjectId | string;
  created_at: Date;
  updated_at: Date;
}

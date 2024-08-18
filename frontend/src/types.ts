import { ObjectId } from 'mongodb';

/* eslint-disable no-unused-vars */
export enum Role {
  Admin = 'admin',
  User = 'user',
}
/* eslint-enable no-unused-vars */

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
  email: string;
  favorite_languages?: string[];
  created_at: Date;
  updated_at: Date;
  roles: Role[];
}

export interface CreateProjectDto {
  project_name: string;
  username: string;
}

export interface Project {
  project_id: string;
  project_name: string;
  owner_id: string;
  environment_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectShares {
  share_id: string;
  project_id: string;
  user_id: string;
  access_level: 'read' | 'write';
}

export interface Environment {
  _id: string;
  username: string;
  projects: Project[];
}

export interface ProjectMongo {
  _id: string;
  project_name: string;
  created_at: Date;
  environment_id?: string;
  directories: DirectoryMongo[];
  files: FileMongo[];
  shared_with: Array<{ user_id: string; access_level: 'read' | 'write' }>;
}

export interface DirectoryMongo {
  _id: ObjectId | string;
  directory_name: string;
  created_at: Date;
  parent_id?: ObjectId | string;
  children: DirectoryMongo[];
  files: FileMongo[];
}

export interface FileMongo {
  _id: ObjectId | string;
  file_name: string;
  file_content: string;
  parent_id?: ObjectId | string;
  created_at: Date;
  updated_at: Date;
}

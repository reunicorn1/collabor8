import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities
//
interface CreateProjectShareDto {
  project_id: string;
  _id?: string;
  username?: string;
  user_id?: string;
  email?: string;
  access_level: 'read' | 'write';
}

interface UpdateProjectShareDto {
  access_level?: 'read' | 'write';
  favorite?: boolean;
}

interface ProjectSharesOutDto {
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

function validateCreateProjectShareDto(dto: any): CreateProjectShareDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { project_id, access_level, _id, username, user_id } = dto;

  if (!user_id && !username) {
    throw new BadRequestException('User ID or username is required');
  }

  if (username && typeof username !== 'string') {
    throw new BadRequestException('Username must be a string');
  }

  if (user_id && typeof user_id !== 'string') {
    throw new BadRequestException('User ID must be a string');
  }

  if (!project_id && !_id) {
    throw new BadRequestException('Project ID is required');
  }

  if (typeof project_id !== 'string' || project_id.trim() === '') {
    throw new BadRequestException(
      'Project ID is required and must be a string',
    );
  }

  if (access_level && typeof access_level !== 'string') {
    throw new BadRequestException('Access level must be a string');
  }

  if (_id && typeof _id !== 'string') {
    throw new BadRequestException('_id must be a string');
  }

  return {
    project_id: project_id.trim(),
    access_level: access_level.trim(),
    _id: _id ? _id.trim() : null,
    username: username ? username.trim() : null,
    user_id: user_id ? user_id.trim() : null,
  };
}

function validateUpdateProjectShareDto(dto: any): UpdateProjectShareDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { access_level, favorite } = dto;

  if (access_level && typeof access_level !== 'string') {
    throw new BadRequestException('Access level must be a string');
  }

  if (favorite && typeof favorite !== 'boolean') {
    throw new BadRequestException('Favorite must be a boolean');
  }

  return {
    access_level: access_level.trim(),
    favorite,
  };
}

function validateProjectSharesOutDto(dto: any): ProjectSharesOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { share_id, project_id, user_id, favorite, access_level, created_at, updated_at, member_count, first_name, last_name, username, project_name, _id } = dto;

  if (typeof share_id !== 'string' || share_id.trim() === '') {
    throw new BadRequestException(
      'Share ID is required and must be a string',
    );
  }

  if (typeof project_id !== 'string' || project_id.trim() === '') {
    throw new BadRequestException(
      'Project ID is required and must be a string',
    );
  }

  if (typeof user_id !== 'string' || user_id.trim() === '') {
    throw new BadRequestException(
      'User ID is required and must be a string',
    );
  }

  if (typeof favorite !== 'boolean') {
    throw new BadRequestException('Favorite must be a boolean');
  }

  if (access_level && typeof access_level !== 'string') {
    throw new BadRequestException('Access level must be a string');
  }

  if (typeof created_at !== 'string' || created_at.trim() === '') {
    throw new BadRequestException('Created at must be a string');
  }

  if (typeof updated_at !== 'string' || updated_at.trim() === '') {
    throw new BadRequestException('Updated at must be a string');
  }

  if (typeof member_count !== 'number') {
    throw new BadRequestException('Member count must be a number');
  }

  if (typeof first_name !== 'string' || first_name.trim() === '') {
    throw new BadRequestException(
      'First name is required and must be a string',
    );
  }

  if (typeof last_name !== 'string' || last_name.trim() === '') {
    throw new BadRequestException(
      'Last name is required and must be a string',
    );
  }

  if (typeof username !== 'string' || username.trim() === '') {
    throw new BadRequestException(
      'Username is required and must be a string',
    );
  }

  if (typeof project_name !== 'string' || project_name.trim() === '') {
    throw new BadRequestException(
      'Project name is required and must be a string',
    );
  }

  if (typeof _id !== 'string' || _id.trim() === '') {
    throw new BadRequestException(
      '_id is required and must be a string',
    );
  }

  return {
    share_id: share_id.trim(),
    project_id: project_id.trim(),
    user_id: user_id.trim(),
    favorite,
    access_level: access_level.trim(),
    created_at,
    updated_at,
    member_count,
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    username: username.trim(),
    project_name: project_name.trim(),
    _id: _id ? _id.trim() : null,
  };
}

function parseCreateProjectDto(requestBody: any): CreateProjectShareDto {
  const validated = validateCreateProjectShareDto(requestBody);

  return validated;
}

function parseUpdateProjectDto(requestBody: any): UpdateProjectShareDto {
  const validated = validateUpdateProjectShareDto(requestBody);

  return validated;
}

function parseProjectSharesOutDto(requestBody: any): ProjectSharesOutDto {
  const validated = validateProjectSharesOutDto(requestBody);

  return validated;
}

export {
  parseCreateProjectDto,
  CreateProjectShareDto,
  parseUpdateProjectDto,
  UpdateProjectShareDto,
  parseProjectSharesOutDto,
  ProjectSharesOutDto,
};

import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities
//
interface CreateProjectMongoDto {
  project_name: string;
  owner_id: string;
  project_id?: string;
  environment_id?: string;
  username?: string;
}

interface UpdateProjectMongoDto {
  project_name?: string;
  updated_at?: Date;
}

function validateCreateProjectDto(dto: any): CreateProjectMongoDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { project_name, owner_id, project_id, environment_id, username } = dto;

  if (typeof project_name !== 'string' || project_name.trim() === '') {
    throw new BadRequestException(
      'Project name is required and must be a string',
    );
  }

  if (typeof owner_id !== 'string' || owner_id.trim() === '') {
    throw new BadRequestException('Owner ID is required and must be a string');
  }

  if (project_id && typeof project_id !== 'string') {
    throw new BadRequestException('Project ID must be a string');
  }

  if (environment_id && typeof environment_id !== 'string') {
    throw new BadRequestException('Environment ID must be a string');
  }

  if (username && typeof username !== 'string') {
    throw new BadRequestException('Username must be a string');
  }

  return {
    project_name: project_name.trim(),
    owner_id: owner_id.trim(),
    project_id: project_id ? project_id.trim() : undefined,
    environment_id: environment_id ? environment_id.trim() : undefined,
    username: username ? username.trim() : undefined,
  };
}

function validateUpdateProjectDto(dto: any): UpdateProjectMongoDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { project_name, updated_at } = dto;

  if (project_name && typeof project_name !== 'string') {
    throw new BadRequestException('Project name must be a string');
  }

  return {
    project_name: project_name?.trim(),
    updated_at: updated_at?.toString().trim(),
  };
}

function parseCreateProjectMongoDto(requestBody: any): CreateProjectMongoDto {
  const validated = validateCreateProjectDto(requestBody);

  return validated;
}

function parseUpdateProjectMongoDto(requestBody: any): UpdateProjectMongoDto {
  const validated = validateUpdateProjectDto(requestBody);

  return validated;
}

export {
  parseCreateProjectMongoDto,
  CreateProjectMongoDto,
  parseUpdateProjectMongoDto,
  UpdateProjectMongoDto,
};

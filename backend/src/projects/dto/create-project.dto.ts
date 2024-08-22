import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities
//
interface CreateProjectDto {
  project_name: string;
  description: string;
  username?: string;
}

interface UpdateProjectDto {
  project_name?: string;
  description?: string;
  updated_at?: Date;
}

function validateCreateProjectDto(dto: any): CreateProjectDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { project_name, description } = dto;

  if (typeof project_name !== 'string' || project_name.trim() === '') {
    throw new BadRequestException(
      'Project name is required and must be a string',
    );
  }

  if (typeof description !== 'string') {
    throw new BadRequestException('description is required and must be a string');
  }
  return { project_name, description };
}

function validateUpdateProjectDto(dto: any): UpdateProjectDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { project_name, description, updated_at } = dto;

  if (project_name && typeof project_name !== 'string') {
    throw new BadRequestException('Project name must be a string');
  }

  if (description && typeof description !== 'string') {
    throw new BadRequestException('Description must be a string');
  }

  return { project_name, description, updated_at };
}

function parseCreateProjectDto(requestBody: any): CreateProjectDto {
  const validated = validateCreateProjectDto(requestBody);

  return validated;
}

function parseUpdateProjectDto(requestBody: any): UpdateProjectDto {
  const validated = validateUpdateProjectDto(requestBody);

  return validated;
}

export {
  parseCreateProjectDto,
  CreateProjectDto,
  parseUpdateProjectDto,
  UpdateProjectDto,
};

import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities

interface CreateDirectoryOutDto {
  name: string;
  parent_id: string;
  project_id: string;
}

interface UpdateDirectoryOutDto {
  name?: string;
  parent_id?: string;
  updated_at?: Date;
}

function validateCreateDirectoryDto(dto: any): CreateDirectoryOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { name, parent_id, project_id } = dto;

  if (typeof parent_id !== 'string' || parent_id.trim() === '') {
    throw new BadRequestException('parent ID is required and must be a string');
  }

  if (typeof name !== 'string' || name.trim() === '') {
    throw new BadRequestException(
      'Directory name is required and must be a string',
    );
  }

  if (typeof project_id !== 'string' || project_id.trim() === '') {
    throw new BadRequestException(
      'Project ID is required and must be a string',
    );
  }

  return {
    name: name.trim(),
    parent_id: parent_id.trim(),
    project_id: project_id.trim(),
  };
}

function validateUpdateDirectoryDto(dto: any): UpdateDirectoryOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { name, parent_id, updated_at } = dto;

  if (name && typeof name !== 'string') {
    throw new BadRequestException('Directory name must be a string');
  }

  if (parent_id && typeof parent_id !== 'string') {
    throw new BadRequestException('Parent ID must be a string');
  }

  return {
    name: name?.trim(),
    parent_id: parent_id?.trim(),
    updated_at: updated_at?.toString()?.trim(),
  };
}

function parseCreateDirectoryMongoDto(requestBody: any): CreateDirectoryOutDto {
  const validated = validateCreateDirectoryDto(requestBody);

  return validated;
}

function parseUpdateDirectoryMongoDto(requestBody: any): UpdateDirectoryOutDto {
  const validated = validateUpdateDirectoryDto(requestBody);

  return validated;
}

export {
  parseCreateDirectoryMongoDto,
  CreateDirectoryOutDto,
  parseUpdateDirectoryMongoDto,
  UpdateDirectoryOutDto,
};

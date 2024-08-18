import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities
//
interface CreateProjectMongoDto {
  project_name: string;
  owner_id: string;
}

function validateCreateProjectDto(dto: any): CreateProjectMongoDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { project_name, owner_id } = dto;

  if (typeof project_name !== 'string' || project_name.trim() === '') {
    throw new BadRequestException(
      'Project name is required and must be a string',
    );
  }

  if (typeof owner_id !== 'string' || owner_id.trim() === '') {
    throw new BadRequestException('Owner ID is required and must be a string');
  }

  return { project_name, owner_id };
}

function parseCreateProjectMongoDto(requestBody: any): CreateProjectMongoDto {
  const validated = validateCreateProjectDto(requestBody);

  return validated;
}

export { parseCreateProjectMongoDto, CreateProjectMongoDto };

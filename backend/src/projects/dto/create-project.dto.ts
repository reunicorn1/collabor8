import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities
//
interface CreateProjectDto {
  project_name: string;
  username: string;
}

function validateCreateProjectDto(dto: any): CreateProjectDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { project_name, username } = dto;

  if (typeof project_name !== 'string' || project_name.trim() === '') {
    throw new BadRequestException(
      'Project name is required and must be a string',
    );
  }

  if (typeof username !== 'string' || username.trim() === '') {
    throw new BadRequestException('Username is required and must be a string');
  }
  return { project_name, username };
}

function parseCreateProjectDto(requestBody: any): CreateProjectDto {
  const validated = validateCreateProjectDto(requestBody);

  return validated;
}

export { parseCreateProjectDto, CreateProjectDto };

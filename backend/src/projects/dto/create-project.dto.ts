import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
// TODO: create dto for all the entities
//
class CreateProjectDto {
  @ApiProperty()
  project_name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  username?: string;
}

class UpdateProjectDto {
  @ApiProperty()
  project_name?: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  updated_at?: Date;
}

function validateCreateProjectDto(dto: any): CreateProjectDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { project_name, description, username } = dto;
  if (typeof project_name !== 'string' || project_name.trim() === '') {
    throw new BadRequestException(
      'Project name is required and must be a string',
    );
  }

  if (typeof description !== 'string') {
    throw new BadRequestException('description is required and must be a string');
  }

  if (username && typeof username !== 'string') {
    throw new BadRequestException('Username must be a string');
  }


  return {
    project_name: project_name.trim(),
    description,
    username: username.trim(),
  };
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

  return {
    project_name: project_name.trim(),
    description,
    updated_at: updated_at.toString().trim(),
   };
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

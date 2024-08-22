import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities

interface CreateDirectoryOutDto {
  directory_name: string;
  username: string;
  parent_id: string;
}

interface UpdateDirectoryOutDto {
  directory_name?: string;
  username?: string;
  parent_id?: string;
  updated_at?: Date;
}

function validateCreateDirectoryDto(dto: any): CreateDirectoryOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { directory_name, username, parent_id } = dto;

  if (typeof parent_id !== 'string' || parent_id.trim() === '') {
    throw new BadRequestException('parent ID is required and must be a string');
  }

  if (typeof directory_name !== 'string' || directory_name.trim() === '') {
    throw new BadRequestException(
      'Directory name is required and must be a string',
    );
  }

  if (typeof username !== 'string' || username.trim() === '') {
    throw new BadRequestException('username is required and must be a string');
  }

  return { directory_name, username, parent_id };
}

function validateUpdateDirectoryDto(dto: any): UpdateDirectoryOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { directory_name, username, parent_id, updated_at } = dto;

  if (directory_name && typeof directory_name !== 'string') {
    throw new BadRequestException('Directory name must be a string');
  }

  if (parent_id && typeof parent_id !== 'string') {
    throw new BadRequestException('Parent ID must be a string');
  }

  if (username && typeof username !== 'string') {
    throw new BadRequestException('Owner ID must be a string');
  }



  return { directory_name, username, parent_id, updated_at };
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

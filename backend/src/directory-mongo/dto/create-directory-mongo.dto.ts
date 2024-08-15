import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities

interface CreateDirectoryOutDto {
  directory_name: string;
  username: string;
  parent_id: string;
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
    throw new BadRequestException('Owner ID is required and must be a string');
  }
  return { directory_name, username, parent_id };
}

function parseCreateDirectoryMongoDto(requestBody: any): CreateDirectoryOutDto {
  const validated = validateCreateDirectoryDto(requestBody);

  return validated;
}

export { parseCreateDirectoryMongoDto };

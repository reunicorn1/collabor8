import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities
//

interface CreateFileOutDto {
  file_name: string;
  username: string;
  parent_id: string;
}

function validateCreateFileDto(dto: any): CreateFileOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { file_name, username, parent_id } = dto;

  if (typeof parent_id !== 'string' || parent_id.trim() === '') {
    throw new BadRequestException('parent ID is required and must be a string');
  }

  if (typeof file_name !== 'string' || file_name.trim() === '') {
    throw new BadRequestException('File name is required and must be a string');
  }

  if (typeof username !== 'string' || username.trim() === '') {
    throw new BadRequestException('Owner ID is required and must be a string');
  }
  return { file_name, username, parent_id };
}

function parseCreateFileMongoDto(requestBody: any): CreateFileOutDto {
  const validated = validateCreateFileDto(requestBody);

  return validated;
}

export { parseCreateFileMongoDto };

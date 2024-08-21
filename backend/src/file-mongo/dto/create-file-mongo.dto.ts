import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities
//

interface CreateFileOutDto {
  file_name: string;
  parent_id: string;
  project_id: string;
  file_content?: string;
}

function validateCreateFileDto(dto: any): CreateFileOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { file_name, parent_id, project_id } = dto;
  let { file_content } = dto;

  if (typeof parent_id !== 'string' || parent_id.trim() === '') {
    throw new BadRequestException('parent ID is required and must be a string');
  }

  if (typeof file_name !== 'string' || file_name.trim() === '') {
    throw new BadRequestException('File name is required and must be a string');
  }

  if (typeof project_id !== 'string' || project_id.trim() === '') {
    throw new BadRequestException('Project ID is required and must be a string');
  }

  if (file_content && typeof file_content !== 'string') {
    throw new BadRequestException('File content must be a string');
  } else if (!file_content) {
    file_content = '';
  }

  return { file_name, parent_id, project_id, file_content };
}

function parseCreateFileMongoDto(requestBody: any): CreateFileOutDto {
  const validated = validateCreateFileDto(requestBody);
  return validated;
}

export { parseCreateFileMongoDto, CreateFileOutDto };

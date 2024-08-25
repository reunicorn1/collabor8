import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities
//

interface CreateFileOutDto {
  name: string;
  parent_id: string;
  project_id: string;
  file_content?: { [key: string]: any }[] | null;
}

interface UpdateFileOutDto {
  name?: string;
  parent_id?: string;
  project_id?: string;
  file_content?: any;
}

function validateCreateFileDto(dto: any): CreateFileOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { name, parent_id, project_id } = dto;
  let { file_content } = dto;

  if (typeof parent_id !== 'string' || parent_id.trim() === '') {
    throw new BadRequestException('parent ID is required and must be a string');
  }

  if (typeof name !== 'string' || name.trim() === '') {
    throw new BadRequestException('File name is required and must be a string');
  }

  if (typeof project_id !== 'string' || project_id.trim() === '') {
    throw new BadRequestException(
      'Project ID is required and must be a string',
    );
  }

  if (file_content && !Array.isArray(file_content)) {
    throw new BadRequestException('File content must be an array');
  } else if (!file_content) {
    file_content = [];
  }

  return {
    name: name.trim(),
    parent_id: parent_id.trim(),
    project_id: project_id.trim(),
    file_content,
  };
}

function validateUpdateFileDto(dto: any): UpdateFileOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { name, parent_id, project_id, file_content } = dto;

  if (name && typeof name !== 'string') {
    throw new BadRequestException('File name must be a string');
  }

  if (parent_id && typeof parent_id !== 'string') {
    throw new BadRequestException('Parent ID must be a string');
  }

  if (project_id && typeof project_id !== 'string') {
    throw new BadRequestException('Project ID must be a string');
  }

  if (file_content && !Array.isArray(file_content)) {
    throw new BadRequestException('File content must be an array');
  }

  return {
    name: name?.trim(),
    parent_id: parent_id?.trim(),
    project_id: project_id?.trim(),
    file_content,
  };
}

function parseCreateFileMongoDto(requestBody: any): CreateFileOutDto {
  const validated = validateCreateFileDto(requestBody);
  return validated;
}

function parseUpdateFileMongoDto(requestBody: any): UpdateFileOutDto {
  const validated = validateUpdateFileDto(requestBody);
  return validated;
}

export {
  parseCreateFileMongoDto,
  CreateFileOutDto,
  parseUpdateFileMongoDto,
  UpdateFileOutDto,
};

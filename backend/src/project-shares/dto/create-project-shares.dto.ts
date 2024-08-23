import { BadRequestException } from '@nestjs/common';
// TODO: create dto for all the entities
//
// interface CreateProjectShareDto {
//   project_id: string;
// }

// interface UpdateProjectShareDto {
//   project_name?: string;
//   description?: string;
//   updated_at?: Date;
// }


interface ProjectSharesOutDto {
  share_id: string;
  project_id: string;
  user_id: string;
  favorite: boolean;
  access_level: 'read' | 'write';
  created_at: string;
  updated_at: string;
  member_count: number;
  first_name: string;
  last_name: string;
  username: string;
  project_name: string;
}

// function validateCreateProjectDto(dto: any): CreateProjectDto {
//   if (!dto || typeof dto !== 'object') {
//     throw new BadRequestException('Invalid input');
//   }

//   const { project_name, description, username } = dto;

//   if (typeof project_name !== 'string' || project_name.trim() === '') {
//     throw new BadRequestException(
//       'Project name is required and must be a string',
//     );
//   }

//   if (typeof description !== 'string') {
//     throw new BadRequestException('description is required and must be a string');
//   }

//   if (username && typeof username !== 'string') {
//     throw new BadRequestException('Username must be a string');
//   }


//   return {
//     project_name: project_name.trim(),
//     description,
//     username: username.trim(),
//   };
// }

// function validateUpdateProjectDto(dto: any): UpdateProjectDto {
//   if (!dto || typeof dto !== 'object') {
//     throw new BadRequestException('Invalid input');
//   }

//   const { project_name, description, updated_at } = dto;

//   if (project_name && typeof project_name !== 'string') {
//     throw new BadRequestException('Project name must be a string');
//   }

//   if (description && typeof description !== 'string') {
//     throw new BadRequestException('Description must be a string');
//   }

//   return {
//     project_name: project_name.trim(),
//     description,
//     updated_at: updated_at.toString().trim(),
//    };
// }

function validateProjectSharesOutDto(dto: any): ProjectSharesOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { share_id, project_id, user_id, favorite, access_level, created_at, updated_at, member_count, first_name, last_name, username, project_name } = dto;

  if (typeof share_id !== 'string' || share_id.trim() === '') {
    throw new BadRequestException(
      'Share ID is required and must be a string',
    );
  }

  if (typeof project_id !== 'string' || project_id.trim() === '') {
    throw new BadRequestException(
      'Project ID is required and must be a string',
    );
  }

  if (typeof user_id !== 'string' || user_id.trim() === '') {
    throw new BadRequestException(
      'User ID is required and must be a string',
    );
  }

  if (typeof favorite !== 'boolean') {
    throw new BadRequestException('Favorite must be a boolean');
  }

  if (access_level && typeof access_level !== 'string') {
    throw new BadRequestException('Access level must be a string');
  }

  if (typeof created_at !== 'string' || created_at.trim() === '') {
    throw new BadRequestException('Created at must be a string');
  }

  if (typeof updated_at !== 'string' || updated_at.trim() === '') {
    throw new BadRequestException('Updated at must be a string');
  }

  if (typeof member_count !== 'number') {
    throw new BadRequestException('Member count must be a number');
  }

  if (typeof first_name !== 'string' || first_name.trim() === '') {
    throw new BadRequestException(
      'First name is required and must be a string',
    );
  }

  if (typeof last_name !== 'string' || last_name.trim() === '') {
    throw new BadRequestException(
      'Last name is required and must be a string',
    );
  }

  if (typeof username !== 'string' || username.trim() === '') {
    throw new BadRequestException(
      'Username is required and must be a string',
    );
  }

  if (typeof project_name !== 'string' || project_name.trim() === '') {
    throw new BadRequestException(
      'Project name is required and must be a string',
    );
  }

  return {
    share_id: share_id.trim(),
    project_id: project_id.trim(),
    user_id: user_id.trim(),
    favorite,
    access_level: access_level.trim(),
    created_at,
    updated_at,
    member_count,
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    username: username.trim(),
    project_name: project_name.trim(),
  };
}




// function parseCreateProjectDto(requestBody: any): CreateProjectDto {
//   const validated = validateCreateProjectDto(requestBody);

//   return validated;
// }

// function parseUpdateProjectDto(requestBody: any): UpdateProjectDto {
//   const validated = validateUpdateProjectDto(requestBody);

//   return validated;
// }

function parseProjectSharesOutDto(requestBody: any): ProjectSharesOutDto {
  const validated = validateProjectSharesOutDto(requestBody);

  return validated;
}

export {
  // parseCreateProjectDto,
  // CreateProjectDto,
  // parseUpdateProjectDto,
  // UpdateProjectDto,
  parseProjectSharesOutDto,
  ProjectSharesOutDto,
};

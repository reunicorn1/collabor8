import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';

class ProjectDocs {
  static init({ summary, description }, ...args) {
    return applyDecorators(
      ApiOperation({
        summary,
        description,
      }),
      ...args,
    );
  }

  create() {
    return ProjectDocs.init(
      {
        summary: 'Create a new project',
        description: 'Create a new project using the provided data.',
      },
      ApiBody({ type: CreateProjectDto }),
    );
  }

  findAllByOwnerId() {
    return ProjectDocs.init({
      summary: 'Get all projects of the logged in user',
      description: 'Retrieve a list of all projects associated with the logged in user using Id.',
    });
  }

  findAllByUsernameDepth() {
    return ProjectDocs.init({
      summary: 'Retrieve projects by username with depth',
      description:
        'Retrieve projects associated with a specific username and a given depth level. This operation fetches projects under a specified directory up to a certain depth in the directory hierarchy.',
    });
  }

  findAllByUsernamePaginated() {
    return ProjectDocs.init({
      summary: 'Get all projects of the logged in user',
      description: 'Retrieve a list of all projects associated with the logged in user using username And is paginated.',
    });
  }

  findAllForUser() {
    return ProjectDocs.init({
      summary: 'Get all projects by username',
      description: 'Retrieve all projects associated with a specific username.',
    });
  }

  findOne() {
    return ProjectDocs.init({
      summary: 'Get project by ID',
      description: 'Retrieve project for a user based on project ID',
    });
  }

  update() {
    return ProjectDocs.init(
      {
        summary: 'Update a project by ID',
        description: 'Update the details of an existing project using its ID.',
      },
      ApiOkResponse({ type: UpdateProjectDto }),
    );
  }

  remove() {
    return ProjectDocs.init({
      summary: 'Delete a project by ID',
      description: 'Remove a project from the system using its ID.',
    });
  }
}

export default new ProjectDocs();

import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
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
}

export default new ProjectDocs();

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProjectSharesService } from './project-shares.service';
import { ProjectShares } from './project-shares.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ProjectShares')
@Controller('project-shares')
export class ProjectSharesController {
  constructor(private readonly projectSharesService: ProjectSharesService) {}

  // Create a new project share
  @ApiOperation({
    summary: 'Create a new project share',
    description: 'Create a new project share entry in the database.',
  })
  @Post()
  async create(
    @Body() createProjectShareDto: Partial<ProjectShares>,
  ): Promise<ProjectShares> {
    return this.projectSharesService.create(createProjectShareDto);
  }

  // Retrieve all project shares
  @ApiOperation({
    summary: 'Retrieve all project shares',
    description: 'Retrieve a list of all project shares from the database.',
  })
  @Get()
  async findAll(): Promise<ProjectShares[]> {
    return this.projectSharesService.findAll();
  }

  // Retrieve a specific project share by ID
  @ApiOperation({
    summary: 'Retrieve a project share by ID',
    description: 'Retrieve a specific project share by its unique ID.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectShares> {
    return this.projectSharesService.findOne(id);
  }

  // Retrieve project shares by project ID
  @ApiOperation({
    summary: 'Retrieve project shares by project ID',
    description:
      'Retrieve all project shares associated with a specific project by its ID.',
  })
  @Get('/project/:project_id')
  async findByProject(
    @Param('project_id') project_id: string,
  ): Promise<ProjectShares[]> {
    return this.projectSharesService.findByProject(project_id);
  }

  // Retrieve project shares by user ID
  @ApiOperation({
    summary: 'Retrieve project shares by user ID',
    description:
      'Retrieve all project shares associated with a specific user by their ID.',
  })
  @Get('/user/:user_id')
  async findByUser(
    @Param('user_id') user_id: string,
  ): Promise<ProjectShares[]> {
    return this.projectSharesService.findByUser(user_id);
  }

  // Update a project share
  @ApiOperation({
    summary: 'Update a project share',
    description:
      'Update the details of an existing project share using its ID.',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectShareDto: Partial<ProjectShares>,
  ): Promise<ProjectShares> {
    return this.projectSharesService.update(id, updateProjectShareDto);
  }

  // Delete a project share
  @ApiOperation({
    summary: 'Delete a project share',
    description:
      'Remove a specific project share from the database using its ID.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectSharesService.remove(id);
  }
}

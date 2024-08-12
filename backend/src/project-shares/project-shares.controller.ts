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

@Controller('project-shares')
export class ProjectSharesController {
  constructor(private readonly projectSharesService: ProjectSharesService) {}

  // Create a new project share
  @Post()
  async create(
    @Body() createProjectShareDto: Partial<ProjectShares>,
  ): Promise<ProjectShares> {
    return this.projectSharesService.create(createProjectShareDto);
  }

  // Retrieve all project shares
  @Get()
  async findAll(): Promise<ProjectShares[]> {
    return this.projectSharesService.findAll();
  }

  // Retrieve a specific project share by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectShares> {
    return this.projectSharesService.findOne(id);
  }

  // Retrieve project shares by project ID
  @Get('/project/:project_id')
  async findByProject(
    @Param('project_id') project_id: string,
  ): Promise<ProjectShares[]> {
    return this.projectSharesService.findByProject(project_id);
  }

  // Retrieve project shares by user ID
  @Get('/user/:user_id')
  async findByUser(
    @Param('user_id') user_id: string,
  ): Promise<ProjectShares[]> {
    return this.projectSharesService.findByUser(user_id);
  }

  // Update a project share
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectShareDto: Partial<ProjectShares>,
  ): Promise<ProjectShares> {
    return this.projectSharesService.update(id, updateProjectShareDto);
  }

  // Delete a project share
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectSharesService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './project.entity';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({
    summary: 'Create a new project',
    description: 'Create a new project using the provided data.',
  })
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: any,
  ): Promise<Projects> {
    createProjectDto.username = req.user.username;
    return this.projectsService.create(createProjectDto);
  }

  @ApiOperation({
    summary: 'Get all projects of the logged in user',
    description: 'Retrieve a list of all projects associated with the logged in user.',
  })
  @Get()
  async findAll(@Request() req: any): Promise<Projects[]> {
    return this.projectsService.findAllByOwnerId(req.user.user_id);
  }

  @ApiOperation({
    summary: 'Get all projects by username',
    description: 'Retrieve all projects associated with a specific username.',
  })
  @Get(':username')
  async findAllByUsername(
    @Param('username') username: string,
  ): Promise<ProjectMongo[]> {
    return this.projectsService.findAllByUsername(username);
  }

  @ApiOperation({
    summary: 'Get a project by ID',
    description: 'Retrieve a specific project by its ID.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Projects> {
    return this.projectsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a project by ID',
    description: 'Update the details of an existing project using its ID.',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: Partial<Projects>,
  ): Promise<Projects> {
    return this.projectsService.update(id, updateProjectDto);
  }

  @ApiOperation({
    summary: 'Delete a project by ID',
    description: 'Remove a project from the system using its ID.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }
}

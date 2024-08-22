import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Put,
  Query,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './project.entity';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';

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
    console.log(createProjectDto);
    return this.projectsService.create(createProjectDto);
  }

  @ApiOperation({
    summary: 'Get all projects of the logged in user',
    description:
      'Retrieve a list of all projects associated with the logged in user using Id.',
  })
  @Get()
  async findAllById(@Request() req: any): Promise<Projects[]> {
    return this.projectsService.findAllBy('owner_id', req.user.id);
  }

  @ApiOperation({
    summary: 'Retrieve projects by username with depth',
    description:
      'Retrieve projects associated with a specific username and a given depth level. This operation fetches projects under a specified directory up to a certain depth in the directory hierarchy.',
  })
  @Get(':username/:id')
  findAllByUsernameDepth(
    @Param('username') username: string,
    @Param('id') id: string,
    @Query('depth') depth: number,
  ) {
    return this.projectsService.findAllByUsernameDepth(username, depth, id);
  }

  // TODO: 22/8 - Add endpoint for searching projects by name
  // project criteria must be owner or contributor
  //
  @ApiOperation({
    summary: 'Get all projects of the logged in user',
    description:
      'Retrieve a list of all projects associated with the logged in user using username And is paginated.',
  })
  @Get('page')
  async findAllByUsernamePaginated(
    @Request() req: any,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
  ): Promise<any> {
    console.log(page, limit, sort);
    if (page && limit) {
      const { total, projects } =
        await this.projectsService.findAllByUsernamePaginated(
          req.user.username,
          page,
          limit,
          sort,
        );
      console.log(total, projects, page, limit, Math.ceil(total / limit));
      return {
        total,
        projects,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } else {
      throw new BadRequestException(
        'Page and limit query parameters are required',
      );
    }
  }

  @ApiOperation({
    summary: 'Get all projects by username',
    description: 'Retrieve all projects associated with a specific username.',
  })
  @Get(':username')
  async findAllForUser(
    @Param('username') username: string,
  ): Promise<Projects[]> {
    return this.projectsService.findAllBy('username', username);
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
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
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

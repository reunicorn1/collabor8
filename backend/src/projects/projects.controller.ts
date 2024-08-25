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
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import Docs from './projects.docs';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';

@ApiBearerAuth()
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Docs.create()
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: any,
  ): Promise<Projects> {
    createProjectDto.username = req.user.username;
    return this.projectsService.create(createProjectDto);
  }

  @Docs.findAllByOwnerId()
  @Get()
  async findAllByOwnerId(@Request() req: any): Promise<Projects[]> {
    return this.projectsService.findAllBy('owner_id', req.user.id);
  }

  // @Docs.findOneDepth()
  @Get('depth/:id')
  async findOneDepth(
    @Param('id') id: string,
    @Query('depth') depth: number,
    @Request() req: any): Promise<ProjectMongo[]> {
    console.log('depth', depth);
    return this.projectsService.findAllByUsernameDepth(req.user.username, depth, id);
  }

  @Docs.findAllByUsernameDepth()
  @Get(':username/:id')
  findAllByUsernameDepth(
    @Param('username') username: string,
    @Param('id') id: string,
    @Query('depth') depth: number,
  ) {
    if (!depth) { depth = 0 }
    if (!username) {
      console.log('+++++++++++++++>')
    }
    return this.projectsService.findAllByUsernameDepth(username, depth, id);
  }

  // TODO: 22/8 - Add endpoint for searching projects by name
  // project criteria must be owner or contributor
  @Docs.findAllByUsernamePaginated()
  @Get('page')
  async findAllByUsernamePaginated(
    @Request() req: any,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
  ): Promise<any> {
    if (page && limit) {
      const { total, projects } =
        await this.projectsService.findAllByUsernamePaginated(
          req.user.username,
          page,
          limit,
          sort,
        );
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

  @Docs.findAllForUser()
  @Get('user/:username')
  async findAllForUser(
    @Request() req: any,
    @Param('username') username: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
  ): Promise<any> {
    if (page && limit) {
      const { total, projects } =
        await this.projectsService.findAllByUsernamePaginated(
          username,
          page,
          limit,
          sort,
        );
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

  @Docs.findOne()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Projects> {
    return this.projectsService.findOne(id);
  }


  @Docs.update()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Projects> {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Docs.remove()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }
}

import { Controller, Delete, Get, Param, Query, Request } from '@nestjs/common';
import { ProjectMongoService } from './project-mongo.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// TODO: Add routes for updating all projects and dirs, files etc
// TODO: Create dto for updating all projects and dirs, files etc
// TODO: Modify depth and pagination routes and optimize
// for the file tree which will be synced with the yMap
// TODO: replace all Params username with @Request() req
@ApiTags('ProjectMongo')
@Controller('project-docs')
export class ProjectMongoController {
  constructor(private projectService: ProjectMongoService) {}

  @ApiOperation({
    summary: 'Retrieve all projects',
    description: 'Retrieve a list of all projects stored in MongoDB.',
  })
  @Get()
  async findAll() {
    return await this.projectService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve all projects by username',
    description:
      'Retrieve a list of all projects associated with a specific username.',
  })
  @Get('all/')
  findAllByUsername(@Request() req) {
    return this.projectService.findAllByUsername(req.user.username);
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
    return this.projectService.findAllByUsernameDepth(username, depth, id);
  }

  @ApiOperation({
    summary: 'Retrieve a project by ID',
    description:
      'Retrieve a specific project from MongoDB using its unique ID.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }



  @ApiOperation({
    summary: 'Delete a project by ID',
    description: 'Delete a specific project from MongoDB using its unique ID.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}

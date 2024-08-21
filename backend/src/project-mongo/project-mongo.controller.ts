import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProjectMongoService } from './project-mongo.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// TODO: Add routes for updating all projects and dirs, files etc
// TODO: Create dto for updating all projects and dirs, files etc
// TODO: Modify depth and pagination routes and optimize
// for the file tree which will be synced with the yMap
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
    summary: 'Retrieve a project by ID',
    description:
      'Retrieve a specific project from MongoDB using its unique ID.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @ApiOperation({
    summary: 'Retrieve all projects by username',
    description:
      'Retrieve all projects associated with a specific username from MongoDB.',
  })
  @Get('all/:username')
  findAllByUsername(@Param('username') username: string) {
    return this.projectService.findAllByUsername(username);
  }

  // TODO: replace all Params username with @Request() req
  @ApiOperation({
    summary: 'Retrieve projects by username with depth',
    description:
      'Retrieve projects associated with a specific username, with a specified depth level for nested objects.',
  })
  @Get(':username/depth')
  findAllByUsernameDepth(
    @Param('username') username: string,
    @Query('depth') depth: number,
  ) {
    return this.projectService.findAllByUsernameDepth(username, depth);
  }

  // @ApiOperation({
  //   summary: 'Retrieve projects with pagination by username',
  //   description: 'Retrieve a paginated list of projects associated with a specific username, based on depth levels.',
  // })
  // @Get(':username/pagination')
  // findProjectsWithPaging(
  //   @Param('username') username: string,
  //   @Query('startDepth') startDepth: number,
  //   @Query('endDepth') endDepth: number,
  // ) {
  //   return this.projectService.findProjectsWithPaging(
  //     username,
  //     startDepth,
  //     endDepth,
  //   );
  // }

  @ApiOperation({
    summary: 'Delete a project by ID',
    description: 'Delete a specific project from MongoDB using its unique ID.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}

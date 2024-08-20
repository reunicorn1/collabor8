import { Controller, Delete, Get, Param, Query, Request } from '@nestjs/common';
import { ProjectMongoService } from './project-mongo.service';
// TODO: Add routes for updating all projects and dirs, files etc
// TODO: Create dto for updating all projects and dirs, files etc
// TODO: Modify depth and pagination routes and optimize
// for the file tree which will be synced with the yMap
  // TODO: replace all Params username with @Request() req
@Controller('project-docs')
export class ProjectMongoController {
  constructor(private projectService: ProjectMongoService) {}

  @Get()
  async findAll() {
    return await this.projectService.findAll();
  }


  @Get('all/')
  findAllByUsername(@Request() req) {
    return this.projectService.findAllByUsername(req.user.username);
  }

  @Get(':username/:id')
  findAllByUsernameDepth(
    @Param('username') username: string,
    @Param('id') id: string,
    @Query('depth') depth: number,
  ) {
    return this.projectService.findAllByUsernameDepth(username, depth, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}

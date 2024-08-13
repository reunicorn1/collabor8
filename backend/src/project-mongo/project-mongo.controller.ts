import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProjectMongoService } from './project-mongo.service';

@Controller('project-docs')
export class ProjectMongoController {
  constructor(private projectService: ProjectMongoService) {}

  @Get()
  async findAll() {
    return await this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Get('all/:username')
  findAllByUsername(@Param('username') username: string) {
    return this.projectService.findAllByUsername(username);
  }

  @Get(':username/depth')
  findAllByUsernameDepth(
    @Param('username') username: string,
    @Query('depth') depth: number,
  ) {
    return this.projectService.findAllByUsernameDepth(username, depth);
  }

  @Get(':username/pagination')
  findProjectsWithPaging(
    @Param('username') username: string,
    @Query('startDepth') startDepth: number,
    @Query('endDepth') endDepth: number,
  ) {
    return this.projectService.findProjectsWithPaging(
      username,
      startDepth,
      endDepth,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}

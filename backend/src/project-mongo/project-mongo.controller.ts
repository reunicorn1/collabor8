import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ProjectMongoService } from './project-mongo.service';

@Controller('projects')
export class ProjectMongoController {
  constructor(private readonly projectService: ProjectMongoService) {}

  @Get()
  findAll() {
    return this.projectService.findAll();
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

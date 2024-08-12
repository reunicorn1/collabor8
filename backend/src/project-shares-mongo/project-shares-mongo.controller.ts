import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ProjectSharesMongoService } from './project-shares-mongo.service';

@Controller('project-shares-docs')
export class ProjectSharesMongoController {
  constructor(private readonly shareService: ProjectSharesMongoService) {}

  @Get()
  findAll() {
    return this.shareService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shareService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shareService.remove(id);
  }
}

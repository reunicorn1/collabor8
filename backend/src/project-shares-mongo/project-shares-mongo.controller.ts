import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ProjectSharesMongoService } from './project-shares-mongo.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ProjectSharesMongo')
@Controller('project-shares-docs')
export class ProjectSharesMongoController {
  constructor(private readonly shareService: ProjectSharesMongoService) {}

  @ApiOperation({
    summary: 'Get all shared projects',
    description: 'Retrieve a list of all shared project documents.',
  })
  @Get()
  findAll() {
    return this.shareService.findAll();
  }

  @ApiOperation({
    summary: 'Get a shared project by ID',
    description: 'Retrieve a specific shared project document by its ID.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shareService.findOne(id);
  }

  @ApiOperation({
    summary: 'Delete a shared project by ID',
    description:
      'Remove a shared project document from the database using its ID.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shareService.remove(id);
  }
}

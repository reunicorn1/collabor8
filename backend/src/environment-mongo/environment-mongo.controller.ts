import { Controller, Delete, Get, Param } from '@nestjs/common';
import { EnvironmentMongoService } from './environment-mongo.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('EnvironmentMongo')
@Controller('environments')
export class EnvironmentMongoController {
  constructor(private readonly environService: EnvironmentMongoService) {}

  @ApiOperation({
    summary: 'Retrieve all environments',
    description:
      'Retrieve a list of all environment documents stored in MongoDB.',
  })
  @Get()
  findAll() {
    return this.environService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve environment projects by username',
    description:
      'Retrieve all projects related to a specific environment by username.',
  })
  @Get('projects/:username')
  getEnvironmentProjects(@Param('username') username: string) {
    return this.environService.getEnvironmentProjects(username);
  }

  @ApiOperation({
    summary: 'Retrieve an environment by ID',
    description:
      'Retrieve a specific environment document from MongoDB using its unique ID.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.environService.findOne(id);
  }

  @ApiOperation({
    summary: 'Delete an environment by ID',
    description:
      'Delete a specific environment document from MongoDB using its unique ID.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.environService.remove(id);
  }
}

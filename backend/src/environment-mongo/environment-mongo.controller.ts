import { Controller, Delete, Get, Param, Request } from '@nestjs/common';
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
    summary: 'Retrieve an environment by username',
    description:
      'Retrieve a specific environment document from MongoDB using its unique username.',
  })
  @Get('me')
  getMyEnvironment(@Request() req) {
    return this.environService.getEnvironmentUsername(req.user.username);
  }

  @ApiOperation({
    summary: 'Delete an environment by ID',
    description:
      'Delete a specific environment document from MongoDB using its unique ID. Creates a new environment for the user.',
  })
  @Delete('me')
  remove(@Request() req) {
    return this.environService.remove(req.user.username);
  }
}

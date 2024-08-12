import { Controller, Delete, Get, Param } from '@nestjs/common';
import { EnvironmentMongoService } from './envrionment-mongo.service';

@Controller('environment')
export class EnvironmentMongoController {
  constructor(private readonly environService: EnvironmentMongoService) {}

  @Get()
  findAll() {
    return this.environService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.environService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.environService.remove(id);
  }
}

import { Controller, Delete, Get, Param } from '@nestjs/common';
import { EnvironmentMongoService } from './environment-mongo.service';

@Controller('environments')
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

import { Controller, Delete, Get, Param } from '@nestjs/common';
import { DirectoryMongoService } from './directory-mongo.service';

@Controller('directories')
export class DirectoryMongoController {
  constructor(private readonly dirService: DirectoryMongoService) {}

  @Get()
  findAll() {
    return this.dirService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dirService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dirService.remove(id);
  }
}

import { Controller, Delete, Get, Param, Post, Body } from '@nestjs/common';
import { DirectoryMongoService } from './directory-mongo.service';
import { DirectoryMongo } from './directory-mongo.entity';

@Controller('directory-docs')
export class DirectoryMongoController {
  constructor(private readonly dirService: DirectoryMongoService) {}

  @Get()
  findAll() {
    return this.dirService.findAll();
  }

  @Post()
  create(@Body() createDirectoryDto: Partial<DirectoryMongo>) {
    return this.dirService.create(createDirectoryDto);
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

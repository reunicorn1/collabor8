import { Controller, Delete, Get, Param, Post, Body } from '@nestjs/common';
import { FileMongoService } from './file-mongo.service';
import { FileMongo } from './file-mongo.entity';

@Controller('file-docs')
export class FileMongoController {
  constructor(private readonly fileService: FileMongoService) {}

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Post()
  create(@Body() createFileDto: Partial<FileMongo>) {
    return this.fileService.create(createFileDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(id);
  }
}

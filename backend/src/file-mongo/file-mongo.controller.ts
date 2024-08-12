import { Controller, Delete, Get, Param } from '@nestjs/common';
import { FileMongoService } from './file-mongo.service';

@Controller('file-docs')
export class FileMongoController {
  constructor(private readonly fileService: FileMongoService) {}

  @Get()
  findAll() {
    return this.fileService.findAll();
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

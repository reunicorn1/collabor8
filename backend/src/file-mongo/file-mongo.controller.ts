import { Controller, Delete, Get, Param, Post, Body } from '@nestjs/common';
import { FileMongoService } from './file-mongo.service';
import { FileMongo } from './file-mongo.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('FileMongo')
@Controller('file-docs')
export class FileMongoController {
  constructor(private readonly fileService: FileMongoService) {}

  @ApiOperation({
    summary: 'Retrieve all files',
    description: 'Retrieve a list of all files stored in MongoDB.',
  })
  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @ApiOperation({
    summary: 'Create a new file',
    description:
      'Create a new file document in MongoDB with the provided data.',
  })
  @Post()
  create(@Body() createFileDto: Partial<FileMongo>) {
    return this.fileService.create(createFileDto);
  }

  @ApiOperation({
    summary: 'Retrieve a file by ID',
    description: 'Retrieve a specific file from MongoDB using its unique ID.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(id);
  }

  @ApiOperation({
    summary: 'Delete a file by ID',
    description: 'Delete a specific file from MongoDB using its unique ID.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(id);
  }
}

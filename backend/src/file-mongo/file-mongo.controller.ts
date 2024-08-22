import { Controller, Delete, Get, Param, Post, Patch, Body, Request } from '@nestjs/common';
import { FileMongoService } from './file-mongo.service';
import { FileMongo } from './file-mongo.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFileOutDto, UpdateFileOutDto } from './dto/create-file-mongo.dto';
@ApiTags('FileMongo')
@Controller('file-docs')
export class FileMongoController {
  constructor(private readonly fileService: FileMongoService) {}

  @ApiOperation({
    summary: 'Create a new file',
    description:
      'Create a new file document in MongoDB with the provided data.',
  })
  @Post()
  create(@Body() createFileDto: CreateFileOutDto): Promise<FileMongo> {
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

  // TODO: After testing deployement, integrate yjs updates with this method
  @ApiOperation({
    summary: 'Update a file by ID',
    description: 'Update a specific file in MongoDB using its unique ID.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileOutDto) {
    return this.fileService.update(id, updateFileDto);
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

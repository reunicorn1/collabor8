import { Controller, Delete, Get, Param, Post, Body, Request } from '@nestjs/common';
import { DirectoryMongoService } from './directory-mongo.service';
import { DirectoryMongo } from './directory-mongo.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('DirectoryMongo')
@Controller('directory-docs')
export class DirectoryMongoController {
  constructor(private readonly dirService: DirectoryMongoService) {}

  @ApiOperation({
    summary: 'Retrieve all directories',
    description:
      'Retrieve a list of all directory documents stored in MongoDB.',
  })
  @Get()
  findAll() {
    return this.dirService.findAll();
  }

  @ApiOperation({
    summary: 'Create a new directory',
    description:
      'Create a new directory document in MongoDB with the provided details.',
  })
  @Post()
  create(@Body() createDirectoryDto: Partial<DirectoryMongo>) {
    return this.dirService.create(createDirectoryDto);
  }

  @ApiOperation({
    summary: 'Retrieve a directory by ID',
    description:
      'Retrieve a specific directory document from MongoDB using its unique ID.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dirService.findOne(id);
  }

  @ApiOperation({
    summary: 'Delete a directory by ID',
    description:
      'Delete a specific directory document from MongoDB using its unique ID.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dirService.remove(id);
  }
}

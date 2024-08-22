import { Controller, Delete, Get, Param, Post, Body, Request } from '@nestjs/common';
import { DirectoryMongoService } from './directory-mongo.service';
import { DirectoryMongo } from './directory-mongo.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateDirectoryOutDto,
  UpdateDirectoryOutDto,
} from './dto/create-directory-mongo.dto';

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
  create(@Body() createDirectoryDto: CreateDirectoryOutDto) {
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
    summary: 'Update a directory by ID',
    description:
      'Update a specific directory document in MongoDB using its unique ID.',
  })
  @Post(':id')
  update(@Param('id') id: string, @Body() updateDirectoryDto: UpdateDirectoryOutDto) {
    return this.dirService.update(id, updateDirectoryDto);
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

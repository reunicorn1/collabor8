import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Body,
  Request,
} from '@nestjs/common';
import { FileMongoService } from './file-mongo.service';
import { FileMongo } from './file-mongo.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateFileOutDto,
  UpdateFileOutDto,
} from './dto/create-file-mongo.dto';
import FileDocs from './file-mongo.docs';

@ApiTags('FileMongo')
@Controller('files')
export class FileMongoController {
  constructor(private readonly fileService: FileMongoService) { }

  @FileDocs.create()
  @Post()
  async create(@Body() createFileDto: CreateFileOutDto): Promise<FileMongo> {
    return await this.fileService.create(createFileDto);
  }

  @FileDocs.findOne()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.fileService.findOne(id);
  }

  // TODO: After testing deployement, integrate yjs updates with this method

  @FileDocs.update()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFileDto: UpdateFileOutDto) {
    return await this.fileService.update(id, updateFileDto);
  }

  @FileDocs.remove()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.fileService.remove(id);
  }
}

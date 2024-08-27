import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Request,
  Patch,
} from '@nestjs/common';
import { DirectoryMongoService } from './directory-mongo.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateDirectoryOutDto,
  UpdateDirectoryOutDto,
} from './dto/create-directory-mongo.dto';
import DirDocs from './directory-mongo.docs';

@ApiTags('DirectoryMongo')
@Controller('directory')
export class DirectoryMongoController {
  constructor(private readonly dirService: DirectoryMongoService) {}

  @DirDocs.findAll()
  @Get()
  async findAll() {
    return await this.dirService.findAll();
  }

  @DirDocs.create()
  @Post()
  async create(@Body() createDirectoryDto: CreateDirectoryOutDto) {
    return await this.dirService.create(createDirectoryDto);
  }

  @DirDocs.findOne()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dirService.findOne(id);
  }

  @DirDocs.update()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDirectoryDto: UpdateDirectoryOutDto,
  ) {
    return await this.dirService.update(id, updateDirectoryDto);
  }

  @DirDocs.remove()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.dirService.remove(id);
  }
}

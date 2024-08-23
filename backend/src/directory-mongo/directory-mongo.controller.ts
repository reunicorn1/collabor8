import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Request,
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
  findAll() {
    return this.dirService.findAll();
  }

  @DirDocs.create()
  @Post()
  create(@Body() createDirectoryDto: CreateDirectoryOutDto) {
    return this.dirService.create(createDirectoryDto);
  }

  @DirDocs.findOne()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dirService.findOne(id);
  }

  @DirDocs.update()
  @Post(':id')
  update(
    @Param('id') id: string,
    @Body() updateDirectoryDto: UpdateDirectoryOutDto,
  ) {
    return this.dirService.update(id, updateDirectoryDto);
  }

  @DirDocs.remove()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dirService.remove(id);
  }
}

import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { FileMongo } from './file-mongo.entity';
import {
  parseCreateFileMongoDto, CreateFileOutDto, parseUpdateFileMongoDto,
  UpdateFileOutDto
} from './dto/create-file-mongo.dto';
import { DirectoryMongoService } from '@directory-mongo/directory-mongo.service';
import { ProjectsService } from '@projects/projects.service';

@Injectable()
export class FileMongoService {
  constructor(
    @InjectRepository(FileMongo, 'mongoConnection')
    private fileRepository: Repository<FileMongo>,
    @Inject(forwardRef(() => DirectoryMongoService))
    private directoryService: DirectoryMongoService,
    @Inject(forwardRef(() => ProjectsService))
    private projectService: ProjectsService,
  ) { }

  async create(createFileDto: CreateFileOutDto): Promise<FileMongo> {
    const parsedDto = parseCreateFileMongoDto(createFileDto);
    const newFile = this.fileRepository.create({
      parent_id: parsedDto.parent_id,
      name: parsedDto.name,
      project_id: parsedDto.project_id,
      file_content: parsedDto.file_content,
    });
    return await this.fileRepository.save(newFile);
  }

  async findAll(): Promise<FileMongo[]> {
    return await this.fileRepository.find();
  }

  // general method to find all files by a field
  async findAllBy(field: string, value: string): Promise<FileMongo[]> {
    const files = await this.fileRepository.find({
      where: { [field]: value },
    });
    return files;
  }

  async findFilesByParent(parent_id: string): Promise<FileMongo[] | null> {
    const files = await this.findAllBy('parent_id', parent_id);
    // remove the file_content from the response
    files.forEach((file) => {
      delete file.file_content;
    });
    return files;
  }

  async findOne(id: string): Promise<FileMongo | null> {
    try {
      const _id = new ObjectId(id);
      return await this.fileRepository.findOneBy({ _id });
    } catch (err) {
      throw new NotFoundException('File not found');
    }
  }

  async update(id: string, updateFileDto: UpdateFileOutDto): Promise<FileMongo> {
    const parsedDto = parseUpdateFileMongoDto(updateFileDto);
    const file = await this.findOne(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const newDate = new Date();
    await this.fileRepository.update(id, {
      name: parsedDto.name,
      file_content: parsedDto.file_content,
      updated_at: newDate,
    });
    if (file.parent_id === file.project_id) {
      await this.projectService.update(file.parent_id, { updated_at: new Date() });
    } else {
      await this.directoryService.update(file.parent_id, { updated_at: new Date() });
    }
    return await this.fileRepository.save(file);
  }



  async remove(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }
}

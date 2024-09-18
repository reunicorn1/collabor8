import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { FileMongo } from './file-mongo.entity';
import {
  parseCreateFileMongoDto,
  CreateFileOutDto,
  parseUpdateFileMongoDto,
  UpdateFileOutDto,
} from './dto/create-file-mongo.dto';
import { DirectoryMongoService } from '@directory-mongo/directory-mongo.service';
import { ProjectsService } from '@projects/projects.service';
import { DockerService } from '@docker/docker.service';
import * as Y from 'yjs';

@Injectable()
export class FileMongoService {
  constructor(
    @InjectRepository(FileMongo, 'mongoConnection')
    private fileRepository: Repository<FileMongo>,
    @Inject(forwardRef(() => DirectoryMongoService))
    private directoryService: DirectoryMongoService,
    @Inject(forwardRef(() => ProjectsService))
    private projectService: ProjectsService,
    @Inject(forwardRef(() => DockerService))
    private dockerService: DockerService,
  ) { }

  async create(createFileDto: CreateFileOutDto): Promise<FileMongo> {
    const parsedDto = parseCreateFileMongoDto(createFileDto);
    const conflict = await this.fileRepository.findOne({
      where: { name: parsedDto.name, parent_id: parsedDto.parent_id },
    });
    if (conflict) {
      throw new ConflictException('File already exists');
    }
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

  async update(
    id: string,
    updateFileDto: UpdateFileOutDto,
  ): Promise<FileMongo> {
    const parsedDto = parseUpdateFileMongoDto(updateFileDto);
    const file = await this.findOne(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    // Check if the name or parent_id has changed
    const isNameChanged = parsedDto.name && parsedDto.name !== file.name;
    const isParentChanged =
      parsedDto.parent_id && parsedDto.parent_id !== file.parent_id;
    // Check if the new name and parent_id already exists
    if (isNameChanged || isParentChanged) {
      const conflict = await this.fileRepository.findOne({
        where: {
          name: parsedDto.name ? parsedDto.name : file.name,
          parent_id: parsedDto.parent_id ? parsedDto.parent_id : file.parent_id,
        },
      });
      if (conflict) {
        throw new ConflictException('File already exists');
      }
    }
    const newDate = new Date();
    if (parsedDto.name) file.name = parsedDto.name;
    if (parsedDto.file_content) file.file_content = parsedDto.file_content;
    file.updated_at = newDate;

    if (file.parent_id === file.project_id) {
      await this.projectService.update(file.parent_id, {
        updated_at: new Date(),
      });
    } else {
      await this.directoryService.update(file.parent_id, {
        updated_at: new Date(),
      });
    }
    return await this.fileRepository.save(file);
  }

  async remove(id: string): Promise<void> {
    try {
      const file = await this.findOne(id);
      if (!file) {
        throw new NotFoundException('File not found');
      }
      await this.fileRepository.delete(id);
    } catch (err) {
      Logger.error(err);
    }
  }

  async execute(id: string, req: any): Promise<{ output: { stdout: string, stderr: string } }> {
  const file = await this.findOne(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    const code = file.file_content.map(op => op.insert).join('');
    const logs = await this.dockerService.executeLanguageCode(code, file.name, req.body?.language);
    return { output: logs };
  }
}

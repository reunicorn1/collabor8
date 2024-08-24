import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { DirectoryMongo } from './directory-mongo.entity';
import { FileMongoService } from '@file-mongo/file-mongo.service';
import {
  parseCreateDirectoryMongoDto,
  CreateDirectoryOutDto,
  parseUpdateDirectoryMongoDto,
  UpdateDirectoryOutDto,
} from './dto/create-directory-mongo.dto';
import { ProjectsService } from '@projects/projects.service';

@Injectable()
export class DirectoryMongoService {
  constructor(
    @InjectRepository(DirectoryMongo, 'mongoConnection')
    private directoryRepository: Repository<DirectoryMongo>,
    @Inject(forwardRef(() => FileMongoService))
    private fileService: FileMongoService,
    @Inject(forwardRef(() => ProjectsService))
    private projectService: ProjectsService,
  ) {}

  async create(
    createDirectoryDto: CreateDirectoryOutDto,
  ): Promise<DirectoryMongo> {
    const parsedDto = parseCreateDirectoryMongoDto(createDirectoryDto);
    const newDirectory = this.directoryRepository.create({
      parent_id: parsedDto.parent_id,
      name: parsedDto.name,
    });
    return this.directoryRepository.save(newDirectory);
  }

  findAll(): Promise<DirectoryMongo[]> {
    return this.directoryRepository.find();
  }

  findOne(id: string): Promise<DirectoryMongo | null> {
    const _id = new ObjectId(id);
    return this.directoryRepository.findOneBy({ _id });
  }

  // general method to find all directories by a field
  async findAllBy(field: string, value: string): Promise<DirectoryMongo[]> {
    const directories = await this.directoryRepository.find({
      where: { [field]: value },
    });
    return directories;
  }

  async findDirectoriesByParent(
    parent_id: string,
  ): Promise<DirectoryMongo[] | null> {
    const directories = await this.findAllBy('parent_id', parent_id);
    return directories;
  }

  async loadDirectoriesByDepth(
    parentId: string,
    depth: number,
  ): Promise<DirectoryMongo[]> {
    if (depth <= 0) return []; // Stop recursion if depth is zero

    const directories = await this.findDirectoriesByParent(parentId);

    // Load files for each directory
    await Promise.all(
      directories.map(async (dir) => {
        dir.files = await this.fileService.findFilesByParent(
          dir._id.toString(),
        );

        // Recursively load child directories
        dir.children = await this.loadDirectoriesByDepth(
          dir._id.toString(),
          depth - 1,
        );
      }),
    );

    return directories;
  }

  async update(id: string, updateDirectoryDto: UpdateDirectoryOutDto): Promise<DirectoryMongo> {
    const parsedDto = parseUpdateDirectoryMongoDto(updateDirectoryDto);
    const directory = await this.findOne(id);
    if (!directory) {
      throw new Error('Directory not found');
    }
    for (const key in parsedDto) {
      if (parsedDto[key]) {
        directory[key] = parsedDto[key];
      }
    }
    directory.updated_at = new Date();
    if (directory.parent_id === directory.project_id) {
      await this.projectService.update(directory.parent_id, {
        updated_at: new Date(),
      });
    } else {
      await this.update(directory.parent_id, { updated_at: new Date() });
    }
    return await this.directoryRepository.save(directory);
  }

  async remove(id: string): Promise<void> {
    const directory = await this.findOne(id);
    if (!directory) {
      throw new Error('Directory not found');
    }
    const directories = await this.findDirectoriesByParent(id);
    const files = await this.fileService.findFilesByParent(id);
    await Promise.all(
      directories.map(async (dir) => {
        await this.remove(dir._id.toString());
      }),
    );
    await Promise.all(
      files.map(async (file) => {
        await this.fileService.remove(file._id.toString());
      }),
    );
    await this.directoryRepository.delete(id);
  }
}

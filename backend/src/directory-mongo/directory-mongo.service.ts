import {
  Injectable,
  Inject,
  forwardRef,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectoryMongo } from './directory-mongo.entity';
import { FileMongoService } from '@file-mongo/file-mongo.service';
import {
  parseCreateDirectoryMongoDto,
  CreateDirectoryOutDto,
  parseUpdateDirectoryMongoDto,
  UpdateDirectoryOutDto,
} from './dto/create-directory-mongo.dto';
import { ProjectsService } from '@projects/projects.service';
import { ObjectId } from 'mongodb';

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
    const conflict = await this.directoryRepository.find({
      where: {
        parent_id: parsedDto.parent_id,
        name: parsedDto.name,
      },
    });
    if (conflict.length) {
      throw new ConflictException('Directory already exists');
    }
    const newDirectory = this.directoryRepository.create({
      parent_id: parsedDto.parent_id,
      name: parsedDto.name,
      project_id: parsedDto.project_id,
    });
    return await this.directoryRepository.save(newDirectory);
  }

  async findAll(): Promise<DirectoryMongo[]> {
    return await this.directoryRepository.find();
  }

  async findOne(id: string): Promise<DirectoryMongo | null> {
    const _id = new ObjectId(id);
    return await this.directoryRepository.findOneBy({ _id });
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

  // Load directories by depth
  // each directory will have a children property with subdirectories and files
  async loadDirectoriesByDepth(
    parentId: string,
    depth: number,
  ): Promise<any[]> {
    // Change return type to `any[]` for flexibility
    if (depth <= 0) return []; // Stop recursion if depth is zero

    const directories = await this.findDirectoriesByParent(parentId);
    if (!directories || directories.length === 0) return []; // Stop if no directories found

    // Load files and recursively load child directories
    return await Promise.all(
      directories.map(async (dir) => {
        const files = await this.fileService.findFilesByParent(
          dir._id.toString(),
        );
        const children = await this.loadDirectoriesByDepth(
          dir._id.toString(),
          depth - 1,
        );

        return {
          ...dir,
          children: {
            directories: children,
            files,
          },
        };
      }),
    );
  }

  async update(
    id: string,
    updateDirectoryDto: UpdateDirectoryOutDto,
  ): Promise<DirectoryMongo> {
    console.log('this is id of dir', id);
    const parsedDto = parseUpdateDirectoryMongoDto(updateDirectoryDto);
    const directory = await this.findOne(id);
    if (!directory) {
      throw new Error('Directory not found');
    }
    const query: { name?: string; parent_id?: string } = {};
    if (parsedDto.name) query.name = parsedDto.name;
    if (parsedDto.parent_id) {
      query.parent_id = parsedDto.parent_id;
    } else {
      query.parent_id = directory.parent_id;
    }
    const conflict = await this.directoryRepository.findOne({
      where: query,
    });
    if (conflict) {
      throw new ConflictException('Directory already exists');
    }

    for (const key in parsedDto) {
      if (parsedDto[key]) {
        directory[key] = parsedDto[key];
      }
    }
    directory.updated_at = new Date();
    console.log('dir object', directory);
    console.log('parent + project', directory.parent_id, directory.project_id);
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
        try {
          await this.remove(dir._id.toString());
        } catch (e) {
          Logger.error(e);
          throw new NotFoundException('Directory not found');
        }
      }),
    );
    await Promise.all(
      files.map(async (file) => {
        try {
          await this.fileService.remove(file._id.toString());
        } catch (e) {
          Logger.error(e);
          throw new NotFoundException('File not found');
        }
      }),
    );
    try {
      await this.directoryRepository.delete(id);
    } catch (e) {
      Logger.error(e);
      throw new NotFoundException('Directory not found');
    }
  }
}

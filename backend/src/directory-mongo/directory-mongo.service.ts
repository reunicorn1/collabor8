import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { DirectoryMongo } from './directory-mongo.entity';
import { FileMongoService } from '@file-mongo/file-mongo.service';
import { parseCreateDirectoryMongoDto } from './dto/create-directory-mongo.dto';

@Injectable()
export class DirectoryMongoService {
  constructor(
    @InjectRepository(DirectoryMongo, 'mongoConnection')
    private directoryRepository: Repository<DirectoryMongo>,
    @Inject(forwardRef(() => FileMongoService))
    private fileService: FileMongoService,
  ) {}

  async create(
    createDirectoryDto: Partial<DirectoryMongo>,
  ): Promise<DirectoryMongo> {
    const parsedDto = parseCreateDirectoryMongoDto(createDirectoryDto);
    const newDirectory = this.directoryRepository.create({
      parent_id: parsedDto.parent_id,
      directory_name: parsedDto.directory_name,
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

  async findDirectoriesByParent(
    parent_id: string,
  ): Promise<DirectoryMongo[] | null> {
    const directories = await this.directoryRepository.find({
      where: { parent_id: parent_id },
    });
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

  async remove(id: string): Promise<void> {
    await this.directoryRepository.delete(id);
  }
}

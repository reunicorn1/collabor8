import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { DirectoryMongo } from './directory-mongo.entity';
import { parseCreateDirectoryMongoDto } from './dto/create-directory-mongo.dto';

@Injectable()
export class DirectoryMongoService {
  constructor(
    @InjectRepository(DirectoryMongo, 'mongoConnection')
    private dirRepository: Repository<DirectoryMongo>,
  ) {}

  async create(
    createDirectoryDto: Partial<DirectoryMongo>,
  ): Promise<DirectoryMongo> {
    const parsedDto = parseCreateDirectoryMongoDto(createDirectoryDto);
    const newDirectory = this.dirRepository.create({
      parent_id: parsedDto.parent_id,
      directory_name: parsedDto.directory_name,
    });
    return this.dirRepository.save(newDirectory);
  }

  findAll(): Promise<DirectoryMongo[]> {
    return this.dirRepository.find();
  }

  findOne(id: string): Promise<DirectoryMongo | null> {
    const _id = new ObjectId(id);
    return this.dirRepository.findOneBy({ _id });
  }

  async remove(id: string): Promise<void> {
    await this.dirRepository.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectoryMongo } from './directory-mongo.entity';

@Injectable()
export class DirectoryMongoService {
  constructor(
    @InjectRepository(DirectoryMongo, 'mongoConnection')
    private dirRepository: Repository<DirectoryMongo>,
  ) {}

  findAll(): Promise<DirectoryMongo[]> {
    return this.dirRepository.find();
  }

  findOne(id: string): Promise<DirectoryMongo | null> {
    return this.dirRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.dirRepository.delete(id);
  }
}

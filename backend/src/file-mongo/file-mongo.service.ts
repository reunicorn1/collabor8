import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileMongo } from './file-mongo.entity';

@Injectable()
export class FileMongoService {
  constructor(
    @InjectRepository(FileMongo)
    private dirRepository: Repository<FileMongo>,
  ) {}

  findAll(): Promise<FileMongo[]> {
    return this.dirRepository.find();
  }

  findOne(id: string): Promise<FileMongo | null> {
    return this.dirRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.dirRepository.delete(id);
  }
}

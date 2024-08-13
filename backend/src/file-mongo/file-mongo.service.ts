import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileMongo } from './file-mongo.entity';

@Injectable()
export class FileMongoService {
  constructor(
    @InjectRepository(FileMongo, 'mongoConnection')
    private fileRepository: Repository<FileMongo>,
  ) {}

  findAll(): Promise<FileMongo[]> {
    return this.fileRepository.find();
  }

  findOne(id: string): Promise<FileMongo | null> {
    return this.fileRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }
}

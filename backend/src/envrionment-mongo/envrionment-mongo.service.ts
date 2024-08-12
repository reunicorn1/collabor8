import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvironmentMongo } from './envrionment-mongo.entity';

@Injectable()
export class EnvironmentMongoService {
  // injecting the repository for data operations
  constructor(
    @InjectRepository(EnvironmentMongo, 'mongoConnection')
    private environRepository: Repository<EnvironmentMongo>,
  ) {}

  findAll(): Promise<EnvironmentMongo[]> {
    return this.environRepository.find();
  }

  findOne(id: string): Promise<EnvironmentMongo | null> {
    return this.environRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.environRepository.delete(id);
  }
}

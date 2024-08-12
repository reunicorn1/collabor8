import { Injectable } from '@nestjs/common';
import { ObjectId, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvironmentMongo } from './environment-mongo.entity';
import { MONGO_CONN } from '@constants';

@Injectable()
export class EnvironmentMongoService {
  // injecting the repository for data operations
  constructor(
    @InjectRepository(EnvironmentMongo, MONGO_CONN)
    private environRepository: Repository<EnvironmentMongo>,
  ) {}

  async create(
    createEnvironmentDto: Partial<EnvironmentMongo>,
  ): Promise<EnvironmentMongo> {
    // TODO: create validation for createEnvironmentDto
    const newEnvironment = this.environRepository.create(createEnvironmentDto);
    return this.environRepository.save(newEnvironment);
  }

  findAll(): Promise<EnvironmentMongo[]> {
    return this.environRepository.find();
  }

  findOne(_id: string): Promise<EnvironmentMongo | null> {
    return this.environRepository.findOneBy({ _id: new ObjectId(_id) });
  }

  async remove(id: string): Promise<void> {
    await this.environRepository.delete(id);
  }
}

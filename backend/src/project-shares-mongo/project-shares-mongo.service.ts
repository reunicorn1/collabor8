import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectSharesMongo } from './project-shares-mongo.entity';

@Injectable()
export class ProjectSharesMongoService {
  constructor(
    @InjectRepository(ProjectSharesMongo, 'mongoConnection')
    private shareRepository: Repository<ProjectSharesMongo>,
  ) {}

  findAll(): Promise<ProjectSharesMongo[]> {
    return this.shareRepository.find();
  }

  findOne(id: string): Promise<ProjectSharesMongo | null> {
    return this.shareRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.shareRepository.delete(id);
  }
}

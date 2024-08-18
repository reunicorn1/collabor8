import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
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
    const _id = new ObjectId(id);
    return this.shareRepository.findOneBy({ _id });
  }

  async remove(id: string): Promise<void> {
    await this.shareRepository.delete(id);
  }
}

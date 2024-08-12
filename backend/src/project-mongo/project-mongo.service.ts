import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectMongo } from './project-mongo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectMongoService {
  constructor(
    @InjectRepository(ProjectMongo, 'mongoConnection')
    private projectRepository: Repository<ProjectMongo>,
  ) {}

  findAll(): Promise<ProjectMongo[]> {
    return this.projectRepository.find();
  }

  findOne(id: string): Promise<ProjectMongo | null> {
    return this.projectRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}

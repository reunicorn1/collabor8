import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectShares } from './project-shares.entity';

@Injectable()
export class ProjectSharesService {
  constructor(
    @InjectRepository(ProjectShares)
    private projectSharesRepository: Repository<ProjectShares>,
  ) {}

  // Create a new project share
  async create(
    createProjectShareDto: Partial<ProjectShares>,
  ): Promise<ProjectShares> {
    const newProjectShare = this.projectSharesRepository.create(
      createProjectShareDto,
    );
    return this.projectSharesRepository.save(newProjectShare);
  }

  // Retrieve all project shares
  async findAll(): Promise<ProjectShares[]> {
    return this.projectSharesRepository.find();
  }

  // Retrieve a specific project share by ID
  async findOne(id: string): Promise<ProjectShares> {
    return this.projectSharesRepository.findOneBy({ share_id: id });
  }

  // Retrieve project shares by project ID
  async findByProject(project_id: string): Promise<ProjectShares[]> {
    return this.projectSharesRepository.findBy({ project_id });
  }

  // Retrieve project shares by user ID
  async findByUser(user_id: string): Promise<ProjectShares[]> {
    return this.projectSharesRepository.findBy({ user_id });
  }

  // Update a project share
  async update(
    id: string,
    updateProjectShareDto: Partial<ProjectShares>,
  ): Promise<ProjectShares> {
    await this.projectSharesRepository.update(id, updateProjectShareDto);
    return this.projectSharesRepository.findOneBy({ share_id: id });
  }

  // Delete a project share
  async remove(id: string): Promise<void> {
    await this.projectSharesRepository.delete(id);
  }
}

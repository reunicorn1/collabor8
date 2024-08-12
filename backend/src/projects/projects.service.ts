import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from './project.entity';
import { parseCreateProjectDto } from './dto/create-project.dto';
import { BadRequestException } from '@nestjs/common';
import { MYSQL_CONN } from '@constants';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects, MYSQL_CONN)
    private projectsRepository: Repository<Projects>,
  ) {}

  // Create a new project
  async create(createProjectDto: Partial<Projects>): Promise<Projects> {
    try {
      const parsedDto = parseCreateProjectDto(createProjectDto);
      const newProject = this.projectsRepository.create(parsedDto);
      return this.projectsRepository.save(newProject);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Retrieve all projects
  async findAll(): Promise<Projects[]> {
    return this.projectsRepository.find();
  }

  // Retrieve all projects by owner ID
  async findAllByOwnerId(owner_id: string): Promise<Projects[]> {
    return this.projectsRepository.findBy({ owner_id });
  }

  // Retrieve all projects by environment ID
  async findAllByEnvironmentId(environment_id: string): Promise<Projects[]> {
    return this.projectsRepository.findBy({ environment_id });
  }

  // Retrieve a specific project by ID
  async findOne(id: string): Promise<Projects> {
    return this.projectsRepository.findOneBy({ project_id: id });
  }

  // Update a project
  async update(
    id: string,
    updateProjectDto: Partial<Projects>,
  ): Promise<Projects> {
    await this.projectsRepository.update(id, updateProjectDto);
    return this.projectsRepository.findOneBy({ project_id: id });
  }

  // Delete a project
  async remove(id: string): Promise<void> {
    await this.projectsRepository.delete(id);
  }
}

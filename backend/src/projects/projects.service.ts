import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { Projects } from './project.entity';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { ProjectMongoService } from '@project-mongo/project-mongo.service';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { UsersService } from '@users/users.service';
import { BadRequestException } from '@nestjs/common';
import { MYSQL_CONN } from '@constants';
import {
  parseCreateProjectDto,
  CreateProjectDto,
  parseUpdateProjectDto,
  UpdateProjectDto,
} from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects, MYSQL_CONN)
    private projectsRepository: Repository<Projects>,
    @Inject(forwardRef(() => ProjectMongoService))
    private readonly projectMongoService: ProjectMongoService,
    @Inject(forwardRef(() => EnvironmentMongoService))
    private readonly environmentService: EnvironmentMongoService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  // Create a new project
  // TODO: TODAY modify env to be obtained from user object
  async create(createProjectDto: CreateProjectDto): Promise<Projects> {
    try {
      const parsedDto = parseCreateProjectDto(createProjectDto);
      const user = await this.usersService.findOneBy({
        username: parsedDto.username,
      });
      console.log(user);
      const environment = await this.environmentService.findOneBy({
        username: user.username,
      });
      parsedDto['environment_id'] = environment._id.toString();
      parsedDto['owner_id'] = user.user_id;
      const newProjectMongo = await this.projectMongoService.create(
        parsedDto as any,
      );
      parsedDto['project_id'] = newProjectMongo._id.toString();
      const newProject = this.projectsRepository.create({
        ...parsedDto,
      });
      return await this.projectsRepository.save(newProject);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Retrieve all projects
  async findAll(): Promise<Projects[]> {
    return this.projectsRepository.find();
  }

  // general method to find all projects by a field
  async findAllBy(field: string, value: string): Promise<Projects[]> {
    return this.projectsRepository.findBy({ [field]: value });
  }

  async findAllByUsernameDepth(
    username: string,
    depth: number,
    id: string,
  ): Promise<ProjectMongo[]> {
    return this.projectMongoService.findAllByUsernameDepth(username, depth, id);
  }

  // retrieve all user projects by username and is paginated
  async findAllByUsernamePaginated(
    username: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<{ total: number; projects: Projects[] }> {
    const skip = (page - 1) * limit;
    if (!sort) {
      sort = 'created_at';
    }
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortDirection = sort.startsWith('-') ? 'DESC' : 'ASC';
    const total = await this.projectsRepository.createQueryBuilder('projects')
      .where('projects.username = :username', { username })
      .getCount();
    const projects = await this.projectsRepository.createQueryBuilder('projects')
      .where('projects.username = :username', { username })
      .skip(skip)
      .take(limit)
      .orderBy(`projects.${sortField}`, sortDirection)
      .getMany();
    return { total, projects };
  }

  // Retrieve a specific project by ID
  // Retrieve a specific project by ID
  async findOne(id: string): Promise<Projects> {
    const project = await this.projectsRepository.findOneBy({ project_id: id });
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  // Update a project
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Projects> {
    const parsedDto = parseUpdateProjectDto(updateProjectDto);
    const project = await this.findOne(id);
    if (!project) {
      throw new Error('Project not found');
    }
    const newDate = new Date();
    await this.projectsRepository.update(id, {
      project_name: parsedDto.project_name,
      description: parsedDto.description,
      updated_at: newDate,
    });
    await this.projectMongoService.update(id, {
      project_name: parsedDto.project_name,
      updated_at: newDate,
    });
    return this.projectsRepository.findOneBy({ project_id: id });
  }

  // Delete a project
  async remove(id: string): Promise<void> {
    await this.projectMongoService.remove(id);
    await this.projectsRepository.delete(id);
  }

  // Delete all projects by owner ID
  async removeAllByEnvironment(environment_id: string): Promise<void> {
    const projects = await this.findAllBy('environment_id', environment_id);
    const projectsMongo = await this.projectMongoService.removeAllByEnvironment(
      environment_id,
    );
  }
}

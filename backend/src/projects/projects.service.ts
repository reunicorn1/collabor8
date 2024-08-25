import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { Projects } from './project.entity';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { ProjectMongoService } from '@project-mongo/project-mongo.service';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { UsersService } from '@users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MYSQL_CONN } from '@constants';
import {
  parseCreateProjectDto,
  CreateProjectDto,
  parseUpdateProjectDto,
  UpdateProjectDto,
} from './dto/create-project.dto';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects, MYSQL_CONN)
    private projectsRepository: Repository<Projects>,
    @Inject(forwardRef(() => ProjectMongoService))
    private readonly projectMongoService: ProjectMongoService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  // Create a new project
  // TODO: TODAY modify env to be obtained from user object
  async create(createProjectDto: CreateProjectDto): Promise<Projects> {
    try {
      const parsedDto = parseCreateProjectDto(createProjectDto);
      const user = await this.usersService.findOneBy({
        username: parsedDto.username,
      });
      // const environment = await this.environmentService.findOneBy({
      //   username: user.username,
      // });
      parsedDto['environment_id'] = user.environment_id;
      parsedDto['owner_id'] = user.user_id;
      const newProjectMongo = await this.projectMongoService.create(
        parsedDto as any,
      );
      parsedDto['_id'] = newProjectMongo._id.toString();
      const newProject = this.projectsRepository.create({
        ...parsedDto,
      });
      await this.projectsRepository.save(newProject);
      newProjectMongo.project_id = newProject.project_id;
      await this.projectMongoService.save(newProjectMongo);
      return newProject;
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
  async getIds(id: string): Promise<{ project_id: string; _id: string }> {
    const IDS = {
      project_id: null,
      _id: null,
    };
    if (uuidValidate(id)) {
      IDS.project_id = id;
      const project = await this.projectsRepository.findOneBy({
        project_id: id,
      });
      id = project._id.toString();
    } else {
      IDS._id = id;
    }
    return IDS;
  }

  async findAllByUsernameDepth(
    username: string,
    depth: number,
    id: string,
  ): Promise<ProjectMongo[]> {
    const IDS = await this.getIds(id);
    let project;
    if (!IDS._id) {
      if (!IDS.project_id) {
        throw new Error('Project not found');
      }
      project = await this.projectsRepository.findOneBy({
        project_id: IDS.project_id,
      });
      IDS._id = project._id.toString();
    } else {
      project = await this.projectsRepository.findOneBy({ _id: IDS._id });
    }

    if (project.username !== username) {
      throw new Error('Project not found');
    }
    return await this.projectMongoService.findAllByUsernameDepth(
      username,
      depth,
      IDS._id,
    );
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
    const total = await this.projectsRepository
      .createQueryBuilder('projects')
      .where('projects.username = :username', { username })
      .getCount();
    const projects = await this.projectsRepository
      .createQueryBuilder('projects')
      .where('projects.username = :username', { username })
      .skip(skip)
      .take(limit)
      .orderBy(`projects.${sortField}`, sortDirection)
      .getMany();
    return { total, projects };
  }

  async wrapProject(project: Projects): Promise<Projects> {
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  // Retrieve a specific project by ID
  // Retrieve a specific project by ID
  async findOne(id: string): Promise<Projects> {
    const project = await this.projectsRepository.findOneBy({ project_id: id });
    return this.wrapProject(project);
  }

  // Update a project
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Projects> {
    const parsedDto = parseUpdateProjectDto(updateProjectDto);
    const IDS = await this.getIds(id);
    let project;
    if (!IDS._id) {
      if (!IDS.project_id) {
        throw new Error('Project not found');
      }
      project = await this.projectsRepository.findOneBy({
        project_id: IDS.project_id,
      });
      IDS._id = project._id.toString();
    }
    if (!project) {
      throw new Error('Project not found');
    }
    const mongoProject = await this.projectMongoService.findOneBy(
      '_id',
      IDS._id,
    );
    if (!mongoProject) {
      throw new Error('Project not found');
    }
    for (const key in parsedDto) {
      if (parsedDto[key]) {
        if (key in mongoProject) {
          mongoProject[key] = parsedDto[key];
        }
        if (key in project) {
          project[key] = parsedDto[key];
        }
      }
    }
    const newDate = new Date();
    mongoProject.updated_at = newDate;
    project.updated_at = newDate;
    await this.projectMongoService.save(mongoProject);
    return await this.projectsRepository.save(project);
  }

  // Delete a project
  async remove(id: string): Promise<void> {
    await this.projectMongoService.remove(id);
    await this.projectsRepository.delete(id);
  }

  // Delete all projects by owner ID
  async removeAllByEnvironment(environment_id: string): Promise<void> {
    const projects = await this.findAllBy('environment_id', environment_id);
    const projectsMongo =
      await this.projectMongoService.removeAllByEnvironment(environment_id);
  }
}

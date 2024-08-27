import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  BadRequestException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Projects } from './project.entity';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { ProjectMongoService } from '@project-mongo/project-mongo.service';
import { UsersService } from '@users/users.service';
import { MYSQL_CONN } from '@constants';
import {
  parseCreateProjectDto,
  CreateProjectDto,
  parseUpdateProjectDto,
  UpdateProjectDto,
} from './dto/create-project.dto';
import { validate as uuidValidate } from 'uuid';
import { ProjectSharesService } from '@project-shares/project-shares.service';

interface ProjectWithMembers extends Projects {
  member_count: number;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects, MYSQL_CONN)
    private projectsRepository: Repository<Projects>,
    @Inject(forwardRef(() => ProjectMongoService))
    private readonly projectMongoService: ProjectMongoService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ProjectSharesService))
    private readonly projectSharesService: ProjectSharesService,
  ) { }

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
      const conflict = await this.projectsRepository.findOneBy({
        project_name: parsedDto.project_name,
        username: parsedDto.username,
      });
      if (conflict) {
        throw new Error('Project name already exists');
      }
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
  async toggleFavorite(username: string, id: string): Promise<Projects> {
    const project = await this.projectsRepository.findOneBy({ project_id: id });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.username !== username) {
      throw new NotFoundException('Project not found');
    }
    project.favorite = !project.favorite;
    await this.handleFavorite(project.username, project.favorite, project);
    await this.projectsRepository.save(project);
    return project;
  }

  async searchForProjects(name: string, username: string): Promise<Projects[]> {
    const projects = this.projectsRepository.find({
      where: {
        project_name: Like(`%${name}%`),
        username: username,
      },
    });
    return projects;

  }
  async getMongoProject(id: string): Promise<ProjectMongo> {
    const IDS = await this.getIds(id);
    return await this.projectMongoService.findOneBy('_id', IDS._id);
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
  ): Promise<{ total: number; projects: ProjectWithMembers[] }> {
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
    const projectWithMembers: ProjectWithMembers[] = await Promise.all(
      projects.map(async (project) => {
        const member_count = await this.projectSharesService.memberCount(project.project_id);
        return {
          ...project,
          member_count,
        };
      })
    );
    return { total, projects: projectWithMembers };
  }

  async wrapProject(project: Projects): Promise<Projects> {
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  // Retrieve a specific project by ID
  async findOne(id: string): Promise<Projects> {
    const IDS = await this.getIds(id);
    if (!IDS.project_id) {
      const project = await this.projectsRepository.findOneBy({ _id: id });
      console.log('project 1', project);
      return await this.wrapProject(project);
    }
    const project = await this.projectsRepository.findOneBy({ project_id: id });
    console.log('project 2', project);
    return await this.wrapProject(project);
  }

  // Update a project
  async handleFavorite(username, favorite, project) {
    const user = await this.usersService.findOneBy({ username });
    if (favorite) {
      if (!user.favorite_projects) {
        user.favorite_projects = [project];
      } else {
        user.favorite_projects.push(project);
      }
    } else {
      if (user.favorite_projects) {
        const idx = user.favorite_projects.indexOf(project);
        user.favorite_projects.splice(idx, 1);
      }
    }
    this.usersService.save(user);
  }


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
    } else {
      project = await this.projectsRepository.findOneBy({ _id: IDS._id });
    }
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (parsedDto.project_name) {
      const conflict = await this.projectsRepository.findOneBy({
        project_name: parsedDto.project_name,
        username: project.username,
      });
      if (conflict) {
        throw new ConflictException('Project name already exists');
      }
    }
    const mongoProject = await this.projectMongoService.findOneBy(
      '_id',
      IDS._id,
    );
    if (!mongoProject) {
      throw new NotFoundException('Project not found');
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
    if (parsedDto.favorite !== null || parsedDto.favorite !== undefined)
      await this.handleFavorite(project.username, parsedDto.favorite, project);
    return await this.projectsRepository.save(project);
  }

  // Delete a project
  async remove(id: string): Promise<void> {
    try {
      const IDS = await this.getIds(id);

      await this.projectSharesService
        .remove_project(IDS.project_id)
        .catch((error) => {
          Logger.error(error);
        });
      await this.projectMongoService.remove(IDS._id).catch((error) => {
        Logger.error(error);
      });
      await this.projectsRepository.delete(IDS.project_id).catch((error) => {
        Logger.error(error);
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Delete all projects by owner ID
  async removeAllByEnvironment(environment_id: string): Promise<void> {
    await this.findAllBy('environment_id', environment_id);
    await this.projectMongoService.removeAllByEnvironment(environment_id);
  }
}

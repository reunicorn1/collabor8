import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectShares } from './project-shares.entity';
import { MYSQL_CONN } from '@constants';
import { ProjectsService } from '@projects/projects.service';
import { UsersService } from '@users/users.service';
import {
  parseCreateProjectDto,
  CreateProjectShareDto,
  ProjectSharesOutDto,
} from './dto/create-project-shares.dto';

@Injectable()
export class ProjectSharesService {
  constructor(
    @InjectRepository(ProjectShares, MYSQL_CONN)
    private projectSharesRepository: Repository<ProjectShares>,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }


  async mapProjectShareData(projectShare: ProjectShares): Promise<ProjectSharesOutDto> {
    const { created_at, updated_at, username, ...projectShareData } = projectShare;
    const project = await this.projectsService.findOne(projectShare.project_id);
    const memberCount = await this.projectSharesRepository.createQueryBuilder('project_shares')
      .where('project_shares.project_id = :project_id', { project_id: project.project_id })
      .getCount();
    const user = await this.usersService.findOneBy({ username: project.username });
    return {
      ...projectShareData, // share_id, project_id, user_id, favorite, access_level
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      project_name: project.project_name,
      _id: project._id,
      created_at: project.created_at.toISOString(),
      updated_at: project.updated_at.toISOString(),
      member_count: memberCount,
    };
  }

  async getProjectShares(project_id: string, username: string): Promise<ProjectShares> {
    return await this.projectSharesRepository.findOneBy({ project_id, username });
  }

  // Create a new project share
  async create(
    createProjectShareDto: CreateProjectShareDto,
  ): Promise<ProjectSharesOutDto> {
    const parsedDto = parseCreateProjectDto(createProjectShareDto);
    if (parsedDto.username) {
      const user = await this.usersService.findOneBy({ username: parsedDto.username });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      parsedDto.user_id = user.user_id;
    } else if (parsedDto.user_id) {
      const user = await this.usersService.findOneBy({ _id: parsedDto.user_id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      parsedDto.username = user.username;
    }
    if (!await this.projectsService.findOne(parsedDto.project_id)) {
      throw new NotFoundException('Project not found');
    }

    const newProjectShare = this.projectSharesRepository.create(parsedDto);
    await this.projectSharesRepository.save(newProjectShare)
    console.log(newProjectShare);
    return await this.mapProjectShareData(newProjectShare);
  }


  // Retrieve all project shares
  async findAll(): Promise<ProjectSharesOutDto[]> {
    const shares = await this.projectSharesRepository.find();
    return Promise.all(shares.map(async (projectShare) => {
      return await this.mapProjectShareData(projectShare);
    }));

  }

  async updateStatus(id: string, status: string): Promise<ProjectShares | { message: string }> {
    const projectShare = await this.projectSharesRepository.findOneBy({ share_id: id });
    if (status !== 'accepted' && status !== 'rejected') {
      throw new Error('Invalid status');
    } else if (projectShare.status === 'rejected') {
      await this.projectSharesRepository.delete(id);
      return { "message": "Project share has been deleted" };
    }
    projectShare.status = status;
    return await this.projectSharesRepository.save(projectShare);
  }

  async findOneByQuery(query: any): Promise<ProjectSharesOutDto> {
    return await this.mapProjectShareData(await this.projectSharesRepository.findOneBy(query));
  }

  // Retrieve a specific project share by ID
  async findOne(id: string): Promise<ProjectSharesOutDto> {
    return await this.findOneByQuery({ share_id: id });
  }

  // Retrieve project shares by project ID
  async findByProject(project_id: string): Promise<ProjectSharesOutDto> {
    return await this.findOneByQuery({ project_id });
  }
  // Retrieve project shares by user ID
  async findByUser(username: string | any): Promise<ProjectSharesOutDto[]> {
    return await this.findAllByQuery({ username });
  }

  async findAllByQuery(query: any): Promise<ProjectSharesOutDto[]> {
    const projectShares = await this.projectSharesRepository.find(query);
    return Promise.all(projectShares.map(async (projectShare) => {
      return await this.mapProjectShareData(projectShare);
    }));
  }


  async findAllByUsernamePaginated(
    username: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<{ total: number; projects: Promise<ProjectSharesOutDto | any>[] }> {
    const skip = (page - 1) * limit;
    if (!sort) {
      sort = 'created_at';
    }
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortDirection = sort.startsWith('-') ? 'DESC' : 'ASC';
    const total = await this.projectSharesRepository.createQueryBuilder('projectShares')
      .where('projects_shares.username = :username', { username })
      .getCount();
    const projects = await this.projectSharesRepository.createQueryBuilder('projectShares')
      .where('project_shares.username = :username', { username })
      .skip(skip)
      .take(limit)
      .orderBy(`project_shares.${sortField}`, sortDirection)
      .getMany().then((projectShares) => {
        return projectShares.map(async (projectShare) => {
          console.log(projectShare);
          if (!projectShare) {
            return null;
          }
          return await this.mapProjectShareData(projectShare);
        });
      })
      .catch((error) => {
        Logger.error(error);
        return [];
      });

    return { total, projects };
  }

  // Update a project share
  async update(
    id: string,
    updateProjectShareDto: Partial<ProjectShares>,
  ): Promise<ProjectShares> {
    await this.projectSharesRepository.update(id, updateProjectShareDto);
    return await this.projectSharesRepository.findOneBy({ share_id: id });
  }

  // Delete a project share
  async remove(id: string): Promise<void> {
    await this.projectSharesRepository.delete(id);
  }
}

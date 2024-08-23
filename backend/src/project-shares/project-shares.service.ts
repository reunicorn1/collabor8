import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectShares } from './project-shares.entity';
import { MYSQL_CONN } from '@constants';
import { ProjectsService } from '@projects/projects.service';
import { UsersService } from '@users/users.service';
import { ProjectSharesOutDto } from './dto/create-project-shares.dto';

@Injectable()
export class ProjectSharesService {
  constructor(
    @InjectRepository(ProjectShares, MYSQL_CONN)
    private projectSharesRepository: Repository<ProjectShares>,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) { }

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
      created_at: project.created_at.toISOString(),
      updated_at: project.updated_at.toISOString(),
      member_count: memberCount,
    };
  }

  async findOneByQuery(query: any): Promise<ProjectSharesOutDto> {
    return await this.mapProjectShareData(await this.projectSharesRepository.findOneBy(query));
  }

  // Retrieve a specific project share by ID
  async findOne(id: string): Promise<ProjectShares> {
    return this.projectSharesRepository.findOneBy({ share_id: id });
  }

  // Retrieve project shares by project ID
  async findByProject(project_id: string): Promise<ProjectShares> {
    return this.projectSharesRepository.findOneBy({ project_id });
  }
  // Retrieve project shares by user ID
  async findByUser(username: string): Promise<ProjectShares> {
    return this.projectSharesRepository.findOneBy({ username });
  }


  async findAllByUsernamePaginated(
    username: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<{ total: number; projects: Promise<ProjectSharesOutDto>[] }> {
    const skip = (page - 1) * limit;
    if (!sort) {
      sort = 'created_at';
    }
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortDirection = sort.startsWith('-') ? 'DESC' : 'ASC';
    const total = await this.projectSharesRepository.createQueryBuilder('projectShares')
      .where('projects.username = :username', { username })
      .getCount();
    const projects = await this.projectSharesRepository.createQueryBuilder('projectShares')
      .where('projects.username = :username', { username })
      .skip(skip)
      .take(limit)
      .orderBy(`projects.${sortField}`, sortDirection)
      .getMany().then((projectShares) => {
        return projectShares.map((projectShare) => {
          return this.mapProjectShareData(projectShare);
        });
      });

      return { total, projects };
  }

  // Update a project share
  async update(
        id: string,
        updateProjectShareDto: Partial<ProjectShares>,
      ): Promise < ProjectShares > {
        await this.projectSharesRepository.update(id, updateProjectShareDto);
        return this.projectSharesRepository.findOneBy({ share_id: id });
      }

  // Delete a project share
  async remove(id: string): Promise < void> {
        await this.projectSharesRepository.delete(id);
      }
}

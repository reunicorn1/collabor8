import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { appConfig } from '@config/configuration';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

@Injectable()
export class ProjectSharesService {
  constructor(
    @InjectRepository(ProjectShares, MYSQL_CONN)
    private projectSharesRepository: Repository<ProjectShares>,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}


  async mapProjectShareData(projectShare: ProjectShares): Promise<ProjectSharesOutDto> {
    if (!projectShare) {
      throw new NotFoundException('Project share not found');
    }
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

  async getRoomToken(username: string, project_id: string): Promise<{
    token: string;
    uid: string;
    channel: string;
  }> {
    const project = await this.projectsService.getMongoProject(project_id);
    console.log(project);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (!appConfig.appID || !appConfig.appCertificate) {
      throw new Error('Agora app ID and certificate not found');
    }

    const user = await this.usersService.findOneBy({ username: username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { user_id } = user;
    const { project_name, _id } = project;
    const channelName = `${project_id}`;
    const appId = appConfig.appID;
    const appCertificate = appConfig.appCertificate;
    const account = user_id;
    const role = 1;
    const start_time = new Date();
    const delta = 12 * 60 * 60 * 1000;
    const expire_time = new Date(start_time.getTime() + delta);
    const privilegeExpiredTs = Math.floor(expire_time.getTime() / 1000);
    const token = RtcTokenBuilder.buildTokenWithAccount(appId,
      appCertificate, channelName,
      account, role, privilegeExpiredTs);


    return { token, uid: user_id, channel: channelName };


    /*
     *   channelName = session_id[:8] + student.id[:8] + mentor.id[:8]
        token = (session.mentor_token, session.student_token)[user]
        if token is not None:
            return respond.ok({"token": token, "uid": user_id,
                                "channel": channelName})
        # generate room ID using session ID and student ID and mentor ID
        appId = getenv('AGORA_APPID')
        appCertificate = getenv('AGORA_CERTIFICATE')
        account = user_id
        role = 1
        start_time = datetime.combine(session.date, session.time)
        start_time = start_time + timedelta(hours=12)
        print("start_time", start_time)
        expire_time = start_time + timedelta(hours=session.duration.hour,
                                    minutes=session.duration.minute)
        print("expire_time", expire_time)
        privilegeExpiredTs = int(expire_time.timestamp())
        token = RtcTokenBuilder.buildTokenWithAccount(appId,
                    appCertificate, channelName,
                    account, role, privilegeExpiredTs)
        if user:
            session.student_token = token
        else:
            session.mentor_token = token
        session.save()
        return respond.ok({
                            "token": token,
                            "uid": user_id,
                            "channel": channelName})

*/

  }

  async partialSearch(query: string, username: string): Promise<ProjectSharesOutDto[]> {
    const shares = await this.projectSharesRepository.createQueryBuilder('project_shares')
      .where('project_shares.username = :username', { username })
      .where('project_shares.username LIKE :query', { query: `%${query}%` })
      .getMany();
    return Promise.all(shares.map(async (projectShare) => {
      return await this.mapProjectShareData(projectShare);
    }));
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
    const project = await this.projectsService.findOne(parsedDto.project_id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    parsedDto._id = project._id;
    if (await this.getProjectShares(parsedDto.project_id, parsedDto.username)) {
      throw new ConflictException('Project share already exists');
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

  async mapProjectUsers(shared_projects: ProjectShares[]): Promise<any[]> {
    const users = await Promise.all(shared_projects.map(async (projectShare) => {
      const user = await this.usersService.findOneBy({ username: projectShare.username });
      return {
        ...projectShare,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        project_picture: user.profile_picture,
      };
    }));
    return users;
  }


  // Retrieve project shares by project ID
  async findByProject(project_id: string): Promise<any[]> {
    const originalProject = await this.projectsService.findOne(project_id);
    if (!originalProject) {
      throw new NotFoundException('Project not found');
    }
    const shared_projects = await this.projectSharesRepository.createQueryBuilder('project_shares')
      .where('project_shares.project_id = :project_id', { project_id })
      .getMany();
    console.log(shared_projects.length);
    return await this.mapProjectUsers(shared_projects);


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
  ): Promise<{ total: number; projects: ProjectSharesOutDto[] }> {
    const skip = (page - 1) * limit;
    if (!sort) {
      sort = 'created_at';
    }
    Logger.log(`given input: ${username}, ${page}, ${limit}, ${sort}`);
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortDirection = sort.startsWith('-') ? 'DESC' : 'ASC';
    const total = await this.projectSharesRepository.createQueryBuilder('project_shares')
      .where('project_shares.username = :username', { username })
      .getCount();
    const projects = await this.projectSharesRepository.createQueryBuilder('project_shares')
      .where('project_shares.username = :username', { username })
      .skip(skip)
      .take(limit)
      .orderBy(`project_shares.${sortField}`, sortDirection)
      .getMany()

    console.log(projects);
    // .then((project) => {
    //   return project.map(async (project) => {
    //     console.log(project);
    //     if (!project) {
    //       return null;
    //     }
    //     return await this.mapProjectShareData(project);
    //   });
    // })
    // .catch((error) => {
    //   Logger.error(error);
    //   return [];
    // });

    const mappedProjects = await Promise.all(
      projects.map(async (project) => {
        return this.mapProjectShareData(project);
      })
    );
    console.log(mappedProjects);


    return { total, projects: mappedProjects };
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
  async remove_project(id: string): Promise<void> {
    try {
      await this.projectSharesRepository.delete({ project_id: id });
    }
    catch (error) {
      Logger.error(error);
    }
  }


}

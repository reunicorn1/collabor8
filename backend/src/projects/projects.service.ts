import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { Projects } from './project.entity';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { ProjectMongoService } from '@project-mongo/project-mongo.service';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { UsersService } from '@users/users.service';
import { parseCreateProjectDto } from './dto/create-project.dto';
import { BadRequestException } from '@nestjs/common';
import { MYSQL_CONN } from '@constants';

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
  ) {}

  // Create a new project
  // TODO: TODAY modify env to be obtained from user object
  async create(createProjectDto: Partial<Projects>): Promise<Projects> {
    try {
      const parsedDto = parseCreateProjectDto(createProjectDto);

      const user = await this.usersService.findOneBy({
        username: parsedDto.username,
      });
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

  async findAllByUsername(username: string): Promise<ProjectMongo[]> {
    const user = await this.usersService.findOneBy({ username });
    return await this.projectMongoService.findAllByEnvironment(
      user.environment_id,
    );
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

  // Delete all projects by owner ID
  async removeAllByEnvironment(environment_id: string): Promise<void> {
    const projects = await this.findAllByEnvironmentId(environment_id);
    console.log(projects);
    const projectsMongo = await this.projectMongoService.removeAllByEnvironment(
      environment_id,
    );
    console.log(projectsMongo);
  }
}

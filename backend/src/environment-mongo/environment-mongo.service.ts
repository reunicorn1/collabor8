import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { Repository, FindOptionsWhere, FindOperator, In } from 'typeorm';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvironmentMongo } from './environment-mongo.entity';
import { UsersService } from '@users/users.service';
import { MONGO_CONN } from '@constants';
import { ProjectsService } from '@projects/projects.service';
// import { UsersService } from '@users/users.service';
interface Query {
  [key: string]: any;
}

@Injectable()
export class EnvironmentMongoService {
  // injecting the repository for data operations
  constructor(
    @InjectRepository(EnvironmentMongo, MONGO_CONN)
    private environRepository: Repository<EnvironmentMongo>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectService: ProjectsService,
  ) {}

  async create(
    createEnvironmentDto: Partial<EnvironmentMongo>,
  ): Promise<EnvironmentMongo> {
    // TODO: create validation for createEnvironmentDto
    const newEnvironment = this.environRepository.create(createEnvironmentDto);
    return await this.environRepository.save(newEnvironment);
  }

  async findAll(): Promise<EnvironmentMongo[]> {
    return await this.environRepository.find();
  }


  async findOne(_id: string): Promise<EnvironmentMongo | null> {
    return await this.environRepository.findOneBy({ _id: new ObjectId(_id) });
  }

  // TODO: TODAY create method to remove environment projects using projectService

  async reset(username: string): Promise<EnvironmentMongo> {
    // remove all projects for the user
    try {
      this.remove(username);
    } catch (err) {
      throw new NotFoundException(`Environment for user ${username} not found`);
    }
    // create a new environment for the user
    const newEnv = await this.create({ username });
    const user = await this.usersService.findOneBy({ username });
    user.environment_id = newEnv._id.toString();
    await this.usersService.save(user);
    await this.environRepository.save(newEnv);
    return newEnv;

  }

  async remove(username: string): Promise<{ message: string }> {
    const env = await this.findOneBy({ username });
    Logger.log(`Environment ${env._id} for user ${username} found`);
    if (!env) {
      throw new NotFoundException(`Environment for user ${username} not found`);
    }
    const projects = await this.projectService.findAllBy('environment_id', env._id.toString());
    await Promise.all(projects.map(async (project) => {
      await this.projectService.remove(project.project_id);
    }));


    // remove the environment
    await this.environRepository.remove(env);
    return { message: `Environment for user ${username} removed` };
  }

  async findOneBy(query: Query): Promise<EnvironmentMongo> {
    const findOptions: FindOptionsWhere<EnvironmentMongo> = {};

    const normalizeValue = (value: any): string | Date | FindOperator<any> => {
      if (Array.isArray(value)) {
        return In(value);
      } else if (value instanceof Date) {
        return value;
      } else if (typeof value === 'string') {
        return value;
      }
      return value;
    };

    for (const [key, value] of Object.entries(query)) {
        findOptions[key] = normalizeValue(value);
    }
    // this comes as empty even though i pass {username: 'admin'} as query

    const env = await this.environRepository.findOne({ where: findOptions });

    if (!env) {
      throw new NotFoundException(
        `User with query ${JSON.stringify(query)} not found`,
      );
    }
    return env;
  }

  async getEnvironmentUsername(username: string): Promise<EnvironmentMongo> {
    const env = await this.findOneBy({
      username,
    });
    return env;
  }
}

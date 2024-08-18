import { Injectable,
  // Inject, forwardRef
} from '@nestjs/common';
import { ObjectId, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvironmentMongo } from './environment-mongo.entity';
import { MONGO_CONN } from '@constants';
// import { UsersService } from '@users/users.service';

@Injectable()
export class EnvironmentMongoService {
  // injecting the repository for data operations
  constructor(
    @InjectRepository(EnvironmentMongo, MONGO_CONN)
    private environRepository: Repository<EnvironmentMongo>,
    // @Inject(forwardRef(() => UsersService))
    // private readonly usersService: UsersService,
  ) {}

  async create(
    createEnvironmentDto: Partial<EnvironmentMongo>,
  ): Promise<EnvironmentMongo> {
    // TODO: create validation for createEnvironmentDto
    const newEnvironment = this.environRepository.create(createEnvironmentDto);
    return this.environRepository.save(newEnvironment);
  }

  findAll(): Promise<EnvironmentMongo[]> {
    return this.environRepository.find();
  }

  findOneBy(
    query: Partial<EnvironmentMongo>,
  ): Promise<EnvironmentMongo | null> {
    return this.environRepository.findOneBy(query);
  }

  findOne(_id: string): Promise<EnvironmentMongo | null> {
    return this.environRepository.findOneBy({ _id: new ObjectId(_id) });
  }

  async remove(id: string): Promise<void> {
    await this.environRepository.delete(id);
  }

  async getEnvironmentProjects(username: string): Promise<EnvironmentMongo> {
    // const user = await this.usersService.findOneBy({ username: username });
    const env = await this.environRepository.findOne({
      where: { username: username },
      relations: ['projects'],
    });
    console.log(env.projects);
    return env;
  }
}

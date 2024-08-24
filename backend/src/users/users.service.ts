import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOperator, In } from 'typeorm';
import { Users } from './user.entity';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { MYSQL_CONN } from '@constants';

interface Query {
  [key: string]: any;
}
// TODO: complete all DB QUERY/MUTATION
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users, MYSQL_CONN)
    private readonly usersRepository: Repository<Users>,
    @Inject(forwardRef(() => EnvironmentMongoService))
    private readonly environmentService: EnvironmentMongoService,
  ) {}

 async create(user: Partial<Users>): Promise<Users> {
   let newUser = this.usersRepository.create(user);
   const newEnv = await this.environmentService.create({ username: newUser.username });
   newUser.environment_id = newEnv._id.toString();
   await this.usersRepository.save(newUser);
   return this.removePasswordHash(newUser);

  }

  async save(user: Users): Promise<Users> {
    return await this.usersRepository.save(user);
  }

  async removePasswordHash(user: Users): Promise<Users> {
    delete user.password_hash;
    delete user.roles;
    return user;
  }

  async removeAllPasswordHash(users: Users[]): Promise<Users[]> {
    return await Promise.all(
      users.map(user => this.removePasswordHash(user)),
    );
  }

  async findAll(): Promise<Users[]> {
    const users = await this.usersRepository.find();
    return await this.removeAllPasswordHash(users);
  }

  async findOneBy(query: Query, pwd: boolean = false): Promise<Users> {
    const findOptions: FindOptionsWhere<Users> = {};

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

    const user = await this.usersRepository.findOne({ where: findOptions });

    if (!user) {
      throw new NotFoundException(
        `User with query ${JSON.stringify(query)} not found`,
      );
    }
    if (pwd) {
      return user;
    }
    return await this.removePasswordHash(user);
  }

  async updateById(
    user_id: string,
    updateUserDto: Partial<Users>,
  ): Promise<Users> {
    await this.usersRepository.update(user_id, updateUserDto);
    return this.findOneBy({ user_id });
  }

  async updateByUsername(
    username: string,
    updateUserDto: Partial<Users>,
  ): Promise<Users> {
    await this.usersRepository.update({ username }, updateUserDto);
    return this.findOneBy({ username });
  }

  async removeByUsername(username: string
  ): Promise<{ message: string }> {
    const result = await this.usersRepository.delete({ username });

    if (result.affected === 0) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return { message: `User with username ${username} successfully deleted` };
  }

async remove(user_id: string): Promise<{ message: string }> {
  const result = await this.usersRepository.delete(user_id);

  if (result.affected === 0) {
    throw new NotFoundException(`User with ID ${user_id} not found`);
  }

  return { message: `User with ID ${user_id} successfully deleted` };
}

async update(username: string, user: Partial<Users>): Promise<Users> {
  await this.usersRepository.update({ username: username }, user);
  return this.findOneBy({ username: username });
}

async removeAll(): Promise<{ message: string }> {
  await this.usersRepository.delete({});
  return { message: 'All users successfully deleted' };
}

}

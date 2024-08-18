import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOperator, In } from 'typeorm';
import { Users } from './user.entity';
import { parseCreateUserDto, parseLoginDto } from './dto/create-user.dto';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { MYSQL_CONN } from '@constants';
import { comparePwd } from '@utils/encrypt_password';

interface Query {
  [key: string]: any;
}
// TODO: complete all DB QUERY/MUTATION
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users, MYSQL_CONN)
    private readonly usersRepository: Repository<Users>,
    private readonly environmentService: EnvironmentMongoService,
  ) {}

  async create(user: Partial<Users>): Promise<Users> {
    try {
      const parsedDto = parseCreateUserDto(user);

      const userExists = await this.usersRepository.findOne({
        where: { username: parsedDto.username },
      });

      if (userExists) {
        throw new ConflictException(
          `User with username ${parsedDto.username} already exists`,
        );
      }

      let newUser = this.usersRepository.create(parsedDto);

      if (this.environmentService) {
        const userEnvironment = await this.environmentService.create({
          username: newUser.username,
        });
        newUser.environment_id = userEnvironment._id.toString();
      }

      newUser = await this.usersRepository.save(newUser);
      // remove password_hash from response
      delete newUser.password_hash;
      return newUser;
    } catch (err) {
      console.log(`Failed to create user: ${err.message}`);
      throw new InternalServerErrorException(`Failed to create user`);
    }
  }

  async login(loginDto: { username: string; password: string }) {
    const parsedDto = parseLoginDto(loginDto);
    const user = await this.usersRepository.findOne({
      where: { username: parsedDto.username },
    });
    if (!user) {
      throw new NotFoundException(
        `User with username ${parsedDto.username} not found`,
      );
    }
    if (!comparePwd(parsedDto.password, user.password_hash)) {
      throw new NotFoundException('Invalid password');
    }
    return user;
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find({
      relations: ['ownedProjects', 'projectShares'],
    });
  }

  async findOneBy(query: Query): Promise<Users> {
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
      if (key in findOptions) {
        findOptions[key] = normalizeValue(value);
      }
    }

    const user = await this.usersRepository.findOne({ where: findOptions });

    if (!user) {
      throw new NotFoundException(
        `User with query ${JSON.stringify(query)} not found`,
      );
    }
    return user;
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

  async remove(user_id: string): Promise<void> {
    const result = await this.usersRepository.delete(user_id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
  }
}

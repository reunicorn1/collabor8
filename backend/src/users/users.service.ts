import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { MYSQL_CONN } from '@constants';

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
      const newUser = this.usersRepository.create(user);
      if (this.environmentService) {
        const userEnvironment = await this.environmentService.create({
          username: newUser.username,
        });
        newUser.environment_id = userEnvironment._id.toString();
      }

      return this.usersRepository.save(newUser);
    } catch (err) {
      console.log({ err });
    }
  }

  async login(loginDto: { username: string; password: string }) {
    const user = await this.usersRepository.findOne({
      where: { username: loginDto.username },
    });
    if (!user) {
      throw new NotFoundException(
        `User with username ${loginDto.username} not found`,
      );
    }
    if (user.password_hash !== loginDto.password) {
      throw new NotFoundException('Invalid password');
    }
    return user;
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find({
      relations: ['ownedProjects', 'projectShares'],
    });
  }

  async findOneBy(query: Partial<Users>): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: query });
    if (!user) {
      throw new NotFoundException(`User with query ${query} not found`);
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

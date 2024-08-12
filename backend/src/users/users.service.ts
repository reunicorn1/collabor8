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

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find({
      relations: ['ownedProjects', 'projectShares'],
    });
  }

  async findOneById(user_id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { user_id },
      relations: ['ownedProjects', 'projectShares'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['ownedProjects', 'projectShares'],
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async update(user_id: string, updateUserDto: Partial<Users>): Promise<Users> {
    await this.usersRepository.update(user_id, updateUserDto);
    return this.findOneById(user_id);
  }

  async remove(user_id: string): Promise<void> {
    const result = await this.usersRepository.delete(user_id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
  }
}

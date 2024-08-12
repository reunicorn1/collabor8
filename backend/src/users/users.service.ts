import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';

// TODO: complete all DB QUERY/MUTATION
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly environmentService: EnvironmentMongoService,
  ) {}

  async create(user: Partial<Users>): Promise<Users> {
    const newUser = this.usersRepository.create(user);
    const userEnvironment = await this.environmentService.create({
      username: newUser.username,
    });
    newUser.environment_id = userEnvironment.id;

    return this.usersRepository.save(newUser);
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

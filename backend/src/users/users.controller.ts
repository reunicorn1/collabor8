import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { Users } from './user.entity';

// TODO: complete RESTful API for user entity
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: Partial<Users>): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') user_id: string): Promise<Users> {
    return this.usersService.findOneById(user_id);
  }

  @Get('username/:username')
  async findOneByUsername(@Param('username') username: string): Promise<Users> {
    return this.usersService.findOneByUsername(username);
  }

  @Put(':id')
  async update(
    @Param('id') user_id: string,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.update(user_id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') user_id: string): Promise<void> {
    return this.usersService.remove(user_id);
  }
}

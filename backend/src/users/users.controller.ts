import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { Users } from './user.entity';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';

// TODO: complete RESTful API for user entity
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      // console.error(error);
      return error;
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.usersService.login(loginDto);
  }

  @Get('all')
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Put()
  async update(
    @Query('id') user_id: string,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateById(user_id, updateUserDto);
  }

  @Get(':username')
  async findOneByUsername(@Param('username') username: string): Promise<Users> {
    return this.usersService.findOneBy({ username });
  }

  @Patch(':username')
  async updateByUsername(
    @Param('username') username: string,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateByUsername(username, updateUserDto);
  }

  @Get(':id')
  async findOneById(@Param('id') user_id: string): Promise<Users> {
    return this.usersService.findOneBy({ user_id });
  }

  @Patch(':id')
  async updateById(
    @Param('id') user_id: string,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateById(user_id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') user_id: string): Promise<void> {
    return this.usersService.remove(user_id);
  }
}

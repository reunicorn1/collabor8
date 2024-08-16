import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { Users } from './user.entity';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Role } from '@auth/enums/role.enum';
// import { Public } from '@auth/decorators/isPublic.decorator';

// TODO: complete RESTful API for user entity
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }
  // TODO: regular user should not be able to set roles
  @Put('update')
  async update(
    @Request() req,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateByUsername(req.user.username, updateUserDto);
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

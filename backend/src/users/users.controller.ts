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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { Public } from '@auth/decorators/isPublic.decorator';

// TODO: complete RESTful API for user entity
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users. Only accessible by admins.',
  })
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }
  // TODO: regular user should not be able to set roles
  @ApiOperation({
    summary: 'Update user details',
    description:
      'Update the details of the current user based on their username. Regular users cannot set roles.',
  })
  @Put('update')
  async update(
    @Request() req,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateByUsername(req.user.username, updateUserDto);
  }

  @ApiOperation({
    summary: 'Get user by username',
    description: 'Retrieve a user by their username.',
  })
  @Get(':username')
  async findOneByUsername(@Param('username') username: string): Promise<Users> {
    return this.usersService.findOneBy({ username });
  }

  @ApiOperation({
    summary: 'Update user by username',
    description:
      'Update the details of a user based on their username. Regular users cannot set roles.',
  })
  @Patch(':username')
  async updateByUsername(
    @Param('username') username: string,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateByUsername(username, updateUserDto);
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a user by their unique ID.',
  })
  @Get(':id')
  async findOneById(@Param('id') user_id: string): Promise<Users> {
    return this.usersService.findOneBy({ user_id });
  }

  @ApiOperation({
    summary: 'Update user by ID',
    description:
      'Update the details of a user based on their unique ID. Regular users cannot set roles.',
  })
  @Patch(':id')
  async updateById(
    @Param('id') user_id: string,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateById(user_id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Delete a user based on their unique ID.',
  })
  @Delete(':id')
  async remove(@Param('id') user_id: string): Promise<void> {
    return this.usersService.remove(user_id);
  }
}

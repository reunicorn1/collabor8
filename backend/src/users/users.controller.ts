import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { Users } from './user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
<<<<<<< HEAD
import DOCS from './users.decorator';

=======
// TODO: error handling for all endpoints
>>>>>>> 4797da9be30972f39ddf6435216a0122d0313ac2
// TODO: complete RESTful API for user entity
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // Endpoints for current user
  @DOCS.findUser()
  @Get('me')
  async findUser(@Request() req): Promise<Users> {
    return this.usersService.findOneBy({ username: req.user.username });
  }

  @DOCS.updateUser()
  @Patch('me')
  async updateUser(
    @Request() req,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    if (updateUserDto.roles) {
      delete updateUserDto.roles;
    }
    return this.usersService.updateByUsername(req.user.username, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete current user profile',
    description: 'Delete the profile of the currently authenticated user.',
  })
  @Delete('me')
  async removeUser(@Request() req): Promise<{ message: string }> {
    return this.usersService.removeByUsername(req.user.username);
  }

  // endpoints for other non-admin users
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their unique ID.',
  })
  @Get(':id')
  async findOneById(@Param('id') user_id: string): Promise<Users> {
    return this.usersService.findOneBy({ user_id });
  }

  @ApiOperation({
    summary: 'Update user by ID',
    description: 'Update a specific user’s profile by their unique ID.',
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
    description: 'Delete a specific user by their unique ID.',
  })
  @Delete(':id')
  async remove(@Param('id') user_id: string): Promise<{ message: string }> {
    return this.usersService.remove(user_id);
  }
}

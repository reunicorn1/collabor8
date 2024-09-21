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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Docs from './users.docs';
import { Projects } from '@projects/project.entity';
import { ProjectShares } from '@project-shares/project-shares.entity';
interface UserFavorite {
  user: Partial<Users>;
  favorite_projects: Projects[];
  favorite_shares: ProjectShares[];
}
// TODO: complete RESTful API for user entity
@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // Endpoints for current user
  @Docs.findUser()
  @Get('me')
  async findUser(@Request() req): Promise<Users> {
    return this.usersService.findOneBy({ username: req.user.username });
  }

  @Docs.updateUser()
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

  @Docs.removeUser()
  @Delete('me')
  async removeUser(@Request() req): Promise<{ message: string }> {
    return this.usersService.removeByUsername(req.user.username);
  }

  @Get('me/favorites')
  async getUserFavorites(@Request() req): Promise<UserFavorite> {
    return await this.usersService.getUserFavorites(req.user.username);
  }

  // endpoints for other non-admin users
  @Docs.findOneById()
  @Get(':id')
  async findOneById(@Param('id') user_id: string): Promise<Users> {
    return this.usersService.findOneBy({ user_id });
  }

  @Docs.updateById()
  @Patch(':id')
  async updateById(
    @Param('id') user_id: string,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateById(user_id, updateUserDto);
  }

  @Docs.remove()
  @Delete(':id')
  async remove(@Param('id') user_id: string): Promise<{ message: string }> {

    return this.usersService.remove(user_id);
  }
}

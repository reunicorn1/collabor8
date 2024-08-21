import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersService } from '@users/users.service';
import { Users } from '@users/user.entity';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Role } from '@auth/enums/role.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({
    summary: 'Retrieve All Users',
    description:
      'Retrieve a list of all users in the system. Accessible only by admins.',
  })
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Delete All Users',
    description: 'Delete all users from the system. Accessible only by admins.',
  })
  @Delete('all')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async removeAll(): Promise<{ message: string }> {
    return this.usersService.removeAll();
  }
  // TODO: regular user should not be able to set roles
  @ApiOperation({
    summary: 'Retrieve User Profile by Username',
    description:
      'Retrieve a specific user profile by username. Accessible only by admins.',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('profile/:username')
  async findUserAdmin(@Param('username') username: string): Promise<Users> {
    return this.usersService.findOneBy({ username });
  }

  @ApiOperation({
    summary: 'Update User Profile by Username',
    description:
      'Update a specific user profile by username. Accessible only by admins.',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch('profile/:username')
  async updateUserAdmin(
    @Param('username') username: string,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateByUsername(username, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete User Profile by Username',
    description:
      'Delete a specific user profile by username. Accessible only by admins.',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('profile/:username')
  async removeUserAdmin(
    @Param('username') username: string,
  ): Promise<{ message: string }> {
    return this.usersService.removeByUsername(username);
  }
}

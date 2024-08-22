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
import { ProjectsService } from '@projects/projects.service';
import { FileMongoService } from '@file-mongo/file-mongo.service';
import { Users } from '@users/user.entity';
import { Projects } from '@projects/project.entity';
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

    private readonly projectsService: ProjectsService,
    private readonly fileService: FileMongoService,
  ) {}

  // User CRUD
  @ApiOperation({
    summary: 'Retrieve All Users',
    description:
      'Retrieve a list of all users in the system. Accessible only by admins.',
  })
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findAllUsers(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Delete All Users',
    description: 'Delete all users from the system. Accessible only by admins.',
  })
  @Delete('all')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async removeAllUsers(): Promise<{ message: string }> {
    return this.usersService.removeAll();
  }
  // TODO: regular user should not be able to set roles
  // Admin Crud
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


// Project CRUD
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Retrieve a list of all projects.',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async findAllProjects(): Promise<Projects[]> {
    return this.projectsService.findAll();
  }

  // Files CRUD

  @ApiOperation({
    summary: 'Retrieve all files',
    description: 'Retrieve a list of all files stored in MongoDB.',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.fileService.findAll();
  }
}

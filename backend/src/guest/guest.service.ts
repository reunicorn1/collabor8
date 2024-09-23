import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@auth/auth.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { Users } from '@users/user.entity';
import { UsersService } from '@users/users.service';
import { ProjectsService } from '@projects/projects.service';
import { Projects } from '@projects/project.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class GuestService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly projectService: ProjectsService,
    private jwtService: JwtService,
  ) { }

  /**
   * create a guest user if it doesn't exist
   * @returns accessToken valid for 24h(no refresh) and guest user details
   *
   */
  async tryout(): Promise<{
    accessToken: string;
    user: Partial<Users>;
    userData: Partial<Users>;
  }> {
    let user: Partial<Users> = null;

    try {
      user = await this.usersService.findOneBy({ username: 'guest' });
    } catch (err) {
      // If guest doesn't exist create one and only one guest
      const createGuestDto: CreateUserDto = {
        username: 'guest',
        email: 'guest.co11abor8@gmail.com',
        first_name: 'Guest',
        last_name: 'User',
        password: 'guest',
        favorite_languages: [],
      };
      user = await this.authService.signUp(createGuestDto);
      console.log('=====================>', user);
      if (!user) {
        throw new InternalServerErrorException('Guest user not created');
      }
    }
    console.log('=====================>', user);
    const payload = {
      username: user.username,
      sub: user.user_id,
      roles: user.roles,
      timestamp: new Date().getTime(),
      jti: uuidv4(),
    };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1d' });
    const {
      user_id,
      email,
      //roles,
      environment_id,
      created_at,
      updated_at,
      password_hash,
      is_verified,
      ...userinfo
    } = user;
    const userData = {
      userId: user_id,
      username: 'guest',
      roles: user.roles,
      jti: payload.jti,
    };
    return {
      accessToken,
      user: userinfo,
      userData,
    };
  }

  /**
   * create a prjoect for the guest user (only one project amongst all guests)
   * @returns projectInfo
   */
  async createOrGetProject(guestId: string): Promise<Projects> {
    try {
      // check if project exists
      return (await this.projectService.findMyProject(guestId, 'guest')) as Projects;
    } catch (err) {
      if (err instanceof NotFoundException) {
        // create a project
        const project = await this.projectService.create({
          project_name: `project-${new Date().getTime()}`,
          username: 'guest',
          description: 'Guest project',
        });

        return project;
      }
      throw new InternalServerErrorException('Error creating project');
    }
  }
}

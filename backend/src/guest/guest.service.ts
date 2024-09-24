import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProjectsService } from '@projects/projects.service';
import { Projects } from '@projects/project.entity';
import { RedisService } from '@redis/redis.service';
import { GUEST_EMAIL, GUEST_USER } from '@constants';
import { UsersService } from '@users/users.service';
import { AuthService } from '@auth/auth.service';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { Users } from '@users/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GuestService {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * create a guest user if it doesn't exist
   *
   * @returns guest user
   */
  async createOrGetGuest(): Promise<Users> {
    try {
      return await this.usersService.findOneBy({ username: GUEST_USER });
    } catch (err) {
      // If guest doesn't exist create one and only one guest
      const createGuestDto: CreateUserDto = {
        username: GUEST_USER,
        email: GUEST_EMAIL,
        first_name: 'Guest',
        last_name: 'User',
        password: GUEST_USER,
        favorite_languages: [],
      };
      const user = await this.authService.signUp(createGuestDto);
      //console.log('=====================>', user);
      if (!user) {
        throw new InternalServerErrorException('Guest user not created');
      }
      return user;
    }
  }

  /**
   * create a guest user if it doesn't exist
   * @param {string} IP - IP address of the guest user
   * @returns accessToken valid for 24h(no refresh) and guest user details
   */
  async tryout(IP: string): Promise<{
    accessToken: string;
    user: Partial<Users>;
    userData: Partial<Users>;
    redirect: string;
  }> {
    console.log('0x00===========================>', { IP });
    const user = await this.createOrGetGuest();
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
      username: GUEST_USER,
      roles: user.roles,
      jti: payload.jti,
    };
    const project = await this.createOrGetProject(IP);

    return {
      accessToken,
      user: userinfo,
      userData,
      redirect: project._id,
    };
  }

  /**
   * create a prjoect for the guest user (only one project per guest)
   * @param {string} IP - IP address of the guest user
   * @returns projectInfo
   */
  async createOrGetProject(IP: string): Promise<Projects> {
    // create a new project for each guest user
    // when clicking on try it out button
    const project_id = await this.redisService.get(IP);
    if (project_id) {
      console.log('0x01==========cached===========>', { project_id });
      return (await this.projectService.findMyProject(
        project_id,
        GUEST_USER,
      )) as Projects;
    }
    const project = await this.projectService.create({
      project_name: `project-${new Date().getTime()}`,
      username: GUEST_USER,
      description: 'Guest project',
    });

    console.log('0x01=========not cached yet============>');
    // persist project on redis for 24h
    await this.redisService.set(IP, project._id, 60 * 60 * 24);

    return project;
  }
}

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Users } from '@users/user.entity';
import { CreateUserDto, parseCreateUserDto, parseLoginDto, LoginUserDto } from '@users/dto/create-user.dto';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { adminEmails } from '@config/configuration';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly environmentService: EnvironmentMongoService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    user: Partial<Users>,
  ): Promise<{
    accessToken: string,
    refreshToken: string,
  }> {
    const payload = {
      username: user.username,
      sub: user.user_id,
      roles: user.roles,
      timestamp: new Date().getTime(),
    };
    Logger.log('--------->', { user })
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{
    accessToken: string,
  }> {
    const { exp, timestamp, ...payload } = await this.jwtService.verifyAsync(refreshToken);
    payload.timestamp = new Date().getTime();
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<Partial<Users>> {
    const { password_hash, ...user } = await this.usersService.findOneBy({ username }, true);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    const comparePwd = await this.comparePwd(password, password_hash);
    if (!comparePwd) {
      throw new NotFoundException('Invalid password');
    }
    return user;
  }

  async signUp(createUserDto: CreateUserDto) {
    if (adminEmails.includes(createUserDto.email)) {
      createUserDto['roles'] = ['admin'];
    }
    if (!createUserDto['favorite_languages']) {
      createUserDto['favorite_languages'] = [];
    }
    return await this.create(createUserDto);
  }

  async create(user: Partial<Users>): Promise<Users> {
    try {
      const parsedDto = parseCreateUserDto(user);
      try {
        const userExists = await this.usersService.findOneBy({ username: parsedDto.username });

        if (userExists) {
          throw new ConflictException(
            `User with username ${parsedDto.username} already exists`,
          );
        }
      } catch (err) {
      }


      const newUser = await this.usersService.create(parsedDto)

      return newUser;
    } catch (err) {
      console.log(`Failed to create user: ${err.message}`);
      throw new InternalServerErrorException(`Failed to create user: ${err.message}`);
    }
  }

  // async attachEnvironment(user: Users): Promise<Users> {
  //   const userEnvironment = this.environmentService.create({
  //     username: user.username,
  //   });
  //   user.environment_id = userEnvironment._id.toString();
  //   return user;
  // }

  // utils
  encryptPwd(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async comparePwd(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

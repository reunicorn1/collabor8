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
import {
  CreateUserDto,
  parseCreateUserDto,
  parseLoginDto,
  LoginUserDto,
} from '@users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { adminEmails } from '@config/configuration';
import { RedisService } from '@redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async signIn(user: Partial<Users>): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<Users>;
  }> {
    const payload = {
      username: user.username,
      sub: user.user_id,
      roles: user.roles,
      timestamp: new Date().getTime(),
      jti: uuidv4(),
    };
    const {
      user_id,
      roles,
      email,
      environment_id,
      created_at,
      updated_at,
      is_verified,
      ...userinfo
    } = await this.usersService.findOneBy({ username: user.username });
    if (!is_verified) {
      throw new UnauthorizedException('User is not verified. Please verify your email');
    }
    Logger.log('--------->', { user });
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
      user: userinfo,
    };
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
  }> {
    const { iat, exp, timestamp, ...payload } =
      await this.jwtService.verifyAsync(refreshToken);
    payload.timestamp = new Date().getTime();

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async verifyUser(token: string): Promise<Partial<Users>> {
    const user = await this.usersService.findOneBy({ user_id: token });
    if (!user) {
      throw new NotFoundException(`User with token ${token} not found`);
    }
    return user;
  }

  async verificationId(email: string): Promise<string> {
    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user.user_id;
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<Users>> {
    const { password_hash, ...user } = await this.usersService.findOneBy(
      { username },
      true,
    );
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
        const userExists = await this.usersService.findOneBy({
          username: parsedDto.username,
        });

        if (userExists) {
          throw new ConflictException(
            `User with username ${parsedDto.username} already exists`,
          );
        }
      } catch (err) {}

      const newUser = await this.usersService.create(parsedDto);

      return newUser;
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to create user: ${err.message}`,
      );
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

  async revokeAccessToken(jti: string) {
    await this.redisService.set(`revoked:${jti}`, 'true', 3600); // Token revocation expires after an hour
  }

  async revokeRefreshToken(refreshToken: string) {
    await this.redisService.set(`revoked:${refreshToken}`, 'true', 7 * 24 * 3600); // Refresh token revocation for 7 days
  }

  async isAccessTokenRevoked(jti: string): Promise<boolean> {
    return !!(await this.redisService.get(`revoked:${jti}`));
  }

  async isRefreshTokenRevoked(refreshToken: string): Promise<boolean> {
    return !!(await this.redisService.get(`revoked:${refreshToken}`));
  }
}

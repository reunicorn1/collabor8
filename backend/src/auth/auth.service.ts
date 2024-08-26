import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
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
import { MailService } from '@mail/mail.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    @InjectQueue('mailer') private mailerQueue: Queue,
  ) { }

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
      const job = await this.mailerQueue.add('verification', {
        email,
        username: user.username,
        user_id,
      });
      //console.log(`------------> ${job}`);
      throw new UnauthorizedException(
        'User is not verified. Please verify your email',
      );
    }
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
    try {
      const { iat, exp, timestamp, ...payload } =
        await this.jwtService.verifyAsync(refreshToken);
      payload.timestamp = new Date().getTime();
      payload.jti = uuidv4();
      const accessToken = await this.jwtService.signAsync(payload);
      return {
        accessToken: accessToken,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyUser(token: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<Users>;
  }> {
    const user = await this.usersService.findOneBy({ user_id: token });
    if (!user) {
      throw new NotFoundException(`User with token ${token} not found`);
    }

    await this.usersService.update(user.username, { is_verified: true });
    return await this.signIn(user);
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
      createUserDto['is_verified'] = true;
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
      } catch (err) { }

      const newUser = await this.usersService.create(parsedDto);

      return newUser;
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to create user: ${err.message}`,
      );
    }
  }

  async resetPassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    if (!oldPassword || !newPassword) {
      throw new BadRequestException('Old and new password are required');
    }
    if (oldPassword === newPassword) {
      throw new ConflictException('Old and new password cannot be the same');
    }
    const validUser = await this.validateUser(username, oldPassword);

    if (!validUser) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    const user = await this.usersService.findOneBy({ username });

    user.password_hash = this.encryptPwd(newPassword);
    await this.usersService.save(user);
    await this.usersService.removePasswordHash(user);
    return { "message": "Password reset successfully" };
  }

  async sendResetPasswordEmail(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      return { message: 'Password reset email sent' };
    }
    const token = uuidv4();
    await this.redisService.set(token, user.user_id, 3600); // Token expires after an hour
    const job = await this.mailerQueue.add('reset-password', {
      email,
      username: user.username,
      user_id: user.user_id,
      url: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
    });
    console.log(
      `'Job URL:'--------> ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
    );
    console.log(`------------> ${job}`);
    return { message: 'Password reset email sent' };
  }

  async validateToken(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user_id = await this.redisService.get(token);
    if (!user_id) {
      throw new NotFoundException('Invalid token');
    }
    const user = await this.usersService.findOneBy({ user_id });
    if (!user) {
      throw new NotFoundException('Invalid token');
    }
    user.password_hash = this.encryptPwd(newPassword);
    await this.usersService.save(user);
    await this.redisService.del(token);
    return { message: 'Password reset successfully' };
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
    await this.redisService.set(
      `revoked:${refreshToken}`,
      'true',
      7 * 24 * 3600,
    ); // Refresh token revocation for 7 days
  }

  async isAccessTokenRevoked(jti: string): Promise<boolean> {
    return !!(await this.redisService.get(`revoked:${jti}`));
  }

  async isRefreshTokenRevoked(refreshToken: string): Promise<boolean> {
    return !!(await this.redisService.get(`revoked:${refreshToken}`));
  }
}

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
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Role } from './enums/role.enum';

export interface Payload {
  username: string,
  sub: string,
  roles: Role[],
  timestamp: number,
  jti: any,
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    @InjectQueue('mailer') private mailerQueue: Queue,
  ) { }

  async signIn(user: Partial<Users> & { is_invited?: boolean }): Promise<{
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
      //roles,
      email,
      environment_id,
      created_at,
      updated_at,
      is_verified,
      ...userinfo
    } = await this.usersService.findOneBy({ username: user.username });
    if (!is_verified && !user.is_invited) {
      const job = await this.mailerQueue.add('verification', {
        email,
        username: user.username,
        user_id,
      });
      //console.log(`------------> ${job}`);
      throw new UnauthorizedException(
        'User is not verified. Please verify your email',
      );
    } else if (user.is_invited) {
      await this.usersService.updateByUsername(user.username, { is_verified: true });
    }
    const toks = await this.generateTokens(payload);
    return {
      ...toks,
      user: userinfo,
    };
  }

  async guestSignIn(): Promise<{
    accessToken: string;
    user: Partial<Users>;
    userData: Partial<Users>;
  }> {
    let user: Partial<Users>;
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
      }
      user = await this.signUp(createGuestDto);
      console.log('=====================>', user);
      if (!user) {
        throw new InternalServerErrorException('Guest user not created');
      }
    }
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
      roles,
      email,
      environment_id,
      created_at,
      updated_at,
      is_verified,
      ...userinfo
    } = user;
    const userData = {
      userId: user_id,
      username: 'guest',
      roles: roles,
      jti: payload.jti,
    }
    return {
      accessToken,
      user: userinfo,
      userData,
    };
  }

  async generateTokens(payload: Payload): Promise<{ accessToken: string, refreshToken: string }> {
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }
  async getProfile(username: string): Promise<Partial<Users>> {
    return await this.usersService.findOneBy({ username });
  }

  async refreshToken(refreshToken: string): Promise<{
    user: Partial<Users>;
    accessToken: string;
  }> {
    try {
      const { iat, exp, timestamp, ...payload } =
        await this.jwtService.verifyAsync(refreshToken);
      payload.timestamp = new Date().getTime();
      payload.jti = uuidv4();
      const accessToken = await this.jwtService.signAsync(payload);
      const {
        user_id,
        roles,
        email,
        environment_id,
        created_at,
        updated_at,
        is_verified,
        ...userinfo
      } = await this.usersService.findOneBy({ username: payload.username });
      return {
        user: userinfo,
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

  async signUp(createUserDto: CreateUserDto & { is_invited?: boolean }) {
    const role = [];
    if (adminEmails.includes(createUserDto.email)) {
      role.push(Role.Admin);
      createUserDto['is_verified'] = true;
    } else if (createUserDto['email'] === 'guest.co11abor8@gmail.com') {
      console.log('=====================> guest user');
      role.push(Role.Guest);
      createUserDto['is_verified'] = true;
      console.log('=====================>', createUserDto);
    }
    else {
      role.push(Role.User);
    }

    if (!createUserDto['favorite_languages']) {
      createUserDto['favorite_languages'] = [];
    }
    if (createUserDto.is_invited) {
      createUserDto['is_verified'] = true;
      // user recieved invitation
      const user = await this.create(createUserDto)
      user.roles = role;
      return await this.usersService.save(user);
    }
    const user = await this.create(createUserDto);
    user.roles = role;
    return await this.usersService.save(user);
  }

  async create(user: Partial<Users>): Promise<Users> {
    const parsedDto = parseCreateUserDto(user);
    const uniqueFields = ['username', 'email'];
    for (const field of uniqueFields) {
      try {
        const userExists = await this.usersService.findOneBy({
          [field]: parsedDto[field],
        });
        if (userExists) {
          throw new ConflictException(
            `User with ${field} ${parsedDto[field]} already exists`,
          );
        }
      } catch (err) {
        if (err instanceof NotFoundException) {
          // do noting
          continue;
        } else {
          throw err;
        }
      }
    }
    const newUser = await this.usersService.create(parsedDto);
    return newUser;
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
    const BASE_URL = `${process.env.NODE_ENV === "production" ? process.env.URL_PROD : process.env.URL_DEV}`;
    const job = await this.mailerQueue.add('reset-password', {
      email,
      username: user.username,
      user_id: user.user_id,
      url: `${BASE_URL}/reset-password?token=${token}`,
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

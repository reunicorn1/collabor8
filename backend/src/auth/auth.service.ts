import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.login({ username, password: pass });
    if (!user) {
      throw new UnauthorizedException();
    }
    // TODO: add JWT logic instead of returning user
    const payload = { username: user.username, sub: user.user_id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}

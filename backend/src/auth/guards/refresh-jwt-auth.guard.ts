import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@auth/decorators/isPublic.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }
  //checks if refresh token is valid
  async checkRefresh(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.info('request', request);
    const token = request.cookies['refreshToken'];
    console.info('token', token);
    if (token) {
      try {
        const checkToken = await this.jwtService.verifyAsync(token);
        console.info('checkToken', checkToken);
        if (checkToken) {
          return true;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  canActivate(context: ExecutionContext): boolean {

    const isRefresh = this.checkRefresh(context);
    if (isRefresh) {
      return true;
    }
    return super.canActivate(context) as boolean;

  }


}

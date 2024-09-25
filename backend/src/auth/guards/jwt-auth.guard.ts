import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@auth/decorators/isPublic.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  async checkGuest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const headers = request.get('authorization');
    const token = headers?.split(' ')[1];

    if (token) {
      try {
      const checkToken = await this.jwtService.verifyAsync(token);

        if (checkToken && checkToken.roles === 'guest') {
          return true;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isGuest = await this.checkGuest(context);
    if (isPublic) {
      return true;
    }

    return await super.canActivate(context) as boolean;
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

}

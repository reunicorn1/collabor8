import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@auth/decorators/isPublic.decorator';
import { IS_API_KEY } from '@auth/decorators/isAPIKey.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService
  ) {
    super();
  }

  /**
   * checkApiKey - Check if the API Key is valid for linking with the socket
   *            connection.
   * @param request - The request object
   * @returns true if the API Key is valid, false otherwise
   */
  checkApiKey(request: Request): boolean {
    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('API_KEY');
    return apiKey === validApiKey;
  }

  /**
   * canActivate - Check if the request is allowed to proceed.
   * @param context - The execution context
   * @returns true if the request is allowed to proceed, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isApiKey = this.reflector.getAllAndOverride<boolean>(IS_API_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (
      isApiKey &&
      this.checkApiKey(
        context.switchToHttp().getRequest<Request>()
    )) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return await super.canActivate(context) as boolean;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

}

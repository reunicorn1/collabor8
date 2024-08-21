import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@auth/decorators/isPublic.decorator';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') { }

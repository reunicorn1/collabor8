import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EnvironmentMongoModule } from '@environment-mongo/environment-mongo.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    EnvironmentMongoModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

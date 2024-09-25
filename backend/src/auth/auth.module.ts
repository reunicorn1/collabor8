import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EnvironmentMongoModule } from '@environment-mongo/environment-mongo.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { SessionSerializer } from '@auth/serializers/session.serializer';
import { RefreshStrategy } from '@auth/strategies/refresh.strategy';
import { MailModule } from '@mail/mail.module';
import { RedisModule } from '@redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
@Module({
  imports: [
    UsersModule,
    EnvironmentMongoModule,
    MailModule,
    RedisModule,
    //GuestModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    BullModule.registerQueue({
      name: 'mailer',
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    RefreshStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }

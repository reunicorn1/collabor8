import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { ProjectsModule } from '@projects/projects.module';
import { RedisModule } from '@redis/redis.module';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ProjectManagerModule } from '@project-manager/project-manager.module';

@Module({
  imports: [
    ProjectsModule,
    RedisModule,
    AuthModule,
    UsersModule,
    JwtModule,
    ProjectManagerModule,
  ],
  exports: [GuestService],
  providers: [GuestService],
  controllers: [GuestController],
})
export class GuestModule { }

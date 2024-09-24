import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { ProjectsModule } from '@projects/projects.module';
import { RedisModule } from '@redis/redis.module';

@Module({
  imports: [
    ProjectsModule,
    RedisModule,
  ],
  exports: [GuestService],
  providers: [GuestService],
  controllers: [GuestController],
})
export class GuestModule { }

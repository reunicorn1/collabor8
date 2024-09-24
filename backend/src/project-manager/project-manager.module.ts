import { Module } from '@nestjs/common';
import { ProjectManagerService } from './project-manager.service';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from '@redis/redis.module';
import { ProjectsModule } from '@projects/projects.module';
import { ProjectSharesModule } from '@project-shares/project-shares.module';

@Module({
  imports: [
    RedisModule,
    ProjectsModule,
    ProjectSharesModule,
    BullModule.registerQueue({
      name: 'project-manager',
    }),
  ],
  exports: [ProjectManagerService],
  providers: [ProjectManagerService]
})
export class ProjectManagerModule {}

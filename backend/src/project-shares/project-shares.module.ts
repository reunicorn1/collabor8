import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectShares } from './project-shares.entity';
import { ProjectSharesController } from './project-shares.controller';
import { ProjectSharesService } from './project-shares.service';
import { MYSQL_CONN } from '@constants';
import { ProjectsModule } from '@projects/projects.module';
import { UsersModule } from '@users/users.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from '@redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectShares], MYSQL_CONN),
    forwardRef(() => ProjectsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => RedisModule),
    BullModule.registerQueue({
      name: 'mailer',
    }),
  ],
  providers: [ProjectSharesService],
  controllers: [ProjectSharesController],
  exports: [ProjectSharesService],
})
export class ProjectSharesModule {}

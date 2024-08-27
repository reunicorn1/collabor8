import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectShares } from './project-shares.entity';
import { ProjectSharesController } from './project-shares.controller';
import { ProjectSharesService } from './project-shares.service';
import { MYSQL_CONN } from '@constants';
import { ProjectsModule } from '@projects/projects.module';
import { UsersModule } from '@users/users.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectShares], MYSQL_CONN),
    forwardRef(() => ProjectsModule),
    forwardRef(() => UsersModule),
    BullModule.registerQueue({
      name: 'mailer',
    }),
  ],
  providers: [ProjectSharesService],
  controllers: [ProjectSharesController],
  exports: [ProjectSharesService],
})
export class ProjectSharesModule {}

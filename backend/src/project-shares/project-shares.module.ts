import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectShares } from './project-shares.entity';
import { ProjectSharesController } from './project-shares.controller';
import { ProjectSharesService } from './project-shares.service';
import { MYSQL_CONN } from '@constants';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectShares], MYSQL_CONN)],
  providers: [ProjectSharesService],
  controllers: [ProjectSharesController],
  exports: [ProjectSharesService],
})
export class ProjectSharesModule {}

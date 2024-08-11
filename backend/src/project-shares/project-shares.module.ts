import { Module } from '@nestjs/common';
import { ProjectSharesService } from './project-shares.service';
import { ProjectSharesController } from './project-shares.controller';

@Module({
  providers: [ProjectSharesService],
  controllers: [ProjectSharesController],
})
export class ProjectSharesModule {}

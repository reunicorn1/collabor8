import { Module } from '@nestjs/common';
import { ProjectSharesMongoService } from './project-shares-mongo.service';
import { ProjectSharesMongoController } from './project-shares-mongo.controller';

@Module({
  providers: [ProjectSharesMongoService],
  controllers: [ProjectSharesMongoController]
})
export class ProjectSharesMongoModule {}

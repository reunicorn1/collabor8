import { Module } from '@nestjs/common';
import { ProjectMongoService } from './project-mongo.service';
import { ProjectMongoController } from './project-mongo.controller';

@Module({
  providers: [ProjectMongoService],
  controllers: [ProjectMongoController]
})
export class ProjectMongoModule {}

import { Module } from '@nestjs/common';
import { ProjectMongoService } from './project-mongo.service';
import { ProjectMongoController } from './project-mongo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMongo } from './project-mongo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMongo], 'mongoConnection')],
  providers: [ProjectMongoService],
  controllers: [ProjectMongoController],
})
export class ProjectMongoModule {}

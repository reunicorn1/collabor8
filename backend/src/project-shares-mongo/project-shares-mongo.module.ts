import { Module } from '@nestjs/common';
import { ProjectSharesMongoService } from './project-shares-mongo.service';
import { ProjectSharesMongoController } from './project-shares-mongo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectSharesMongo } from './project-shares-mongo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectSharesMongo], 'mongoConnection')],
  providers: [ProjectSharesMongoService],
  controllers: [ProjectSharesMongoController],
  exports: [ProjectSharesMongoService],
})
export class ProjectSharesMongoModule {}

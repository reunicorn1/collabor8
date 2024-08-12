import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentMongoService } from './envrionment-mongo.service';
import { EnvironmentMongoController } from './envrionment-mongo.controller';
import { EnvironmentMongo } from './envrionment-mongo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentMongo], 'mongoConnection')], // register repositories
  providers: [EnvironmentMongoService],
  controllers: [EnvironmentMongoController],
})
export class EnvironmentMongoModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentMongoService } from './envrionment-mongo.service';
import { EnvrionmentMongoController } from './envrionment-mongo.controller';
import { EnvironmentMongo } from './envrionment-mongo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentMongo])], // register repositories
  providers: [EnvironmentMongoService],
  controllers: [EnvrionmentMongoController],
})
export class EnvrionmentMongoModule {}

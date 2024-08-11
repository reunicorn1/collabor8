import { Module } from '@nestjs/common';
import { EnvrionmentMongoService } from './envrionment-mongo.service';
import { EnvrionmentMongoController } from './envrionment-mongo.controller';

@Module({
  providers: [EnvrionmentMongoService],
  controllers: [EnvrionmentMongoController],
})
export class EnvrionmentMongoModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentMongoService } from './environment-mongo.service';
import { EnvironmentMongoController } from './environment-mongo.controller';
import { EnvironmentMongo } from './environment-mongo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentMongo], 'mongoConnection')], // register repositories
  providers: [EnvironmentMongoService],
  controllers: [EnvironmentMongoController],
})
export class EnvironmentMongoModule {}

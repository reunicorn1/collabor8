import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { EnvironmentMongo } from '@environment-mongo/environment-mongo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnvironmentMongo], 'mongoConnection'),
    TypeOrmModule.forFeature([Users], 'mysqlConnection'),
  ],
  providers: [UsersService, EnvironmentMongoService],
  controllers: [UsersController],
})
export class UsersModule {}

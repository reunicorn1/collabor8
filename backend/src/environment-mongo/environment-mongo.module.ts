import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentMongoService } from './environment-mongo.service';
import { EnvironmentMongoController } from './environment-mongo.controller';
import { EnvironmentMongo } from './environment-mongo.entity';
import { Users } from '@users/user.entity';
import { UsersService } from '@users/users.service';
import { MONGO_CONN, MYSQL_CONN } from '@constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnvironmentMongo], MONGO_CONN),
    TypeOrmModule.forFeature([Users], MYSQL_CONN),
  ],
  providers: [EnvironmentMongoService, UsersService],
  controllers: [EnvironmentMongoController],
  exports: [EnvironmentMongoService],
})
export class EnvironmentMongoModule {}

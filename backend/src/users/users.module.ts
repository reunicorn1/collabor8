import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { EnvironmentMongo } from '@environment-mongo/environment-mongo.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users], 'mysqlConnection'),
    TypeOrmModule.forFeature([EnvironmentMongo], 'mongoConnection'),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UsersService,
    EnvironmentMongoService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

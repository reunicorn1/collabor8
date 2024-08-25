import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EnvironmentMongoModule } from '@environment-mongo/environment-mongo.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@auth/guards/roles.guard';
import { MONGO_CONN, MYSQL_CONN } from '@constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users], MYSQL_CONN),
    forwardRef(() => EnvironmentMongoModule),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UsersService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

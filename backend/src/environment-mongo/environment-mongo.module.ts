import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentMongoService } from './environment-mongo.service';
import { EnvironmentMongoController } from './environment-mongo.controller';
import { EnvironmentMongo } from './environment-mongo.entity';
import { UsersModule } from '@users/users.module';
import { MONGO_CONN, MYSQL_CONN } from '@constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnvironmentMongo], MONGO_CONN),
    forwardRef(() => UsersModule),
  ],
  providers: [EnvironmentMongoService],
  controllers: [EnvironmentMongoController],
  exports: [EnvironmentMongoService],
})
export class EnvironmentMongoModule {}

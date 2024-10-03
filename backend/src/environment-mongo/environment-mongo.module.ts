import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentMongoService } from './environment-mongo.service';
import { EnvironmentMongoController } from './environment-mongo.controller';
import { EnvironmentMongo } from './environment-mongo.entity';
import { UsersModule } from '@users/users.module';
import { MONGO_CONN } from '@constants';
import { ProjectsModule } from '@projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnvironmentMongo], MONGO_CONN),
    forwardRef(() => UsersModule),
    forwardRef(() => ProjectsModule),
  ],
  providers: [EnvironmentMongoService],
  controllers: [EnvironmentMongoController],
  exports: [EnvironmentMongoService],
})
export class EnvironmentMongoModule {}

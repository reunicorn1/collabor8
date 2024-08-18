import { Module } from '@nestjs/common';
import { ProjectMongo } from './project-mongo.entity';
import { ProjectMongoService } from './project-mongo.service';
import { ProjectMongoController } from './project-mongo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@users/user.entity';
import { UsersService } from '@users/users.service';
import { EnvironmentMongo } from '@environment-mongo/environment-mongo.entity';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { DirectoryMongo } from '@directory-mongo/directory-mongo.entity';
import { DirectoryMongoService } from '@directory-mongo/directory-mongo.service';
import { FileMongo } from '@file-mongo/file-mongo.entity';
import { FileMongoService } from '@file-mongo/file-mongo.service';
import { Projects } from '@projects/project.entity';
import { ProjectsService } from '@projects/projects.service';
import { MYSQL_CONN, MONGO_CONN } from '@constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMongo], MONGO_CONN),
    TypeOrmModule.forFeature([Users], MYSQL_CONN),
    TypeOrmModule.forFeature([EnvironmentMongo], MONGO_CONN),
    TypeOrmModule.forFeature([Projects], MYSQL_CONN),
    TypeOrmModule.forFeature([DirectoryMongo], MONGO_CONN),
    TypeOrmModule.forFeature([FileMongo], MONGO_CONN),
  ],
  providers: [
    ProjectMongoService,
    UsersService,
    EnvironmentMongoService,
    ProjectsService,
    DirectoryMongoService,
    FileMongoService,
  ],
  controllers: [ProjectMongoController],
  exports: [ProjectMongoService],
})
export class ProjectMongoModule {}

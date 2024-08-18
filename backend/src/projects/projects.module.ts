import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './project.entity';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { Users } from '@users/user.entity';
import { EnvironmentMongo } from '@environment-mongo/environment-mongo.entity';
import { ProjectMongoService } from '@project-mongo/project-mongo.service';
import { UsersService } from '@users/users.service';
import { EnvironmentMongoService } from '@environment-mongo/environment-mongo.service';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DirectoryMongo } from '@directory-mongo/directory-mongo.entity';
import { DirectoryMongoService } from '@directory-mongo/directory-mongo.service';
import { FileMongo } from '@file-mongo/file-mongo.entity';
import { FileMongoService } from '@file-mongo/file-mongo.service';
import { MYSQL_CONN, MONGO_CONN } from '@constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects], MYSQL_CONN),
    TypeOrmModule.forFeature([ProjectMongo], MONGO_CONN),
    TypeOrmModule.forFeature([Users], MYSQL_CONN),
    TypeOrmModule.forFeature([EnvironmentMongo], MONGO_CONN),
    TypeOrmModule.forFeature([DirectoryMongo], MONGO_CONN),
    TypeOrmModule.forFeature([FileMongo], MONGO_CONN),
  ],
  providers: [
    ProjectsService,
    ProjectMongoService,
    UsersService,
    EnvironmentMongoService,
    DirectoryMongoService,
    FileMongoService,
  ],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}

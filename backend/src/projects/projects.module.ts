import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectMongoModule } from '@project-mongo/project-mongo.module';
import { UsersModule } from '@users/users.module';
import { EnvironmentMongoModule } from '@environment-mongo/environment-mongo.module';
import { DirectoryMongoModule } from '@directory-mongo/directory-mongo.module';
import { FileMongoModule } from '@file-mongo/file-mongo.module';
import { MYSQL_CONN } from '@constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects], MYSQL_CONN),
    ProjectMongoModule,
    UsersModule,
    EnvironmentMongoModule,
    DirectoryMongoModule,
    FileMongoModule,
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}

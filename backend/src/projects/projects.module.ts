import { forwardRef, Module } from '@nestjs/common';
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
import { ProjectSharesModule } from '@project-shares/project-shares.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects], MYSQL_CONN),
    forwardRef(() => ProjectMongoModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EnvironmentMongoModule),
    forwardRef(() => DirectoryMongoModule),
    forwardRef(() => FileMongoModule),
    forwardRef(() => ProjectSharesModule),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}

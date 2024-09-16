import { forwardRef, Module } from '@nestjs/common';
import { FileMongoService } from './file-mongo.service';
import { FileMongoController } from './file-mongo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileMongo } from './file-mongo.entity';
import { ProjectsModule } from '@projects/projects.module';
import { DirectoryMongoModule } from '@directory-mongo/directory-mongo.module';
import { DockerModule } from '@docker/docker.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileMongo], 'mongoConnection'),
    forwardRef(() => DirectoryMongoModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => DockerModule),
  ],
  providers: [FileMongoService],
  controllers: [FileMongoController],
  exports: [FileMongoService],
})
export class FileMongoModule {}

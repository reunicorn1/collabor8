import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectoryMongoService } from './directory-mongo.service';
import { DirectoryMongoController } from './directory-mongo.controller';
import { DirectoryMongo } from './directory-mongo.entity';
import { FileMongoModule } from '../file-mongo/file-mongo.module';
import { ProjectsModule } from '@projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DirectoryMongo], 'mongoConnection'),
    forwardRef(() => ProjectsModule),
    forwardRef(() => FileMongoModule),
  ],
  providers: [DirectoryMongoService],
  controllers: [DirectoryMongoController],
  exports: [DirectoryMongoService],
})
export class DirectoryMongoModule {}

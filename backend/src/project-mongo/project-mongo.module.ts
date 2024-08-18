import { Module } from '@nestjs/common';
import { ProjectMongo } from './project-mongo.entity';
import { ProjectMongoService } from './project-mongo.service';
import { ProjectMongoController } from './project-mongo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@users/users.module';
import { DirectoryMongoModule } from '@directory-mongo/directory-mongo.module';
import { FileMongoModule } from '@file-mongo/file-mongo.module';
import { MONGO_CONN } from '@constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMongo], MONGO_CONN),
    UsersModule,
    DirectoryMongoModule,
    FileMongoModule,
  ],
  providers: [
    ProjectMongoService,
  ],
  controllers: [ProjectMongoController],
  exports: [ProjectMongoService],
})
export class ProjectMongoModule {}

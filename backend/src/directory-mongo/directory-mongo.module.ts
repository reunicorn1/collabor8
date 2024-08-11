import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectoryMongoService } from './directory-mongo.service';
import { DirectoryMongoController } from './directory-mongo.controller';
import { DirectoryMongo } from './directory-mongo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DirectoryMongo])], // register repositories
  providers: [DirectoryMongoService],
  controllers: [DirectoryMongoController],
})
export class DirectoryMongoModule {}

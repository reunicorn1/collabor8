import { Module } from '@nestjs/common';
import { DirectoryMongoService } from './directory-mongo.service';
import { DirectoryMongoController } from './directory-mongo.controller';

@Module({
  providers: [DirectoryMongoService],
  controllers: [DirectoryMongoController]
})
export class DirectoryMongoModule {}

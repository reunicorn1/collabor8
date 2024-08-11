import { Module } from '@nestjs/common';
import { FileMongoService } from './file-mongo.service';
import { FileMongoController } from './file-mongo.controller';

@Module({
  providers: [FileMongoService],
  controllers: [FileMongoController]
})
export class FileMongoModule {}

import { Module } from '@nestjs/common';
import { FileMongoService } from './file-mongo.service';
import { FileMongoController } from './file-mongo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileMongo } from './file-mongo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileMongo], 'mongoConnection')],
  providers: [FileMongoService],
  controllers: [FileMongoController],
  exports: [FileMongoService],
})
export class FileMongoModule {}

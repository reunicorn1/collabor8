import { Module } from '@nestjs/common';
import { DockerService } from './docker.service';
import { DockerController } from './docker.controller';

@Module({
  imports: [],
  providers: [DockerService],
  controllers: [DockerController],
  exports: [DockerService],
})
export class DockerModule {}

import { Module } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { EnvironmentController } from './environment.controller';

@Module({
  providers: [EnvironmentService],
  controllers: [EnvironmentController]
})
export class EnvironmentModule {}

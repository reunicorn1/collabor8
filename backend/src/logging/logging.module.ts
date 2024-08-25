import { Module } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  providers: [LoggingInterceptor],
})
export class LoggingModule {}

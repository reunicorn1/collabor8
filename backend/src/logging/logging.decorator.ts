import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

export function LogEndpoint() {
  return applyDecorators(UseInterceptors(LoggingInterceptor));
}

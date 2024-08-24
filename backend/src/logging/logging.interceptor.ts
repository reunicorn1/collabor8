import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, params, query, body } = request;

    this.logger.log(`Request - ${method} ${url}`);
    this.logger.log(`Params: ${JSON.stringify(params)}`);
    this.logger.log(`Query: ${JSON.stringify(query)}`);
    this.logger.log(`Body: ${JSON.stringify(body)}`);

    const now = Date.now();
    return next.handle().pipe(
      tap((response) => {
        const responseTime = Date.now() - now;
        this.logger.log(`Response: ${JSON.stringify(response)}`);
        this.logger.log(`Response Time: ${responseTime}ms`);
      }),
    );
  }
}


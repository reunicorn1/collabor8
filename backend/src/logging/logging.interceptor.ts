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

    this.logger.verbose(`Request - ${method} ${url}`);
    this.logger.verbose(`Params: ${JSON.stringify(params)}`);
    this.logger.verbose(`Query: ${JSON.stringify(query)}`);
    this.logger.verbose(`Body: ${JSON.stringify(body)}`);

    const now = Date.now();
    return next.handle().pipe(
      tap((response) => {
        const responseTime = Date.now() - now;
        // this.logger.log(`Response: ${JSON.stringify(response)}`)
        this.logger.verbose(`Response Time: ${responseTime}ms`);
      }),
    );
  }
}

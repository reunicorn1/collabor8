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
    const response = context.switchToHttp().getResponse();
    let respFlag = false;

    const { method, url, params, query, body } = request;

    this.logger.verbose(`Request - ${method} ${url}`);
    this.logger.verbose(`Params: ${JSON.stringify(params)}`);
    this.logger.verbose(`Query: ${JSON.stringify(query)}`);
    this.logger.verbose(`Body: ${JSON.stringify(body)}`);

    // Intercept the response
    const originalSend = response.send.bind(response);
    response.send = (body: any) => {
      if (body) {
        respFlag = true;
        this.logger.log(`Response: ${JSON.stringify(body)}`);

      }
      return originalSend(body);
    };

    const now = Date.now();
    return next.handle().pipe(
      tap((response) => {
        if (response && !respFlag) {
          this.logger.log(`Response: ${JSON.stringify(response)}`);
        }
        const responseTime = Date.now() - now;
        this.logger.verbose(`Response Time: ${responseTime}ms`);
      }),
    );
  }
}

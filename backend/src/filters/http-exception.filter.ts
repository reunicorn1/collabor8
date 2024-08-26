import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
// TODO: Implement custom exception filters
/* Different exceptions can be caught and handled differently
 * HttpException: Standard HTTP errors.
 * ValidationException: For validation errors.
 * DatabaseException: For database-related errors.
 * UnauthorizedException: For unauthorized access.
 * ForbiddenException: For forbidden access.
 * NotFoundException: When a resource is not found.
 * InternalServerErrorException: For general server errors.
 * CustomException: Any application-specific exceptions.
*/

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    let message: string;

    if (exception instanceof UnauthorizedException) {
      message = `Unauthorized access. ${exception.message}`;
    } else if (exception instanceof ForbiddenException) {
      message = `Forbidden access. ${exception.message}`;
    } else if (exception instanceof NotFoundException) {
      message = `Resource not found. ${exception.message}`;
    } else if (exception instanceof BadRequestException) {
      message = `Bad request. ${exception.message}`;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = (exceptionResponse as any).message || 'An error occurred';
    } else {
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : 'An error occurred';
    }

    const responseBody = {
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseBody);
  }
}


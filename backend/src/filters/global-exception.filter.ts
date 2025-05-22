import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppException } from 'src/exceptions/app.exception';
import { logger } from 'src/logger/pino.logger';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const error = exception instanceof Error ? exception : new Error('Unknown error');

    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse &&
      typeof (exceptionResponse as { message?: unknown }).message === 'object'
    ) {
      return response.status(status).json({
        ...(exceptionResponse as object),
        request: `${request.method} ${request.url}`,
        timestamp: new Date().toISOString(),
      });
    }

    const body: { statusCode: number; error: string; request: string; timestamp: string; cause?: any } = {
      statusCode: status,
      error: error.message,
      request: `${request.method} ${request.url}`,
      timestamp: new Date().toISOString(),
    };

    if (error instanceof AppException) {
      body.cause = error.getCause(error);
    }

    logger.error({
      message: 'Unhandled Exception',
      exception,
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
      },
    });

    response.status(status).json(body);
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'An unexpected internal error occurred. Please try again later.';
    let errorType = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        message = resObj.message || message;
        errorType = resObj.error || exception.name;
      }
    } else if (exception instanceof Error) {
      // Internal error: Log full details to server console only
      this.logger.error(
        `Unhandled exception on [${request.method}] ${request.url}: ${exception.message}`,
        exception.stack,
      );

      // In production or tests, NEVER leak file paths, database errors, or stack traces
      if (process.env.NODE_ENV === 'development') {
        // Only in local dev, provide safe debug hint without credentials
        message = exception.message.replace(/([a-zA-Z]:\\[^:\s]+|\/home\/[^\s]+)/g, '[REDACTED_PATH]');
      }
    } else {
      this.logger.error(`Unknown exception type caught: ${String(exception)}`);
    }

    // Sanitize any remaining local disk paths or tokens in message
    const sanitize = (text: string) =>
      text
        .replace(/([a-zA-Z]:\\[^:\s]+|\/home\/[^\s]+)/g, '[PATH]')
        .replace(/(authToken=[^&\s]+|token=[^&\s]+|Bearer\s+[a-zA-Z0-9._-]+)/gi, '[REDACTED]');

    let finalMessage = message;
    if (typeof finalMessage === 'string') {
      finalMessage = sanitize(finalMessage);
    } else if (Array.isArray(finalMessage)) {
      finalMessage = finalMessage.map((m) => (typeof m === 'string' ? sanitize(m) : m));
    }

    response.status(status).json({
      statusCode: status,
      error: errorType,
      message: finalMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

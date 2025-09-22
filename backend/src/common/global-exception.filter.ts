import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StructuredLogger } from '../common/logger.service';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error?: string;
  traceId?: string;
  details?: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly structuredLogger = new StructuredLogger();

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const traceId = this.generateTraceId();
    
    let status: number;
    let message: string;
    let error: string | undefined;
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        details = exceptionResponse;
      } else {
        message = exceptionResponse as string;
      }
      
      error = exception.name;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = exception.name;
      
      // Log full error details for internal errors
      this.structuredLogger.error('Unhandled exception', exception, {
        traceId,
        path: request.url,
        method: request.method,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
      });
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'UnknownError';
      
      this.structuredLogger.error('Unknown exception type', undefined, {
        traceId,
        exception: String(exception),
        path: request.url,
        method: request.method,
      });
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      traceId,
    };

    // Include error name and details in development
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.error = error;
      if (details) {
        errorResponse.details = details;
      }
    }

    // Log error context
    if (status >= 500) {
      this.structuredLogger.error(message, exception as Error, {
        traceId,
        statusCode: status,
        path: request.url,
        method: request.method,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
      });
    } else if (status >= 400) {
      this.structuredLogger.warn(`Client error: ${message}`, {
        traceId,
        statusCode: status,
        path: request.url,
        method: request.method,
        ipAddress: request.ip,
      });
    }

    response.status(status).json(errorResponse);
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

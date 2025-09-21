import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MonitoringService } from './monitoring.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MonitoringInterceptor.name);

  constructor(private monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Generate unique request ID
    const requestId = uuidv4();
    request.requestId = requestId;
    response.setHeader('X-Request-ID', requestId);

    // Start performance timer
    const endTimer = this.monitoringService.startRequestTimer(requestId);

    // Log request details
    const logContext = {
      requestId,
      method: request.method,
      url: request.url,
      userAgent: request.get('user-agent'),
      ip: request.ip || request.connection.remoteAddress,
    };

    this.logger.log(`Request started: ${request.method} ${request.url}`, logContext);

    // Record business metrics
    this.monitoringService.recordBusinessMetric('api_request', 1, logContext);

    return next.handle().pipe(
      tap((data) => {
        // End performance timer
        endTimer();
        
        // Log successful response
        this.logger.log(`Request completed: ${request.method} ${request.url}`, {
          ...logContext,
          statusCode: response.statusCode,
          responseSize: JSON.stringify(data).length,
        });

        // Record success metric
        this.monitoringService.recordBusinessMetric('api_success', 1, logContext);
      }),
      catchError((error) => {
        // End performance timer
        endTimer();
        
        // Record error
        this.monitoringService.recordError(error, logContext);
        
        // Record error metric
        this.monitoringService.recordBusinessMetric('api_error', 1, {
          ...logContext,
          errorType: error.constructor.name,
          errorMessage: error.message,
        });

        this.logger.error(`Request failed: ${request.method} ${request.url}`, {
          ...logContext,
          error: error.message,
          stack: error.stack,
        });

        throw error;
      })
    );
  }
}

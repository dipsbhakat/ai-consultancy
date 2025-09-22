import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { MonitoringService } from '../../modules/monitoring/monitoring.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);

  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        this.monitoringService.recordRequest(responseTime, false);
        
        // Log slow requests
        if (responseTime > 1000) {
          this.logger.warn(`Slow request: ${method} ${url} - ${responseTime}ms`);
        }
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        this.monitoringService.recordRequest(responseTime, true);
        
        // Create security alert for repeated errors from same IP
        const ipAddress = request.ip || request.connection?.remoteAddress || 'unknown';
        
        if (error.status === 401 || error.status === 403) {
          this.monitoringService.createSecurityAlert(
            'FAILED_LOGIN',
            'MEDIUM',
            `Authentication/Authorization failure from ${ipAddress}`,
            {
              method,
              url,
              ipAddress,
              status: error.status,
              responseTime,
            },
          );
        }
        
        throw error;
      }),
    );
  }
}

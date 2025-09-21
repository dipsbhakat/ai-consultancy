import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface LogContext {
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  context?: Record<string, any>;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly isProduction: boolean;
  private performanceMetrics: PerformanceMetric[] = [];

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  // Application Performance Monitoring
  recordPerformanceMetric(metric: PerformanceMetric): void {
    this.performanceMetrics.push(metric);
    
    if (this.isProduction) {
      // In production, you might want to send to external monitoring service
      this.logger.log(`Performance Metric: ${JSON.stringify(metric)}`);
    } else {
      this.logger.debug(`Performance Metric: ${metric.name} = ${metric.value}${metric.unit}`);
    }

    // Keep only last 1000 metrics in memory
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }
  }

  // Request Performance Tracking
  startRequestTimer(requestId: string): () => void {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      this.recordPerformanceMetric({
        name: 'request_duration',
        value: duration,
        unit: 'ms',
        timestamp: new Date(),
        context: { requestId }
      });
    };
  }

  // Database Performance Tracking
  recordDatabaseQuery(query: string, duration: number, context?: LogContext): void {
    this.recordPerformanceMetric({
      name: 'database_query_duration',
      value: duration,
      unit: 'ms',
      timestamp: new Date(),
      context: { query: query.substring(0, 100), ...context }
    });

    if (duration > 1000) { // Log slow queries
      this.logger.warn(`Slow database query detected: ${duration}ms`, {
        query: query.substring(0, 200),
        ...context
      });
    }
  }

  // Error Tracking
  recordError(error: Error, context?: LogContext): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date(),
      ...context
    };

    this.logger.error(`Application Error: ${error.message}`, errorData);

    // In production, send to error tracking service (e.g., Sentry)
    if (this.isProduction) {
      // Example: this.sentryService.captureException(error, context);
    }
  }

  // System Health Metrics
  getHealthMetrics(): Record<string, any> {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    return {
      uptime: uptime,
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
      },
      cpu: {
        usage: process.cpuUsage(),
      },
      performance: {
        metricsCount: this.performanceMetrics.length,
        averageRequestTime: this.getAverageRequestTime(),
      },
      timestamp: new Date(),
    };
  }

  // Business Metrics
  recordBusinessMetric(metric: string, value: number, context?: LogContext): void {
    this.recordPerformanceMetric({
      name: `business_${metric}`,
      value,
      unit: 'count',
      timestamp: new Date(),
      context
    });
  }

  // Get Performance Summary
  getPerformanceSummary(): Record<string, any> {
    const last100Metrics = this.performanceMetrics.slice(-100);
    const requestMetrics = last100Metrics.filter(m => m.name === 'request_duration');
    const dbMetrics = last100Metrics.filter(m => m.name === 'database_query_duration');

    return {
      requests: {
        count: requestMetrics.length,
        averageDuration: this.calculateAverage(requestMetrics.map(m => m.value)),
        maxDuration: Math.max(...requestMetrics.map(m => m.value), 0),
        minDuration: Math.min(...requestMetrics.map(m => m.value), 0),
      },
      database: {
        count: dbMetrics.length,
        averageDuration: this.calculateAverage(dbMetrics.map(m => m.value)),
        slowQueries: dbMetrics.filter(m => m.value > 1000).length,
      },
      timestamp: new Date(),
    };
  }

  private getAverageRequestTime(): number {
    const requestMetrics = this.performanceMetrics
      .filter(m => m.name === 'request_duration')
      .slice(-50); // Last 50 requests

    return this.calculateAverage(requestMetrics.map(m => m.value));
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  // Cleanup old metrics
  cleanup(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.performanceMetrics = this.performanceMetrics.filter(
      metric => metric.timestamp > oneHourAgo
    );
  }
}

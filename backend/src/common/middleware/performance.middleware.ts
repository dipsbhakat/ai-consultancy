import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../../modules/monitoring/monitoring.service';

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PerformanceMiddleware.name);
  private requestCounts = new Map<string, number>();
  private lastReset = Date.now();

  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
    
    // Rate limiting check
    this.checkRateLimit(clientIp);
    
    // Monitor response
    const originalSend = res.send;
    res.send = function(data) {
      const responseTime = Date.now() - startTime;
      
      // Record metrics
      const isError = res.statusCode >= 400;
      
      // Log performance data
      if (responseTime > 2000) {
        this.logger.warn(`Slow response: ${req.method} ${req.path} - ${responseTime}ms - IP: ${clientIp}`);
      }
      
      return originalSend.call(res, data);
    }.bind(this);

    next();
  }

  private checkRateLimit(ip: string): void {
    const now = Date.now();
    
    // Reset counters every minute
    if (now - this.lastReset > 60000) {
      this.requestCounts.clear();
      this.lastReset = now;
    }
    
    // Track requests per IP
    const currentCount = this.requestCounts.get(ip) || 0;
    this.requestCounts.set(ip, currentCount + 1);
    
    // Alert if too many requests from single IP
    if (currentCount > 100) { // 100 requests per minute
      this.monitoringService.createSecurityAlert(
        'RATE_LIMIT_EXCEEDED',
        'HIGH',
        `Rate limit exceeded for IP: ${ip}`,
        {
          ipAddress: ip,
          requestCount: currentCount,
          timeWindow: '1 minute',
        },
      );
    }
  }
}

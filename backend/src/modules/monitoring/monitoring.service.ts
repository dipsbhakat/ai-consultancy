import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { StructuredLogger } from '../../common/logger.service';

export interface SystemMetrics {
  timestamp: Date;
  activeUsers: number;
  activeSessions: number;
  totalRequests: number;
  errorRate: number;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  dbConnections: number;
}

export interface SecurityAlert {
  id: string;
  type: 'FAILED_LOGIN' | 'SUSPICIOUS_IP' | 'TOKEN_ABUSE' | 'RATE_LIMIT_EXCEEDED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly structuredLogger = new StructuredLogger();
  
  // In-memory storage for real-time metrics (in production, use Redis/InfluxDB)
  private metrics: SystemMetrics[] = [];
  private alerts: SecurityAlert[] = [];
  private requestCount = 0;
  private errorCount = 0;
  private responseTimes: number[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    // Start collecting metrics every 30 seconds
    setInterval(() => this.collectMetrics(), 30000);
    
    // Clean up old metrics every hour (keep last 24 hours)
    setInterval(() => this.cleanupOldMetrics(), 3600000);
  }

  /**
   * Collect system metrics
   */
  private async collectMetrics(): Promise<void> {
    try {
      const now = new Date();
      
      // Database metrics
      const activeUsers = await this.getActiveUsersCount();
      const activeSessions = await this.getActiveSessionsCount();
      const dbConnections = await this.getDatabaseConnections();
      
      // Application metrics
      const errorRate = this.calculateErrorRate();
      const avgResponseTime = this.calculateAverageResponseTime();
      
      // System metrics
      const memoryUsage = this.getMemoryUsage();
      const cpuUsage = await this.getCpuUsage();

      const metrics: SystemMetrics = {
        timestamp: now,
        activeUsers,
        activeSessions,
        totalRequests: this.requestCount,
        errorRate,
        responseTime: avgResponseTime,
        memoryUsage,
        cpuUsage,
        dbConnections,
      };

      this.metrics.push(metrics);

      // Log metrics for external monitoring systems
      this.structuredLogger.info('System metrics collected', {
        ...metrics,
        action: 'metrics_collection',
      });

      // Check for performance anomalies
      await this.checkPerformanceAlerts(metrics);

    } catch (error) {
      this.logger.error('Failed to collect metrics:', error);
    }
  }

  /**
   * Record request metrics
   */
  recordRequest(responseTime: number, isError = false): void {
    this.requestCount++;
    this.responseTimes.push(responseTime);
    
    if (isError) {
      this.errorCount++;
    }

    // Keep only last 1000 response times for average calculation
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
  }

  /**
   * Create security alert
   */
  createSecurityAlert(
    type: SecurityAlert['type'],
    severity: SecurityAlert['severity'],
    message: string,
    details: Record<string, any> = {},
  ): void {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      details,
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.push(alert);

    // Log security alert
    this.structuredLogger.securityEvent(
      `security_alert_${type.toLowerCase()}`,
      { alertId: alert.id, severity, ...details },
      details.ipAddress || 'unknown',
    );

    // In production, send to external alerting system (Slack, PagerDuty, etc.)
    this.sendAlertNotification(alert);
  }

  /**
   * Get current system metrics
   */
  getCurrentMetrics(): SystemMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(hours = 24): SystemMetrics[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.metrics.filter(m => m.timestamp >= cutoffTime);
  }

  /**
   * Get active security alerts
   */
  getActiveAlerts(): SecurityAlert[] {
    return this.alerts.filter(a => !a.resolved);
  }

  /**
   * Get all alerts with pagination
   */
  getAllAlerts(limit = 50, offset = 0): SecurityAlert[] {
    return this.alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.structuredLogger.info('Security alert resolved', {
        alertId,
        action: 'alert_resolved',
      });
      return true;
    }
    return false;
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    metrics: SystemMetrics | null;
    activeAlerts: number;
    issues: string[];
  } {
    const currentMetrics = this.getCurrentMetrics();
    const activeAlerts = this.getActiveAlerts().length;
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    if (currentMetrics) {
      // Check various health indicators
      if (currentMetrics.errorRate > 5) {
        issues.push(`High error rate: ${currentMetrics.errorRate.toFixed(2)}%`);
        status = 'warning';
      }
      
      if (currentMetrics.responseTime > 2000) {
        issues.push(`Slow response time: ${currentMetrics.responseTime.toFixed(0)}ms`);
        status = 'warning';
      }
      
      if (currentMetrics.memoryUsage > 80) {
        issues.push(`High memory usage: ${currentMetrics.memoryUsage.toFixed(1)}%`);
        status = 'warning';
      }
      
      if (currentMetrics.cpuUsage > 80) {
        issues.push(`High CPU usage: ${currentMetrics.cpuUsage.toFixed(1)}%`);
        status = 'warning';
      }

      // Critical thresholds
      if (currentMetrics.errorRate > 15 || currentMetrics.responseTime > 5000) {
        status = 'critical';
      }
    }

    if (activeAlerts > 0) {
      issues.push(`${activeAlerts} active security alert${activeAlerts > 1 ? 's' : ''}`);
      if (status === 'healthy') {
        status = 'warning';
      }
    }

    return {
      status,
      metrics: currentMetrics,
      activeAlerts,
      issues,
    };
  }

  // Private helper methods

  private async getActiveUsersCount(): Promise<number> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return this.prisma.adminUser.count({
      where: {
        isActive: true,
        lastLoginAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });
  }

  private async getActiveSessionsCount(): Promise<number> {
    return this.prisma.adminSession.count({
      where: {
        isActive: true,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
  }

  private async getDatabaseConnections(): Promise<number> {
    // For SQLite, this is always 1. For PostgreSQL, you'd query pg_stat_activity
    return 1;
  }

  private calculateErrorRate(): number {
    if (this.requestCount === 0) return 0;
    return (this.errorCount / this.requestCount) * 100;
  }

  private calculateAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    return this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
  }

  private getMemoryUsage(): number {
    const used = process.memoryUsage();
    return (used.heapUsed / used.heapTotal) * 100;
  }

  private async getCpuUsage(): Promise<number> {
    // Simple CPU usage estimation based on process CPU time
    // In production, use a proper CPU monitoring library
    const usage = process.cpuUsage();
    return ((usage.user + usage.system) / 1000000) / process.uptime() * 100;
  }

  private async checkPerformanceAlerts(metrics: SystemMetrics): Promise<void> {
    // Check for performance issues and create alerts
    if (metrics.errorRate > 10) {
      this.createSecurityAlert(
        'RATE_LIMIT_EXCEEDED',
        'HIGH',
        `High error rate detected: ${metrics.errorRate.toFixed(2)}%`,
        { errorRate: metrics.errorRate },
      );
    }

    if (metrics.responseTime > 3000) {
      this.createSecurityAlert(
        'RATE_LIMIT_EXCEEDED',
        'MEDIUM',
        `Slow response time detected: ${metrics.responseTime.toFixed(0)}ms`,
        { responseTime: metrics.responseTime },
      );
    }
  }

  private cleanupOldMetrics(): void {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp >= twentyFourHoursAgo);
    
    // Clean up old alerts (keep last 1000)
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 1000);
    }
    
    // Reset counters periodically
    if (this.requestCount > 100000) {
      this.requestCount = Math.floor(this.requestCount / 2);
      this.errorCount = Math.floor(this.errorCount / 2);
    }
  }

  private sendAlertNotification(alert: SecurityAlert): void {
    // In production, integrate with notification services
    this.logger.warn(
      `🚨 Security Alert [${alert.severity}]: ${alert.message}`,
      alert.details,
    );
  }
}

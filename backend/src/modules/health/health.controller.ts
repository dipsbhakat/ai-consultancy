import { Controller, Get, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MonitoringService } from '../../monitoring/monitoring.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly monitoringService: MonitoringService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Comprehensive health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth() {
    const startTime = Date.now();
    
    try {
      // Test database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      
      const systemMetrics = this.monitoringService.getHealthMetrics();
      const performanceMetrics = this.monitoringService.getPerformanceSummary();
      
      const duration = Date.now() - startTime;
      this.monitoringService.recordPerformanceMetric({
        name: 'health_check_duration',
        value: duration,
        unit: 'ms',
        timestamp: new Date()
      });

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: this.config.get<string>('NODE_ENV'),
        version: '1.0.0',
        uptime: process.uptime(),
        system: systemMetrics,
        performance: performanceMetrics,
        checks: {
          database: 'healthy',
          memory: systemMetrics.memory.heapUsed < 500 ? 'healthy' : 'warning',
          uptime: systemMetrics.uptime > 0 ? 'healthy' : 'error'
        }
      };
    } catch (error) {
      this.monitoringService.recordError(error, {
        method: 'GET',
        url: '/health',
        component: 'HealthController'
      });

      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
        environment: this.config.get<string>('NODE_ENV')
      };
    }
  }

  @Get('ready')
  @ApiOperation({ summary: 'Enhanced readiness probe with monitoring' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async getReadiness() {
    try {
      // Test database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      
      const memUsage = process.memoryUsage();
      const isMemoryHealthy = memUsage.heapUsed / memUsage.heapTotal < 0.9;
      const performanceMetrics = this.monitoringService.getPerformanceSummary();
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'healthy',
          memory: isMemoryHealthy ? 'healthy' : 'warning',
          performance: performanceMetrics.requests.count > 0 ? 'active' : 'idle',
        },
        uptime: process.uptime(),
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
        },
        performance: performanceMetrics,
      };
    } catch (error) {
      this.logger.error('Readiness check failed:', error);
      this.monitoringService.recordError(error, {
        method: 'GET',
        url: '/health/ready',
        component: 'HealthController'
      });
      throw new Error('Service not ready');
    }
  }

  @Get('live')
  @ApiOperation({ summary: 'Enhanced liveness probe' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      uptime: process.uptime(),
      nodeVersion: process.version,
      environment: this.config.get<string>('NODE_ENV'),
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Performance and system metrics' })
  @ApiResponse({ status: 200, description: 'Returns system and performance metrics' })
  getMetrics() {
    const systemMetrics = this.monitoringService.getHealthMetrics();
    const performanceMetrics = this.monitoringService.getPerformanceSummary();
    
    return {
      timestamp: new Date().toISOString(),
      system: systemMetrics,
      performance: performanceMetrics,
      application: {
        environment: this.config.get<string>('NODE_ENV'),
        version: '1.0.0',
        nodeVersion: process.version,
        pid: process.pid,
      }
    };
  }
}

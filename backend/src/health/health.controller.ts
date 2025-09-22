import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async check() {
    const startTime = Date.now();
    
    try {
      // Test database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        checks: {
          database: 'healthy',
          environment: this.configService.get('NODE_ENV'),
        },
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks: {
          database: 'unhealthy',
          error: error.message,
        },
        responseTime: Date.now() - startTime,
      };
    }
  }

  @Get('ready')
  async readiness() {
    try {
      // More thorough readiness check
      await this.prisma.adminUser.count();
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'ready',
          admin_seed: 'ready',
        },
      };
    } catch (error) {
      return {
        status: 'not-ready',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  @Get('live')
  live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      pid: process.pid,
    };
  }
}

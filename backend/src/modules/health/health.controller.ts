import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        version: { type: 'string', example: '1.0.0' }
      }
    }
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is ready to accept traffic',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ready' },
        checks: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'healthy' },
            memory: { type: 'string', example: 'healthy' }
          }
        }
      }
    }
  })
  getReadiness() {
    const memUsage = process.memoryUsage();
    const isMemoryHealthy = memUsage.heapUsed / memUsage.heapTotal < 0.9;

    return {
      status: 'ready',
      checks: {
        database: 'healthy', // Mock for now
        memory: isMemoryHealthy ? 'healthy' : 'warning',
      },
    };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is alive',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'alive' },
        pid: { type: 'number', example: 12345 }
      }
    }
  })
  getLiveness() {
    return {
      status: 'alive',
      pid: process.pid,
    };
  }
}

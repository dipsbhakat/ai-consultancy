import { Controller, Get, Post, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '../../types/enums';
import { MonitoringService } from './monitoring.service';

@Controller('admin/monitoring')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.SUPERADMIN, AdminRole.EDITOR)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('health')
  getHealthStatus() {
    return this.monitoringService.getHealthStatus();
  }

  @Get('metrics')
  getCurrentMetrics() {
    return {
      current: this.monitoringService.getCurrentMetrics(),
      timestamp: new Date(),
    };
  }

  @Get('metrics/history')
  getMetricsHistory(@Query('hours') hours?: string) {
    const hoursNumber = hours ? parseInt(hours, 10) : 24;
    return {
      metrics: this.monitoringService.getMetricsHistory(hoursNumber),
      period: `${hoursNumber} hours`,
    };
  }

  @Get('alerts')
  getAlerts(@Query('active') activeOnly?: string) {
    if (activeOnly === 'true') {
      return {
        alerts: this.monitoringService.getActiveAlerts(),
        type: 'active',
      };
    }
    
    return {
      alerts: this.monitoringService.getAllAlerts(),
      type: 'all',
    };
  }

  @Post('alerts/:alertId/resolve')
  resolveAlert(@Param('alertId') alertId: string) {
    const resolved = this.monitoringService.resolveAlert(alertId);
    return {
      success: resolved,
      message: resolved ? 'Alert resolved successfully' : 'Alert not found',
    };
  }
}

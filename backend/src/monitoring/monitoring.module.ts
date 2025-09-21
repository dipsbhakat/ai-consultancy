import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MonitoringService } from './monitoring.service';
import { MonitoringInterceptor } from './monitoring.interceptor';

@Global()
@Module({
  providers: [
    MonitoringService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MonitoringInterceptor,
    },
  ],
  exports: [MonitoringService],
})
export class MonitoringModule {}

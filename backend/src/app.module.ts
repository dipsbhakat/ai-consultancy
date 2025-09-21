import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ContactModule } from './modules/contact/contact.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { SetupModule } from './modules/setup/setup.module';
import { DebugModule } from './modules/debug/debug.module';
import { HealthController } from './modules/health/health.controller';
import { DatabaseModule } from './database/database.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    }]),
    DatabaseModule,
    MonitoringModule,
    ContactModule,
    AuthModule,
    AdminModule,
    SetupModule,
    DebugModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
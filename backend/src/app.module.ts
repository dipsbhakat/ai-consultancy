import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './modules/contact/contact.module';
import { HealthController } from './modules/health/health.controller';
import { DatabaseModule } from './database/database.module';
import { RedisService } from './database/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ContactModule,
  ],
  controllers: [HealthController],
  providers: [RedisService],
})
export class AppModule {}
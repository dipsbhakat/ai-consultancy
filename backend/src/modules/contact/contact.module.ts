import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { DatabaseModule } from '../../database/database.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [DatabaseModule, AnalyticsModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}

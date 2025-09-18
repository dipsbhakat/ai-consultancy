import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { RedisService } from '../../database/redis.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, RedisService],
})
export class ContactModule {}

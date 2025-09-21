import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [SetupController],
  providers: [PrismaService],
})
export class SetupModule {}

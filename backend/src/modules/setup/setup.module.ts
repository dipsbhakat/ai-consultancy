import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { StartupService } from './startup.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [SetupController],
  providers: [PrismaService, StartupService],
})
export class SetupModule {}

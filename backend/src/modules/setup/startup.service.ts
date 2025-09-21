import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StartupService implements OnModuleInit {
  private readonly logger = new Logger(StartupService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing application...');
    await this.ensureAdminAccount();
    this.logger.log('Application initialization complete');
  }

  private async ensureAdminAccount() {
    try {
      const adminEmail = 'admin@aiconsultancy.com';
      const adminPassword = 'Admin123!';
      
      // Check if admin exists
      const admin = await this.prisma.adminUser.findFirst({
        where: { email: adminEmail }
      });

      if (!admin) {
        this.logger.log('⚠️ Admin account not found - it should be created by seed process');
        return;
      }

      // Only reset if account is locked
      if (admin.lockedUntil && admin.lockedUntil > new Date()) {
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
        
        await this.prisma.adminUser.update({
          where: { id: admin.id },
          data: {
            passwordHash,
            isActive: true,
            loginAttempts: 0,
            lockedUntil: null,
          },
        });
        this.logger.log(`✅ Unlocked and reset admin account: ${admin.email}`);
      } else {
        this.logger.log(`✅ Admin account verified: ${admin.email}`);
      }

    } catch (error) {
      this.logger.error('❌ Failed to verify admin account:', error);
    }
  }
}

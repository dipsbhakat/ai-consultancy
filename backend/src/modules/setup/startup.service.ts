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
      let admin = await this.prisma.adminUser.findFirst({
        where: { email: adminEmail }
      });

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

      if (!admin) {
        // Create admin if not exists
        admin = await this.prisma.adminUser.create({
          data: {
            email: adminEmail,
            passwordHash,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'SUPERADMIN',
            isActive: true,
            loginAttempts: 0,
          },
        });
        this.logger.log(`✅ Created admin account: ${admin.email}`);
      } else {
        // Always update password to ensure consistency
        await this.prisma.adminUser.update({
          where: { id: admin.id },
          data: {
            passwordHash,
            isActive: true,
            loginAttempts: 0,
            lockedUntil: null,
          },
        });
        this.logger.log(`✅ Verified and updated admin account: ${admin.email}`);
      }

      // Verify password works
      const testPassword = await bcrypt.compare(adminPassword, passwordHash);
      if (testPassword) {
        this.logger.log('✅ Admin password verification successful');
      } else {
        this.logger.error('❌ Admin password verification failed');
      }

    } catch (error) {
      this.logger.error('❌ Failed to ensure admin account:', error);
    }
  }
}

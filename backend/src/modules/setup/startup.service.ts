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

      if (!admin) {
        this.logger.log('⚠️ Admin account not found - creating it now');
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
        
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
        return;
      }

      // Always verify password works and reset if needed
      const passwordValid = await bcrypt.compare(adminPassword, admin.passwordHash);
      
      if (!passwordValid || admin.lockedUntil || admin.loginAttempts > 0) {
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
        this.logger.log(`✅ Reset admin account credentials: ${admin.email}`);
        
        // Verify the reset worked
        const testPassword = await bcrypt.compare(adminPassword, passwordHash);
        if (testPassword) {
          this.logger.log('✅ Password verification successful after reset');
        } else {
          this.logger.error('❌ Password verification failed after reset');
        }
      } else {
        this.logger.log(`✅ Admin account verified: ${admin.email}`);
      }

    } catch (error) {
      this.logger.error('❌ Failed to ensure admin account:', error);
    }
  }
}

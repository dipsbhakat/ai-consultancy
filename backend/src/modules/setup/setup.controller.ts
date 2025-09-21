import { Controller, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('setup')
export class SetupController {
  private readonly logger = new Logger(SetupController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('init-admin')
  @HttpCode(HttpStatus.OK)
  async initializeAdmin() {
    try {
      // Check if any admin exists
      const adminCount = await this.prisma.adminUser.count();
      
      if (adminCount > 0) {
        this.logger.log('Admin users already exist, skipping initialization');
        return { 
          message: 'Admin users already exist', 
          adminCount,
          login: 'Use existing credentials to login at /admin/login'
        };
      }

      // Create initial admin
      const adminEmail = 'admin@aiconsultancy.com';
      const adminPassword = 'Admin123!';
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

      const admin = await this.prisma.adminUser.create({
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

      this.logger.log(`Created initial admin: ${admin.email}`);

      return {
        message: 'Initial admin user created successfully',
        email: admin.email,
        password: adminPassword,
        warning: 'Please change the default password after first login!',
        loginUrl: '/admin/login'
      };

    } catch (error) {
      this.logger.error('Failed to initialize admin:', error);
      throw error;
    }
  }
}

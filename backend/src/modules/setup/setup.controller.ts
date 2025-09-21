import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

interface InitAdminDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  forceReset?: boolean;
}

@Controller('setup')
export class SetupController {
  private readonly logger = new Logger(SetupController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('init-admin')
  @HttpCode(HttpStatus.OK)
  async initializeAdmin(@Body() body: InitAdminDto = {}) {
    try {
      const adminEmail = body.email || 'admin@aiconsultancy.com';
      const adminPassword = body.password || 'Admin123!';
      const firstName = body.firstName || 'Super';
      const lastName = body.lastName || 'Admin';
      const forceReset = body.forceReset || false;

      // Check if admin already exists
      const existingAdmin = await this.prisma.adminUser.findFirst({
        where: { email: adminEmail }
      });

      if (existingAdmin && !forceReset) {
        this.logger.log('Admin user already exists');
        return {
          message: 'Admin user already exists',
          email: existingAdmin.email,
          loginUrl: '/admin/login',
          hint: 'Use forceReset: true to reset password'
        };
      }

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

      let admin;
      if (existingAdmin && forceReset) {
        // Update existing admin
        admin = await this.prisma.adminUser.update({
          where: { email: adminEmail },
          data: {
            passwordHash,
            firstName,
            lastName,
            role: 'SUPERADMIN',
            isActive: true,
            loginAttempts: 0,
            lockedUntil: null,
          },
        });
        this.logger.log(`Reset admin password: ${admin.email}`);
        
        return {
          message: 'Admin password reset successfully',
          email: admin.email,
          loginUrl: '/admin/login'
        };
      } else {
        // Create new admin
        admin = await this.prisma.adminUser.create({
          data: {
            email: adminEmail,
            passwordHash,
            firstName,
            lastName,
            role: 'SUPERADMIN',
            isActive: true,
            loginAttempts: 0,
          },
        });
        this.logger.log(`Created admin: ${admin.email}`);

        return {
          message: 'Admin user created successfully',
          email: admin.email,
          warning: 'Please change the default password after first login!',
          loginUrl: '/admin/login'
        };
      }

    } catch (error) {
      this.logger.error('Failed to initialize admin:', error);
      return {
        error: 'Failed to initialize admin',
        details: error.message
      };
    }
  }
}

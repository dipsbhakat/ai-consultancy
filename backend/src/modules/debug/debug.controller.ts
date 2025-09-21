import { Controller, Post, HttpCode, HttpStatus, Logger, Get } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('debug')
export class DebugController {
  private readonly logger = new Logger(DebugController.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @Get('admin-info')
  @HttpCode(HttpStatus.OK)
  async getAdminInfo() {
    try {
      const admins = await this.prisma.adminUser.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          loginAttempts: true,
          lockedUntil: true,
          createdAt: true,
          lastLoginAt: true,
        },
      });

      return {
        count: admins.length,
        admins,
      };
    } catch (error) {
      this.logger.error('Failed to get admin info:', error);
      throw error;
    }
  }

  @Post('reset-admin')
  @HttpCode(HttpStatus.OK)
  async resetAdmin() {
    try {
      // Delete all existing admin users
      await this.prisma.adminUser.deleteMany({});
      
      // Create new admin with correct credentials
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

      this.logger.log(`Reset and created admin: ${admin.email}`);

      return {
        message: 'Admin user reset successfully',
        email: admin.email,
        password: adminPassword,
        warning: 'Please change the default password after first login!',
        loginUrl: '/admin/login'
      };

    } catch (error) {
      this.logger.error('Failed to reset admin:', error);
      throw error;
    }
  }
}

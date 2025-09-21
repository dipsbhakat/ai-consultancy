import { Controller, Post, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
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

  @Get('debug')
  async debug() {
    try {
      // Test database connection and table existence
      const adminCount = await this.prisma.adminUser.count();
      const contactCount = await this.prisma.contactSubmission.count();
      
      return {
        message: 'Database debug info',
        adminUserCount: adminCount,
        contactSubmissionCount: contactCount,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        error: 'Database error',
        message: error.message,
        stack: error.stack
      };
    }
  }

  @Post('init-admin')
  @HttpCode(HttpStatus.OK)
  async initializeAdmin() {
    try {
      // Check if admin already exists
      const existingAdmin = await this.prisma.adminUser.findFirst({
        where: { email: 'admin@aiconsultancy.com' }
      });

      if (existingAdmin) {
        this.logger.log('Admin user already exists');
        
        // Test password verification for debugging
        const testPassword = 'Admin123!';
        const isPasswordValid = await bcrypt.compare(testPassword, existingAdmin.passwordHash);
        
        return {
          message: 'Admin user already exists',
          email: existingAdmin.email,
          note: 'Use admin@aiconsultancy.com with password Admin123!',
          loginUrl: '/admin/login',
          debug: {
            passwordHashExists: !!existingAdmin.passwordHash,
            passwordHashLength: existingAdmin.passwordHash.length,
            testPasswordValid: isPasswordValid
          }
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

      this.logger.log(`Created admin: ${admin.email}`);

      return {
        message: 'Admin user created successfully',
        email: admin.email,
        password: adminPassword,
        warning: 'Please change the default password after first login!',
        loginUrl: '/admin/login'
      };

    } catch (error) {
      this.logger.error('Failed to initialize admin:', error);
      return {
        error: 'Failed to initialize admin',
        details: error.message,
        stack: error.stack
      };
    }
  }

  @Post('reset-admin')
  @HttpCode(HttpStatus.OK)
  async resetAdmin() {
    try {
      // Delete existing admin
      await this.prisma.adminUser.deleteMany({
        where: { email: 'admin@aiconsultancy.com' }
      });
      
      this.logger.log('Deleted existing admin user');

      // Create fresh admin
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

      this.logger.log(`Created fresh admin: ${admin.email}`);

      // Verify the password immediately
      const isPasswordValid = await bcrypt.compare(adminPassword, passwordHash);

      return {
        message: 'Admin user reset successfully',
        email: admin.email,
        password: adminPassword,
        verification: {
          passwordValid: isPasswordValid,
          hashLength: passwordHash.length
        },
        warning: 'Please change the default password after first login!',
        loginUrl: '/admin/login'
      };

    } catch (error) {
      this.logger.error('Failed to reset admin:', error);
      return {
        error: 'Failed to reset admin',
        details: error.message,
        stack: error.stack
      };
    }
  }
}

import { Controller, Post, Get, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
  ) {}

  @Get('env-check')
  @HttpCode(HttpStatus.OK)
  checkEnvironment() {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    
    return {
      environment: nodeEnv,
      jwtSecretSet: !!jwtSecret,
      jwtSecretLength: jwtSecret ? jwtSecret.length : 0,
      jwtSecretStart: jwtSecret ? jwtSecret.substring(0, 20) + '...' : 'NOT_SET',
      jwtExpiresIn: jwtExpiresIn || 'NOT_SET',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      isProduction: nodeEnv === 'production',
      needsEnvSetup: !jwtSecret || jwtSecret.includes('change') || jwtSecret.includes('dev'),
      allEnvVars: {
        PORT: this.configService.get<string>('PORT'),
        DATABASE_URL: this.configService.get<string>('DATABASE_URL') ? 'SET' : 'NOT_SET'
      }
    };
  }

  @Post('unlock-admin')
  @HttpCode(HttpStatus.OK)
  async unlockAdmin(@Body() body: { email?: string } = {}) {
    try {
      const adminEmail = body.email || 'admin@aiconsultancy.com';

      // Unlock the admin account by clearing lockout fields
      const admin = await this.prisma.adminUser.update({
        where: { email: adminEmail },
        data: {
          loginAttempts: 0,
          lockedUntil: null,
        },
      });

      this.logger.log(`Admin account unlocked: ${admin.email}`);

      return {
        message: 'Admin account unlocked successfully',
        email: admin.email,
        loginUrl: '/admin/login'
      };

    } catch (error) {
      this.logger.error('Failed to unlock admin:', error);
      return {
        error: 'Failed to unlock admin account',
        details: error.message
      };
    }
  }

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

  @Post('test-admin-login')
  @HttpCode(HttpStatus.OK)
  async testAdminLogin(@Body() body: { email?: string; password?: string } = {}) {
    try {
      const adminEmail = body.email || 'admin@aiconsultancy.com';
      const adminPassword = body.password || 'Admin123!';

      // Find admin
      const admin = await this.prisma.adminUser.findFirst({
        where: { email: adminEmail }
      });

      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
          email: adminEmail
        };
      }

      // Test password
      const isPasswordValid = await bcrypt.compare(adminPassword, admin.passwordHash);
      
      return {
        success: isPasswordValid,
        message: isPasswordValid ? 'Password is valid' : 'Password is invalid',
        email: admin.email,
        adminStatus: {
          isActive: admin.isActive,
          loginAttempts: admin.loginAttempts,
          lockedUntil: admin.lockedUntil,
          lastLoginAt: admin.lastLoginAt
        }
      };

    } catch (error) {
      this.logger.error('Failed to test admin login:', error);
      return {
        success: false,
        error: 'Failed to test login',
        details: error.message
      };
    }
  }
}

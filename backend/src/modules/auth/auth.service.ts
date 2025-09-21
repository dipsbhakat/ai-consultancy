import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { AdminUser } from '@prisma/client';
import { AdminRole } from '../../types/enums';
import * as bcrypt from 'bcrypt';
import { LoginDto, CreateAdminDto, AdminJwtPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;
  private readonly maxLoginAttempts = 5;
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticate admin user with email and password
   */
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password } = loginDto;

    // Find admin user
    const admin = await this.prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      this.logger.warn(`Failed login attempt for non-existent email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const unlockTime = admin.lockedUntil.toISOString();
      this.logger.warn(`Login attempt for locked account: ${email}, unlocks at: ${unlockTime}`);
      throw new UnauthorizedException(`Account is locked until ${unlockTime}`);
    }

    // Check if account is active
    if (!admin.isActive) {
      this.logger.warn(`Login attempt for inactive account: ${email}`);
      throw new UnauthorizedException('Account is disabled');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isPasswordValid) {
      await this.handleFailedLogin(admin.id);
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login attempts on successful login
    await this.resetLoginAttempts(admin.id);

    // Update last login timestamp
    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Create JWT payload
    const payload: AdminJwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role as AdminRole,
      firstName: admin.firstName,
      lastName: admin.lastName,
    };

    // Generate JWT token
    const accessToken = this.jwtService.sign(payload);

    // Log successful login
    await this.logAdminAction(admin.id, 'LOGIN', 'admin_user', admin.id, null, null, ipAddress, userAgent);

    this.logger.log(`Successful login for admin: ${email}`);

    return {
      accessToken,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role as AdminRole,
      },
    };
  }

  /**
   * Create a new admin user (only by SUPERADMIN)
   */
  async createAdmin(createAdminDto: CreateAdminDto, createdBy: string) {
    const { email, password, firstName, lastName, role } = createAdminDto;

    // Check if admin already exists
    const existingAdmin = await this.prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new BadRequestException('Admin user with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.saltRounds);

    // Create admin user
    const admin = await this.prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
      },
    });

    // Log admin creation
    await this.logAdminAction(
      createdBy,
      'CREATE',
      'admin_user',
      admin.id,
      null,
      { email, firstName, lastName, role },
    );

    this.logger.log(`New admin created: ${email} with role: ${role}`);

    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    };
  }

  /**
   * Validate JWT token and return admin user
   */
  async validateAdmin(payload: AdminJwtPayload) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
    });

    if (!admin || !admin.isActive) {
      return null;
    }

    return admin;
  }

  /**
   * Handle failed login attempts and account locking
   */
  private async handleFailedLogin(adminId: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!admin) return;

    const newAttempts = admin.loginAttempts + 1;
    const updateData: any = { loginAttempts: newAttempts };

    // Lock account if max attempts reached
    if (newAttempts >= this.maxLoginAttempts) {
      updateData.lockedUntil = new Date(Date.now() + this.lockoutDuration);
      this.logger.warn(`Account locked due to failed attempts: ${admin.email}`);
    }

    await this.prisma.adminUser.update({
      where: { id: adminId },
      data: updateData,
    });
  }

  /**
   * Reset login attempts after successful login
   */
  private async resetLoginAttempts(adminId: string) {
    await this.prisma.adminUser.update({
      where: { id: adminId },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  /**
   * Log admin actions for audit trail
   */
  private async logAdminAction(
    adminId: string,
    action: string,
    resource: string,
    resourceId?: string,
    oldValues?: any,
    newValues?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action,
          resource,
          resourceId,
          oldValues: oldValues ? JSON.stringify(oldValues) : null,
          newValues: newValues ? JSON.stringify(newValues) : null,
          ipAddress,
          userAgent,
          adminId,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
    }
  }
}

import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { StructuredLogger } from '../../common/logger.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SessionInfo {
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly structuredLogger = new StructuredLogger();

  // Short-lived access tokens (15 minutes)
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  // Long-lived refresh tokens (30 days)
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 30;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate access and refresh token pair
   */
  async generateTokenPair(
    adminId: string,
    sessionInfo: SessionInfo,
  ): Promise<TokenPair> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    // Generate access token (short-lived)
    const accessTokenPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      firstName: admin.firstName,
      lastName: admin.lastName,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    // Generate refresh token (long-lived, random)
    const refreshTokenValue = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        adminId: admin.id,
        expiresAt,
        deviceInfo: this.hashDeviceInfo(sessionInfo.userAgent),
        ipAddress: sessionInfo.ipAddress,
      },
    });

    // Create or update session
    await this.createOrUpdateSession(adminId, sessionInfo);

    // Clean up old tokens for this admin
    await this.cleanupExpiredTokens(adminId);

    this.structuredLogger.info('Token pair generated', {
      adminId: admin.id,
      email: admin.email,
      ipAddress: sessionInfo.ipAddress,
      action: 'token_generated',
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(
    refreshTokenValue: string,
    sessionInfo: SessionInfo,
  ): Promise<TokenPair> {
    // Find and validate refresh token
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshTokenValue },
      include: { admin: true },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshToken.isRevoked) {
      this.structuredLogger.securityEvent(
        'revoked_refresh_token_used',
        { adminId: refreshToken.adminId },
        sessionInfo.ipAddress,
      );
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (refreshToken.expiresAt < new Date()) {
      // Clean up expired token
      await this.prisma.refreshToken.delete({
        where: { id: refreshToken.id },
      });
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Security: Check if device info matches (optional, for device binding)
    const currentDeviceHash = this.hashDeviceInfo(sessionInfo.userAgent);
    if (refreshToken.deviceInfo && refreshToken.deviceInfo !== currentDeviceHash) {
      this.structuredLogger.securityEvent(
        'refresh_token_device_mismatch',
        { 
          adminId: refreshToken.adminId,
          expectedDevice: refreshToken.deviceInfo,
          actualDevice: currentDeviceHash,
        },
        sessionInfo.ipAddress,
      );
      // Don't reject, but log for monitoring
    }

    // Check if admin is still active
    if (!refreshToken.admin.isActive) {
      await this.revokeRefreshToken(refreshTokenValue);
      throw new UnauthorizedException('Admin account is disabled');
    }

    // Generate new token pair (token rotation)
    const newTokenPair = await this.generateTokenPair(
      refreshToken.adminId,
      sessionInfo,
    );

    // Revoke the old refresh token (token rotation)
    await this.revokeRefreshToken(refreshTokenValue);

    this.structuredLogger.info('Access token refreshed', {
      adminId: refreshToken.adminId,
      email: refreshToken.admin.email,
      ipAddress: sessionInfo.ipAddress,
      action: 'token_refreshed',
    });

    return newTokenPair;
  }

  /**
   * Revoke a specific refresh token
   */
  async revokeRefreshToken(tokenValue: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token: tokenValue },
      data: { isRevoked: true },
    });
  }

  /**
   * Revoke all refresh tokens for an admin (logout from all devices)
   */
  async revokeAllRefreshTokens(adminId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { adminId },
      data: { isRevoked: true },
    });

    // Deactivate all sessions
    await this.prisma.adminSession.updateMany({
      where: { adminId },
      data: { isActive: false },
    });

    this.structuredLogger.info('All refresh tokens revoked', {
      adminId,
      action: 'logout_all_devices',
    });
  }

  /**
   * Create or update admin session
   */
  private async createOrUpdateSession(
    adminId: string,
    sessionInfo: SessionInfo,
  ): Promise<void> {
    const sessionToken = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);

    const deviceHash = this.hashDeviceInfo(sessionInfo.userAgent);

    // Try to update existing session for this device
    const existingSession = await this.prisma.adminSession.findFirst({
      where: {
        adminId,
        deviceInfo: deviceHash,
        isActive: true,
      },
    });

    if (existingSession) {
      await this.prisma.adminSession.update({
        where: { id: existingSession.id },
        data: {
          lastActivity: new Date(),
          ipAddress: sessionInfo.ipAddress,
          userAgent: sessionInfo.userAgent,
        },
      });
    } else {
      await this.prisma.adminSession.create({
        data: {
          adminId,
          sessionToken,
          deviceInfo: deviceHash,
          ipAddress: sessionInfo.ipAddress,
          userAgent: sessionInfo.userAgent,
          expiresAt,
        },
      });
    }
  }

  /**
   * Clean up expired tokens and sessions
   */
  private async cleanupExpiredTokens(adminId: string): Promise<void> {
    const now = new Date();

    // Remove expired refresh tokens
    await this.prisma.refreshToken.deleteMany({
      where: {
        adminId,
        expiresAt: { lt: now },
      },
    });

    // Remove expired sessions
    await this.prisma.adminSession.deleteMany({
      where: {
        adminId,
        expiresAt: { lt: now },
      },
    });

    // Keep only the last 5 active sessions per admin
    const activeSessions = await this.prisma.adminSession.findMany({
      where: {
        adminId,
        isActive: true,
        expiresAt: { gte: now },
      },
      orderBy: { lastActivity: 'desc' },
    });

    if (activeSessions.length > 5) {
      const sessionsToRemove = activeSessions.slice(5);
      await this.prisma.adminSession.deleteMany({
        where: {
          id: { in: sessionsToRemove.map(s => s.id) },
        },
      });
    }
  }

  /**
   * Get active sessions for an admin
   */
  async getActiveSessions(adminId: string) {
    return this.prisma.adminSession.findMany({
      where: {
        adminId,
        isActive: true,
        expiresAt: { gte: new Date() },
      },
      orderBy: { lastActivity: 'desc' },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        lastActivity: true,
        createdAt: true,
      },
    });
  }

  /**
   * Generate a cryptographically secure random token
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash device information for comparison
   */
  private hashDeviceInfo(userAgent: string): string {
    return crypto
      .createHash('sha256')
      .update(userAgent || 'unknown')
      .digest('hex')
      .substring(0, 16);
  }
}

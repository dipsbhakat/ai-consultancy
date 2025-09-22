import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  ValidationPipe,
  Logger,
  Ip,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService, SessionInfo } from './token.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import { LoginDto, CreateAdminDto, AuthResponse } from './dto/auth.dto';
import { AdminUser } from '@prisma/client';
import { AdminRole } from '../../types/enums';
import { StructuredLogger } from '../../common/logger.service';

export class RefreshTokenDto {
  refreshToken: string;
}

@Controller('admin/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly structuredLogger = new StructuredLogger();

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ): Promise<AuthResponse> {
    this.structuredLogger.info('Login attempt', {
      email: loginDto.email,
      ipAddress,
      userAgent,
      action: 'login_attempt',
    });

    try {
      // Use the enhanced auth service for login
      const result = await this.authService.login(loginDto, ipAddress, userAgent);
      
      // Generate token pair with session info
      const sessionInfo: SessionInfo = {
        deviceInfo: userAgent || 'unknown',
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown',
      };

      const tokenPair = await this.tokenService.generateTokenPair(
        result.admin.id,
        sessionInfo,
      );

      this.structuredLogger.info('Login successful', {
        adminId: result.admin.id,
        email: result.admin.email,
        ipAddress,
        action: 'login_success',
      });

      return {
        admin: result.admin,
        ...tokenPair,
      };
    } catch (error) {
      this.structuredLogger.error('Login error', error, {
        email: loginDto.email,
        ipAddress,
        action: 'login_error',
      });
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    this.structuredLogger.info('Token refresh attempt', {
      ipAddress,
      userAgent,
      action: 'token_refresh_attempt',
    });

    try {
      const sessionInfo: SessionInfo = {
        deviceInfo: userAgent || 'unknown',
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown',
      };

      const tokenPair = await this.tokenService.refreshAccessToken(
        refreshTokenDto.refreshToken,
        sessionInfo,
      );

      return tokenPair;
    } catch (error) {
      this.structuredLogger.error('Token refresh error', error, {
        ipAddress,
        action: 'token_refresh_error',
      });
      throw error;
    }
  }

  @Post('create-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPERADMIN)
  async createAdmin(
    @Body(ValidationPipe) createAdminDto: CreateAdminDto,
    @CurrentAdmin() currentAdmin: AdminUser,
  ) {
    this.logger.log(`Admin creation requested by: ${currentAdmin.email}`);
    
    return await this.authService.createAdmin(createAdminDto, currentAdmin.id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentAdmin() admin: AdminUser) {
    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      isActive: admin.isActive,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentAdmin() admin: AdminUser,
    @Body() body: { refreshToken?: string },
    @Ip() ipAddress: string,
  ) {
    try {
      if (body.refreshToken) {
        await this.tokenService.revokeRefreshToken(body.refreshToken);
      }

      this.structuredLogger.info('Logout successful', {
        adminId: admin.id,
        email: admin.email,
        ipAddress,
        action: 'logout',
      });

      return { message: 'Successfully logged out' };
    } catch (error) {
      this.structuredLogger.error('Logout error', error, {
        adminId: admin.id,
        ipAddress,
        action: 'logout_error',
      });
      throw error;
    }
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logoutFromAllDevices(
    @CurrentAdmin() admin: AdminUser,
    @Ip() ipAddress: string,
  ) {
    try {
      await this.tokenService.revokeAllRefreshTokens(admin.id);

      this.structuredLogger.info('Logout from all devices', {
        adminId: admin.id,
        email: admin.email,
        ipAddress,
        action: 'logout_all_devices',
      });

      return { message: 'Logged out from all devices successfully' };
    } catch (error) {
      this.structuredLogger.error('Logout all devices error', error, {
        adminId: admin.id,
        ipAddress,
        action: 'logout_all_error',
      });
      throw error;
    }
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getActiveSessions(@CurrentAdmin() admin: AdminUser) {
    try {
      const sessions = await this.tokenService.getActiveSessions(admin.id);
      return { sessions };
    } catch (error) {
      this.structuredLogger.error('Get sessions error', error, {
        adminId: admin.id,
        action: 'get_sessions_error',
      });
      throw error;
    }
  }
}

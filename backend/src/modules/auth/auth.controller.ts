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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import { LoginDto, CreateAdminDto, AuthResponse } from './dto/auth.dto';
import { AdminUser } from '@prisma/client';
import { AdminRole } from '../../types/enums';

@Controller('admin/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Request() req: any,
  ): Promise<AuthResponse> {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    this.logger.log(`Login attempt from IP: ${ipAddress}`);
    
    return await this.authService.login(loginDto, ipAddress, userAgent);
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
  async logout(@CurrentAdmin() admin: AdminUser, @Request() req: any) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    // Log logout action for audit
    // Note: The actual token invalidation would require a token blacklist 
    // or short token expiry with refresh tokens
    
    this.logger.log(`Admin logout: ${admin.email} from IP: ${ipAddress}`);
    
    return { message: 'Successfully logged out' };
  }
}

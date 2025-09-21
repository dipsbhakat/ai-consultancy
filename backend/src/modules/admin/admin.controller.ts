import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentAdmin } from '../auth/decorators/current-admin.decorator';
import { UpdateAdminDto } from '../auth/dto/auth.dto';
import { AdminUser } from '@prisma/client';
import { AdminRole, ContactStatus, ContactPriority } from '../../types/enums';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard(@CurrentAdmin() admin: AdminUser) {
    this.logger.log(`Dashboard accessed by admin: ${admin.email}`);
    return await this.adminService.getDashboardStats();
  }

  @Get('users')
  @UseGuards(RolesGuard)
  @Roles(AdminRole.SUPERADMIN)
  async getAllAdmins(@CurrentAdmin() admin: AdminUser) {
    this.logger.log(`Admin users list accessed by: ${admin.email}`);
    return await this.adminService.getAllAdmins();
  }

  @Put('users/:adminId')
  @UseGuards(RolesGuard)
  @Roles(AdminRole.SUPERADMIN)
  async updateAdmin(
    @Param('adminId') adminId: string,
    @Body(ValidationPipe) updateAdminDto: UpdateAdminDto,
    @CurrentAdmin() currentAdmin: AdminUser,
  ) {
    this.logger.log(`Admin update requested for ${adminId} by: ${currentAdmin.email}`);
    return await this.adminService.updateAdmin(adminId, updateAdminDto, currentAdmin.id);
  }

  @Get('contacts')
  async getContactSubmissions(
    @CurrentAdmin() admin: AdminUser,
    @Query('page') pageQuery?: string,
    @Query('limit') limitQuery?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('search') search?: string,
  ) {
    const page = pageQuery ? Math.max(1, parseInt(pageQuery, 10) || 1) : 1;
    const limit = limitQuery ? Math.min(100, Math.max(1, parseInt(limitQuery, 10) || 20)) : 20;
    // Limit access based on role
    if (admin.role === AdminRole.VIEWER && assignedTo && assignedTo !== admin.id) {
      assignedTo = admin.id; // Viewers can only see their own assignments
    }

    this.logger.log(`Contact submissions accessed by: ${admin.email}, filters: ${JSON.stringify({ status, priority, assignedTo, search })}`);
    
    return await this.adminService.getContactSubmissions(
      page,
      Math.min(limit, 100), // Max 100 per page
      status,
      priority,
      assignedTo,
      search,
    );
  }

  @Put('contacts/:contactId')
  async updateContactSubmission(
    @Param('contactId') contactId: string,
    @Body(ValidationPipe) updates: {
      status?: string;
      priority?: string;
      assignedTo?: string;
      internalNotes?: string;
      tags?: string[];
    },
    @CurrentAdmin() admin: AdminUser,
  ) {
    // Viewers can only update contacts assigned to them
    if (admin.role === AdminRole.VIEWER) {
      const contact = await this.adminService.getContactSubmissions(1, 1, undefined, undefined, admin.id);
      if (!contact.contacts.find(c => c.id === contactId)) {
        throw new Error('Access denied: You can only update contacts assigned to you');
      }
    }

    this.logger.log(`Contact ${contactId} update requested by: ${admin.email}`);
    
    return await this.adminService.updateContactSubmission(contactId, updates, admin.id);
  }

  @Get('audit-logs')
  @UseGuards(RolesGuard)
  @Roles(AdminRole.SUPERADMIN, AdminRole.EDITOR)
  async getAuditLogs(
    @CurrentAdmin() admin: AdminUser,
    @Query('page') pageQuery?: string,
    @Query('limit') limitQuery?: string,
    @Query('adminId') adminId?: string,
    @Query('resource') resource?: string,
  ) {
    const page = pageQuery ? Math.max(1, parseInt(pageQuery, 10) || 1) : 1;
    const limit = limitQuery ? Math.min(100, Math.max(1, parseInt(limitQuery, 10) || 50)) : 50;
    this.logger.log(`Audit logs accessed by: ${admin.email}`);
    
    return await this.adminService.getAuditLogs(
      page,
      Math.min(limit, 100), // Max 100 per page
      adminId,
      resource,
    );
  }
}

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AdminUser } from '@prisma/client';
import { AdminRole, ContactStatus, ContactPriority, ContactSource } from '../../types/enums';
import { UpdateAdminDto } from '../auth/dto/auth.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all admin users (SUPERADMIN only)
   */
  async getAllAdmins() {
    return await this.prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        loginAttempts: true,
        lockedUntil: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update admin user (SUPERADMIN only)
   */
  async updateAdmin(adminId: string, updateAdminDto: UpdateAdminDto, updatedBy: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    const updatedAdmin = await this.prisma.adminUser.update({
      where: { id: adminId },
      data: updateAdminDto,
    });

    // Log the update
    await this.logAdminAction(
      updatedBy,
      'UPDATE',
      'admin_user',
      adminId,
      { firstName: admin.firstName, lastName: admin.lastName, role: admin.role, isActive: admin.isActive },
      updateAdminDto,
    );

    this.logger.log(`Admin updated: ${updatedAdmin.email} by admin: ${updatedBy}`);

    return {
      id: updatedAdmin.id,
      email: updatedAdmin.email,
      firstName: updatedAdmin.firstName,
      lastName: updatedAdmin.lastName,
      role: updatedAdmin.role,
      isActive: updatedAdmin.isActive,
      lastLoginAt: updatedAdmin.lastLoginAt,
      createdAt: updatedAdmin.createdAt,
      updatedAt: updatedAdmin.updatedAt,
    };
  }

  /**
   * Get contact submissions with filters and pagination
   */
  async getContactSubmissions(
    page: number = 1,
    limit: number = 20,
    status?: string,
    priority?: string,
    assignedTo?: string,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      this.prisma.contactSubmission.findMany({
        where,
        include: {
          assignedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' }, // HIGH and URGENT first
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      this.prisma.contactSubmission.count({ where }),
    ]);

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update contact submission
   */
  async updateContactSubmission(
    contactId: string,
    updates: {
      status?: string;
      priority?: string;
      assignedTo?: string;
      internalNotes?: string;
      tags?: string[];
      respondedAt?: Date;
    },
    updatedBy: string,
  ) {
    const contact = await this.prisma.contactSubmission.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException('Contact submission not found');
    }

    // If status is being updated to RESOLVED, set respondedAt
    if (updates.status === ContactStatus.RESOLVED && contact.status !== ContactStatus.RESOLVED) {
      updates.respondedAt = new Date();
    }

    // Prepare data for SQLite (convert arrays to JSON strings)
    const updateData: any = { ...updates };
    if (updates.tags) {
      updateData.tags = JSON.stringify(updates.tags);
    }

    const updatedContact = await this.prisma.contactSubmission.update({
      where: { id: contactId },
      data: updateData,
      include: {
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Log the update
    await this.logAdminAction(
      updatedBy,
      'UPDATE',
      'contact_submission',
      contactId,
      { status: contact.status, priority: contact.priority, assignedTo: contact.assignedTo },
      updates,
    );

    this.logger.log(`Contact submission updated: ${contactId} by admin: ${updatedBy}`);

    return updatedContact;
  }

  /**
   * Get audit logs with pagination
   */
  async getAuditLogs(page: number = 1, limit: number = 50, adminId?: string, resource?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (adminId) where.adminId = adminId;
    if (resource) where.resource = resource;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const [
      totalContacts,
      newContacts,
      inReviewContacts,
      resolvedContacts,
      urgentContacts,
      totalAdmins,
      activeAdmins,
    ] = await Promise.all([
      this.prisma.contactSubmission.count(),
      this.prisma.contactSubmission.count({ where: { status: ContactStatus.NEW } }),
      this.prisma.contactSubmission.count({ where: { status: ContactStatus.IN_REVIEW } }),
      this.prisma.contactSubmission.count({ where: { status: ContactStatus.RESOLVED } }),
      this.prisma.contactSubmission.count({ where: { priority: ContactPriority.URGENT } }),
      this.prisma.adminUser.count(),
      this.prisma.adminUser.count({ where: { isActive: true } }),
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentContacts = await this.prisma.contactSubmission.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    return {
      contacts: {
        total: totalContacts,
        new: newContacts,
        inReview: inReviewContacts,
        resolved: resolvedContacts,
        urgent: urgentContacts,
        recent: recentContacts,
      },
      admins: {
        total: totalAdmins,
        active: activeAdmins,
      },
    };
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

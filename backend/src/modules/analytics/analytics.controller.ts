import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AnalyticsService, BusinessAnalytics } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '../../types/enums';
import { PrismaService } from '../../database/prisma.service';

export interface TrackEventDto {
  eventType: string;
  eventData: Record<string, any>;
  sessionId?: string;
}

export interface LeadScoreResponse {
  contactId: string;
  demandScore: number;
  engagementScore: number;
  qualityScore: number;
  urgencyScore: number;
  totalScore: number;
  grade: string;
}

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Track an analytics event (public endpoint)
   */
  @Post('track')
  async trackEvent(
    @Body() trackEventDto: TrackEventDto,
    @Request() request: any,
  ): Promise<{ success: boolean }> {
    try {
      await this.analyticsService.trackEvent(
        trackEventDto.eventType,
        trackEventDto.eventData,
        trackEventDto.sessionId,
        undefined, // userId - not available for public tracking
        request,
      );

      return { success: true };
    } catch (error) {
      throw new HttpException(
        'Failed to track event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Calculate lead score for a contact
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPERADMIN, AdminRole.EDITOR)
  @Post('lead-score/:contactId')
  async calculateLeadScore(
    @Param('contactId') contactId: string,
  ): Promise<LeadScoreResponse> {
    try {
      const factors = await this.analyticsService.calculateLeadScore(contactId);
      
      // Get the stored lead score to return complete data
      const leadScore = await this.prisma.leadScore.findUnique({
        where: { contactId },
      });

      if (!leadScore) {
        throw new HttpException(
          'Lead score not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        contactId,
        demandScore: factors.demandScore,
        engagementScore: factors.engagementScore,
        qualityScore: factors.qualityScore,
        urgencyScore: factors.urgencyScore,
        totalScore: leadScore.totalScore,
        grade: leadScore.grade,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to calculate lead score',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get business analytics dashboard data
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPERADMIN, AdminRole.EDITOR, AdminRole.VIEWER)
  @Get('dashboard')
  async getBusinessAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<BusinessAnalytics> {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago
      const end = endDate ? new Date(endDate) : new Date(); // Default: now

      return await this.analyticsService.getBusinessAnalytics(start, end);
    } catch (error) {
      throw new HttpException(
        'Failed to get business analytics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get lead quality distribution
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPERADMIN, AdminRole.EDITOR, AdminRole.VIEWER)
  @Get('lead-quality-distribution')
  async getLeadQualityDistribution(): Promise<Record<string, number>> {
    try {
      return await this.analyticsService.getLeadQualityDistribution();
    } catch (error) {
      throw new HttpException(
        'Failed to get lead quality distribution',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get top performing content
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPERADMIN, AdminRole.EDITOR, AdminRole.VIEWER)
  @Get('top-content')
  async getTopPerformingContent(
    @Query('limit') limit?: string,
  ): Promise<Array<{
    pageUrl: string;
    views: number;
    conversions: number;
    conversionRate: number;
  }>> {
    try {
      const numericLimit = limit ? parseInt(limit, 10) : 10;
      return await this.analyticsService.getTopPerformingContent(numericLimit);
    } catch (error) {
      throw new HttpException(
        'Failed to get top performing content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all lead scores with pagination
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPERADMIN, AdminRole.EDITOR, AdminRole.VIEWER)
  @Get('lead-scores')
  async getLeadScores(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('grade') grade?: string,
  ): Promise<{
    leadScores: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const where = grade ? { grade } : {};

      const [leadScores, total] = await Promise.all([
        this.prisma.leadScore.findMany({
          where,
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
                projectType: true,
                budget: true,
                createdAt: true,
              },
            },
          },
          orderBy: { totalScore: 'desc' },
          skip,
          take: limitNum,
        }),
        this.prisma.leadScore.count({ where }),
      ]);

      return {
        leadScores,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get lead scores',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get conversion funnel data
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPERADMIN, AdminRole.EDITOR, AdminRole.VIEWER)
  @Get('conversion-funnel')
  async getConversionFunnel(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{
    stages: Array<{
      stage: string;
      count: number;
      percentage: number;
    }>;
    dropOffAnalysis: Array<{
      from: string;
      to: string;
      dropOffRate: number;
    }>;
  }> {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      // Get funnel stage counts
      const stageCounts = await this.prisma.conversionFunnel.groupBy({
        by: ['stage'],
        where: {
          timestamp: { gte: start, lte: end },
        },
        _count: {
          stage: true,
        },
        orderBy: {
          _count: {
            stage: 'desc',
          },
        },
      });

      const total = stageCounts.reduce((sum, stage) => sum + stage._count.stage, 0);
      
      const stages = stageCounts.map(stage => ({
        stage: stage.stage,
        count: stage._count.stage,
        percentage: total > 0 ? (stage._count.stage / total) * 100 : 0,
      }));

      // Calculate drop-off rates between stages
      const stageOrder = ['VISITOR', 'ENGAGED', 'LEAD', 'CONTACT', 'QUALIFIED', 'CONVERTED'];
      const dropOffAnalysis = [];

      for (let i = 0; i < stageOrder.length - 1; i++) {
        const currentStage = stages.find(s => s.stage === stageOrder[i]);
        const nextStage = stages.find(s => s.stage === stageOrder[i + 1]);

        if (currentStage && nextStage && currentStage.count > 0) {
          const dropOffRate = ((currentStage.count - nextStage.count) / currentStage.count) * 100;
          dropOffAnalysis.push({
            from: stageOrder[i],
            to: stageOrder[i + 1],
            dropOffRate: Math.max(0, dropOffRate),
          });
        }
      }

      return {
        stages,
        dropOffAnalysis,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get conversion funnel data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

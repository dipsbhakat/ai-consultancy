import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StructuredLogger } from '../../common/logger.service';

export interface LeadScoringFactors {
  demandScore: number;
  engagementScore: number;
  qualityScore: number;
  urgencyScore: number;
}

export interface BusinessAnalytics {
  period: string;
  visitors: {
    total: number;
    unique: number;
    returning: number;
  };
  leads: {
    total: number;
    qualified: number;
    conversionRate: number;
    avgScore: number;
  };
  funnel: {
    visitors: number;
    engaged: number;
    leads: number;
    contacts: number;
    qualified: number;
    converted: number;
  };
  topSources: Array<{
    source: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
  }>;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly structuredLogger = new StructuredLogger();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate lead score for a contact submission
   */
  async calculateLeadScore(contactId: string): Promise<LeadScoringFactors> {
    const contact = await this.prisma.contactSubmission.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      throw new Error('Contact not found');
    }

    // Calculate demand score (0-40 points)
    const demandScore = this.calculateDemandScore(contact);
    
    // Calculate engagement score (0-30 points)
    const engagementScore = await this.calculateEngagementScore(contactId);
    
    // Calculate quality score (0-20 points)
    const qualityScore = this.calculateQualityScore(contact);
    
    // Calculate urgency score (0-10 points)
    const urgencyScore = this.calculateUrgencyScore(contact);

    const totalScore = demandScore + engagementScore + qualityScore + urgencyScore;
    const grade = this.calculateGrade(totalScore);

    // Store or update lead score
    await this.prisma.leadScore.upsert({
      where: { contactId },
      update: {
        demandScore,
        engagementScore,
        qualityScore,
        urgencyScore,
        totalScore,
        grade,
        lastCalculated: new Date(),
        calculatedBy: 'system',
      },
      create: {
        contactId,
        demandScore,
        engagementScore,
        qualityScore,
        urgencyScore,
        totalScore,
        grade,
        calculatedBy: 'system',
      },
    });

    this.structuredLogger.info('Lead score calculated', {
      contactId,
      totalScore,
      grade,
      action: 'lead_scoring',
    });

    return {
      demandScore,
      engagementScore,
      qualityScore,
      urgencyScore,
    };
  }

  /**
   * Track analytics event
   */
  async trackEvent(
    eventType: string,
    eventData: Record<string, any>,
    sessionId?: string,
    userId?: string,
    request?: any,
  ): Promise<void> {
    try {
      const ipAddress = request?.ip || request?.connection?.remoteAddress;
      const userAgent = request?.get?.('user-agent');
      const referrer = request?.get?.('referer');
      const pageUrl = eventData.pageUrl || request?.originalUrl;

      await this.prisma.analyticsEvent.create({
        data: {
          eventType,
          eventData: JSON.stringify(eventData),
          sessionId,
          userId,
          ipAddress,
          userAgent,
          referrer,
          pageUrl,
        },
      });

      // Track conversion funnel progression
      if (eventType === 'CONTACT_SUBMIT') {
        await this.trackFunnelStage(sessionId, 'CONTACT', pageUrl, eventType);
      } else if (eventType === 'FORM_INTERACTION') {
        await this.trackFunnelStage(sessionId, 'ENGAGED', pageUrl, eventType);
      }
    } catch (error) {
      this.logger.error('Failed to track analytics event:', error);
      throw error;
    }
  }

  /**
   * Track conversion funnel stage
   */
  async trackFunnelStage(
    sessionId: string,
    stage: string,
    pageUrl?: string,
    eventTrigger?: string,
  ): Promise<void> {
    if (!sessionId) return;

    // Get the previous stage for this session
    const previousStage = await this.prisma.conversionFunnel.findFirst({
      where: { sessionId },
      orderBy: { timestamp: 'desc' },
    });

    await this.prisma.conversionFunnel.create({
      data: {
        sessionId,
        stage,
        sourceStage: previousStage?.stage,
        pageUrl,
        eventTrigger,
      },
    });
  }

  /**
   * Get business analytics for a time period
   */
  async getBusinessAnalytics(
    startDate: Date,
    endDate: Date,
  ): Promise<BusinessAnalytics> {
    // Get visitor metrics
    const visitorMetrics = await this.getVisitorMetrics(startDate, endDate);
    
    // Get lead metrics
    const leadMetrics = await this.getLeadMetrics(startDate, endDate);
    
    // Get funnel metrics
    const funnelMetrics = await this.getFunnelMetrics(startDate, endDate);
    
    // Get top traffic sources
    const topSources = await this.getTopTrafficSources(startDate, endDate);

    return {
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      visitors: visitorMetrics,
      leads: leadMetrics,
      funnel: funnelMetrics,
      topSources,
    };
  }

  /**
   * Get lead quality distribution
   */
  async getLeadQualityDistribution(): Promise<Record<string, number>> {
    const distribution = await this.prisma.leadScore.groupBy({
      by: ['grade'],
      _count: {
        grade: true,
      },
    });

    return distribution.reduce((acc, item) => {
      acc[item.grade] = item._count.grade;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Get top performing content/pages
   */
  async getTopPerformingContent(limit = 10): Promise<Array<{
    pageUrl: string;
    views: number;
    conversions: number;
    conversionRate: number;
  }>> {
    const pageMetrics = await this.prisma.analyticsEvent.groupBy({
      by: ['pageUrl'],
      where: {
        eventType: 'PAGE_VIEW',
        pageUrl: { not: null },
      },
      _count: {
        pageUrl: true,
      },
      orderBy: {
        _count: {
          pageUrl: 'desc',
        },
      },
      take: limit,
    });

    const results = [];
    for (const page of pageMetrics) {
      const conversions = await this.prisma.analyticsEvent.count({
        where: {
          eventType: 'CONTACT_SUBMIT',
          pageUrl: page.pageUrl,
        },
      });

      results.push({
        pageUrl: page.pageUrl || 'Unknown',
        views: page._count.pageUrl,
        conversions,
        conversionRate: page._count.pageUrl > 0 ? (conversions / page._count.pageUrl) * 100 : 0,
      });
    }

    return results;
  }

  // Private helper methods

  private calculateDemandScore(contact: any): number {
    let score = 0;

    // Project type scoring
    const projectTypeScores: Record<string, number> = {
      'web-development': 15,
      'mobile-app': 20,
      'ai-ml': 25,
      'consulting': 10,
      'maintenance': 5,
    };
    score += projectTypeScores[contact.projectType] || 5;

    // Budget scoring
    const budgetScores: Record<string, number> = {
      'under-5k': 5,
      '5k-15k': 10,
      '15k-50k': 15,
      'over-50k': 20,
    };
    score += budgetScores[contact.budget] || 0;

    return Math.min(score, 40);
  }

  private async calculateEngagementScore(contactId: string): Promise<number> {
    // For now, return a base score. In production, this would analyze:
    // - Time spent on site before submitting
    // - Number of pages visited
    // - Form interaction patterns
    // - Previous visits/sessions
    
    const baseEngagement = 15; // Medium engagement
    return baseEngagement;
  }

  private calculateQualityScore(contact: any): number {
    let score = 0;

    // Company presence
    if (contact.company && contact.company.length > 2) {
      score += 5;
    }

    // Email domain quality
    if (contact.email) {
      const domain = contact.email.split('@')[1];
      if (domain && !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain)) {
        score += 10; // Business email
      } else {
        score += 3; // Personal email
      }
    }

    // Phone number presence
    if (contact.phone && contact.phone.length > 5) {
      score += 5;
    }

    return Math.min(score, 20);
  }

  private calculateUrgencyScore(contact: any): number {
    let score = 5; // Base urgency

    // Keywords in message indicating urgency
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'rush', 'deadline', 'soon'];
    const message = (contact.message || '').toLowerCase();
    
    if (urgentKeywords.some(keyword => message.includes(keyword))) {
      score += 5;
    }

    return Math.min(score, 10);
  }

  private calculateGrade(totalScore: number): string {
    if (totalScore >= 80) return 'A';
    if (totalScore >= 60) return 'B';
    if (totalScore >= 40) return 'C';
    return 'D';
  }

  private async getVisitorMetrics(startDate: Date, endDate: Date) {
    const totalVisitors = await this.prisma.analyticsEvent.count({
      where: {
        eventType: 'PAGE_VIEW',
        timestamp: { gte: startDate, lte: endDate },
      },
    });

    const uniqueVisitors = await this.prisma.analyticsEvent.groupBy({
      by: ['sessionId'],
      where: {
        eventType: 'PAGE_VIEW',
        timestamp: { gte: startDate, lte: endDate },
        sessionId: { not: null },
      },
    }).then(sessions => sessions.length);

    return {
      total: totalVisitors,
      unique: uniqueVisitors,
      returning: Math.max(0, totalVisitors - uniqueVisitors),
    };
  }

  private async getLeadMetrics(startDate: Date, endDate: Date) {
    const totalContacts = await this.prisma.contactSubmission.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const qualifiedLeads = await this.prisma.leadScore.count({
      where: {
        grade: { in: ['A', 'B'] },
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const avgScore = await this.prisma.leadScore.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _avg: {
        totalScore: true,
      },
    });

    return {
      total: totalContacts,
      qualified: qualifiedLeads,
      conversionRate: 0, // Would calculate from visitor to contact ratio
      avgScore: avgScore._avg.totalScore || 0,
    };
  }

  private async getFunnelMetrics(startDate: Date, endDate: Date) {
    const stages = ['VISITOR', 'ENGAGED', 'LEAD', 'CONTACT', 'QUALIFIED', 'CONVERTED'];
    const funnelData: Record<string, number> = {};

    for (const stage of stages) {
      const count = await this.prisma.conversionFunnel.count({
        where: {
          stage,
          timestamp: { gte: startDate, lte: endDate },
        },
      });
      funnelData[stage.toLowerCase()] = count;
    }

    return {
      visitors: funnelData.visitor || 0,
      engaged: funnelData.engaged || 0,
      leads: funnelData.lead || 0,
      contacts: funnelData.contact || 0,
      qualified: funnelData.qualified || 0,
      converted: funnelData.converted || 0,
    };
  }

  private async getTopTrafficSources(startDate: Date, endDate: Date) {
    // This would analyze referrer data and UTM parameters
    // For now, return mock data structure
    return [
      { source: 'organic', visitors: 100, conversions: 10, conversionRate: 10 },
      { source: 'direct', visitors: 80, conversions: 8, conversionRate: 10 },
      { source: 'referral', visitors: 50, conversions: 7, conversionRate: 14 },
    ];
  }
}

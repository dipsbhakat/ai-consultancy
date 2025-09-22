import { adminAPI } from './useAdminAPI';

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventData: Record<string, any>;
  sessionId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  pageUrl?: string;
  timestamp: string;
}

export interface LeadScore {
  id: string;
  contactId: string;
  demandScore: number;
  engagementScore: number;
  qualityScore: number;
  urgencyScore: number;
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  contact: {
    id: string;
    name: string;
    email: string;
    company?: string;
    projectType?: string;
    budget?: string;
    createdAt: string;
  };
  createdAt: string;
  lastCalculated: string;
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

export interface ConversionFunnelData {
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
}

export interface TopContent {
  pageUrl: string;
  views: number;
  conversions: number;
  conversionRate: number;
}

export interface LeadScoresResponse {
  leadScores: LeadScore[];
  total: number;
  page: number;
  totalPages: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

class AnalyticsAPIService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
  }

  private async getValidAccessToken(): Promise<string | null> {
    // Use the adminAPI's token management
    return (adminAPI as any).getValidAccessToken();
  }

  /**
   * Track an analytics event (public endpoint)
   */
  async trackEvent(eventData: {
    eventType: string;
    eventData: Record<string, any>;
    sessionId?: string;
  }): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseURL}/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to track event');
    }

    return response.json();
  }

  /**
   * Get business analytics dashboard data
   */
  async getBusinessAnalytics(startDate?: string, endDate?: string): Promise<BusinessAnalytics> {
    const accessToken = await this.getValidAccessToken();
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(`${this.baseURL}/analytics/dashboard?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get business analytics');
    }

    return response.json();
  }

  /**
   * Get lead quality distribution
   */
  async getLeadQualityDistribution(): Promise<Record<string, number>> {
    const accessToken = await this.getValidAccessToken();
    
    const response = await fetch(`${this.baseURL}/analytics/lead-quality-distribution`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get lead quality distribution');
    }

    return response.json();
  }

  /**
   * Get top performing content
   */
  async getTopPerformingContent(limit = 10): Promise<TopContent[]> {
    const accessToken = await this.getValidAccessToken();
    
    const response = await fetch(`${this.baseURL}/analytics/top-content?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get top performing content');
    }

    return response.json();
  }

  /**
   * Get lead scores with pagination
   */
  async getLeadScores(
    page = 1,
    limit = 20,
    grade?: string
  ): Promise<LeadScoresResponse> {
    const accessToken = await this.getValidAccessToken();
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (grade) params.append('grade', grade);
    
    const response = await fetch(`${this.baseURL}/analytics/lead-scores?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get lead scores');
    }

    return response.json();
  }

  /**
   * Get conversion funnel data
   */
  async getConversionFunnel(startDate?: string, endDate?: string): Promise<ConversionFunnelData> {
    const accessToken = await this.getValidAccessToken();
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(`${this.baseURL}/analytics/conversion-funnel?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get conversion funnel data');
    }

    return response.json();
  }

  /**
   * Calculate lead score for a contact
   */
  async calculateLeadScore(contactId: string): Promise<{
    contactId: string;
    demandScore: number;
    engagementScore: number;
    qualityScore: number;
    urgencyScore: number;
    totalScore: number;
    grade: string;
  }> {
    const accessToken = await this.getValidAccessToken();
    
    const response = await fetch(`${this.baseURL}/analytics/lead-score/${contactId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to calculate lead score');
    }

    return response.json();
  }
}

export const analyticsAPI = new AnalyticsAPIService();

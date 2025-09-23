import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAdvancedAnalytics } from './AdvancedAnalytics';
import { usePersonalization } from './PersonalizationEngine';
import { useAIPersonalization } from './AIPersonalizationEngine';

// Types
interface LeadData {
  id: string;
  email?: string;
  name?: string;
  company?: string;
  industry?: string;
  employeeCount?: string;
  budget?: string;
  timeline?: string;
  painPoints?: string[];
  source: string;
  firstTouchTime: number;
  lastActivityTime: number;
  sessionCount: number;
  totalTimeSpent: number;
  pageViewCount: number;
  contentConsumed: string[];
  conversionEvents: string[];
  deviceTypes: string[];
  geoLocation?: string;
}

interface LeadScore {
  overall: number;
  demographic: number;
  behavioral: number;
  engagement: number;
  intent: number;
  fit: number;
  urgency: number;
  tier: 'hot' | 'warm' | 'cold' | 'nurture';
  priority: number;
  nextBestAction: string;
  reasoning: string[];
}

interface ScoringModel {
  weights: {
    demographic: number;
    behavioral: number;
    engagement: number;
    intent: number;
    fit: number;
    urgency: number;
  };
  thresholds: {
    hot: number;
    warm: number;
    cold: number;
  };
}

interface LeadInsight {
  type: 'opportunity' | 'risk' | 'recommendation';
  message: string;
  confidence: number;
  actionable: boolean;
  urgency: 'high' | 'medium' | 'low';
}

// AI Lead Scoring Engine
class AILeadScoringEngine {
  private static instance: AILeadScoringEngine;
  private scoringModel!: ScoringModel;
  private leadHistory: Map<string, LeadData[]> = new Map();
  private industryBenchmarks: Map<string, number> = new Map();

  constructor() {
    this.initializeScoringModel();
    this.initializeIndustryBenchmarks();
  }

  public static getInstance(): AILeadScoringEngine {
    if (!AILeadScoringEngine.instance) {
      AILeadScoringEngine.instance = new AILeadScoringEngine();
    }
    return AILeadScoringEngine.instance;
  }

  private initializeScoringModel(): void {
    this.scoringModel = {
      weights: {
        demographic: 0.20,
        behavioral: 0.25,
        engagement: 0.20,
        intent: 0.15,
        fit: 0.10,
        urgency: 0.10
      },
      thresholds: {
        hot: 80,
        warm: 60,
        cold: 40
      }
    };
  }

  private initializeIndustryBenchmarks(): void {
    // Industry conversion rate benchmarks (out of 100)
    this.industryBenchmarks.set('manufacturing', 85);
    this.industryBenchmarks.set('healthcare', 90);
    this.industryBenchmarks.set('finance', 95);
    this.industryBenchmarks.set('technology', 75);
    this.industryBenchmarks.set('retail', 70);
    this.industryBenchmarks.set('education', 65);
    this.industryBenchmarks.set('other', 60);
  }

  public scoreLeadDemographics(lead: LeadData): number {
    let score = 0;

    // Industry fit scoring
    const industryScore = this.industryBenchmarks.get(lead.industry || 'other') || 60;
    score += (industryScore / 100) * 25;

    // Company size scoring
    const sizeScores: Record<string, number> = {
      '1-10': 10,
      '11-50': 20,
      '51-200': 30,
      '201-1000': 25,
      '1000+': 20
    };
    score += sizeScores[lead.employeeCount || '1-10'] || 10;

    // Budget fit scoring
    const budgetScores: Record<string, number> = {
      'under-10k': 10,
      '10k-50k': 20,
      '50k-200k': 30,
      'over-200k': 25,
      'unknown': 15
    };
    score += budgetScores[lead.budget || 'unknown'] || 15;

    // Timeline urgency
    const timelineScores: Record<string, number> = {
      'immediate': 25,
      '3-months': 20,
      '6-months': 15,
      'exploring': 10
    };
    score += timelineScores[lead.timeline || 'exploring'] || 10;

    return Math.min(100, score);
  }

  public scoreLeadBehavior(lead: LeadData): number {
    let score = 0;

    // Session frequency scoring
    const sessionFrequency = lead.sessionCount / Math.max(1, this.daysSinceFirstTouch(lead));
    score += Math.min(30, sessionFrequency * 10);

    // Time spent scoring (sigmoid function)
    const avgTimePerSession = lead.totalTimeSpent / Math.max(1, lead.sessionCount);
    const timeScore = 30 / (1 + Math.exp(-(avgTimePerSession - 180) / 60));
    score += timeScore;

    // Page depth scoring
    const avgPagesPerSession = lead.pageViewCount / Math.max(1, lead.sessionCount);
    score += Math.min(20, avgPagesPerSession * 5);

    // Content consumption diversity
    const contentDiversity = lead.contentConsumed.length;
    score += Math.min(20, contentDiversity * 3);

    return Math.min(100, score);
  }

  public scoreLeadEngagement(lead: LeadData): number {
    let score = 0;

    // Conversion event scoring
    const conversionWeights: Record<string, number> = {
      'email_capture': 15,
      'roi_calculation': 20,
      'demo_request': 25,
      'contact_form': 30,
      'phone_call': 35,
      'meeting_scheduled': 40
    };

    lead.conversionEvents.forEach(event => {
      score += conversionWeights[event] || 10;
    });

    // Recency scoring (higher for recent activity)
    const daysSinceLastActivity = this.daysSinceLastActivity(lead);
    const recencyScore = Math.max(0, 30 - daysSinceLastActivity * 2);
    score += recencyScore;

    // Device engagement (multi-device usage indicates higher engagement)
    const deviceDiversity = new Set(lead.deviceTypes).size;
    score += deviceDiversity * 10;

    return Math.min(100, score);
  }

  public scoreLeadIntent(lead: LeadData): number {
    let score = 0;

    // High-intent content consumption
    const highIntentContent = [
      'pricing-page',
      'case-studies',
      'testimonials',
      'contact-page',
      'demo-page',
      'roi-calculator'
    ];

    const highIntentViews = lead.contentConsumed.filter(content => 
      highIntentContent.some(intent => content.includes(intent))
    ).length;

    score += Math.min(40, highIntentViews * 8);

    // Timeline urgency
    if (lead.timeline === 'immediate') score += 30;
    else if (lead.timeline === '3-months') score += 20;
    else if (lead.timeline === '6-months') score += 10;

    // Pain point specificity
    const painPointCount = lead.painPoints?.length || 0;
    score += Math.min(20, painPointCount * 5);

    // Recent high-value actions
    const recentHighValueActions = lead.conversionEvents.filter(event => 
      ['demo_request', 'contact_form', 'phone_call', 'meeting_scheduled'].includes(event)
    ).length;
    score += Math.min(10, recentHighValueActions * 5);

    return Math.min(100, score);
  }

  public scoreLeadFit(lead: LeadData): number {
    let score = 50; // Base fit score

    // Industry fit
    const industryFit = this.industryBenchmarks.get(lead.industry || 'other') || 60;
    score += (industryFit - 60) / 4; // Normalize around base

    // Company size fit
    if (['51-200', '201-1000'].includes(lead.employeeCount || '')) {
      score += 20; // Sweet spot
    } else if (['11-50', '1000+'].includes(lead.employeeCount || '')) {
      score += 10;
    }

    // Budget fit
    if (['50k-200k', 'over-200k'].includes(lead.budget || '')) {
      score += 20;
    } else if (lead.budget === '10k-50k') {
      score += 10;
    }

    // Source quality
    const sourceScores: Record<string, number> = {
      'linkedin': 15,
      'google': 10,
      'referral': 20,
      'direct': 5,
      'email': 15,
      'content': 10
    };
    score += sourceScores[lead.source] || 0;

    return Math.min(100, Math.max(0, score));
  }

  public scoreLeadUrgency(lead: LeadData): number {
    let score = 0;

    // Timeline urgency
    if (lead.timeline === 'immediate') score += 40;
    else if (lead.timeline === '3-months') score += 25;
    else if (lead.timeline === '6-months') score += 15;

    // Recent activity spike
    const recentActivityDays = 3;
    const recentActivity = this.daysSinceLastActivity(lead) <= recentActivityDays;
    if (recentActivity) score += 20;

    // Competitive urgency indicators
    const competitiveKeywords = lead.contentConsumed.filter(content => 
      content.includes('comparison') || content.includes('vs') || content.includes('alternative')
    ).length;
    score += Math.min(20, competitiveKeywords * 10);

    // Multiple touchpoints in short time
    const touchpointDensity = lead.sessionCount / Math.max(1, this.daysSinceFirstTouch(lead));
    if (touchpointDensity > 1) score += 20;

    return Math.min(100, score);
  }

  private daysSinceFirstTouch(lead: LeadData): number {
    return Math.max(1, (Date.now() - lead.firstTouchTime) / (1000 * 60 * 60 * 24));
  }

  private daysSinceLastActivity(lead: LeadData): number {
    return (Date.now() - lead.lastActivityTime) / (1000 * 60 * 60 * 24);
  }

  public calculateLeadScore(lead: LeadData): LeadScore {
    const demographic = this.scoreLeadDemographics(lead);
    const behavioral = this.scoreLeadBehavior(lead);
    const engagement = this.scoreLeadEngagement(lead);
    const intent = this.scoreLeadIntent(lead);
    const fit = this.scoreLeadFit(lead);
    const urgency = this.scoreLeadUrgency(lead);

    // Calculate weighted overall score
    const overall = 
      demographic * this.scoringModel.weights.demographic +
      behavioral * this.scoringModel.weights.behavioral +
      engagement * this.scoringModel.weights.engagement +
      intent * this.scoringModel.weights.intent +
      fit * this.scoringModel.weights.fit +
      urgency * this.scoringModel.weights.urgency;

    // Determine tier
    let tier: LeadScore['tier'] = 'nurture';
    if (overall >= this.scoringModel.thresholds.hot) tier = 'hot';
    else if (overall >= this.scoringModel.thresholds.warm) tier = 'warm';
    else if (overall >= this.scoringModel.thresholds.cold) tier = 'cold';

    // Calculate priority (1-100, higher is more priority)
    const priority = Math.round(overall);

    // Determine next best action
    const nextBestAction = this.determineNextBestAction(lead, overall, tier);

    // Generate reasoning
    const reasoning = this.generateScoreReasoning(lead, {
      demographic, behavioral, engagement, intent, fit, urgency
    });

    return {
      overall: Math.round(overall),
      demographic: Math.round(demographic),
      behavioral: Math.round(behavioral),
      engagement: Math.round(engagement),
      intent: Math.round(intent),
      fit: Math.round(fit),
      urgency: Math.round(urgency),
      tier,
      priority,
      nextBestAction,
      reasoning
    };
  }

  private determineNextBestAction(lead: LeadData, _score: number, tier: LeadScore['tier']): string {
    if (tier === 'hot') {
      if (lead.conversionEvents.includes('meeting_scheduled')) {
        return 'Follow up on scheduled meeting';
      } else if (lead.conversionEvents.includes('contact_form')) {
        return 'Schedule immediate sales call';
      } else {
        return 'Direct sales outreach with personalized proposal';
      }
    } else if (tier === 'warm') {
      if (lead.conversionEvents.includes('demo_request')) {
        return 'Deliver personalized demo';
      } else if (lead.conversionEvents.includes('roi_calculation')) {
        return 'Send detailed ROI analysis and case studies';
      } else {
        return 'Nurture with industry-specific content';
      }
    } else if (tier === 'cold') {
      return 'Educational content sequence and retargeting';
    } else {
      return 'Long-term nurture campaign with valuable content';
    }
  }

  private generateScoreReasoning(lead: LeadData, scores: any): string[] {
    const reasoning: string[] = [];

    // Demographic reasoning
    if (scores.demographic > 75) {
      reasoning.push(`Excellent demographic fit: ${lead.industry} industry with ${lead.employeeCount} employees`);
    } else if (scores.demographic < 40) {
      reasoning.push(`Demographic challenges: Industry or company size may not be ideal fit`);
    }

    // Behavioral reasoning
    if (scores.behavioral > 75) {
      reasoning.push(`High engagement: ${lead.sessionCount} sessions with strong time-on-site`);
    } else if (scores.behavioral < 40) {
      reasoning.push(`Low engagement: Limited sessions or shallow page views`);
    }

    // Intent reasoning
    if (scores.intent > 75) {
      reasoning.push(`Strong buying intent: Viewed pricing, demos, or requested contact`);
    } else if (scores.intent < 40) {
      reasoning.push(`Early stage: Mostly consuming educational content`);
    }

    // Urgency reasoning
    if (scores.urgency > 75) {
      reasoning.push(`High urgency: Immediate timeline or recent activity spike`);
    } else if (scores.urgency < 40) {
      reasoning.push(`Low urgency: Long timeline or infrequent engagement`);
    }

    return reasoning;
  }

  public generateLeadInsights(lead: LeadData, score: LeadScore): LeadInsight[] {
    const insights: LeadInsight[] = [];

    // Opportunity insights
    if (score.overall > 80 && score.urgency > 70) {
      insights.push({
        type: 'opportunity',
        message: 'High-value lead with immediate timeline - prioritize for direct sales contact',
        confidence: 0.9,
        actionable: true,
        urgency: 'high'
      });
    }

    if (score.engagement > 75 && score.intent < 50) {
      insights.push({
        type: 'opportunity',
        message: 'Highly engaged but needs nurturing - send targeted content to build intent',
        confidence: 0.8,
        actionable: true,
        urgency: 'medium'
      });
    }

    // Risk insights
    if (this.daysSinceLastActivity(lead) > 7 && score.overall > 60) {
      insights.push({
        type: 'risk',
        message: 'High-scoring lead going cold - immediate re-engagement needed',
        confidence: 0.85,
        actionable: true,
        urgency: 'high'
      });
    }

    if (score.fit < 40 && score.overall > 50) {
      insights.push({
        type: 'risk',
        message: 'Engagement without fit - may not convert, consider disqualifying',
        confidence: 0.7,
        actionable: true,
        urgency: 'medium'
      });
    }

    // Recommendation insights
    if (score.demographic > 80 && score.behavioral < 50) {
      insights.push({
        type: 'recommendation',
        message: 'Perfect demographic fit but low engagement - try different content types',
        confidence: 0.75,
        actionable: true,
        urgency: 'medium'
      });
    }

    if (lead.conversionEvents.includes('roi_calculation') && !lead.conversionEvents.includes('contact_form')) {
      insights.push({
        type: 'recommendation',
        message: 'Calculated ROI but hasn\'t contacted - follow up with personalized proposal',
        confidence: 0.9,
        actionable: true,
        urgency: 'high'
      });
    }

    return insights.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
  }

  public updateLeadData(leadId: string, updates: Partial<LeadData>): void {
    // Store lead updates for machine learning
    if (!this.leadHistory.has(leadId)) {
      this.leadHistory.set(leadId, []);
    }
    
    const history = this.leadHistory.get(leadId)!;
    const lastData = history[history.length - 1];
    const updatedData = { ...lastData, ...updates, lastActivityTime: Date.now() };
    
    history.push(updatedData);
    
    // Keep only last 50 updates per lead
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
  }
}

// React Context
const LeadScoringContext = createContext<{
  currentLeadScore: LeadScore | null;
  leadInsights: LeadInsight[];
  isScoring: boolean;
  updateLeadData: (updates: Partial<LeadData>) => void;
} | null>(null);

// Provider Component
export const LeadScoringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLeadScore, setCurrentLeadScore] = useState<LeadScore | null>(null);
  const [leadInsights, setLeadInsights] = useState<LeadInsight[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);

  const { session, metrics } = useAdvancedAnalytics();
  const { userProfile } = usePersonalization();
  const { behaviorPattern } = useAIPersonalization();
  const scoringEngine = AILeadScoringEngine.getInstance();

  useEffect(() => {
    if (session && userProfile && behaviorPattern) {
      setIsScoring(true);

      // Build lead data from available sources
      const leadDataObj: LeadData = {
        id: userProfile.id,
        email: undefined, // Would be set from forms
        source: session.source,
        firstTouchTime: session.startTime,
        lastActivityTime: session.lastActivity,
        sessionCount: userProfile.visitCount,
        totalTimeSpent: metrics?.sessionDuration || 0,
        pageViewCount: metrics?.pageViews || 0,
        contentConsumed: [], // Would track page visits
        conversionEvents: [], // Would track from analytics
        deviceTypes: [behaviorPattern.deviceType],
        industry: userProfile.industry,
        employeeCount: userProfile.companySize
      };

      setLeadData(leadDataObj);

      // Calculate score
      const score = scoringEngine.calculateLeadScore(leadDataObj);
      setCurrentLeadScore(score);

      // Generate insights
      const insights = scoringEngine.generateLeadInsights(leadDataObj, score);
      setLeadInsights(insights);

      setIsScoring(false);
    }
  }, [session, userProfile, behaviorPattern, metrics, scoringEngine]);

  const updateLeadData = (updates: Partial<LeadData>) => {
    if (leadData) {
      const updatedLead = { ...leadData, ...updates };
      setLeadData(updatedLead);
      scoringEngine.updateLeadData(leadData.id, updates);

      // Recalculate score
      const newScore = scoringEngine.calculateLeadScore(updatedLead);
      setCurrentLeadScore(newScore);

      const newInsights = scoringEngine.generateLeadInsights(updatedLead, newScore);
      setLeadInsights(newInsights);
    }
  };

  return (
    <LeadScoringContext.Provider
      value={{
        currentLeadScore,
        leadInsights,
        isScoring,
        updateLeadData
      }}
    >
      {children}
    </LeadScoringContext.Provider>
  );
};

// Hook
export const useLeadScoring = () => {
  const context = useContext(LeadScoringContext);
  if (!context) {
    throw new Error('useLeadScoring must be used within LeadScoringProvider');
  }
  return context;
};

// Lead Score Dashboard
export const LeadScoreDashboard: React.FC = () => {
  const { currentLeadScore, leadInsights, isScoring } = useLeadScoring();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showDashboard = localStorage.getItem('show_lead_scoring_dashboard') === 'true';
    setIsVisible(import.meta.env.DEV && showDashboard);
  }, []);

  if (!isVisible || isScoring || !currentLeadScore) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-yellow-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-lg shadow-2xl p-4 w-80 border border-blue-600 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white flex items-center">
          🎯 Lead Score
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-300 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        {/* Overall Score */}
        <div className="bg-black/20 rounded p-3">
          <div className="flex justify-between items-center mb-2">
            <span>Overall Score:</span>
            <span className={`text-2xl font-bold ${getScoreColor(currentLeadScore.overall)}`}>
              {currentLeadScore.overall}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getTierColor(currentLeadScore.tier)}`}>
              {currentLeadScore.tier.toUpperCase()}
            </span>
            <span className="text-blue-200 text-xs">Priority: {currentLeadScore.priority}</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-black/20 rounded p-3">
          <h4 className="font-semibold text-blue-200 mb-2">Score Breakdown</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Demographic:</span>
              <span className={getScoreColor(currentLeadScore.demographic)}>{currentLeadScore.demographic}</span>
            </div>
            <div className="flex justify-between">
              <span>Behavioral:</span>
              <span className={getScoreColor(currentLeadScore.behavioral)}>{currentLeadScore.behavioral}</span>
            </div>
            <div className="flex justify-between">
              <span>Engagement:</span>
              <span className={getScoreColor(currentLeadScore.engagement)}>{currentLeadScore.engagement}</span>
            </div>
            <div className="flex justify-between">
              <span>Intent:</span>
              <span className={getScoreColor(currentLeadScore.intent)}>{currentLeadScore.intent}</span>
            </div>
            <div className="flex justify-between">
              <span>Fit:</span>
              <span className={getScoreColor(currentLeadScore.fit)}>{currentLeadScore.fit}</span>
            </div>
            <div className="flex justify-between">
              <span>Urgency:</span>
              <span className={getScoreColor(currentLeadScore.urgency)}>{currentLeadScore.urgency}</span>
            </div>
          </div>
        </div>

        {/* Next Best Action */}
        <div className="bg-black/20 rounded p-3">
          <h4 className="font-semibold text-blue-200 mb-2">Next Best Action</h4>
          <p className="text-xs">{currentLeadScore.nextBestAction}</p>
        </div>

        {/* Top Insights */}
        {leadInsights.length > 0 && (
          <div className="bg-black/20 rounded p-3">
            <h4 className="font-semibold text-blue-200 mb-2">Key Insights</h4>
            <div className="space-y-2">
              {leadInsights.slice(0, 2).map((insight, index) => (
                <div key={index} className="text-xs">
                  <div className={`flex items-center ${
                    insight.urgency === 'high' ? 'text-red-300' :
                    insight.urgency === 'medium' ? 'text-yellow-300' : 'text-green-300'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                    <span className="text-white">{insight.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reasoning */}
        {currentLeadScore.reasoning.length > 0 && (
          <div className="bg-black/20 rounded p-3">
            <h4 className="font-semibold text-blue-200 mb-2">AI Reasoning</h4>
            <div className="space-y-1">
              {currentLeadScore.reasoning.slice(0, 2).map((reason, index) => (
                <div key={index} className="text-xs text-blue-100">
                  • {reason}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILeadScoringEngine;

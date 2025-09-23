import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAdvancedAnalytics } from './AdvancedAnalytics';
import { usePersonalization } from './PersonalizationEngine';

// Types for AI-powered features
interface UserBehaviorPattern {
  sessionDuration: number;
  pageViews: number;
  scrollDepth: number;
  clickPattern: string[];
  timeOnPages: Map<string, number>;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  trafficSource: string;
  conversionEvents: number;
  engagementScore: number;
}

interface PredictiveModel {
  conversionProbability: number;
  recommendedContent: string[];
  optimalTiming: number;
  preferredCTAs: string[];
  riskFactors: string[];
  nextBestAction: 'nurture' | 'convert' | 'educate' | 'qualify';
}

interface AIRecommendation {
  type: 'content' | 'timing' | 'design' | 'offer';
  confidence: number;
  action: string;
  expectedLift: number;
  reasoning: string;
}

interface AIInsight {
  insight: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  category: 'conversion' | 'engagement' | 'retention' | 'acquisition';
}

// AI Models and Algorithms
class AIPersonalizationEngine {
  private static instance: AIPersonalizationEngine;
  private behaviorData: Map<string, UserBehaviorPattern[]> = new Map();
  private modelWeights: Map<string, number> = new Map();
  private conversionFactors: Map<string, number> = new Map();

  constructor() {
    this.initializeModels();
  }

  public static getInstance(): AIPersonalizationEngine {
    if (!AIPersonalizationEngine.instance) {
      AIPersonalizationEngine.instance = new AIPersonalizationEngine();
    }
    return AIPersonalizationEngine.instance;
  }

  private initializeModels(): void {
    // Initialize AI model weights based on historical data
    this.modelWeights.set('sessionDuration', 0.25);
    this.modelWeights.set('scrollDepth', 0.15);
    this.modelWeights.set('pageViews', 0.20);
    this.modelWeights.set('clickPattern', 0.18);
    this.modelWeights.set('trafficSource', 0.12);
    this.modelWeights.set('deviceType', 0.10);

    // Conversion factor weights
    this.conversionFactors.set('email_capture', 0.3);
    this.conversionFactors.set('roi_calculation', 0.4);
    this.conversionFactors.set('contact_form', 0.6);
    this.conversionFactors.set('phone_call', 0.8);
    this.conversionFactors.set('consultation_booking', 1.0);
  }

  public analyzeBehaviorPattern(userId: string, currentSession: any): UserBehaviorPattern {
    const pattern: UserBehaviorPattern = {
      sessionDuration: currentSession.sessionDuration || 0,
      pageViews: currentSession.pageViews || 1,
      scrollDepth: this.calculateAverageScrollDepth(currentSession.events),
      clickPattern: this.extractClickPattern(currentSession.events),
      timeOnPages: this.calculateTimeOnPages(currentSession.events),
      deviceType: this.detectDeviceType(),
      trafficSource: currentSession.source || 'direct',
      conversionEvents: this.countConversionEvents(currentSession.events),
      engagementScore: this.calculateEngagementScore(currentSession)
    };

    // Store pattern for learning
    if (!this.behaviorData.has(userId)) {
      this.behaviorData.set(userId, []);
    }
    this.behaviorData.get(userId)!.push(pattern);

    return pattern;
  }

  public predictConversionProbability(pattern: UserBehaviorPattern): PredictiveModel {
    // AI algorithm to predict conversion probability
    let probability = 0.1; // Base probability

    // Session duration factor (sigmoid function)
    const durationScore = 1 / (1 + Math.exp(-(pattern.sessionDuration - 180) / 60));
    probability += durationScore * 0.3;

    // Engagement score factor
    const engagementScore = Math.min(pattern.engagementScore / 100, 1);
    probability += engagementScore * 0.25;

    // Page views factor (logarithmic)
    const pageViewScore = Math.log(pattern.pageViews + 1) / Math.log(10);
    probability += Math.min(pageViewScore, 1) * 0.2;

    // Scroll depth factor
    probability += pattern.scrollDepth * 0.15;

    // Device type factor
    const deviceMultiplier = pattern.deviceType === 'desktop' ? 1.2 : 
                           pattern.deviceType === 'tablet' ? 1.0 : 0.8;
    probability *= deviceMultiplier;

    // Traffic source factor
    const sourceMultiplier = this.getSourceMultiplier(pattern.trafficSource);
    probability *= sourceMultiplier;

    // Ensure probability is between 0 and 1
    probability = Math.max(0, Math.min(1, probability));

    return {
      conversionProbability: probability,
      recommendedContent: this.getRecommendedContent(pattern, probability),
      optimalTiming: this.calculateOptimalTiming(pattern),
      preferredCTAs: this.getPreferredCTAs(pattern),
      riskFactors: this.identifyRiskFactors(pattern),
      nextBestAction: this.determineNextBestAction(pattern, probability)
    };
  }

  private calculateAverageScrollDepth(events: any[]): number {
    const scrollEvents = events.filter(e => e.eventType === 'SCROLL_DEPTH');
    if (scrollEvents.length === 0) return 0;
    
    const totalScroll = scrollEvents.reduce((sum, e) => sum + (e.eventData.scrollPercentage || 0), 0);
    return totalScroll / scrollEvents.length / 100;
  }

  private extractClickPattern(events: any[]): string[] {
    return events
      .filter(e => e.eventType === 'BUTTON_CLICK')
      .map(e => e.eventData.buttonText || 'unknown')
      .slice(-10); // Last 10 clicks
  }

  private calculateTimeOnPages(events: any[]): Map<string, number> {
    const timeMap = new Map<string, number>();
    const pageViews = events.filter(e => e.eventType === 'PAGE_VIEW');
    
    pageViews.forEach((event, index) => {
      const pageUrl = event.eventData.pageUrl || '/';
      const timeOnPage = index < pageViews.length - 1 
        ? pageViews[index + 1].timestamp - event.timestamp
        : 60000; // Default 1 minute for last page
      
      timeMap.set(pageUrl, (timeMap.get(pageUrl) || 0) + timeOnPage);
    });

    return timeMap;
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private countConversionEvents(events: any[]): number {
    const conversionEventTypes = ['FORM_SUBMIT', 'EMAIL_CAPTURE', 'ROI_CALCULATION'];
    return events.filter(e => conversionEventTypes.includes(e.eventType)).length;
  }

  private calculateEngagementScore(session: any): number {
    let score = 0;
    
    // Time-based engagement
    score += Math.min(session.sessionDuration / 300, 1) * 30; // Max 30 points for 5+ minutes
    
    // Page view engagement
    score += Math.min(session.pageViews * 5, 25); // Max 25 points for 5+ pages
    
    // Event engagement
    score += Math.min(session.events.length * 2, 30); // Max 30 points for 15+ events
    
    // Conversion events
    const conversionEvents = this.countConversionEvents(session.events);
    score += conversionEvents * 15; // 15 points per conversion event

    return Math.min(score, 100);
  }

  private getSourceMultiplier(source: string): number {
    const multipliers: Record<string, number> = {
      'google': 1.3,
      'linkedin': 1.4,
      'direct': 1.1,
      'referral': 1.2,
      'facebook': 0.9,
      'twitter': 0.8,
      'email': 1.5
    };
    return multipliers[source.toLowerCase()] || 1.0;
  }

  private getRecommendedContent(pattern: UserBehaviorPattern, probability: number): string[] {
    const recommendations: string[] = [];

    if (probability > 0.7) {
      recommendations.push('pricing-page', 'case-studies', 'testimonials', 'contact-form');
    } else if (probability > 0.4) {
      recommendations.push('roi-calculator', 'features-comparison', 'demo-video', 'lead-magnet');
    } else {
      recommendations.push('educational-content', 'about-us', 'blog-posts', 'free-resources');
    }

    // Device-specific recommendations
    if (pattern.deviceType === 'mobile') {
      recommendations.push('mobile-optimized-forms', 'click-to-call', 'mobile-testimonials');
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  private calculateOptimalTiming(pattern: UserBehaviorPattern): number {
    // Calculate optimal timing for showing CTAs/popups (in seconds)
    const baseTime = 30; // 30 seconds base
    
    if (pattern.engagementScore > 70) return baseTime;
    if (pattern.engagementScore > 40) return baseTime * 1.5;
    return baseTime * 2;
  }

  private getPreferredCTAs(pattern: UserBehaviorPattern): string[] {
    const ctas: string[] = [];

    if (pattern.deviceType === 'mobile') {
      ctas.push('Call Now', 'Get Quote', 'WhatsApp Us');
    } else {
      ctas.push('Get Free Consultation', 'Calculate ROI', 'Download Guide');
    }

    if (pattern.conversionEvents > 0) {
      ctas.push('Book Meeting', 'Start Project', 'Get Custom Quote');
    }

    return ctas;
  }

  private identifyRiskFactors(pattern: UserBehaviorPattern): string[] {
    const risks: string[] = [];

    if (pattern.sessionDuration < 60) risks.push('short-session');
    if (pattern.scrollDepth < 0.3) risks.push('low-engagement');
    if (pattern.pageViews === 1) risks.push('single-page-visit');
    if (pattern.clickPattern.length === 0) risks.push('no-interactions');
    if (pattern.deviceType === 'mobile' && pattern.sessionDuration > 300) risks.push('mobile-fatigue');

    return risks;
  }

  private determineNextBestAction(pattern: UserBehaviorPattern, probability: number): 'nurture' | 'convert' | 'educate' | 'qualify' {
    if (probability > 0.7) return 'convert';
    if (probability > 0.4 && pattern.conversionEvents > 0) return 'qualify';
    if (pattern.engagementScore > 50) return 'nurture';
    return 'educate';
  }

  public generateRecommendations(pattern: UserBehaviorPattern, model: PredictiveModel): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // Content recommendations
    if (model.conversionProbability > 0.6) {
      recommendations.push({
        type: 'content',
        confidence: 0.85,
        action: 'Show pricing and case studies prominently',
        expectedLift: 0.25,
        reasoning: 'High conversion probability indicates ready-to-buy user'
      });
    }

    // Timing recommendations
    if (pattern.sessionDuration < 120) {
      recommendations.push({
        type: 'timing',
        confidence: 0.72,
        action: 'Delay popup by 60 seconds',
        expectedLift: 0.15,
        reasoning: 'User needs more time to engage with content'
      });
    }

    // Design recommendations
    if (pattern.deviceType === 'mobile') {
      recommendations.push({
        type: 'design',
        confidence: 0.90,
        action: 'Use larger buttons and simplified forms',
        expectedLift: 0.35,
        reasoning: 'Mobile users prefer streamlined interfaces'
      });
    }

    // Offer recommendations
    if (model.riskFactors.includes('price-sensitive')) {
      recommendations.push({
        type: 'offer',
        confidence: 0.68,
        action: 'Highlight ROI calculator and free consultation',
        expectedLift: 0.20,
        reasoning: 'Price-sensitive users respond to value demonstration'
      });
    }

    return recommendations.sort((a, b) => b.expectedLift - a.expectedLift);
  }

  public generateInsights(userId: string): AIInsight[] {
    const userPatterns = this.behaviorData.get(userId) || [];
    if (userPatterns.length === 0) return [];

    const insights: AIInsight[] = [];
    const latestPattern = userPatterns[userPatterns.length - 1];

    // Engagement insights
    if (latestPattern.engagementScore > 70) {
      insights.push({
        insight: 'User shows high engagement - prime for conversion',
        confidence: 0.88,
        impact: 'high',
        actionable: true,
        category: 'conversion'
      });
    }

    // Behavior pattern insights
    if (userPatterns.length > 3) {
      const avgSessionDuration = userPatterns.reduce((sum, p) => sum + p.sessionDuration, 0) / userPatterns.length;
      if (avgSessionDuration > 240) {
        insights.push({
          insight: 'User consistently spends significant time - interested prospect',
          confidence: 0.82,
          impact: 'high',
          actionable: true,
          category: 'acquisition'
        });
      }
    }

    // Device preference insights
    const mobileVisits = userPatterns.filter(p => p.deviceType === 'mobile').length;
    if (mobileVisits / userPatterns.length > 0.7) {
      insights.push({
        insight: 'User prefers mobile - optimize for mobile experience',
        confidence: 0.95,
        impact: 'medium',
        actionable: true,
        category: 'engagement'
      });
    }

    return insights;
  }
}

// React Context
const AIPersonalizationContext = createContext<{
  behaviorPattern: UserBehaviorPattern | null;
  predictiveModel: PredictiveModel | null;
  recommendations: AIRecommendation[];
  insights: AIInsight[];
  isLoading: boolean;
} | null>(null);

// Provider Component
export const AIPersonalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [behaviorPattern, setBehaviorPattern] = useState<UserBehaviorPattern | null>(null);
  const [predictiveModel, setPredictiveModel] = useState<PredictiveModel | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { metrics, session } = useAdvancedAnalytics();
  const { userProfile } = usePersonalization();
  const aiEngine = AIPersonalizationEngine.getInstance();

  useEffect(() => {
    if (session && metrics) {
      setIsLoading(true);
      
      // Analyze current behavior pattern
      const pattern = aiEngine.analyzeBehaviorPattern(userProfile.id, {
        sessionDuration: metrics.sessionDuration,
        pageViews: metrics.pageViews,
        events: session.events,
        source: session.source
      });
      
      setBehaviorPattern(pattern);

      // Generate predictive model
      const model = aiEngine.predictConversionProbability(pattern);
      setPredictiveModel(model);

      // Generate recommendations
      const recs = aiEngine.generateRecommendations(pattern, model);
      setRecommendations(recs);

      // Generate insights
      const insightData = aiEngine.generateInsights(userProfile.id);
      setInsights(insightData);

      setIsLoading(false);
    }
  }, [session, metrics, userProfile, aiEngine]);

  return (
    <AIPersonalizationContext.Provider
      value={{
        behaviorPattern,
        predictiveModel,
        recommendations,
        insights,
        isLoading
      }}
    >
      {children}
    </AIPersonalizationContext.Provider>
  );
};

// Hook
export const useAIPersonalization = () => {
  const context = useContext(AIPersonalizationContext);
  if (!context) {
    throw new Error('useAIPersonalization must be used within AIPersonalizationProvider');
  }
  return context;
};

// AI Dashboard Component
export const AIDashboard: React.FC = () => {
  const { behaviorPattern, predictiveModel, recommendations, insights, isLoading } = useAIPersonalization();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showDashboard = localStorage.getItem('show_ai_dashboard') === 'true';
    setIsVisible(import.meta.env.DEV && showDashboard);
  }, []);

  if (!isVisible || isLoading) return null;

  return (
    <div className="fixed top-4 right-80 z-50 bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-lg shadow-2xl p-4 w-96 border border-purple-600 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white flex items-center">
          🤖 AI Personalization
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-purple-300 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        {/* Conversion Probability */}
        {predictiveModel && (
          <div className="bg-black/20 rounded p-3">
            <h4 className="font-semibold text-purple-200 mb-2">🎯 Prediction Model</h4>
            <div className="flex justify-between">
              <span>Conversion Probability:</span>
              <span className={`font-bold ${
                predictiveModel.conversionProbability > 0.7 ? 'text-green-400' :
                predictiveModel.conversionProbability > 0.4 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {(predictiveModel.conversionProbability * 100).toFixed(1)}%
              </span>
            </div>
            <div className="mt-2">
              <span className="text-purple-300">Next Action: </span>
              <span className="font-semibold capitalize">{predictiveModel.nextBestAction}</span>
            </div>
          </div>
        )}

        {/* Top Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-black/20 rounded p-3">
            <h4 className="font-semibold text-purple-200 mb-2">💡 AI Recommendations</h4>
            <div className="space-y-2">
              {recommendations.slice(0, 2).map((rec, index) => (
                <div key={index} className="text-xs">
                  <div className="font-medium">{rec.action}</div>
                  <div className="text-purple-300">
                    Confidence: {(rec.confidence * 100).toFixed(0)}% | 
                    Lift: +{(rec.expectedLift * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights */}
        {insights.length > 0 && (
          <div className="bg-black/20 rounded p-3">
            <h4 className="font-semibold text-purple-200 mb-2">🧠 AI Insights</h4>
            <div className="space-y-1">
              {insights.slice(0, 2).map((insight, index) => (
                <div key={index} className="text-xs">
                  <div className={`flex items-center ${
                    insight.impact === 'high' ? 'text-red-300' :
                    insight.impact === 'medium' ? 'text-yellow-300' : 'text-green-300'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                    {insight.insight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Behavior Pattern Summary */}
        {behaviorPattern && (
          <div className="bg-black/20 rounded p-3">
            <h4 className="font-semibold text-purple-200 mb-2">📊 Behavior Analysis</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-purple-300">Engagement:</span>
                <span className="ml-1 font-semibold">{behaviorPattern.engagementScore}/100</span>
              </div>
              <div>
                <span className="text-purple-300">Device:</span>
                <span className="ml-1 font-semibold capitalize">{behaviorPattern.deviceType}</span>
              </div>
              <div>
                <span className="text-purple-300">Pages:</span>
                <span className="ml-1 font-semibold">{behaviorPattern.pageViews}</span>
              </div>
              <div>
                <span className="text-purple-300">Scroll:</span>
                <span className="ml-1 font-semibold">{(behaviorPattern.scrollDepth * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPersonalizationEngine;

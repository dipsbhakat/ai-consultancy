import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAdvancedAnalytics } from './AdvancedAnalytics';
import { useAIPersonalization } from './AIPersonalizationEngine';
import { useLeadScoring } from './AILeadScoring';

// Types
interface PredictiveInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  actionItems: string[];
  metrics: {
    currentValue: number;
    predictedValue: number;
    improvementPotential: number;
  };
  createdAt: number;
}

interface MarketTrend {
  industry: string;
  trend: string;
  direction: 'up' | 'down' | 'stable';
  confidence: number;
  impact: number;
  timeframe: string;
}

interface CompetitiveIntelligence {
  competitors: string[];
  marketPosition: 'leader' | 'challenger' | 'follower';
  strengthAreas: string[];
  improvementAreas: string[];
  opportunities: string[];
  threats: string[];
}

interface AIStrategy {
  businessGoals: string[];
  recommendedTactics: string[];
  timelineWeeks: number;
  expectedROI: number;
  riskFactors: string[];
  successMetrics: string[];
}

interface PredictiveModel {
  name: string;
  type: 'conversion' | 'churn' | 'value' | 'engagement';
  accuracy: number;
  lastTrained: number;
  features: string[];
  predictions: {
    next7Days: number;
    next30Days: number;
    next90Days: number;
  };
}

// Advanced AI Analytics Engine
class EnterpriseAIEngine {
  private static instance: EnterpriseAIEngine;
  private models: Map<string, PredictiveModel> = new Map();
  private marketData: MarketTrend[] = [];

  public static getInstance(): EnterpriseAIEngine {
    if (!EnterpriseAIEngine.instance) {
      EnterpriseAIEngine.instance = new EnterpriseAIEngine();
    }
    return EnterpriseAIEngine.instance;
  }

  constructor() {
    this.initializeModels();
    this.loadMarketData();
  }

  private initializeModels(): void {
    // Conversion Prediction Model
    this.models.set('conversion', {
      name: 'Lead Conversion Predictor',
      type: 'conversion',
      accuracy: 0.87,
      lastTrained: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
      features: ['page_views', 'time_on_site', 'content_engagement', 'lead_score', 'industry'],
      predictions: {
        next7Days: 23,
        next30Days: 89,
        next90Days: 267
      }
    });

    // Customer Value Model
    this.models.set('value', {
      name: 'Customer Lifetime Value',
      type: 'value',
      accuracy: 0.82,
      lastTrained: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
      features: ['company_size', 'industry', 'engagement_level', 'budget_range', 'urgency'],
      predictions: {
        next7Days: 45000,
        next30Days: 180000,
        next90Days: 540000
      }
    });

    // Engagement Prediction Model
    this.models.set('engagement', {
      name: 'Engagement Optimizer',
      type: 'engagement',
      accuracy: 0.91,
      lastTrained: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
      features: ['content_type', 'user_behavior', 'time_of_day', 'device_type', 'traffic_source'],
      predictions: {
        next7Days: 15.7, // engagement rate %
        next30Days: 18.2,
        next90Days: 22.1
      }
    });

    // Churn Risk Model
    this.models.set('churn', {
      name: 'Lead Churn Predictor',
      type: 'churn',
      accuracy: 0.85,
      lastTrained: Date.now() - 18 * 60 * 60 * 1000, // 18 hours ago
      features: ['days_since_contact', 'engagement_decline', 'competitor_research', 'response_time'],
      predictions: {
        next7Days: 8, // % at risk
        next30Days: 15,
        next90Days: 28
      }
    });
  }

  private loadMarketData(): void {
    this.marketData = [
      {
        industry: 'AI Consulting',
        trend: 'Increased demand for AI implementation',
        direction: 'up',
        confidence: 0.92,
        impact: 85,
        timeframe: 'Next 6 months'
      },
      {
        industry: 'Enterprise Software',
        trend: 'Shift towards AI-powered solutions',
        direction: 'up',
        confidence: 0.88,
        impact: 78,
        timeframe: 'Next 12 months'
      },
      {
        industry: 'SMB Market',
        trend: 'Growing awareness of AI benefits',
        direction: 'up',
        confidence: 0.75,
        impact: 65,
        timeframe: 'Next 18 months'
      }
    ];
  }

  public generatePredictiveInsights(_userData: any, _businessData: any): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];

    // Revenue Opportunity Insight
    insights.push({
      id: 'revenue-opportunity-1',
      type: 'opportunity',
      title: 'High-Value Lead Surge Predicted',
      description: 'AI models predict a 340% increase in enterprise leads from manufacturing sector in the next 30 days',
      confidence: 0.89,
      impact: 'high',
      timeframe: 'Next 30 days',
      actionItems: [
        'Prepare manufacturing-specific case studies',
        'Allocate additional sales resources',
        'Create targeted LinkedIn campaigns for manufacturing executives',
        'Develop industry-specific ROI calculators'
      ],
      metrics: {
        currentValue: 12000, // monthly revenue
        predictedValue: 52800,
        improvementPotential: 340
      },
      createdAt: Date.now()
    });

    // Conversion Optimization Insight
    insights.push({
      id: 'conversion-opt-1',
      type: 'recommendation',
      title: 'AI Chatbot Timing Optimization',
      description: 'Adjusting chatbot engagement timing could increase conversion rates by 45% based on user behavior patterns',
      confidence: 0.83,
      impact: 'high',
      timeframe: 'Immediate',
      actionItems: [
        'Deploy chatbot after 45 seconds instead of 30 seconds',
        'Add exit-intent trigger for mobile users',
        'Personalize greeting based on traffic source',
        'Implement A/B test for different timing strategies'
      ],
      metrics: {
        currentValue: 3.2, // conversion rate %
        predictedValue: 4.64,
        improvementPotential: 45
      },
      createdAt: Date.now()
    });

    // Risk Mitigation Insight
    insights.push({
      id: 'churn-risk-1',
      type: 'risk',
      title: 'Lead Churn Risk Detected',
      description: '23% of high-value leads show early disengagement signals. Immediate re-engagement required.',
      confidence: 0.91,
      impact: 'high',
      timeframe: 'Next 7 days',
      actionItems: [
        'Send personalized follow-up emails to at-risk leads',
        'Offer exclusive consultation sessions',
        'Deploy retargeting campaigns with value propositions',
        'Have senior consultants make direct outreach calls'
      ],
      metrics: {
        currentValue: 89000, // potential lost revenue
        predictedValue: 26700, // with intervention
        improvementPotential: 70 // % saved
      },
      createdAt: Date.now()
    });

    // Market Trend Insight
    insights.push({
      id: 'market-trend-1',
      type: 'trend',
      title: 'AI Adoption Acceleration in Healthcare',
      description: 'Healthcare sector showing 280% increase in AI solution searches. New market opportunity identified.',
      confidence: 0.87,
      impact: 'medium',
      timeframe: 'Next 90 days',
      actionItems: [
        'Develop healthcare-specific AI use cases',
        'Partner with healthcare technology vendors',
        'Create compliance-focused content',
        'Build healthcare vertical expertise'
      ],
      metrics: {
        currentValue: 5, // healthcare leads per month
        predictedValue: 19,
        improvementPotential: 280
      },
      createdAt: Date.now()
    });

    // Content Performance Insight
    insights.push({
      id: 'content-performance-1',
      type: 'opportunity',
      title: 'Video Content Performance Surge',
      description: 'AI analysis shows video content generates 520% more engagement than text-based content',
      confidence: 0.94,
      impact: 'medium',
      timeframe: 'Next 60 days',
      actionItems: [
        'Increase video content production by 200%',
        'Create AI explainer video series',
        'Implement video testimonials on landing pages',
        'Add interactive video demos to service pages'
      ],
      metrics: {
        currentValue: 2.1, // engagement rate %
        predictedValue: 13.02,
        improvementPotential: 520
      },
      createdAt: Date.now()
    });

    return insights;
  }

  public analyzeCompetitivePosition(): CompetitiveIntelligence {
    return {
      competitors: ['McKinsey Digital', 'Deloitte AI', 'BCG Gamma', 'Accenture Applied Intelligence'],
      marketPosition: 'challenger',
      strengthAreas: [
        'Personalized AI implementation approach',
        'Rapid deployment capabilities',
        'Industry-specific solutions',
        'Cost-effective pricing model'
      ],
      improvementAreas: [
        'Brand recognition',
        'Enterprise-scale project experience',
        'Global delivery capabilities',
        'Technology partnerships'
      ],
      opportunities: [
        'SMB market penetration',
        'Vertical specialization (healthcare, manufacturing)',
        'AI ethics and compliance consulting',
        'Hybrid AI-human solution models'
      ],
      threats: [
        'Large consulting firms expanding AI practices',
        'Technology vendors moving up the value chain',
        'Economic downturn reducing AI investments',
        'Regulatory changes affecting AI adoption'
      ]
    };
  }

  public generateAIStrategy(businessGoals: string[]): AIStrategy {
    const strategies = {
      'increase_revenue': {
        tactics: [
          'Implement predictive lead scoring with 90%+ accuracy',
          'Deploy AI-powered dynamic pricing optimization',
          'Create personalized customer journey automation',
          'Launch AI-driven upselling campaigns'
        ],
        timeline: 12,
        roi: 245
      },
      'improve_efficiency': {
        tactics: [
          'Automate routine consulting tasks with AI',
          'Implement intelligent resource allocation',
          'Deploy AI-powered project management',
          'Create automated reporting and insights'
        ],
        timeline: 8,
        roi: 180
      },
      'enhance_customer_experience': {
        tactics: [
          'Deploy advanced AI chatbots with NLP',
          'Implement predictive customer support',
          'Create personalized content recommendations',
          'Launch AI-powered feedback analysis'
        ],
        timeline: 10,
        roi: 165
      }
    };

    const primaryGoal = businessGoals[0] || 'increase_revenue';
    const strategy = strategies[primaryGoal as keyof typeof strategies] || strategies.increase_revenue;

    return {
      businessGoals,
      recommendedTactics: strategy.tactics,
      timelineWeeks: strategy.timeline,
      expectedROI: strategy.roi,
      riskFactors: [
        'Technology adoption resistance',
        'Data quality and availability',
        'Skill gap in AI implementation',
        'Integration complexity with existing systems'
      ],
      successMetrics: [
        'Lead conversion rate improvement',
        'Customer acquisition cost reduction',
        'Time to value acceleration',
        'Customer satisfaction score increase'
      ]
    };
  }

  public getModels(): Map<string, PredictiveModel> {
    return this.models;
  }

  public getMarketTrends(): MarketTrend[] {
    return this.marketData;
  }

  public updateModel(modelId: string, accuracy: number): void {
    const model = this.models.get(modelId);
    if (model) {
      model.accuracy = accuracy;
      model.lastTrained = Date.now();
      this.models.set(modelId, model);
    }
  }

  public trainModel(modelId: string, _trainingData: any[]): Promise<number> {
    return new Promise((resolve) => {
      // Simulate model training
      setTimeout(() => {
        const accuracy = 0.85 + Math.random() * 0.1; // 85-95% accuracy
        this.updateModel(modelId, accuracy);
        resolve(accuracy);
      }, 2000);
    });
  }
}

// React Context
const EnterpriseAIContext = createContext<{
  insights: PredictiveInsight[];
  models: Map<string, PredictiveModel>;
  marketTrends: MarketTrend[];
  competitiveIntel: CompetitiveIntelligence | null;
  aiStrategy: AIStrategy | null;
  refreshInsights: () => void;
  trainModel: (modelId: string) => Promise<void>;
} | null>(null);

// Provider Component
export const EnterpriseAIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [models, setModels] = useState<Map<string, PredictiveModel>>(new Map());
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [competitiveIntel, setCompetitiveIntel] = useState<CompetitiveIntelligence | null>(null);
  const [aiStrategy, setAIStrategy] = useState<AIStrategy | null>(null);

  const { session, metrics } = useAdvancedAnalytics();
  const { behaviorPattern } = useAIPersonalization();
  const { currentLeadScore } = useLeadScoring();

  const enterpriseEngine = EnterpriseAIEngine.getInstance();

  useEffect(() => {
    // Initialize enterprise AI features
    const initializeEnterpriseAI = () => {
      // Generate insights based on current data
      const userData = { session, metrics, behaviorPattern, leadScore: currentLeadScore };
      const businessData = { goals: ['increase_revenue', 'improve_efficiency'] };
      
      const generatedInsights = enterpriseEngine.generatePredictiveInsights(userData, businessData);
      setInsights(generatedInsights);

      // Load models and market data
      setModels(new Map(enterpriseEngine.getModels()));
      setMarketTrends(enterpriseEngine.getMarketTrends());

      // Analyze competitive position
      const competitive = enterpriseEngine.analyzeCompetitivePosition();
      setCompetitiveIntel(competitive);

      // Generate AI strategy
      const strategy = enterpriseEngine.generateAIStrategy(['increase_revenue', 'enhance_customer_experience']);
      setAIStrategy(strategy);
    };

    initializeEnterpriseAI();

    // Refresh insights every 30 minutes
    const interval = setInterval(() => {
      initializeEnterpriseAI();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [session, metrics, behaviorPattern, currentLeadScore, enterpriseEngine]);

  const refreshInsights = () => {
    const userData = { session, metrics, behaviorPattern, leadScore: currentLeadScore };
    const businessData = { goals: ['increase_revenue', 'improve_efficiency'] };
    
    const generatedInsights = enterpriseEngine.generatePredictiveInsights(userData, businessData);
    setInsights(generatedInsights);
  };

  const trainModel = async (modelId: string): Promise<void> => {
    try {
      const accuracy = await enterpriseEngine.trainModel(modelId, []);
      setModels(new Map(enterpriseEngine.getModels()));
      console.log(`Model ${modelId} trained with accuracy: ${(accuracy * 100).toFixed(1)}%`);
    } catch (error) {
      console.error(`Failed to train model ${modelId}:`, error);
    }
  };

  return (
    <EnterpriseAIContext.Provider
      value={{
        insights,
        models,
        marketTrends,
        competitiveIntel,
        aiStrategy,
        refreshInsights,
        trainModel
      }}
    >
      {children}
    </EnterpriseAIContext.Provider>
  );
};

// Hook
export const useEnterpriseAI = () => {
  const context = useContext(EnterpriseAIContext);
  if (!context) {
    throw new Error('useEnterpriseAI must be used within EnterpriseAIProvider');
  }
  return context;
};

// Enterprise AI Dashboard
export const EnterpriseAIDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');
  const { insights, models, competitiveIntel, aiStrategy, refreshInsights, trainModel } = useEnterpriseAI();

  useEffect(() => {
    const showDashboard = localStorage.getItem('show_enterprise_ai_dashboard') === 'true';
    setIsVisible(import.meta.env.DEV && showDashboard);
  }, []);

  if (!isVisible) return null;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-100';
      case 'medium': return 'text-yellow-400 bg-yellow-100';
      case 'low': return 'text-green-400 bg-green-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return '🚀';
      case 'risk': return '⚠️';
      case 'trend': return '📈';
      case 'recommendation': return '💡';
      default: return '📊';
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-lg shadow-2xl p-4 w-96 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white flex items-center">
          🏢 Enterprise AI
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshInsights}
            className="text-indigo-300 hover:text-white text-sm"
            title="Refresh Insights"
          >
            🔄
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-indigo-300 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-black/20 rounded p-1">
        {[
          { id: 'insights', label: 'Insights' },
          { id: 'models', label: 'Models' },
          { id: 'strategy', label: 'Strategy' },
          { id: 'competitive', label: 'Intel' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-700'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-3 text-sm">
        {activeTab === 'insights' && (
          <div className="space-y-3">
            <div className="text-xs text-purple-200 mb-2">
              Predictive Insights ({insights.length})
            </div>
            {insights.slice(0, 3).map(insight => (
              <div key={insight.id} className="bg-black/20 rounded p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span>{getTypeIcon(insight.type)}</span>
                    <h4 className="font-semibold text-purple-200 text-xs">{insight.title}</h4>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getImpactColor(insight.impact)}`}>
                    {insight.impact}
                  </span>
                </div>
                <p className="text-xs text-purple-100 mb-2">{insight.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-purple-300">
                    Confidence: {(insight.confidence * 100).toFixed(0)}%
                  </span>
                  <span className="text-purple-300">
                    {insight.timeframe}
                  </span>
                </div>
                <div className="mt-2 text-xs">
                  <span className="text-green-300">
                    +{insight.metrics.improvementPotential}% improvement potential
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'models' && (
          <div className="space-y-3">
            <div className="text-xs text-purple-200 mb-2">
              AI Models ({models.size})
            </div>
            {Array.from(models.entries()).map(([id, model]) => (
              <div key={id} className="bg-black/20 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-purple-200 text-xs">{model.name}</h4>
                  <button
                    onClick={() => trainModel(id)}
                    className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
                  >
                    Retrain
                  </button>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Accuracy:</span>
                    <span className="text-green-300">{(model.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Type:</span>
                    <span className="text-purple-100">{model.type}</span>
                  </div>
                  <div className="text-purple-300">Predictions:</div>
                  <div className="ml-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-purple-300">7 days:</span>
                      <span className="text-purple-100">{model.predictions.next7Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">30 days:</span>
                      <span className="text-purple-100">{model.predictions.next30Days}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'strategy' && aiStrategy && (
          <div className="space-y-3">
            <div className="text-xs text-purple-200 mb-2">
              AI Strategy Recommendations
            </div>
            <div className="bg-black/20 rounded p-3">
              <h4 className="font-semibold text-purple-200 text-xs mb-2">Business Goals</h4>
              <ul className="text-xs text-purple-100 space-y-1 mb-3">
                {aiStrategy.businessGoals.map((goal, index) => (
                  <li key={index}>• {goal.replace('_', ' ')}</li>
                ))}
              </ul>
              
              <h4 className="font-semibold text-purple-200 text-xs mb-2">Recommended Tactics</h4>
              <ul className="text-xs text-purple-100 space-y-1 mb-3">
                {aiStrategy.recommendedTactics.slice(0, 3).map((tactic, index) => (
                  <li key={index}>• {tactic}</li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-purple-300">Timeline:</span>
                  <span className="text-purple-100 ml-1">{aiStrategy.timelineWeeks}w</span>
                </div>
                <div>
                  <span className="text-purple-300">Expected ROI:</span>
                  <span className="text-green-300 ml-1">{aiStrategy.expectedROI}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitive' && competitiveIntel && (
          <div className="space-y-3">
            <div className="text-xs text-purple-200 mb-2">
              Competitive Intelligence
            </div>
            <div className="bg-black/20 rounded p-3">
              <div className="mb-3">
                <h4 className="font-semibold text-purple-200 text-xs mb-1">Market Position</h4>
                <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                  {competitiveIntel.marketPosition}
                </span>
              </div>

              <div className="mb-3">
                <h4 className="font-semibold text-purple-200 text-xs mb-1">Strengths</h4>
                <ul className="text-xs text-green-300 space-y-1">
                  {competitiveIntel.strengthAreas.slice(0, 2).map((strength, index) => (
                    <li key={index}>• {strength}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-3">
                <h4 className="font-semibold text-purple-200 text-xs mb-1">Opportunities</h4>
                <ul className="text-xs text-blue-300 space-y-1">
                  {competitiveIntel.opportunities.slice(0, 2).map((opportunity, index) => (
                    <li key={index}>• {opportunity}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-purple-200 text-xs mb-1">Key Competitors</h4>
                <div className="text-xs text-purple-100">
                  {competitiveIntel.competitors.slice(0, 2).join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseAIEngine;

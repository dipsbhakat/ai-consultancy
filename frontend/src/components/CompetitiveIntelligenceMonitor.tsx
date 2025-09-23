import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, DollarSign, Users, Star, AlertCircle, Shield, Zap } from 'lucide-react';

// Types
interface Competitor {
  id: string;
  name: string;
  domain: string;
  marketShare: number;
  pricing: {
    tier: string;
    price: number;
    features: string[];
  }[];
  strengths: string[];
  weaknesses: string[];
  recentActivity: CompetitorActivity[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  sentiment: number; // -1 to 1
}

interface CompetitorActivity {
  id: string;
  type: 'pricing' | 'feature' | 'marketing' | 'partnership' | 'funding';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  timestamp: number;
  source: string;
}

interface MarketTrend {
  id: string;
  category: string;
  trend: string;
  direction: 'up' | 'down' | 'stable';
  impact: number; // 1-10
  confidence: number; // 0-1
  timeframe: string;
  description: string;
}

interface CompetitiveGap {
  id: string;
  area: string;
  gap: 'advantage' | 'disadvantage' | 'parity';
  severity: number; // 1-10
  recommendation: string;
  effort: 'low' | 'medium' | 'high';
  timeToImplement: string;
}

// Competitive Intelligence Engine
class CompetitiveIntelligenceEngine {
  private static instance: CompetitiveIntelligenceEngine;

  public static getInstance(): CompetitiveIntelligenceEngine {
    if (!CompetitiveIntelligenceEngine.instance) {
      CompetitiveIntelligenceEngine.instance = new CompetitiveIntelligenceEngine();
    }
    return CompetitiveIntelligenceEngine.instance;
  }

  public getCompetitors(): Competitor[] {
    return [
      {
        id: 'competitor_a',
        name: 'MarketLeader Corp',
        domain: 'marketleader.com',
        marketShare: 35.2,
        pricing: [
          {
            tier: 'Starter',
            price: 49,
            features: ['Basic Analytics', 'Email Support', '5 Projects']
          },
          {
            tier: 'Professional',
            price: 149,
            features: ['Advanced Analytics', 'Priority Support', 'Unlimited Projects', 'API Access']
          },
          {
            tier: 'Enterprise',
            price: 299,
            features: ['Custom Analytics', '24/7 Support', 'White Label', 'Dedicated Manager']
          }
        ],
        strengths: ['Market Leader', 'Strong Brand', 'Extensive Features', 'Large Customer Base'],
        weaknesses: ['High Pricing', 'Complex UI', 'Slow Innovation', 'Poor Mobile Experience'],
        recentActivity: [
          {
            id: 'activity_1',
            type: 'pricing',
            title: 'Price Increase Announced',
            description: '15% price increase across all tiers effective next quarter',
            impact: 'high',
            timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
            source: 'Company Blog'
          },
          {
            id: 'activity_2',
            type: 'feature',
            title: 'AI Integration Launch',
            description: 'Launched new AI-powered analytics dashboard',
            impact: 'medium',
            timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
            source: 'Product Updates'
          }
        ],
        threatLevel: 'high',
        sentiment: 0.3
      },
      {
        id: 'competitor_b',
        name: 'FastGrowing Inc',
        domain: 'fastgrowing.io',
        marketShare: 18.7,
        pricing: [
          {
            tier: 'Free',
            price: 0,
            features: ['Basic Features', 'Community Support', '1 Project']
          },
          {
            tier: 'Pro',
            price: 79,
            features: ['Advanced Features', 'Email Support', '10 Projects']
          },
          {
            tier: 'Business',
            price: 199,
            features: ['All Features', 'Priority Support', 'Unlimited Projects']
          }
        ],
        strengths: ['Aggressive Pricing', 'Modern UI', 'Fast Development', 'Strong Social Media'],
        weaknesses: ['Limited Features', 'New to Market', 'Unproven Scale', 'Limited Integrations'],
        recentActivity: [
          {
            id: 'activity_3',
            type: 'funding',
            title: 'Series B Funding',
            description: 'Raised $25M Series B led by top VC firm',
            impact: 'high',
            timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
            source: 'TechCrunch'
          },
          {
            id: 'activity_4',
            type: 'partnership',
            title: 'Integration Partnership',
            description: 'Announced strategic partnership with major CRM provider',
            impact: 'medium',
            timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
            source: 'Press Release'
          }
        ],
        threatLevel: 'medium',
        sentiment: 0.7
      },
      {
        id: 'competitor_c',
        name: 'NicheMaster Ltd',
        domain: 'nichemaster.com',
        marketShare: 12.4,
        pricing: [
          {
            tier: 'Basic',
            price: 29,
            features: ['Core Features', 'Email Support']
          },
          {
            tier: 'Advanced',
            price: 89,
            features: ['All Features', 'Phone Support', 'Custom Reports']
          }
        ],
        strengths: ['Industry Expertise', 'Specialized Features', 'Great Support', 'Loyal Customers'],
        weaknesses: ['Limited Market', 'Slow Growth', 'Legacy Technology', 'Small Team'],
        recentActivity: [
          {
            id: 'activity_5',
            type: 'feature',
            title: 'Mobile App Launch',
            description: 'Released native mobile apps for iOS and Android',
            impact: 'low',
            timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
            source: 'App Store'
          }
        ],
        threatLevel: 'low',
        sentiment: 0.1
      }
    ];
  }

  public getMarketTrends(): MarketTrend[] {
    return [
      {
        id: 'trend_1',
        category: 'Technology',
        trend: 'AI-Powered Analytics',
        direction: 'up',
        impact: 9,
        confidence: 0.92,
        timeframe: 'Next 6 months',
        description: 'Increasing demand for AI-driven business intelligence and predictive analytics'
      },
      {
        id: 'trend_2',
        category: 'Pricing',
        trend: 'Freemium Models',
        direction: 'up',
        impact: 7,
        confidence: 0.85,
        timeframe: 'Next 12 months',
        description: 'More companies adopting freemium pricing to reduce customer acquisition costs'
      },
      {
        id: 'trend_3',
        category: 'Integration',
        trend: 'API-First Architecture',
        direction: 'up',
        impact: 8,
        confidence: 0.88,
        timeframe: 'Next 18 months',
        description: 'Growing emphasis on seamless integrations and ecosystem connectivity'
      },
      {
        id: 'trend_4',
        category: 'User Experience',
        trend: 'Mobile-First Design',
        direction: 'stable',
        impact: 6,
        confidence: 0.75,
        timeframe: 'Ongoing',
        description: 'Continued importance of mobile optimization and responsive design'
      }
    ];
  }

  public getCompetitiveGaps(): CompetitiveGap[] {
    return [
      {
        id: 'gap_1',
        area: 'AI Features',
        gap: 'disadvantage',
        severity: 8,
        recommendation: 'Accelerate AI feature development to match competitor capabilities',
        effort: 'high',
        timeToImplement: '3-6 months'
      },
      {
        id: 'gap_2',
        area: 'Pricing Strategy',
        gap: 'advantage',
        severity: 3,
        recommendation: 'Maintain competitive pricing advantage while adding value',
        effort: 'low',
        timeToImplement: 'Ongoing'
      },
      {
        id: 'gap_3',
        area: 'Mobile Experience',
        gap: 'disadvantage',
        severity: 6,
        recommendation: 'Develop native mobile applications for iOS and Android',
        effort: 'medium',
        timeToImplement: '2-4 months'
      },
      {
        id: 'gap_4',
        area: 'Integration Ecosystem',
        gap: 'parity',
        severity: 5,
        recommendation: 'Expand integration partnerships to differentiate from competitors',
        effort: 'medium',
        timeToImplement: '4-8 months'
      }
    ];
  }

  public calculateCompetitiveThreat(competitor: Competitor): number {
    const marketShareWeight = competitor.marketShare * 0.3;
    const activityWeight = competitor.recentActivity.length * 10 * 0.2;
    const sentimentWeight = (competitor.sentiment + 1) * 50 * 0.2;
    const threatMultiplier = competitor.threatLevel === 'critical' ? 1.5 : 
                           competitor.threatLevel === 'high' ? 1.2 : 
                           competitor.threatLevel === 'medium' ? 1.0 : 0.8;
    
    return Math.min((marketShareWeight + activityWeight + sentimentWeight) * threatMultiplier, 100);
  }
}

// Main Competitive Intelligence Monitor
export const CompetitiveIntelligenceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'competitors' | 'trends' | 'gaps'>('competitors');
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [competitiveGaps, setCompetitiveGaps] = useState<CompetitiveGap[]>([]);

  const ciEngine = CompetitiveIntelligenceEngine.getInstance();

  useEffect(() => {
    const showMonitor = localStorage.getItem('show_competitive_intelligence') === 'true';
    setIsVisible(import.meta.env.DEV && showMonitor);

    if (showMonitor) {
      setCompetitors(ciEngine.getCompetitors());
      setMarketTrends(ciEngine.getMarketTrends());
      setCompetitiveGaps(ciEngine.getCompetitiveGaps());
    }
  }, [ciEngine]);

  if (!isVisible) return null;

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getGapColor = (gap: string) => {
    switch (gap) {
      case 'advantage': return 'text-green-500';
      case 'disadvantage': return 'text-red-500';
      case 'parity': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`;
  };

  return (
    <div className="fixed top-4 right-[830px] z-50 bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-lg shadow-2xl w-[400px] max-h-[85vh] overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-6 h-6 text-purple-400" />
            <h3 className="font-bold text-white">Competitive Intel</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-purple-300 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-4 bg-black/20 rounded p-1">
          {[
            { id: 'competitors', label: 'Competitors', icon: Users },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'gaps', label: 'Gaps', icon: AlertCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded text-xs transition-colors ${
                  activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-3">
            {competitors.map(competitor => (
              <div 
                key={competitor.id} 
                className={`bg-black/20 rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedCompetitor === competitor.id ? 'bg-purple-600/20 border border-purple-500' : 'hover:bg-black/30'
                }`}
                onClick={() => setSelectedCompetitor(selectedCompetitor === competitor.id ? null : competitor.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{competitor.name}</h4>
                    <p className="text-xs text-gray-300">{competitor.domain}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Market Share</div>
                    <div className="text-sm font-bold text-white">{competitor.marketShare}%</div>
                    <div className={`text-xs ${getThreatColor(competitor.threatLevel)}`}>
                      {competitor.threatLevel.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-gray-300">
                      From ${competitor.pricing[0]?.price || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-gray-300">
                      {((competitor.sentiment + 1) * 5).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Expanded Competitor Details */}
                {selectedCompetitor === competitor.id && (
                  <div className="mt-3 pt-3 border-t border-gray-600 space-y-3">
                    {/* Recent Activity */}
                    <div>
                      <h5 className="text-xs font-semibold text-purple-200 mb-2">Recent Activity</h5>
                      <div className="space-y-2">
                        {competitor.recentActivity.slice(0, 2).map(activity => (
                          <div key={activity.id} className="bg-black/20 rounded p-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h6 className="text-xs font-medium text-white">{activity.title}</h6>
                                <p className="text-xs text-gray-300 mt-1">{activity.description}</p>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
                                  <span className={`text-xs ${
                                    activity.impact === 'high' ? 'text-red-400' : 
                                    activity.impact === 'medium' ? 'text-yellow-400' : 'text-green-400'
                                  }`}>
                                    {activity.impact.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <h5 className="text-xs font-semibold text-green-200 mb-1">Strengths</h5>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {competitor.strengths.slice(0, 2).map((strength, index) => (
                            <li key={index}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-red-200 mb-1">Weaknesses</h5>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {competitor.weaknesses.slice(0, 2).map((weakness, index) => (
                            <li key={index}>• {weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Market Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-3">
            {marketTrends.map(trend => (
              <div key={trend.id} className="bg-black/20 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{trend.trend}</h4>
                    <p className="text-xs text-purple-300">{trend.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className={`w-3 h-3 ${
                        trend.direction === 'up' ? 'text-green-400' : 
                        trend.direction === 'down' ? 'text-red-400 transform rotate-180' : 'text-gray-400'
                      }`} />
                      <span className="text-xs text-gray-300">{trend.impact}/10</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {(trend.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-300 mb-2">{trend.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-300">{trend.timeframe}</span>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-gray-300">High Impact</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Competitive Gaps Tab */}
        {activeTab === 'gaps' && (
          <div className="space-y-3">
            {competitiveGaps.map(gap => (
              <div key={gap.id} className="bg-black/20 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{gap.area}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs ${getGapColor(gap.gap)}`}>
                        {gap.gap.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-300">Severity: {gap.severity}/10</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Effort</div>
                    <div className={`text-xs ${
                      gap.effort === 'high' ? 'text-red-400' : 
                      gap.effort === 'medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {gap.effort.toUpperCase()}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-300 mb-2">{gap.recommendation}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-300">{gap.timeToImplement}</span>
                  <Shield className="w-3 h-3 text-blue-400" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-600 text-xs text-gray-400 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default CompetitiveIntelligenceMonitor;

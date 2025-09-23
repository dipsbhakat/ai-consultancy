import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Brain } from 'lucide-react';
import { useEnterpriseAI } from './EnterpriseAI';
import { useAdvancedAnalytics } from './AdvancedAnalytics';
import { useLeadScoring } from './AILeadScoring';

// Types
interface BusinessMetric {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  forecast: number[];
  category: 'revenue' | 'leads' | 'conversion' | 'efficiency';
}

interface KPICard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical' | 'info' | 'success';
  title: string;
  message: string;
  action: string;
  priority: number;
  timestamp: number;
}

// Business Intelligence Engine
class BusinessIntelligenceEngine {
  private static instance: BusinessIntelligenceEngine;

  public static getInstance(): BusinessIntelligenceEngine {
    if (!BusinessIntelligenceEngine.instance) {
      BusinessIntelligenceEngine.instance = new BusinessIntelligenceEngine();
    }
    return BusinessIntelligenceEngine.instance;
  }

  public generateBusinessMetrics(): BusinessMetric[] {
    return [
      {
        id: 'monthly_revenue',
        name: 'Monthly Revenue',
        currentValue: 127500,
        previousValue: 98200,
        target: 150000,
        unit: '$',
        trend: 'up',
        change: 29.8,
        forecast: [135000, 142000, 156000, 162000],
        category: 'revenue'
      },
      {
        id: 'lead_conversion_rate',
        name: 'Lead Conversion Rate',
        currentValue: 4.2,
        previousValue: 3.1,
        target: 5.0,
        unit: '%',
        trend: 'up',
        change: 35.5,
        forecast: [4.5, 4.8, 5.2, 5.6],
        category: 'conversion'
      },
      {
        id: 'qualified_leads',
        name: 'Qualified Leads',
        currentValue: 89,
        previousValue: 67,
        target: 100,
        unit: '',
        trend: 'up',
        change: 32.8,
        forecast: [95, 102, 108, 115],
        category: 'leads'
      },
      {
        id: 'average_deal_size',
        name: 'Average Deal Size',
        currentValue: 23400,
        previousValue: 19800,
        target: 25000,
        unit: '$',
        trend: 'up',
        change: 18.2,
        forecast: [24200, 24800, 26100, 27500],
        category: 'revenue'
      },
      {
        id: 'sales_cycle_length',
        name: 'Sales Cycle Length',
        currentValue: 28,
        previousValue: 35,
        target: 21,
        unit: ' days',
        trend: 'down', // down is good for cycle length
        change: -20.0,
        forecast: [26, 24, 22, 20],
        category: 'efficiency'
      },
      {
        id: 'customer_acquisition_cost',
        name: 'Customer Acquisition Cost',
        currentValue: 1850,
        previousValue: 2340,
        target: 1500,
        unit: '$',
        trend: 'down', // down is good for CAC
        change: -20.9,
        forecast: [1720, 1650, 1580, 1480],
        category: 'efficiency'
      }
    ];
  }

  public generateKPICards(): KPICard[] {
    return [
      {
        title: 'Total Revenue',
        value: '$127.5K',
        change: '+29.8%',
        trend: 'up',
        icon: DollarSign,
        color: 'green'
      },
      {
        title: 'Active Leads',
        value: '89',
        change: '+32.8%',
        trend: 'up',
        icon: Users,
        color: 'blue'
      },
      {
        title: 'Conversion Rate',
        value: '4.2%',
        change: '+35.5%',
        trend: 'up',
        icon: Target,
        color: 'purple'
      },
      {
        title: 'AI Efficiency',
        value: '94.7%',
        change: '+12.3%',
        trend: 'up',
        icon: Brain,
        color: 'indigo'
      }
    ];
  }

  public generatePerformanceAlerts(): PerformanceAlert[] {
    return [
      {
        id: 'revenue_milestone',
        type: 'success',
        title: 'Revenue Milestone Achieved',
        message: 'Monthly revenue exceeded $125K target by 2%',
        action: 'View detailed revenue analysis',
        priority: 3,
        timestamp: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        id: 'lead_quality_drop',
        type: 'warning',
        title: 'Lead Quality Score Declining',
        message: 'Average lead score dropped 8% in the last 3 days',
        action: 'Review lead sources and qualification criteria',
        priority: 2,
        timestamp: Date.now() - 45 * 60 * 1000
      },
      {
        id: 'ai_model_performance',
        type: 'critical',
        title: 'AI Model Requires Retraining',
        message: 'Conversion prediction accuracy below 85% threshold',
        action: 'Retrain conversion model with recent data',
        priority: 1,
        timestamp: Date.now() - 15 * 60 * 1000
      },
      {
        id: 'competitor_activity',
        type: 'info',
        title: 'Competitor Analysis Update',
        message: 'New pricing strategy detected from key competitor',
        action: 'Review competitive positioning',
        priority: 2,
        timestamp: Date.now() - 6 * 60 * 60 * 1000
      }
    ];
  }

  public calculateROI(investment: number, revenue: number, timeframe: number): number {
    return ((revenue - investment) / investment) * 100 / timeframe * 12; // Annualized ROI
  }

  public predictFuturePerformance(metrics: BusinessMetric[], timeframeDays: number): any {
    const predictions: any = {};
    
    metrics.forEach(metric => {
      const growthRate = metric.change / 100;
      const dailyGrowthRate = growthRate / 30; // Assuming monthly change
      const predictedValue = metric.currentValue * (1 + dailyGrowthRate * timeframeDays);
      
      predictions[metric.id] = {
        current: metric.currentValue,
        predicted: Math.round(predictedValue * 100) / 100,
        confidence: this.calculatePredictionConfidence(metric),
        trend: predictedValue > metric.currentValue ? 'up' : 'down'
      };
    });

    return predictions;
  }

  private calculatePredictionConfidence(metric: BusinessMetric): number {
    // Higher confidence for metrics with consistent trends
    const trendConsistency = Math.abs(metric.change) > 10 ? 0.9 : 0.7;
    const dataQuality = metric.forecast.length > 2 ? 0.95 : 0.8;
    return Math.min(trendConsistency * dataQuality, 0.95);
  }
}

// Main Business Intelligence Dashboard
export const BusinessIntelligenceDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);
  const [kpiCards, setKPICards] = useState<KPICard[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [predictions, setPredictions] = useState<any>({});

  const { insights } = useEnterpriseAI();
  const { metrics: analyticsMetrics } = useAdvancedAnalytics();
  const { currentLeadScore: _currentLeadScore } = useLeadScoring();

  const biEngine = BusinessIntelligenceEngine.getInstance();

  useEffect(() => {
    const showDashboard = localStorage.getItem('show_business_intelligence_dashboard') === 'true';
    setIsVisible(import.meta.env.DEV && showDashboard);

    if (showDashboard) {
      // Initialize BI data
      const businessMetrics = biEngine.generateBusinessMetrics();
      const kpiData = biEngine.generateKPICards();
      const alertData = biEngine.generatePerformanceAlerts();
      
      setMetrics(businessMetrics);
      setKPICards(kpiData);
      setAlerts(alertData);

      // Generate predictions
      const timeframeDays = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const futurePerformance = biEngine.predictFuturePerformance(businessMetrics, timeframeDays);
      setPredictions(futurePerformance);
    }
  }, [timeframe, biEngine]);

  if (!isVisible) return null;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      case 'stable': return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: PerformanceAlert['type']) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
    }
  };

  const formatNumber = (num: number, unit: string) => {
    if (unit === '$') {
      return num >= 1000 ? `$${(num / 1000).toFixed(1)}K` : `$${num}`;
    }
    return `${num}${unit}`;
  };

  return (
    <div className="fixed top-4 right-96 z-50 bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-lg shadow-2xl w-[420px] max-h-[85vh] overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h3 className="font-bold text-white">Business Intelligence</h3>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as '7d' | '30d' | '90d')}
              className="bg-black/20 text-white text-xs rounded px-2 py-1 border border-blue-600"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
            <button
              onClick={() => setIsVisible(false)}
              className="text-blue-300 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div key={index} className="bg-black/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 text-${kpi.color}-400`} />
                  {getTrendIcon(kpi.trend)}
                </div>
                <div className="text-xs text-gray-300 mb-1">{kpi.title}</div>
                <div className="text-lg font-bold text-white">{kpi.value}</div>
                <div className={`text-xs ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Alerts */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-blue-200 mb-2">Performance Alerts</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.slice(0, 3).map(alert => (
              <div key={alert.id} className="bg-black/20 rounded p-2">
                <div className="flex items-start space-x-2">
                  <span className="text-sm">{getAlertIcon(alert.type)}</span>
                  <div className="flex-1">
                    <h5 className="text-xs font-medium text-white">{alert.title}</h5>
                    <p className="text-xs text-gray-300">{alert.message}</p>
                    <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">
                      {alert.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-blue-200 mb-2">Key Metrics</h4>
          <div className="space-y-2">
            {metrics.slice(0, 4).map(metric => (
              <div 
                key={metric.id} 
                className={`bg-black/20 rounded p-3 cursor-pointer transition-colors ${
                  activeMetric === metric.id ? 'bg-blue-600/20 border border-blue-500' : 'hover:bg-black/30'
                }`}
                onClick={() => setActiveMetric(activeMetric === metric.id ? null : metric.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-xs font-medium text-white">{metric.name}</h5>
                    <div className="text-sm font-bold text-white">
                      {formatNumber(metric.currentValue, metric.unit)}
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      {getTrendIcon(metric.trend)}
                      <span className={metric.change > 0 ? 'text-green-400' : 'text-red-400'}>
                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Target</div>
                    <div className="text-xs text-blue-300">
                      {formatNumber(metric.target, metric.unit)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {((metric.currentValue / metric.target) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Expanded Metric Details */}
                {activeMetric === metric.id && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="text-xs text-gray-300 mb-2">Forecast (Next 4 Months)</div>
                    <div className="flex justify-between text-xs">
                      {metric.forecast.map((value, index) => (
                        <div key={index} className="text-center">
                          <div className="text-blue-300">M{index + 1}</div>
                          <div className="text-white">{formatNumber(value, metric.unit)}</div>
                        </div>
                      ))}
                    </div>
                    {predictions[metric.id] && (
                      <div className="mt-2 text-xs">
                        <span className="text-gray-400">Predicted ({timeframe}): </span>
                        <span className="text-green-400">
                          {formatNumber(predictions[metric.id].predicted, metric.unit)}
                        </span>
                        <span className="text-gray-400 ml-2">
                          ({(predictions[metric.id].confidence * 100).toFixed(0)}% confidence)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights Summary */}
        <div>
          <h4 className="text-sm font-semibold text-blue-200 mb-2 flex items-center">
            <Brain className="w-4 h-4 mr-1" />
            AI Insights
          </h4>
          <div className="space-y-2">
            {insights.slice(0, 2).map(insight => (
              <div key={insight.id} className="bg-black/20 rounded p-2">
                <div className="flex items-start space-x-2">
                  <span className="text-sm">💡</span>
                  <div>
                    <h5 className="text-xs font-medium text-white">{insight.title}</h5>
                    <p className="text-xs text-gray-300 line-clamp-2">{insight.description}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-green-400">
                        +{insight.metrics.improvementPotential}% potential
                      </span>
                      <span className="text-xs text-blue-400">
                        {(insight.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-4 pt-3 border-t border-gray-600 flex justify-between text-xs text-gray-400">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span>{analyticsMetrics?.pageViews || 0} page views today</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligenceDashboard;

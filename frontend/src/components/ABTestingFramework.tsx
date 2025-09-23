import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAdvancedAnalytics } from './AdvancedAnalytics';

// Types
interface ABTest {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  startDate: number;
  endDate?: number;
  targetMetric: 'conversion_rate' | 'click_through_rate' | 'time_on_page' | 'form_completion';
  minSampleSize: number;
  confidenceLevel: number;
  variants: ABVariant[];
  results?: ABTestResults;
}

interface ABVariant {
  id: string;
  name: string;
  weight: number; // Traffic allocation percentage (0-100)
  isControl: boolean;
  content: {
    [key: string]: any;
  };
  metrics: {
    impressions: number;
    conversions: number;
    clicks: number;
    engagementTime: number;
  };
}

interface ABTestResults {
  winner?: string;
  confidence: number;
  improvementRate: number;
  statisticalSignificance: boolean;
  recommendedAction: 'continue' | 'declare_winner' | 'stop_test' | 'extend_test';
}

interface ABTestAssignment {
  testId: string;
  variantId: string;
  assignedAt: number;
}

// Predefined A/B Tests
const defaultTests: ABTest[] = [
  {
    id: 'hero-headline-test',
    name: 'Hero Headline Optimization',
    description: 'Testing different hero headlines for conversion impact',
    isActive: true,
    startDate: Date.now(),
    targetMetric: 'conversion_rate',
    minSampleSize: 100,
    confidenceLevel: 95,
    variants: [
      {
        id: 'control',
        name: 'Original Headline',
        weight: 50,
        isControl: true,
        content: {
          headline: 'Turn Your Business Into an AI Powerhouse',
          subtext: 'Boost productivity by 400% with our proven AI implementation strategies'
        },
        metrics: { impressions: 0, conversions: 0, clicks: 0, engagementTime: 0 }
      },
      {
        id: 'variant-a',
        name: 'Urgency-Focused',
        weight: 50,
        isControl: false,
        content: {
          headline: 'Get 400% ROI in 90 Days or Your Money Back',
          subtext: 'Join 500+ companies that transformed their business with our AI solutions'
        },
        metrics: { impressions: 0, conversions: 0, clicks: 0, engagementTime: 0 }
      }
    ]
  },
  {
    id: 'cta-button-test',
    name: 'Primary CTA Button Text',
    description: 'Testing different CTA button texts for click-through rates',
    isActive: true,
    startDate: Date.now(),
    targetMetric: 'click_through_rate',
    minSampleSize: 200,
    confidenceLevel: 95,
    variants: [
      {
        id: 'control',
        name: 'Get Started Now',
        weight: 33,
        isControl: true,
        content: {
          buttonText: 'Get Started Now',
          buttonStyle: 'primary'
        },
        metrics: { impressions: 0, conversions: 0, clicks: 0, engagementTime: 0 }
      },
      {
        id: 'variant-a',
        name: 'Free Consultation',
        weight: 33,
        isControl: false,
        content: {
          buttonText: 'Get Free Consultation',
          buttonStyle: 'primary'
        },
        metrics: { impressions: 0, conversions: 0, clicks: 0, engagementTime: 0 }
      },
      {
        id: 'variant-b',
        name: 'Calculate ROI',
        weight: 34,
        isControl: false,
        content: {
          buttonText: 'Calculate Your ROI',
          buttonStyle: 'primary'
        },
        metrics: { impressions: 0, conversions: 0, clicks: 0, engagementTime: 0 }
      }
    ]
  },
  {
    id: 'pricing-display-test',
    name: 'Pricing Display Strategy',
    description: 'Testing different pricing presentation methods',
    isActive: true,
    startDate: Date.now(),
    targetMetric: 'conversion_rate',
    minSampleSize: 150,
    confidenceLevel: 90,
    variants: [
      {
        id: 'control',
        name: 'Hide Pricing',
        weight: 50,
        isControl: true,
        content: {
          showPricing: false,
          pricingMessage: 'Custom pricing based on your needs'
        },
        metrics: { impressions: 0, conversions: 0, clicks: 0, engagementTime: 0 }
      },
      {
        id: 'variant-a',
        name: 'Show Starting Price',
        weight: 50,
        isControl: false,
        content: {
          showPricing: true,
          pricingMessage: 'Starting at $5,000/month'
        },
        metrics: { impressions: 0, conversions: 0, clicks: 0, engagementTime: 0 }
      }
    ]
  }
];

// Statistical functions
class ABTestStatistics {
  static calculateZScore(p1: number, n1: number, p2: number, n2: number): number {
    const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
    const standardError = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
    return (p1 - p2) / standardError;
  }

  static getConfidenceLevel(zScore: number): number {
    const absZ = Math.abs(zScore);
    if (absZ >= 2.58) return 99;
    if (absZ >= 2.33) return 98;
    if (absZ >= 1.96) return 95;
    if (absZ >= 1.65) return 90;
    if (absZ >= 1.28) return 80;
    return 0;
  }

  static calculateSampleSize(
    baseConversionRate: number,
    minDetectableEffect: number,
    confidenceLevel: number = 95,
    power: number = 80
  ): number {
    const alpha = 1 - confidenceLevel / 100;
    const beta = 1 - power / 100;
    const zAlpha = this.getZScoreForAlpha(alpha / 2);
    const zBeta = this.getZScoreForAlpha(beta);
    
    const p1 = baseConversionRate;
    const p2 = baseConversionRate * (1 + minDetectableEffect);
    const pBar = (p1 + p2) / 2;
    
    const numerator = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
    const denominator = Math.pow(p2 - p1, 2);
    
    return Math.ceil(numerator / denominator);
  }

  private static getZScoreForAlpha(alpha: number): number {
    // Approximation for common alpha values
    if (alpha <= 0.005) return 2.58;
    if (alpha <= 0.01) return 2.33;
    if (alpha <= 0.025) return 1.96;
    if (alpha <= 0.05) return 1.65;
    if (alpha <= 0.1) return 1.28;
    return 1.0;
  }
}

// A/B Testing Engine
class ABTestingEngine {
  private static instance: ABTestingEngine;
  private tests: ABTest[];
  private assignments: Map<string, ABTestAssignment> = new Map();
  private userId: string;

  constructor() {
    this.userId = this.getUserId();
    this.tests = this.loadTests();
    this.loadAssignments();
  }

  public static getInstance(): ABTestingEngine {
    if (!ABTestingEngine.instance) {
      ABTestingEngine.instance = new ABTestingEngine();
    }
    return ABTestingEngine.instance;
  }

  private getUserId(): string {
    let userId = localStorage.getItem('ab_test_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ab_test_user_id', userId);
    }
    return userId;
  }

  private loadTests(): ABTest[] {
    const stored = localStorage.getItem('ab_tests');
    return stored ? JSON.parse(stored) : defaultTests;
  }

  private saveTests(): void {
    localStorage.setItem('ab_tests', JSON.stringify(this.tests));
  }

  private loadAssignments(): void {
    const stored = localStorage.getItem('ab_test_assignments');
    if (stored) {
      const assignments = JSON.parse(stored);
      this.assignments = new Map(Object.entries(assignments));
    }
  }

  private saveAssignments(): void {
    const assignmentsObj = Object.fromEntries(this.assignments);
    localStorage.setItem('ab_test_assignments', JSON.stringify(assignmentsObj));
  }

  private hashUserId(testId: string): number {
    const str = `${this.userId}_${testId}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  public getVariantForTest(testId: string): ABVariant | null {
    const test = this.tests.find(t => t.id === testId);
    if (!test || !test.isActive) return null;

    // Check if user already has an assignment
    const existingAssignment = this.assignments.get(testId);
    if (existingAssignment) {
      const variant = test.variants.find(v => v.id === existingAssignment.variantId);
      if (variant) {
        // Track impression
        variant.metrics.impressions++;
        this.saveTests();
        return variant;
      }
    }

    // Assign new variant based on hash
    const hash = this.hashUserId(testId);
    const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
    const normalizedHash = hash % totalWeight;
    
    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (normalizedHash < cumulativeWeight) {
        // Create assignment
        this.assignments.set(testId, {
          testId,
          variantId: variant.id,
          assignedAt: Date.now()
        });
        this.saveAssignments();

        // Track impression
        variant.metrics.impressions++;
        this.saveTests();

        return variant;
      }
    }

    // Fallback to control
    const control = test.variants.find(v => v.isControl);
    if (control) {
      this.assignments.set(testId, {
        testId,
        variantId: control.id,
        assignedAt: Date.now()
      });
      this.saveAssignments();
      control.metrics.impressions++;
      this.saveTests();
      return control;
    }

    return null;
  }

  public trackConversion(testId: string, conversionValue: number = 1): void {
    const assignment = this.assignments.get(testId);
    if (!assignment) return;

    const test = this.tests.find(t => t.id === testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === assignment.variantId);
    if (variant) {
      variant.metrics.conversions += conversionValue;
      this.saveTests();
    }
  }

  public trackClick(testId: string): void {
    const assignment = this.assignments.get(testId);
    if (!assignment) return;

    const test = this.tests.find(t => t.id === testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === assignment.variantId);
    if (variant) {
      variant.metrics.clicks++;
      this.saveTests();
    }
  }

  public trackEngagementTime(testId: string, timeInSeconds: number): void {
    const assignment = this.assignments.get(testId);
    if (!assignment) return;

    const test = this.tests.find(t => t.id === testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === assignment.variantId);
    if (variant) {
      variant.metrics.engagementTime += timeInSeconds;
      this.saveTests();
    }
  }

  public calculateResults(testId: string): ABTestResults | null {
    const test = this.tests.find(t => t.id === testId);
    if (!test) return null;

    const control = test.variants.find(v => v.isControl);
    if (!control) return null;

    // Find best performing variant
    let bestVariant = control;
    let bestRate = this.getConversionRate(control, test.targetMetric);

    for (const variant of test.variants) {
      if (variant.isControl) continue;
      const rate = this.getConversionRate(variant, test.targetMetric);
      if (rate > bestRate) {
        bestRate = rate;
        bestVariant = variant;
      }
    }

    if (bestVariant === control) {
      return {
        winner: control.id,
        confidence: 0,
        improvementRate: 0,
        statisticalSignificance: false,
        recommendedAction: 'continue'
      };
    }

    // Calculate statistical significance
    const controlRate = this.getConversionRate(control, test.targetMetric);
    const variantRate = this.getConversionRate(bestVariant, test.targetMetric);
    
    const controlSample = this.getSampleSize(control, test.targetMetric);
    const variantSample = this.getSampleSize(bestVariant, test.targetMetric);

    if (controlSample < test.minSampleSize || variantSample < test.minSampleSize) {
      return {
        confidence: 0,
        improvementRate: ((variantRate - controlRate) / controlRate) * 100,
        statisticalSignificance: false,
        recommendedAction: 'continue'
      };
    }

    const zScore = ABTestStatistics.calculateZScore(
      variantRate, variantSample,
      controlRate, controlSample
    );

    const confidence = ABTestStatistics.getConfidenceLevel(zScore);
    const improvementRate = ((variantRate - controlRate) / controlRate) * 100;
    const isSignificant = confidence >= test.confidenceLevel;

    return {
      winner: isSignificant ? bestVariant.id : undefined,
      confidence,
      improvementRate,
      statisticalSignificance: isSignificant,
      recommendedAction: isSignificant ? 'declare_winner' : 'continue'
    };
  }

  private getConversionRate(variant: ABVariant, metric: ABTest['targetMetric']): number {
    switch (metric) {
      case 'conversion_rate':
        return variant.metrics.impressions > 0 ? variant.metrics.conversions / variant.metrics.impressions : 0;
      case 'click_through_rate':
        return variant.metrics.impressions > 0 ? variant.metrics.clicks / variant.metrics.impressions : 0;
      case 'time_on_page':
        return variant.metrics.impressions > 0 ? variant.metrics.engagementTime / variant.metrics.impressions : 0;
      case 'form_completion':
        return variant.metrics.clicks > 0 ? variant.metrics.conversions / variant.metrics.clicks : 0;
      default:
        return 0;
    }
  }

  private getSampleSize(variant: ABVariant, metric: ABTest['targetMetric']): number {
    switch (metric) {
      case 'conversion_rate':
      case 'click_through_rate':
      case 'time_on_page':
        return variant.metrics.impressions;
      case 'form_completion':
        return variant.metrics.clicks;
      default:
        return 0;
    }
  }

  public getActiveTests(): ABTest[] {
    return this.tests.filter(t => t.isActive);
  }

  public getTestResults(): Map<string, ABTestResults> {
    const results = new Map<string, ABTestResults>();
    for (const test of this.tests) {
      const result = this.calculateResults(test.id);
      if (result) {
        results.set(test.id, result);
      }
    }
    return results;
  }
}

// React Context
const ABTestContext = createContext<{
  getVariant: (testId: string) => ABVariant | null;
  trackConversion: (testId: string, value?: number) => void;
  trackClick: (testId: string) => void;
  trackEngagement: (testId: string, timeInSeconds: number) => void;
  activeTests: ABTest[];
  testResults: Map<string, ABTestResults>;
} | null>(null);

// Provider Component
export const ABTestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [engine] = useState(() => ABTestingEngine.getInstance());
  const [activeTests, setActiveTests] = useState<ABTest[]>([]);
  const [testResults, setTestResults] = useState<Map<string, ABTestResults>>(new Map());
  const { trackEvent } = useAdvancedAnalytics();

  useEffect(() => {
    setActiveTests(engine.getActiveTests());
    setTestResults(engine.getTestResults());
    
    // Update results every 30 seconds
    const interval = setInterval(() => {
      setTestResults(engine.getTestResults());
    }, 30000);

    return () => clearInterval(interval);
  }, [engine]);

  const getVariant = (testId: string): ABVariant | null => {
    const variant = engine.getVariantForTest(testId);
    if (variant) {
      trackEvent('BUTTON_CLICK', {
        buttonText: `AB_TEST_${testId}_${variant.id}`,
        pageUrl: window.location.pathname
      });
    }
    return variant;
  };

  const trackConversion = (testId: string, value: number = 1): void => {
    engine.trackConversion(testId, value);
    trackEvent('FORM_SUBMIT', {
      formId: `ab_test_conversion_${testId}`,
      pageUrl: window.location.pathname
    });
  };

  const trackClick = (testId: string): void => {
    engine.trackClick(testId);
    trackEvent('BUTTON_CLICK', {
      buttonText: `ab_test_click_${testId}`,
      pageUrl: window.location.pathname
    });
  };

  const trackEngagement = (testId: string, timeInSeconds: number): void => {
    engine.trackEngagementTime(testId, timeInSeconds);
    trackEvent('TIME_ON_PAGE', {
      timeOnPage: timeInSeconds,
      pageUrl: window.location.pathname
    });
  };

  return (
    <ABTestContext.Provider
      value={{
        getVariant,
        trackConversion,
        trackClick,
        trackEngagement,
        activeTests,
        testResults
      }}
    >
      {children}
    </ABTestContext.Provider>
  );
};

// Hook
export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
};

// Component for A/B tested content
export const ABTestComponent: React.FC<{
  testId: string;
  children: (variant: ABVariant | null) => ReactNode;
}> = ({ testId, children }) => {
  const { getVariant } = useABTest();
  const variant = getVariant(testId);
  return <>{children(variant)}</>;
};

// Results Dashboard
export const ABTestDashboard: React.FC = () => {
  const { activeTests, testResults } = useABTest();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showDashboard = localStorage.getItem('show_ab_dashboard') === 'true';
    setIsVisible(import.meta.env.DEV && showDashboard);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-4 z-50 bg-white rounded-lg shadow-2xl p-4 w-96 border border-gray-200 max-h-80 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">🧪 A/B Test Dashboard</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        {activeTests.map(test => {
          const results = testResults.get(test.id);
          return (
            <div key={test.id} className="border border-gray-200 rounded p-2">
              <h4 className="font-semibold text-gray-700">{test.name}</h4>
              
              {test.variants.map(variant => (
                <div key={variant.id} className="mt-1 text-xs">
                  <div className="flex justify-between">
                    <span className={variant.isControl ? 'font-semibold' : ''}>
                      {variant.name} {variant.isControl && '(Control)'}
                    </span>
                    <span>{variant.metrics.impressions} views</span>
                  </div>
                </div>
              ))}
              
              {results && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                  <div>Confidence: {results.confidence}%</div>
                  <div>Improvement: {results.improvementRate.toFixed(1)}%</div>
                  <div className={`font-semibold ${results.statisticalSignificance ? 'text-green-600' : 'text-orange-600'}`}>
                    {results.statisticalSignificance ? '✓ Significant' : '⏳ Testing'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ABTestingEngine;

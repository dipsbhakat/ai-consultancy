import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAdvancedAnalytics } from './AdvancedAnalytics';

// Types
interface UserProfile {
  id: string;
  industry?: string;
  companySize?: string;
  visitCount: number;
  lastVisit: number;
  interests: string[];
  engagementScore: number;
  conversionStage: 'awareness' | 'consideration' | 'decision' | 'retention';
  preferredContentType: 'technical' | 'business' | 'case-studies' | 'roi-focused';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  geoLocation?: string;
  behaviorSegment: 'first-time' | 'returning' | 'engaged' | 'high-intent' | 'price-sensitive';
}

interface PersonalizationRule {
  id: string;
  name: string;
  conditions: {
    field: keyof UserProfile;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
    value: any;
  }[];
  actions: {
    type: 'show_content' | 'hide_content' | 'modify_cta' | 'change_pricing' | 'prioritize_features';
    target: string;
    content?: any;
  }[];
  priority: number;
  isActive: boolean;
}

interface PersonalizedContent {
  heroHeadline?: string;
  heroSubtext?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  featuredTestimonial?: any;
  pricingHighlight?: string;
  urgencyMessage?: string;
  leadMagnetOffer?: string;
  featuredCaseStudy?: any;
  recommendedServices?: string[];
}

// Default personalization rules
const defaultRules: PersonalizationRule[] = [
  {
    id: 'first-time-visitor',
    name: 'First Time Visitor - Education Focus',
    conditions: [
      { field: 'visitCount', operator: 'equals', value: 1 },
      { field: 'conversionStage', operator: 'equals', value: 'awareness' }
    ],
    actions: [
      {
        type: 'modify_cta',
        target: 'primary',
        content: 'Learn How AI Can Transform Your Business'
      },
      {
        type: 'show_content',
        target: 'educational-popup',
        content: 'What is AI Implementation?'
      }
    ],
    priority: 1,
    isActive: true
  },
  {
    id: 'returning-high-engagement',
    name: 'Returning High Engagement - Conversion Focus',
    conditions: [
      { field: 'visitCount', operator: 'greater_than', value: 3 },
      { field: 'engagementScore', operator: 'greater_than', value: 70 }
    ],
    actions: [
      {
        type: 'modify_cta',
        target: 'primary',
        content: 'Get Your Custom AI Strategy - Free Consultation'
      },
      {
        type: 'show_content',
        target: 'urgency-banner',
        content: 'Limited Time: Book Your Strategy Call This Week'
      }
    ],
    priority: 2,
    isActive: true
  },
  {
    id: 'mobile-user-optimization',
    name: 'Mobile User - Simplified Experience',
    conditions: [
      { field: 'deviceType', operator: 'equals', value: 'mobile' }
    ],
    actions: [
      {
        type: 'modify_cta',
        target: 'primary',
        content: 'Call Now'
      },
      {
        type: 'prioritize_features',
        target: 'mobile-features',
        content: ['instant-chat', 'quick-call', 'simple-form']
      }
    ],
    priority: 3,
    isActive: true
  },
  {
    id: 'manufacturing-focus',
    name: 'Manufacturing Industry Focus',
    conditions: [
      { field: 'industry', operator: 'equals', value: 'manufacturing' }
    ],
    actions: [
      {
        type: 'show_content',
        target: 'featured-case-study',
        content: {
          title: 'How AI Reduced Manufacturing Costs by 40%',
          company: 'TechManufacturing Corp',
          results: '40% cost reduction, 99.8% quality improvement'
        }
      },
      {
        type: 'modify_cta',
        target: 'secondary',
        content: 'See Manufacturing AI Solutions'
      }
    ],
    priority: 4,
    isActive: true
  },
  {
    id: 'price-sensitive-segment',
    name: 'Price Sensitive - ROI Focus',
    conditions: [
      { field: 'behaviorSegment', operator: 'equals', value: 'price-sensitive' }
    ],
    actions: [
      {
        type: 'show_content',
        target: 'roi-calculator-highlight',
        content: 'Calculate Your Potential Savings - Free Tool'
      },
      {
        type: 'change_pricing',
        target: 'consultation',
        content: 'FREE Strategy Session (Usually $500)'
      }
    ],
    priority: 5,
    isActive: true
  }
];

// Personalization Engine Class
class PersonalizationEngine {
  private static instance: PersonalizationEngine;
  private userProfile: UserProfile;
  private rules: PersonalizationRule[];
  private appliedRules: string[] = [];

  constructor() {
    this.userProfile = this.initializeUserProfile();
    this.rules = this.loadRules();
    this.updateUserProfile();
  }

  public static getInstance(): PersonalizationEngine {
    if (!PersonalizationEngine.instance) {
      PersonalizationEngine.instance = new PersonalizationEngine();
    }
    return PersonalizationEngine.instance;
  }

  private initializeUserProfile(): UserProfile {
    const stored = localStorage.getItem('user_profile');
    const now = Date.now();
    
    if (stored) {
      const profile = JSON.parse(stored);
      profile.visitCount = (profile.visitCount || 0) + 1;
      profile.lastVisit = now;
      return profile;
    }

    return {
      id: this.generateUserId(),
      visitCount: 1,
      lastVisit: now,
      interests: [],
      engagementScore: 0,
      conversionStage: 'awareness',
      preferredContentType: 'business',
      deviceType: this.detectDeviceType(),
      behaviorSegment: 'first-time'
    };
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private loadRules(): PersonalizationRule[] {
    const stored = localStorage.getItem('personalization_rules');
    return stored ? JSON.parse(stored) : defaultRules;
  }

  private updateUserProfile(): void {
    // Update engagement score based on behavior
    const sessionDuration = Date.now() - this.userProfile.lastVisit;
    if (sessionDuration > 60000) { // More than 1 minute
      this.userProfile.engagementScore += 10;
    }

    // Update conversion stage based on behavior
    if (this.userProfile.visitCount >= 3 && this.userProfile.engagementScore > 50) {
      this.userProfile.conversionStage = 'consideration';
    }
    if (this.userProfile.visitCount >= 5 && this.userProfile.engagementScore > 80) {
      this.userProfile.conversionStage = 'decision';
    }

    // Update behavior segment
    if (this.userProfile.visitCount === 1) {
      this.userProfile.behaviorSegment = 'first-time';
    } else if (this.userProfile.visitCount > 1 && this.userProfile.engagementScore < 30) {
      this.userProfile.behaviorSegment = 'returning';
    } else if (this.userProfile.engagementScore > 60) {
      this.userProfile.behaviorSegment = 'engaged';
    } else if (this.userProfile.engagementScore > 80) {
      this.userProfile.behaviorSegment = 'high-intent';
    }

    // Save to localStorage
    localStorage.setItem('user_profile', JSON.stringify(this.userProfile));
  }

  public updateUserData(data: Partial<UserProfile>): void {
    this.userProfile = { ...this.userProfile, ...data };
    this.updateUserProfile();
  }

  public trackInterest(interest: string): void {
    if (!this.userProfile.interests.includes(interest)) {
      this.userProfile.interests.push(interest);
      this.userProfile.engagementScore += 5;
      this.updateUserProfile();
    }
  }

  public trackEngagement(activity: string, score: number): void {
    // Track the specific activity for analytics
    console.log(`Engagement tracked: ${activity} (+${score} points)`);
    this.userProfile.engagementScore += score;
    this.updateUserProfile();
  }

  private evaluateCondition(condition: PersonalizationRule['conditions'][0]): boolean {
    const profileValue = this.userProfile[condition.field];
    
    switch (condition.operator) {
      case 'equals':
        return profileValue === condition.value;
      case 'contains':
        return Array.isArray(profileValue) 
          ? profileValue.includes(condition.value)
          : String(profileValue).includes(String(condition.value));
      case 'greater_than':
        return Number(profileValue) > Number(condition.value);
      case 'less_than':
        return Number(profileValue) < Number(condition.value);
      case 'in':
        return Array.isArray(condition.value) 
          ? condition.value.includes(profileValue)
          : false;
      default:
        return false;
    }
  }

  public getPersonalizedContent(): PersonalizedContent {
    const content: PersonalizedContent = {};
    const applicableRules = this.rules
      .filter(rule => rule.isActive)
      .filter(rule => rule.conditions.every(condition => this.evaluateCondition(condition)))
      .sort((a, b) => a.priority - b.priority);

    this.appliedRules = applicableRules.map(rule => rule.id);

    // Apply rule actions
    applicableRules.forEach(rule => {
      rule.actions.forEach(action => {
        switch (action.type) {
          case 'modify_cta':
            if (action.target === 'primary') {
              content.primaryCTA = action.content;
            } else if (action.target === 'secondary') {
              content.secondaryCTA = action.content;
            }
            break;
          case 'show_content':
            if (action.target === 'featured-case-study') {
              content.featuredCaseStudy = action.content;
            } else if (action.target === 'urgency-banner') {
              content.urgencyMessage = action.content;
            } else if (action.target === 'roi-calculator-highlight') {
              content.leadMagnetOffer = action.content;
            }
            break;
          case 'change_pricing':
            if (action.target === 'consultation') {
              content.pricingHighlight = action.content;
            }
            break;
        }
      });
    });

    // Default personalization based on user profile
    if (!content.heroHeadline) {
      content.heroHeadline = this.getPersonalizedHeadline();
    }

    if (!content.primaryCTA) {
      content.primaryCTA = this.getPersonalizedCTA();
    }

    return content;
  }

  private getPersonalizedHeadline(): string {
    switch (this.userProfile.conversionStage) {
      case 'awareness':
        return 'Discover How AI Can Transform Your Business';
      case 'consideration':
        return 'Ready to See Real AI Results? Let\'s Talk';
      case 'decision':
        return 'Start Your AI Transformation Today';
      case 'retention':
        return 'Welcome Back! Let\'s Expand Your AI Success';
      default:
        return 'Turn Your Business Into an AI Powerhouse';
    }
  }

  private getPersonalizedCTA(): string {
    if (this.userProfile.deviceType === 'mobile') {
      return 'Call Now';
    }

    switch (this.userProfile.behaviorSegment) {
      case 'first-time':
        return 'Learn More About AI Solutions';
      case 'returning':
        return 'Get Your Free Consultation';
      case 'engaged':
        return 'Schedule Your Strategy Call';
      case 'high-intent':
        return 'Start Your AI Project Today';
      case 'price-sensitive':
        return 'Calculate Your ROI - Free';
      default:
        return 'Get Started Now';
    }
  }

  public getUserProfile(): UserProfile {
    return { ...this.userProfile };
  }

  public getAppliedRules(): string[] {
    return [...this.appliedRules];
  }
}

// React Context
const PersonalizationContext = createContext<{
  personalizedContent: PersonalizedContent;
  userProfile: UserProfile;
  updateUserData: (data: Partial<UserProfile>) => void;
  trackInterest: (interest: string) => void;
  trackEngagement: (activity: string, score: number) => void;
  appliedRules: string[];
} | null>(null);

// Provider Component
export const PersonalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [engine] = useState(() => PersonalizationEngine.getInstance());
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent>({});
  const [userProfile, setUserProfile] = useState<UserProfile>(engine.getUserProfile());
  const [appliedRules, setAppliedRules] = useState<string[]>([]);
  const { trackEvent } = useAdvancedAnalytics();

  useEffect(() => {
    const content = engine.getPersonalizedContent();
    setPersonalizedContent(content);
    setAppliedRules(engine.getAppliedRules());

    // Track personalization
    trackEvent('PERSONALIZATION_APPLIED', {
      appliedRules: engine.getAppliedRules(),
      userSegment: userProfile.behaviorSegment,
      conversionStage: userProfile.conversionStage
    });
  }, [userProfile, trackEvent]);

  const updateUserData = (data: Partial<UserProfile>) => {
    engine.updateUserData(data);
    setUserProfile(engine.getUserProfile());
  };

  const trackInterest = (interest: string) => {
    engine.trackInterest(interest);
    setUserProfile(engine.getUserProfile());
    trackEvent('INTEREST_TRACKED', { interest });
  };

  const trackEngagement = (activity: string, score: number) => {
    engine.trackEngagement(activity, score);
    setUserProfile(engine.getUserProfile());
    trackEvent('ENGAGEMENT_TRACKED', { activity, score });
  };

  return (
    <PersonalizationContext.Provider
      value={{
        personalizedContent,
        userProfile,
        updateUserData,
        trackInterest,
        trackEngagement,
        appliedRules
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};

// Hook
export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within PersonalizationProvider');
  }
  return context;
};

// Personalized Component Wrapper
export const PersonalizedContent: React.FC<{
  children: (content: PersonalizedContent) => ReactNode;
}> = ({ children }) => {
  const { personalizedContent } = usePersonalization();
  return <>{children(personalizedContent)}</>;
};

// Debug Panel
export const PersonalizationDebugPanel: React.FC = () => {
  const { userProfile, personalizedContent, appliedRules } = usePersonalization();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showDebug = localStorage.getItem('show_personalization_debug') === 'true';
    setIsVisible(import.meta.env.DEV && showDebug);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl p-4 w-80 border border-gray-200 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">🎯 Personalization Debug</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div>
          <h4 className="font-semibold text-gray-700 mb-1">User Profile:</h4>
          <div className="bg-gray-50 p-2 rounded text-xs">
            <div>Segment: {userProfile.behaviorSegment}</div>
            <div>Stage: {userProfile.conversionStage}</div>
            <div>Visits: {userProfile.visitCount}</div>
            <div>Engagement: {userProfile.engagementScore}</div>
            <div>Device: {userProfile.deviceType}</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-1">Applied Rules:</h4>
          <div className="bg-blue-50 p-2 rounded text-xs">
            {appliedRules.length > 0 ? (
              appliedRules.map(ruleId => (
                <div key={ruleId} className="text-blue-800">• {ruleId}</div>
              ))
            ) : (
              <div className="text-gray-500">No rules applied</div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-1">Personalized Content:</h4>
          <div className="bg-green-50 p-2 rounded text-xs">
            {Object.entries(personalizedContent).map(([key, value]) => (
              <div key={key} className="text-green-800">
                <strong>{key}:</strong> {String(value).slice(0, 50)}...
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationEngine;

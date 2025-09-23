import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsEvent {
  eventType: 'PAGE_VIEW' | 'BUTTON_CLICK' | 'FORM_SUBMIT' | 'SCROLL_DEPTH' | 'TIME_ON_PAGE' | 'ROI_CALCULATION' | 'EMAIL_CAPTURE' | 'PERSONALIZATION_APPLIED' | 'INTEREST_TRACKED' | 'ENGAGEMENT_TRACKED';
  eventData: {
    pageUrl?: string;
    buttonText?: string;
    formId?: string;
    scrollPercentage?: number;
    timeOnPage?: number;
    calculationResult?: any;
    emailCaptured?: string;
    userAgent?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    appliedRules?: string[];
    userSegment?: string;
    conversionStage?: string;
    interest?: string;
    activity?: string;
    score?: number;
  };
  sessionId: string;
  timestamp?: number;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: AnalyticsEvent[];
  source: string;
  medium: string;
  campaign?: string;
  userAgent: string;
  screenResolution: string;
  isNewUser: boolean;
}

class AdvancedAnalyticsEngine {
  private static instance: AdvancedAnalyticsEngine;
  private session: UserSession;
  private eventQueue: AnalyticsEvent[] = [];
  private isOnline: boolean = navigator.onLine;
  private apiEndpoint: string = 'http://localhost:3001/api/v1/analytics';

  constructor() {
    this.session = this.initializeSession();
    this.setupEventListeners();
    this.startHeartbeat();
  }

  public static getInstance(): AdvancedAnalyticsEngine {
    if (!AdvancedAnalyticsEngine.instance) {
      AdvancedAnalyticsEngine.instance = new AdvancedAnalyticsEngine();
    }
    return AdvancedAnalyticsEngine.instance;
  }

  private initializeSession(): UserSession {
    const sessionId = this.generateSessionId();
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: [],
      source: urlParams.get('utm_source') || document.referrer || 'direct',
      medium: urlParams.get('utm_medium') || 'organic',
      campaign: urlParams.get('utm_campaign') || undefined,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      isNewUser: !localStorage.getItem('analytics_returning_user')
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventListeners(): void {
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('TIME_ON_PAGE', {
          timeOnPage: Date.now() - this.session.lastActivity
        });
      } else {
        this.session.lastActivity = Date.now();
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercentage > maxScrollDepth && scrollPercentage % 25 === 0) {
        maxScrollDepth = scrollPercentage;
        this.trackEvent('SCROLL_DEPTH', { scrollPercentage });
      }
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a[href], .cta, [data-track]')) {
        this.trackEvent('BUTTON_CLICK', {
          buttonText: target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown',
          pageUrl: window.location.pathname
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.trackEvent('FORM_SUBMIT', {
        formId: form.id || form.className || 'anonymous-form',
        pageUrl: window.location.pathname
      });
    });

    // Track online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushEventQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Mark as returning user
    localStorage.setItem('analytics_returning_user', 'true');
  }

  private startHeartbeat(): void {
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.session.lastActivity = Date.now();
      }
    }, 30000); // Every 30 seconds

    // Flush events every 5 seconds
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flushEventQueue();
      }
    }, 5000);
  }

  public trackEvent(eventType: AnalyticsEvent['eventType'], eventData: AnalyticsEvent['eventData']): void {
    const event: AnalyticsEvent = {
      eventType,
      eventData: {
        ...eventData,
        pageUrl: eventData.pageUrl || window.location.pathname,
        userAgent: this.session.userAgent,
        source: this.session.source,
        medium: this.session.medium,
        campaign: this.session.campaign
      },
      sessionId: this.session.sessionId,
      timestamp: Date.now()
    };

    this.eventQueue.push(event);
    this.session.events.push(event);

    // Track page views
    if (eventType === 'PAGE_VIEW') {
      this.session.pageViews++;
    }

    // Auto-flush critical events
    if (['FORM_SUBMIT', 'EMAIL_CAPTURE', 'ROI_CALCULATION'].includes(eventType)) {
      this.flushEventQueue();
    }
  }

  private async flushEventQueue(): Promise<void> {
    if (!this.isOnline || this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(`${this.apiEndpoint}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: eventsToSend,
          session: this.session
        })
      });

      if (!response.ok) {
        // Re-queue events if failed
        this.eventQueue.unshift(...eventsToSend);
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
      // Re-queue events for retry
      this.eventQueue.unshift(...eventsToSend);
    }
  }

  public trackPageView(pageUrl?: string): void {
    this.trackEvent('PAGE_VIEW', {
      pageUrl: pageUrl || window.location.pathname
    });
  }

  public trackROICalculation(result: any): void {
    this.trackEvent('ROI_CALCULATION', {
      calculationResult: result,
      pageUrl: window.location.pathname
    });
  }

  public trackEmailCapture(email: string, source: string): void {
    this.trackEvent('EMAIL_CAPTURE', {
      emailCaptured: email,
      source,
      pageUrl: window.location.pathname
    });
  }

  public getSession(): UserSession {
    return { ...this.session };
  }

  public getSessionMetrics() {
    const now = Date.now();
    const sessionDuration = now - this.session.startTime;
    const timeOnCurrentPage = now - this.session.lastActivity;
    
    return {
      sessionDuration: Math.round(sessionDuration / 1000), // in seconds
      pageViews: this.session.pageViews,
      eventsCount: this.session.events.length,
      timeOnCurrentPage: Math.round(timeOnCurrentPage / 1000),
      source: this.session.source,
      medium: this.session.medium,
      isNewUser: this.session.isNewUser
    };
  }
}

// React Hook for Analytics
export const useAdvancedAnalytics = () => {
  const [analytics] = useState(() => AdvancedAnalyticsEngine.getInstance());
  const [metrics, setMetrics] = useState(analytics.getSessionMetrics());

  useEffect(() => {
    // Track initial page view
    analytics.trackPageView();

    // Update metrics every 10 seconds
    const interval = setInterval(() => {
      setMetrics(analytics.getSessionMetrics());
    }, 10000);

    return () => clearInterval(interval);
  }, [analytics]);

  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackROICalculation: analytics.trackROICalculation.bind(analytics),
    trackEmailCapture: analytics.trackEmailCapture.bind(analytics),
    metrics,
    session: analytics.getSession()
  };
};

// Analytics Dashboard Component (for internal use)
export const AnalyticsDashboard: React.FC = () => {
  const { metrics, session } = useAdvancedAnalytics();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development mode
  useEffect(() => {
    const isDev = import.meta.env.DEV;
    const showAnalytics = localStorage.getItem('show_analytics_dashboard') === 'true';
    setIsVisible(isDev && showAnalytics);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-2xl p-4 w-80 border border-gray-200"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">📊 Analytics Dashboard</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Session Duration:</span>
          <span className="font-semibold">{Math.floor(metrics.sessionDuration / 60)}m {metrics.sessionDuration % 60}s</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Page Views:</span>
          <span className="font-semibold">{metrics.pageViews}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Events:</span>
          <span className="font-semibold">{metrics.eventsCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Source:</span>
          <span className="font-semibold">{metrics.source}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">User Type:</span>
          <span className="font-semibold">{metrics.isNewUser ? 'New' : 'Returning'}</span>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Session ID: {session.sessionId.slice(-8)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Analytics Heatmap Component
export const AnalyticsHeatmap: React.FC = () => {
  const [clickData, setClickData] = useState<{x: number, y: number, count: number}[]>([]);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      setClickData(prev => {
        const existing = prev.find(point => 
          Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5
        );
        
        if (existing) {
          return prev.map(point => 
            point === existing ? {...point, count: point.count + 1} : point
          );
        } else {
          return [...prev.slice(-50), {x, y, count: 1}]; // Keep last 50 clicks
        }
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {clickData.map((point, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0.7 }}
          exit={{ scale: 2, opacity: 0 }}
          className="absolute w-4 h-4 rounded-full bg-red-500"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: Math.min(0.8, point.count * 0.2),
            background: `radial-gradient(circle, rgba(239,68,68,${Math.min(0.8, point.count * 0.2)}) 0%, transparent 70%)`
          }}
        />
      ))}
    </div>
  );
};

export default AdvancedAnalyticsEngine;

import { Component, ErrorInfo, ReactNode } from 'react';
import { config, Logger } from '../config/production';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ProductionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error with full context
    Logger.error('React Error Boundary caught error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name
    });

    // Send to monitoring service in production
    if (config.isProduction()) {
      this.reportError(error, errorInfo);
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      buildVersion: import.meta.env.VITE_APP_VERSION || 'unknown'
    };

    // Send to monitoring service
    fetch(`${config.getApiConfig().baseUrl}/errors/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorReport)
    }).catch(reportingError => {
      Logger.error('Failed to report error to monitoring service', reportingError);
    });
  }

  private getUserId(): string | null {
    // Get user ID from authentication context or localStorage
    return localStorage.getItem('user_id') || null;
  }

  private getSessionId(): string | null {
    // Get session ID
    return sessionStorage.getItem('session_id') || null;
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReportIssue = () => {
    const subject = encodeURIComponent('Website Error Report');
    const body = encodeURIComponent(`
Error: ${this.state.error?.message || 'Unknown error'}
URL: ${window.location.href}
Time: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}

Please describe what you were doing when this error occurred:
    `);
    
    window.open(`mailto:dipeshbhakat5@gmail.com?subject=${subject}&body=${body}`);
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="mt-4 text-lg font-medium text-gray-900">
                  Something went wrong
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  We're sorry, but something unexpected happened. Our team has been notified.
                </p>
                
                {config.isDevelopment() && this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm text-red-600 hover:text-red-500">
                      Show error details (Development only)
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                      {this.state.error.message}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
                
                <div className="mt-6 flex flex-col space-y-3">
                  <button
                    onClick={this.handleRetry}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Homepage
                  </button>
                  
                  <button
                    onClick={this.handleReportIssue}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance Monitor Component
interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private observer?: PerformanceObserver;

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public init() {
    if (!config.isFeatureEnabled('performanceMonitoring')) {
      return;
    }

    this.measureBasicMetrics();
    this.observeWebVitals();
    this.scheduleReporting();
  }

  private measureBasicMetrics() {
    // Page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    });
  }

  private observeWebVitals() {
    if ('PerformanceObserver' in window) {
      // Observe paint metrics
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = entry.startTime;
              }
              break;
            case 'largest-contentful-paint':
              this.metrics.largestContentfulPaint = entry.startTime;
              break;
            case 'layout-shift':
              const layoutShiftEntry = entry as any;
              if (!layoutShiftEntry.hadRecentInput) {
                this.metrics.cumulativeLayoutShift = (this.metrics.cumulativeLayoutShift || 0) + layoutShiftEntry.value;
              }
              break;
            case 'first-input':
              this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
              break;
          }
        }
      });

      try {
        this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
      } catch (error) {
        Logger.warn('Performance observer failed to initialize', error);
      }
    }
  }

  private scheduleReporting() {
    // Report metrics every 30 seconds
    setInterval(() => {
      this.reportMetrics();
    }, 30000);

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });
  }

  private reportMetrics() {
    if (Object.keys(this.metrics).length === 0) {
      return;
    }

    const report = {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      connection: this.getConnectionInfo(),
      deviceMemory: (navigator as any).deviceMemory || null,
      hardwareConcurrency: navigator.hardwareConcurrency || null
    };

    fetch(`${config.getApiConfig().baseUrl}/analytics/performance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    }).catch(error => {
      Logger.warn('Failed to report performance metrics', error);
    });

    Logger.info('Performance metrics reported', report);
  }

  private getConnectionInfo() {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };
    }
    return null;
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();

export default ProductionErrorBoundary;

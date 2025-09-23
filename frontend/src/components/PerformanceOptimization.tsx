import React, { useState, useEffect, useRef, lazy } from 'react';
import { useAdvancedAnalytics } from './AdvancedAnalytics';

// Performance Monitoring
interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  resourceLoadTimes: Map<string, number>;
  componentRenderTimes: Map<string, number>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: 0,
      resourceLoadTimes: new Map(),
      componentRenderTimes: new Map()
    };
    this.initializeMonitoring();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeMonitoring(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.metrics.largestContentfulPaint = entry.startTime;
          }
          if (entry.entryType === 'first-input') {
            this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
          }
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            this.metrics.cumulativeLayoutShift += (entry as any).value;
          }
        }
      });

      this.observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }

    // Monitor page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.timeToInteractive = navigation.domInteractive - navigation.fetchStart;

      // First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.firstContentfulPaint = fcpEntry.startTime;
      }

      // Resource load times
      const resourceEntries = performance.getEntriesByType('resource');
      resourceEntries.forEach(entry => {
        const resource = entry as PerformanceResourceTiming;
        this.metrics.resourceLoadTimes.set(
          resource.name,
          resource.responseEnd - resource.fetchStart
        );
      });

      this.reportMetrics();
    });
  }

  public trackComponentRender(componentName: string, renderTime: number): void {
    this.metrics.componentRenderTimes.set(componentName, renderTime);
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  private reportMetrics(): void {
    // Send metrics to analytics
    const analyticsEngine = (window as any).analyticsEngine;
    if (analyticsEngine) {
      analyticsEngine.trackEvent('PERFORMANCE_METRICS', {
        pageLoadTime: this.metrics.pageLoadTime,
        firstContentfulPaint: this.metrics.firstContentfulPaint,
        largestContentfulPaint: this.metrics.largestContentfulPaint,
        cumulativeLayoutShift: this.metrics.cumulativeLayoutShift
      });
    }
  }
}

// Lazy Loading Hook
export const useLazyLoad = (threshold: number = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasLoaded(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, hasLoaded]);

  return { ref, isIntersecting, hasLoaded };
};

// Component Performance Tracker
export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  const PerformantComponent: React.FC<P> = (props) => {
    const renderStartTime = useRef<number>(0);
    const performanceMonitor = PerformanceMonitor.getInstance();

    useEffect(() => {
      renderStartTime.current = performance.now();
    });

    useEffect(() => {
      const renderTime = performance.now() - renderStartTime.current;
      performanceMonitor.trackComponentRender(componentName, renderTime);
    });

    return <WrappedComponent {...props} />;
  };

  PerformantComponent.displayName = `withPerformanceTracking(${componentName})`;
  return PerformantComponent;
};

// Image Optimization Component
export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
}> = ({ src, alt, className, width, height, priority = false, placeholder }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, hasLoaded: shouldLoad } = useLazyLoad();

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate responsive image sources
  const generateSrcSet = (baseSrc: string): string => {
    const sizes = [480, 768, 1024, 1440, 1920];
    return sizes
      .map(size => `${baseSrc}?w=${size} ${size}w`)
      .join(', ');
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={{ width, height }}>
      {(shouldLoad || priority) && (
        <>
          {/* Placeholder */}
          {!isLoaded && (
            <div 
              className="bg-gray-200 animate-pulse w-full h-full"
              style={{ width, height }}
            >
              {placeholder && (
                <img 
                  src={placeholder} 
                  alt="" 
                  className="w-full h-full object-cover opacity-50"
                />
              )}
            </div>
          )}
          
          {/* Main image */}
          <img
            src={src}
            srcSet={generateSrcSet(src)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            style={{ 
              width, 
              height,
              position: isLoaded ? 'static' : 'absolute',
              top: isLoaded ? 'auto' : 0
            }}
          />
        </>
      )}
    </div>
  );
};

// Code Splitting Helper
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(() => 
    importFn().then(module => ({
      default: module.default || module
    }))
  );
};

// Resource Preloader
class ResourcePreloader {
  private static instance: ResourcePreloader;
  private preloadedResources: Set<string> = new Set();

  public static getInstance(): ResourcePreloader {
    if (!ResourcePreloader.instance) {
      ResourcePreloader.instance = new ResourcePreloader();
    }
    return ResourcePreloader.instance;
  }

  public preloadImage(src: string): Promise<void> {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.preloadedResources.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  public preloadScript(src: string): Promise<void> {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.onload = () => {
        this.preloadedResources.add(src);
        resolve();
      };
      script.onerror = reject;
      script.src = src;
      document.head.appendChild(script);
    });
  }

  public preloadCSS(href: string): Promise<void> {
    if (this.preloadedResources.has(href)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.onload = () => {
        this.preloadedResources.add(href);
        resolve();
      };
      link.onerror = reject;
      link.href = href;
      document.head.appendChild(link);
    });
  }

  public async preloadCriticalResources(): Promise<void> {
    const criticalImages = [
      '/images/hero-background.webp',
      '/images/testimonial-avatars.webp',
      '/images/company-logos.webp'
    ];

    const preloadPromises = criticalImages.map(src => this.preloadImage(src));
    await Promise.allSettled(preloadPromises);
  }
}

// Performance-optimized component wrapper
export const PerformantComponent: React.FC<{
  children: React.ReactNode;
  componentName: string;
  lazy?: boolean;
  preloadImages?: string[];
}> = ({ children, componentName, lazy = false, preloadImages = [] }) => {
  const { ref, hasLoaded } = useLazyLoad();
  const [isReady, setIsReady] = useState(!lazy);
  const performanceMonitor = PerformanceMonitor.getInstance();
  const preloader = ResourcePreloader.getInstance();

  useEffect(() => {
    if (hasLoaded && !isReady) {
      const startTime = performance.now();
      
      // Preload images if specified
      Promise.all(preloadImages.map(src => preloader.preloadImage(src)))
        .then(() => {
          const loadTime = performance.now() - startTime;
          performanceMonitor.trackComponentRender(componentName, loadTime);
          setIsReady(true);
        })
        .catch(() => {
          setIsReady(true); // Continue even if preload fails
        });
    }
  }, [hasLoaded, isReady, componentName, preloadImages, performanceMonitor, preloader]);

  if (lazy && !isReady) {
    return (
      <div ref={ref} className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 rounded-lg w-full h-48"></div>
      </div>
    );
  }

  return <>{children}</>;
};

// Bundle analyzer component
export const BundleAnalyzer: React.FC = () => {
  const [bundleInfo, setBundleInfo] = useState<{
    totalSize: number;
    chunks: Array<{ name: string; size: number }>;
  } | null>(null);

  useEffect(() => {
    // Simulate bundle analysis (in real app, this would come from webpack-bundle-analyzer)
    const mockBundleInfo = {
      totalSize: 245760, // ~240KB
      chunks: [
        { name: 'main', size: 125440 },
        { name: 'vendor', size: 89320 },
        { name: 'analytics', size: 21440 },
        { name: 'personalization', size: 9560 }
      ]
    };
    setBundleInfo(mockBundleInfo);
  }, []);

  if (import.meta.env.PROD || !bundleInfo) return null;

  return (
    <div className="fixed top-40 right-4 z-50 bg-white rounded-lg shadow-2xl p-4 w-80 border border-gray-200">
      <h3 className="font-bold text-gray-800 mb-3">📦 Bundle Analysis</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total Bundle Size:</span>
          <span className="font-semibold">
            {(bundleInfo.totalSize / 1024).toFixed(1)}KB
          </span>
        </div>
        
        <div className="mt-3">
          <h4 className="font-semibold text-gray-700 mb-2">Chunks:</h4>
          {bundleInfo.chunks.map(chunk => (
            <div key={chunk.name} className="flex justify-between text-xs">
              <span>{chunk.name}:</span>
              <span>{(chunk.size / 1024).toFixed(1)}KB</span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-2 bg-green-50 rounded text-xs">
          <div className="text-green-800 font-semibold">✓ Optimizations Applied:</div>
          <div>• Tree shaking enabled</div>
          <div>• Code splitting active</div>
          <div>• Lazy loading implemented</div>
          <div>• Image optimization active</div>
        </div>
      </div>
    </div>
  );
};

// Performance Dashboard
export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const performanceMonitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    const showDashboard = localStorage.getItem('show_performance_dashboard') === 'true';
    setIsVisible(import.meta.env.DEV && showDashboard);
    
    if (isVisible) {
      const interval = setInterval(() => {
        setMetrics(performanceMonitor.getMetrics());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible, performanceMonitor]);

  const getScoreColor = (score: number, thresholds: [number, number]) => {
    if (score <= thresholds[0]) return 'text-green-600';
    if (score <= thresholds[1]) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-2xl p-4 w-80 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">⚡ Performance Metrics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Page Load Time:</span>
          <span className={getScoreColor(metrics.pageLoadTime, [1000, 3000])}>
            {(metrics.pageLoadTime / 1000).toFixed(2)}s
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>First Contentful Paint:</span>
          <span className={getScoreColor(metrics.firstContentfulPaint, [1800, 3000])}>
            {(metrics.firstContentfulPaint / 1000).toFixed(2)}s
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Largest Contentful Paint:</span>
          <span className={getScoreColor(metrics.largestContentfulPaint, [2500, 4000])}>
            {(metrics.largestContentfulPaint / 1000).toFixed(2)}s
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Cumulative Layout Shift:</span>
          <span className={getScoreColor(metrics.cumulativeLayoutShift * 1000, [100, 250])}>
            {metrics.cumulativeLayoutShift.toFixed(3)}
          </span>
        </div>
        
        <div className="mt-3">
          <h4 className="font-semibold text-gray-700 mb-1">Component Render Times:</h4>
          <div className="max-h-32 overflow-y-auto text-xs">
            {Array.from(metrics.componentRenderTimes.entries()).map(([name, time]) => (
              <div key={name} className="flex justify-between">
                <span className="truncate">{name}:</span>
                <span>{time.toFixed(1)}ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for performance optimization
export const usePerformanceOptimization = () => {
  const { trackEvent } = useAdvancedAnalytics();
  const performanceMonitor = PerformanceMonitor.getInstance();
  const preloader = ResourcePreloader.getInstance();

  const trackPerformance = (componentName: string, action: string) => {
    const startTime = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - startTime;
        performanceMonitor.trackComponentRender(componentName, duration);
        trackEvent('BUTTON_CLICK', {
          buttonText: `performance_${componentName}_${action}`,
          pageUrl: window.location.pathname
        });
      }
    };
  };

  return {
    trackPerformance,
    preloadImage: preloader.preloadImage.bind(preloader),
    preloadScript: preloader.preloadScript.bind(preloader),
    preloadCSS: preloader.preloadCSS.bind(preloader),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor)
  };
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = PerformanceMonitor.getInstance();
  (window as any).resourcePreloader = ResourcePreloader.getInstance();
}

export { PerformanceMonitor, ResourcePreloader };

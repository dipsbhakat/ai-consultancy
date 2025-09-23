// Production Configuration System
interface AppConfig {
  environment: 'development' | 'production' | 'staging';
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  features: {
    aiFeatures: boolean;
    chatbot: boolean;
    leadScoring: boolean;
    personalization: boolean;
    abTesting: boolean;
    enterpriseAI: boolean;
    businessIntelligence: boolean;
    competitiveIntelligence: boolean;
    analytics: boolean;
    errorReporting: boolean;
    performanceMonitoring: boolean;
  };
  security: {
    cspEnabled: boolean;
    securityHeaders: boolean;
    csrfProtection: boolean;
  };
  performance: {
    cacheDuration: number;
    enableCache: boolean;
    rateLimitPerMinute: number;
  };
  monitoring: {
    sentryDsn?: string;
    analyticsId?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    enableConsoleLogs: boolean;
  };
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): AppConfig {
    const env = import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development';
    
    return {
      environment: env as 'development' | 'production' | 'staging',
      api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
        timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
        retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
        retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
      },
      features: {
        aiFeatures: this.getBooleanEnv('VITE_ENABLE_AI_FEATURES', true),
        chatbot: this.getBooleanEnv('VITE_ENABLE_CHATBOT', true),
        leadScoring: this.getBooleanEnv('VITE_ENABLE_LEAD_SCORING', true),
        personalization: this.getBooleanEnv('VITE_ENABLE_PERSONALIZATION', true),
        abTesting: this.getBooleanEnv('VITE_ENABLE_AB_TESTING', true),
        enterpriseAI: this.getBooleanEnv('VITE_ENABLE_ENTERPRISE_AI', true),
        businessIntelligence: this.getBooleanEnv('VITE_ENABLE_BUSINESS_INTELLIGENCE', true),
        competitiveIntelligence: this.getBooleanEnv('VITE_ENABLE_COMPETITIVE_INTELLIGENCE', true),
        analytics: this.getBooleanEnv('VITE_ENABLE_ANALYTICS', true),
        errorReporting: this.getBooleanEnv('VITE_ENABLE_ERROR_REPORTING', env === 'production'),
        performanceMonitoring: this.getBooleanEnv('VITE_ENABLE_PERFORMANCE_MONITORING', env === 'production'),
      },
      security: {
        cspEnabled: this.getBooleanEnv('VITE_ENABLE_CSP', env === 'production'),
        securityHeaders: this.getBooleanEnv('VITE_ENABLE_SECURITY_HEADERS', env === 'production'),
        csrfProtection: this.getBooleanEnv('VITE_CSRF_PROTECTION', env === 'production'),
      },
      performance: {
        cacheDuration: parseInt(import.meta.env.VITE_CACHE_DURATION || '300000'),
        enableCache: this.getBooleanEnv('VITE_ENABLE_CACHE', true),
        rateLimitPerMinute: parseInt(import.meta.env.VITE_RATE_LIMIT_PER_MINUTE || '100'),
      },
      monitoring: {
        sentryDsn: import.meta.env.VITE_SENTRY_DSN,
        analyticsId: import.meta.env.VITE_ANALYTICS_ID,
        logLevel: (import.meta.env.VITE_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
        enableConsoleLogs: this.getBooleanEnv('VITE_ENABLE_CONSOLE_LOGS', env !== 'production'),
      },
    };
  }

  private getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  public isProduction(): boolean {
    return this.config.environment === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  public isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  public getApiConfig() {
    return this.config.api;
  }

  public getSecurityConfig() {
    return this.config.security;
  }

  public getPerformanceConfig() {
    return this.config.performance;
  }

  public getMonitoringConfig() {
    return this.config.monitoring;
  }
}

// Export singleton instance
export const config = ConfigManager.getInstance();
export type { AppConfig };

// Production logging utility
export class Logger {
  private static config = ConfigManager.getInstance().getMonitoringConfig();

  private static shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevel = this.config.logLevel;
    const currentLevelIndex = levels.indexOf(level);
    const configLevelIndex = levels.indexOf(configLevel);
    
    return currentLevelIndex >= configLevelIndex && this.config.enableConsoleLogs;
  }

  public static debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  public static info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  public static warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  public static error(message: string, error?: Error, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error || '', ...args);
    }
    
    // Send to monitoring service in production
    if (ConfigManager.getInstance().isProduction() && this.config.sentryDsn) {
      this.sendToMonitoring(message, error);
    }
  }

  private static sendToMonitoring(message: string, error?: Error): void {
    // Implementation for error monitoring service (e.g., Sentry)
    try {
      // Example: Send to Sentry or other monitoring service
      fetch('/api/v1/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          error: error?.message,
          stack: error?.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(() => {
        // Silently fail monitoring to avoid recursive errors
      });
    } catch {
      // Silently fail
    }
  }
}

export default ConfigManager;

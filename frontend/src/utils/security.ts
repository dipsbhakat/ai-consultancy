import { config, Logger } from '../config/production';

// Security headers and CSP configuration
export class SecurityManager {
  private static instance: SecurityManager;

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  public init() {
    if (!config.isProduction()) {
      Logger.info('Security manager initialized in development mode');
      return;
    }

    this.setupCSP();
    this.setupSecurityHeaders();
    this.initializeInputSanitization();
    this.setupRateLimiting();
  }

  private setupCSP() {
    if (!config.getSecurityConfig().cspEnabled) return;

    // Get the correct API base URL from config
    const apiConfig = config.getApiConfig();
    const apiBaseUrl = apiConfig.baseUrl;
    
    // Extract the domain from the API URL
    const apiUrl = new URL(apiBaseUrl);
    const apiDomain = apiUrl.origin;

    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      // Allow connections to our backend API and analytics
      `connect-src 'self' ${apiDomain} ${apiBaseUrl} https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ];

    const cspContent = cspDirectives.join('; ');
    
    // Remove any existing CSP meta tags first
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCSP) {
      existingCSP.remove();
    }
    
    // Create new meta tag for CSP
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspContent;
    document.head.appendChild(meta);

    Logger.info('Content Security Policy configured', { 
      apiDomain, 
      apiBaseUrl,
      cspContent 
    });
  }

  private setupSecurityHeaders() {
    // These would typically be set by the server, but we can add some client-side protections
    if (config.getSecurityConfig().securityHeaders) {
      // Prevent clickjacking
      if (window.self !== window.top) {
        document.body.style.display = 'none';
        Logger.warn('Potential clickjacking attempt detected');
      }

      // Disable right-click in production (optional)
      if (config.isProduction()) {
        document.addEventListener('contextmenu', (e) => {
          e.preventDefault();
        });
      }
    }
  }

  private initializeInputSanitization() {
    // Sanitize all form inputs
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.type === 'text') {
        target.value = this.sanitizeInput(target.value);
      }
    });
  }

  private setupRateLimiting() {
    const requests = new Map<string, number[]>();
    const rateLimitPerMinute = config.getPerformanceConfig().rateLimitPerMinute;

    // Override fetch to add rate limiting
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0].toString();
      const now = Date.now();
      const windowStart = now - 60000; // 1 minute window

      if (!requests.has(url)) {
        requests.set(url, []);
      }

      const urlRequests = requests.get(url)!;
      // Remove old requests outside the window
      const recentRequests = urlRequests.filter(time => time > windowStart);
      requests.set(url, recentRequests);

      if (recentRequests.length >= rateLimitPerMinute) {
        Logger.warn(`Rate limit exceeded for ${url}`);
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      recentRequests.push(now);
      return originalFetch(...args);
    };
  }

  public sanitizeInput(input: string): string {
    // Basic XSS prevention
    return input
      .replace(/[<>'"]/g, '') // Remove dangerous characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  public validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  public generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  public validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }
}

// API Security Layer
export class SecureAPIClient {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    const apiConfig = config.getApiConfig();
    this.baseUrl = apiConfig.baseUrl;
    this.timeout = apiConfig.timeout;
    this.retryAttempts = apiConfig.retryAttempts;
    this.retryDelay = apiConfig.retryDelay;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    // Add CSRF token if available
    const csrfToken = sessionStorage.getItem('csrf_token');
    if (csrfToken) {
      defaultHeaders['X-CSRF-Token'] = csrfToken;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await this.fetchWithRetry(url, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      Logger.error(`API request failed: ${url}`, error as Error);
      throw error;
    }
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    attempt: number = 1
  ): Promise<Response> {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (attempt < this.retryAttempts) {
        Logger.warn(`API request attempt ${attempt} failed, retrying...`, error);
        await this.delay(this.retryDelay * attempt);
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Data encryption utilities
export class EncryptionUtils {
  public static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  public static encryptLocalData(data: string, key: string): string {
    // Simple XOR encryption for local storage (not cryptographically secure)
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  public static decryptLocalData(encryptedData: string, key: string): string {
    try {
      const data = atob(encryptedData);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch {
      return '';
    }
  }
}

// Initialize security manager
export const securityManager = SecurityManager.getInstance();
export const apiClient = new SecureAPIClient();

export default SecurityManager;

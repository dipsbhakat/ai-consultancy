// API configuration for different environments
const getApiBaseUrl = (): string => {
  // In production, use environment variable or deployed backend URL
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || 'https://ai-consultancy-backend-nodejs.onrender.com/api/v1';
  }
  
  // In development, use local backend
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const ENDPOINTS = {
  TESTIMONIALS: '/contact/testimonials',
  SERVICES: '/contact/services',
  CONTACT_SUBMIT: '/contact/submit',
  CONTACT_SUBMISSIONS: '/contact/submissions',
  HEALTH: '/health',
} as const;

// API client with error handling and retries
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async fetchWithRetry(
    endpoint: string, 
    options: RequestInit = {}, 
    retries: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retries > 0 && error instanceof Error && !error.name.includes('Abort')) {
        console.warn(`Request failed, retrying... (${API_CONFIG.RETRY_ATTEMPTS - retries + 1}/${API_CONFIG.RETRY_ATTEMPTS})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (API_CONFIG.RETRY_ATTEMPTS - retries + 1)));
        return this.fetchWithRetry(endpoint, options, retries - 1);
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.fetchWithRetry(endpoint);
    const data = await response.json();
    return data;
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.fetchWithRetry(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.fetchWithRetry(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.fetchWithRetry(endpoint, {
      method: 'DELETE',
    });
    return response.json();
  }
}

export const apiClient = new ApiClient();

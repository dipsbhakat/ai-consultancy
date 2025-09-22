import {
  AdminUser,
  ContactSubmission,
  AuditLog,
  DashboardStats,
  LoginRequest,
  AuthResponse,
  CreateAdminRequest,
  UpdateAdminRequest,
  UpdateContactRequest,
  ContactStatus,
  ContactPriority,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

class AdminAPIService {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenRefreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
    // Initialize tokens from localStorage
    const savedAccessToken = localStorage.getItem('admin_access_token');
    const savedRefreshToken = localStorage.getItem('admin_refresh_token');
    if (savedAccessToken && savedRefreshToken) {
      this.accessToken = savedAccessToken;
      this.refreshToken = savedRefreshToken;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Ensure we have a valid access token
    const token = await this.getValidAccessToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - try to refresh token
        const refreshedToken = await this.refreshAccessToken();
        if (refreshedToken) {
          // Retry with new token
          const retryConfig: RequestInit = {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshedToken}`,
              ...options.headers,
            },
          };
          const retryResponse = await fetch(url, retryConfig);
          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }
        // If refresh failed, clear tokens and throw
        this.clearTokens();
        throw new Error('Authentication failed');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async getValidAccessToken(): Promise<string | null> {
    if (this.accessToken) {
      // Check if token is expired (simple check - in production, decode JWT)
      try {
        const tokenParts = this.accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const now = Math.floor(Date.now() / 1000);
          
          // If token expires in less than 1 minute, refresh it
          if (payload.exp && payload.exp - now < 60) {
            return await this.refreshAccessToken();
          }
        }
      } catch (error) {
        console.warn('Error checking token expiry:', error);
      }
    }
    
    return this.accessToken;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    // Prevent multiple simultaneous refresh requests
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.performTokenRefresh();
    try {
      const newToken = await this.tokenRefreshPromise;
      return newToken;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseURL}/admin/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return null;
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('admin_access_token', accessToken);
    localStorage.setItem('admin_refresh_token', refreshToken);
  }

  setToken(token: string) {
    // Backward compatibility - treat as access token
    this.accessToken = token;
    localStorage.setItem('admin_access_token', token);
    // Clear old token storage
    localStorage.removeItem('admin_token');
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenRefreshPromise = null;
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_token'); // Clean up old storage
  }

  clearToken() {
    // Backward compatibility
    this.clearTokens();
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<any>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store both tokens
    this.setTokens(response.accessToken, response.refreshToken);
    
    // Return the expected AuthResponse format
    return {
      accessToken: response.accessToken,
      admin: response.admin,
    };
  }

  async logout(): Promise<void> {
    try {
      await this.request('/admin/auth/logout', { 
        method: 'POST',
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });
    } finally {
      this.clearTokens();
    }
  }

  async logoutFromAllDevices(): Promise<void> {
    try {
      await this.request('/admin/auth/logout-all', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  async getActiveSessions(): Promise<any> {
    return this.request('/admin/auth/sessions');
  }

  async getProfile(): Promise<AdminUser> {
    return this.request<AdminUser>('/admin/auth/profile');
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/admin/dashboard');
  }

  // Admin Management
  async getAllAdmins(): Promise<AdminUser[]> {
    return this.request<AdminUser[]>('/admin/users');
  }

  async createAdmin(adminData: CreateAdminRequest): Promise<AdminUser> {
    return this.request<AdminUser>('/admin/auth/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  async updateAdmin(adminId: string, updates: UpdateAdminRequest): Promise<AdminUser> {
    return this.request<AdminUser>(`/admin/users/${adminId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Contact Management
  async getContacts(params: {
    page?: number;
    limit?: number;
    status?: ContactStatus;
    priority?: ContactPriority;
    assignedTo?: string;
    search?: string;
  } = {}): Promise<{
    contacts: ContactSubmission[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const query = searchParams.toString();
    return this.request(`/admin/contacts${query ? `?${query}` : ''}`);
  }

  async updateContact(contactId: string, updates: UpdateContactRequest): Promise<ContactSubmission> {
    return this.request<ContactSubmission>(`/admin/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Audit Logs
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    adminId?: string;
    resource?: string;
  } = {}): Promise<{
    logs: AuditLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const query = searchParams.toString();
    return this.request(`/admin/audit-logs${query ? `?${query}` : ''}`);
  }
}

export const adminAPI = new AdminAPIService();

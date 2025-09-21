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
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setToken(response.accessToken);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/admin/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
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

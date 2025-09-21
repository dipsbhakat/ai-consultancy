// Admin System Types

export enum AdminRole {
  SUPERADMIN = 'SUPERADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum ContactStatus {
  NEW = 'NEW',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  ARCHIVED = 'ARCHIVED',
}

export enum ContactPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ContactSource {
  WEBSITE = 'WEBSITE',
  EMAIL = 'EMAIL',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  OTHER = 'OTHER',
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  loginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  consent: boolean;
  status: ContactStatus;
  priority: ContactPriority;
  source: ContactSource;
  tags: string[];
  internalNotes?: string;
  assignedTo?: string;
  assignedUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

export interface DashboardStats {
  contacts: {
    total: number;
    new: number;
    inReview: number;
    resolved: number;
    urgent: number;
    recent: number;
  };
  admins: {
    total: number;
    active: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: AdminRole;
  };
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: AdminRole;
}

export interface UpdateAdminRequest {
  firstName?: string;
  lastName?: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface UpdateContactRequest {
  status?: ContactStatus;
  priority?: ContactPriority;
  assignedTo?: string;
  internalNotes?: string;
  tags?: string[];
}

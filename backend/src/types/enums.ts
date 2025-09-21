// Custom type definitions for SQLite compatibility

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

export enum EventType {
  PAGEVIEW = 'PAGEVIEW',
  CTA_CLICK = 'CTA_CLICK',
}

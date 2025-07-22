export interface User {
  id: number;
  email: string;
  name: string;
  organization: string;
  role: 'admin' | 'user' | 'guest';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  name: string;
  organization: string;
  role: 'admin' | 'user' | 'guest';
}

export interface UserUpdateRequest {
  name?: string;
  organization?: string;
  role?: 'admin' | 'user' | 'guest';
  isActive?: boolean;
}

export interface FetchLog {
  id: number;
  bidNtceNo?: string;
  requestedAt: string;
  resultCode: string;
  status: 'success' | 'failed' | 'pending';
  errorMessage?: string;
  responseTime?: number;
  dataCount?: number;
}

export interface SystemLog {
  id: number;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: 'user_activity' | 'api_call' | 'system' | 'security';
  message: string;
  details?: Record<string, any>;
  userId?: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface NotificationConfig {
  id: number;
  type: 'new_bid' | 'urgent' | 'deadline' | 'achievement';
  channel: 'web' | 'email' | 'push';
  frequency: 'immediate' | 'daily' | 'weekly';
  recipients: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ReportConfig {
  id: number;
  type: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  isActive: boolean;
  schedule: string; // cron expression
  createdAt: string;
  updatedAt?: string;
}

export interface SystemStatistics {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  bids: {
    total: number;
    newToday: number;
    syncSuccess: number;
  };
  notifications: {
    total: number;
    unread: number;
    urgent: number;
  };
  system: {
    uptime: string;
    lastBackup: string;
    diskUsage: string;
    memoryUsage: string;
  };
}

export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  description?: string;
  category: 'api' | 'security' | 'notification' | 'system';
  isEncrypted: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BackupInfo {
  id: number;
  filename: string;
  size: number;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed' | 'in_progress';
  createdAt: string;
  downloadUrl?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationInfo;
}

export interface LogsResponse {
  logs: SystemLog[];
  pagination: PaginationInfo;
}

export interface FetchLogsResponse {
  logs: FetchLog[];
  pagination: PaginationInfo;
}
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
  updatedAt: string;
}

// 타입 단언 제거
export const createNotificationConfig = (data: Partial<NotificationConfig>): NotificationConfig => {
  return {
    id: data.id ?? 0,
    type: data.type ?? 'new_bid',
    channel: data.channel ?? 'web',
    frequency: data.frequency ?? 'immediate',
    recipients: data.recipients ?? [],
    isActive: data.isActive ?? true,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString()
  };
};

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

// 품질/감사 기능 타입 정의
export interface QualityMetrics {
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    successRate: number;
  };
  dataQuality: {
    totalRecords: number;
    validRecords: number;
    duplicateRecords: number;
    missingDataRate: number;
  };
  apiPerformance: {
    totalCalls: number;
    successCalls: number;
    failedCalls: number;
    averageResponseTime: number;
  };
  userActivity: {
    activeUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    pageViews: number;
  };
  securityMetrics: {
    failedLogins: number;
    suspiciousActivities: number;
    blockedRequests: number;
    lastSecurityScan: string;
  };
}

export interface AuditLog {
  id: number;
  userId?: number;
  userName?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'user_activity' | 'data_access' | 'system_change' | 'security_event';
  timestamp: string;
  sessionId?: string;
  requestId?: string;
}

export interface QualityReport {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalIssues: number;
    criticalIssues: number;
    resolvedIssues: number;
    openIssues: number;
  };
  trends: {
    daily: Array<{
      date: string;
      issues: number;
      resolved: number;
    }>;
    weekly: Array<{
      week: string;
      issues: number;
      resolved: number;
    }>;
  };
  categories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  recommendations: Array<{
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
  }>;
}

export interface AuditSettings {
  id: number;
  enabled: boolean;
  retentionDays: number;
  logLevel: 'all' | 'important' | 'critical';
  categories: string[];
  excludedUsers: number[];
  excludedActions: string[];
  realTimeAlerts: boolean;
  alertThresholds: {
    failedLogins: number;
    suspiciousActivities: number;
    dataAccess: number;
  };
  exportSettings: {
    format: 'json' | 'csv' | 'xml';
    includeDetails: boolean;
    compression: boolean;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: PaginationInfo;
}

export interface QualityMetricsResponse {
  metrics: QualityMetrics;
  lastUpdated: string;
}

export interface QualityReportResponse {
  report: QualityReport;
  generatedAt: string;
}
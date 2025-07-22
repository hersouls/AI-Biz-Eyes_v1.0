export interface Notification {
  id: number;
  type: 'urgent' | 'deadline' | 'missing' | 'duplicate' | 'new' | 'update';
  bidNtceNo?: string;
  title: string;
  message?: string;
  status: 'unread' | 'read' | 'important' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: number;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  emailNotifications: {
    enabled: boolean;
    types: string[];
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  webNotifications: {
    enabled: boolean;
    types: string[];
  };
  pushNotifications: {
    enabled: boolean;
  };
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  summary: {
    newBids: number;
    deadlineBids: number;
    missingBids: number;
    duplicateBids: number;
    successRate: number;
  };
  charts: {
    bidTypeDistribution: Array<{ type: string; count: number }>;
    statusDistribution: Array<{ status: string; count: number }>;
    weeklyTrend: Array<{ date: string; count: number }>;
  };
  generatedAt: string;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface NotificationFilter {
  type?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  urgent: number;
  high: number;
  normal: number;
  low: number;
}
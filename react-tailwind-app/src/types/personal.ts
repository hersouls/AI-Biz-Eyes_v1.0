export interface UserProfile {
  id: number;
  email: string;
  name: string;
  organization: string;
  role: 'admin' | 'user' | 'guest';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
}

export interface NotificationSettings {
  id: number;
  userId: number;
  newBid: boolean;
  urgent: boolean;
  deadline: boolean;
  achievement: boolean;
  webNotification: boolean;
  emailNotification: boolean;
  pushNotification: boolean;
  immediateNotification: boolean;
  dailyNotification: boolean;
  weeklyNotification: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ReportSettings {
  id: number;
  userId: number;
  dailyReport: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
  emailReport: boolean;
  webReport: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardSettings {
  id: number;
  userId: number;
  widgets: DashboardWidget[];
  defaultFilters: DashboardFilters;
  layout: DashboardLayout;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'overview' | 'trend' | 'calendar' | 'recommendations' | 'notifications' | 'references' | 'reports';
  isVisible: boolean;
  order: number;
  settings?: Record<string, any>;
}

export interface DashboardFilters {
  organization?: string[];
  businessType?: string[];
  budgetRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: string;
    end?: string;
  };
  status?: string[];
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  widgetPositions: Record<string, { x: number; y: number; width: number; height: number }>;
}

export interface UserActivity {
  id: number;
  userId: number;
  action: 'view_bid' | 'participate_bid' | 'add_reference' | 'view_report' | 'update_settings' | 'export_data';
  targetId?: number;
  targetType?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface UserPerformance {
  userId: number;
  totalBidsViewed: number;
  totalBidsParticipated: number;
  totalReferencesAdded: number;
  totalReportsViewed: number;
  successRate: number;
  averageResponseTime: number;
  lastMonthActivity: number;
  thisMonthActivity: number;
}

export interface PersonalSettings {
  id: number;
  userId: number;
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  autoSave: boolean;
  keyboardShortcuts: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SecuritySettings {
  id: number;
  userId: number;
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'email' | 'sms' | 'app';
  passwordLastChanged?: string;
  loginHistory: LoginHistory[];
  sessionTimeout: number; // minutes
  createdAt: string;
  updatedAt?: string;
}

export interface LoginHistory {
  id: number;
  userId: number;
  loginAt: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  success: boolean;
  failureReason?: string;
}

export interface DataExport {
  id: number;
  userId: number;
  type: 'work_history' | 'settings' | 'all';
  format: 'excel' | 'csv' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  fileSize?: number;
  createdAt: string;
  completedAt?: string;
}

export interface PersonalApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  organization?: string;
  phone?: string;
  department?: string;
  position?: string;
  avatar?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationSettingsUpdateRequest {
  newBid?: boolean;
  urgent?: boolean;
  deadline?: boolean;
  achievement?: boolean;
  webNotification?: boolean;
  emailNotification?: boolean;
  pushNotification?: boolean;
  immediateNotification?: boolean;
  dailyNotification?: boolean;
  weeklyNotification?: boolean;
}

export interface DashboardSettingsUpdateRequest {
  widgets?: DashboardWidget[];
  defaultFilters?: DashboardFilters;
  layout?: DashboardLayout;
}

export interface PersonalSettingsUpdateRequest {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'ko' | 'en';
  timezone?: string;
  dateFormat?: string;
  numberFormat?: string;
  autoSave?: boolean;
  keyboardShortcuts?: boolean;
}

export interface SecuritySettingsUpdateRequest {
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'email' | 'sms' | 'app';
  sessionTimeout?: number;
}
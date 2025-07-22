import axios from 'axios';
import {
  UserProfile,
  NotificationSettings,
  ReportSettings,
  DashboardSettings,
  UserActivity,
  UserPerformance,
  PersonalSettings,
  SecuritySettings,
  DataExport,
  PersonalApiResponse,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  NotificationSettingsUpdateRequest,
  DashboardSettingsUpdateRequest,
  PersonalSettingsUpdateRequest,
  SecuritySettingsUpdateRequest
} from '../types/personal';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock data for development
const mockUserProfile: UserProfile = {
  id: 1,
  email: 'user@example.com',
  name: '홍길동',
  organization: '테크노파크',
  role: 'user',
  isActive: true,
  lastLogin: '2024-07-23T11:30:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  phone: '010-1234-5678',
  department: '사업팀',
  position: '실무자'
};

const mockNotificationSettings: NotificationSettings = {
  id: 1,
  userId: 1,
  newBid: true,
  urgent: true,
  deadline: true,
  achievement: false,
  webNotification: true,
  emailNotification: true,
  pushNotification: false,
  immediateNotification: true,
  dailyNotification: true,
  weeklyNotification: false,
  createdAt: '2024-01-01T00:00:00Z'
};

const mockReportSettings: ReportSettings = {
  id: 1,
  userId: 1,
  dailyReport: true,
  weeklyReport: true,
  monthlyReport: false,
  emailReport: true,
  webReport: true,
  createdAt: '2024-01-01T00:00:00Z'
};

const mockDashboardSettings: DashboardSettings = {
  id: 1,
  userId: 1,
  widgets: [
    { id: 'overview', type: 'overview', isVisible: true, order: 1 },
    { id: 'trend', type: 'trend', isVisible: true, order: 2 },
    { id: 'calendar', type: 'calendar', isVisible: true, order: 3 },
    { id: 'recommendations', type: 'recommendations', isVisible: true, order: 4 },
    { id: 'notifications', type: 'notifications', isVisible: true, order: 5 },
    { id: 'references', type: 'references', isVisible: false, order: 6 },
    { id: 'reports', type: 'reports', isVisible: false, order: 7 }
  ],
  defaultFilters: {
    organization: [],
    businessType: [],
    budgetRange: { min: 0, max: 1000000000 },
    dateRange: { start: '', end: '' },
    status: []
  },
  layout: {
    columns: 3,
    rows: 3,
    widgetPositions: {}
  },
  createdAt: '2024-01-01T00:00:00Z'
};

const mockUserActivities: UserActivity[] = [
  {
    id: 1,
    userId: 1,
    action: 'view_bid',
    targetId: 123,
    targetType: 'bid',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2024-07-23T10:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    action: 'participate_bid',
    targetId: 124,
    targetType: 'bid',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2024-07-22T15:30:00Z'
  },
  {
    id: 3,
    userId: 1,
    action: 'add_reference',
    targetId: 125,
    targetType: 'reference',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2024-07-21T09:15:00Z'
  }
];

const mockUserPerformance: UserPerformance = {
  userId: 1,
  totalBidsViewed: 156,
  totalBidsParticipated: 23,
  totalReferencesAdded: 45,
  totalReportsViewed: 12,
  successRate: 78.5,
  averageResponseTime: 2.3,
  lastMonthActivity: 89,
  thisMonthActivity: 67
};

const mockPersonalSettings: PersonalSettings = {
  id: 1,
  userId: 1,
  theme: 'light',
  language: 'ko',
  timezone: 'Asia/Seoul',
  dateFormat: 'YYYY-MM-DD',
  numberFormat: '#,##0',
  autoSave: true,
  keyboardShortcuts: true,
  createdAt: '2024-01-01T00:00:00Z'
};

const mockSecuritySettings: SecuritySettings = {
  id: 1,
  userId: 1,
  twoFactorEnabled: false,
  sessionTimeout: 30,
  loginHistory: [
    {
      id: 1,
      userId: 1,
      loginAt: '2024-07-23T11:30:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      location: 'Seoul, Korea',
      success: true
    },
    {
      id: 2,
      userId: 1,
      loginAt: '2024-07-22T09:15:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      location: 'Seoul, Korea',
      success: true
    }
  ],
  createdAt: '2024-01-01T00:00:00Z'
};

const mockDataExports: DataExport[] = [
  {
    id: 1,
    userId: 1,
    type: 'work_history',
    format: 'excel',
    status: 'completed',
    fileUrl: '/downloads/work_history_20240723.xlsx',
    fileSize: 2048576,
    createdAt: '2024-07-23T10:00:00Z',
    completedAt: '2024-07-23T10:05:00Z'
  },
  {
    id: 2,
    userId: 1,
    type: 'settings',
    format: 'json',
    status: 'completed',
    fileUrl: '/downloads/settings_20240722.json',
    fileSize: 51200,
    createdAt: '2024-07-22T15:00:00Z',
    completedAt: '2024-07-22T15:01:00Z'
  }
];

export class PersonalService {
  // User Profile
  static async getUserProfile(): Promise<PersonalApiResponse<UserProfile>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/profile`);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: mockUserProfile
      };
    }
  }

  static async updateProfile(data: ProfileUpdateRequest): Promise<PersonalApiResponse<UserProfile>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/profile`, data);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: { ...mockUserProfile, ...data }
      };
    }
  }

  static async changePassword(data: PasswordChangeRequest): Promise<PersonalApiResponse<null>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/password`, data);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다.'
      };
    }
  }

  // Notification Settings
  static async getNotificationSettings(): Promise<PersonalApiResponse<NotificationSettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/notifications`);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: mockNotificationSettings
      };
    }
  }

  static async updateNotificationSettings(data: NotificationSettingsUpdateRequest): Promise<PersonalApiResponse<NotificationSettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/notifications`, data);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: { ...mockNotificationSettings, ...data }
      };
    }
  }

  // Report Settings
  static async getReportSettings(): Promise<PersonalApiResponse<ReportSettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/reports`);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: mockReportSettings
      };
    }
  }

  static async updateReportSettings(data: Partial<ReportSettings>): Promise<PersonalApiResponse<ReportSettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/reports`, data);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: { ...mockReportSettings, ...data }
      };
    }
  }

  // Dashboard Settings
  static async getDashboardSettings(): Promise<PersonalApiResponse<DashboardSettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/dashboard`);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: mockDashboardSettings
      };
    }
  }

  static async updateDashboardSettings(data: DashboardSettingsUpdateRequest): Promise<PersonalApiResponse<DashboardSettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/dashboard`, data);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: { ...mockDashboardSettings, ...data }
      };
    }
  }

  // User Activity
  static async getUserActivities(page: number = 1, limit: number = 20): Promise<PersonalApiResponse<{ activities: UserActivity[]; total: number }>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/activities?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: {
          activities: mockUserActivities,
          total: mockUserActivities.length
        }
      };
    }
  }

  // User Performance
  static async getUserPerformance(): Promise<PersonalApiResponse<UserPerformance>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/performance`);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: mockUserPerformance
      };
    }
  }

  // Personal Settings
  static async getPersonalSettings(): Promise<PersonalApiResponse<PersonalSettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/settings`);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: mockPersonalSettings
      };
    }
  }

  static async updatePersonalSettings(data: PersonalSettingsUpdateRequest): Promise<PersonalApiResponse<PersonalSettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/settings`, data);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: { ...mockPersonalSettings, ...data }
      };
    }
  }

  // Security Settings
  static async getSecuritySettings(): Promise<PersonalApiResponse<SecuritySettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/security`);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: mockSecuritySettings
      };
    }
  }

  static async updateSecuritySettings(data: SecuritySettingsUpdateRequest): Promise<PersonalApiResponse<SecuritySettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/security`, data);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: { ...mockSecuritySettings, ...data }
      };
    }
  }

  // Data Export
  static async getDataExports(): Promise<PersonalApiResponse<DataExport[]>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/exports`);
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: mockDataExports
      };
    }
  }

  static async createDataExport(type: 'work_history' | 'settings' | 'all', format: 'excel' | 'csv' | 'json'): Promise<PersonalApiResponse<DataExport>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/personal/exports`, { type, format });
      return response.data;
    } catch (error) {
      // Mock response for development
      const newExport: DataExport = {
        id: mockDataExports.length + 1,
        userId: 1,
        type,
        format,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      return {
        success: true,
        data: newExport
      };
    }
  }

  static async downloadExport(exportId: number, format: 'excel' | 'csv' | 'json'): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/exports/${exportId}/download`);
      return response.data.downloadUrl;
    } catch (error) {
      // Mock response for development
      return `/downloads/export_${exportId}.${format}`;
    }
  }

  // Test notification
  static async testNotification(channel: 'web' | 'email' | 'push'): Promise<PersonalApiResponse<null>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/personal/test-notification`, { channel });
      return response.data;
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        message: `${channel} 알림 테스트가 성공적으로 발송되었습니다.`
      };
    }
  }
}
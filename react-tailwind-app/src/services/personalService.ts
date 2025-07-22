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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

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
    createdAt: '2024-07-22T10:30:00Z',
    details: { bidNo: '2024001', bidTitle: 'IT 시스템 구축 사업' }
  },
  {
    id: 2,
    userId: 1,
    action: 'add_reference',
    targetId: 456,
    targetType: 'reference',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2024-07-22T09:15:00Z',
    details: { referenceTitle: '유사 사업 레퍼런스' }
  },
  {
    id: 3,
    userId: 1,
    action: 'view_report',
    targetId: 789,
    targetType: 'report',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2024-07-21T16:45:00Z',
    details: { reportType: 'weekly', format: 'pdf' }
  }
];

const mockUserPerformance: UserPerformance = {
  userId: 1,
  totalBidsViewed: 45,
  totalBidsParticipated: 20,
  totalReferencesAdded: 12,
  totalReportsViewed: 8,
  averageResponseTime: 30,
  lastMonthActivity: 15,
  thisMonthActivity: 10,
  successRate: 87
};

const mockPersonalSettings: PersonalSettings = {
  id: 1,
  userId: 1,
  language: 'ko',
  timezone: 'Asia/Seoul',
  dateFormat: 'YYYY-MM-DD',
  numberFormat: '1,234.56',
  keyboardShortcuts: true,
  theme: 'light',
  autoSave: true,
  createdAt: '2024-07-01T00:00:00Z'
};

const mockSecuritySettings: SecuritySettings = {
  id: 1,
  userId: 1,
  twoFactorEnabled: false,
  sessionTimeout: 3600,
  loginHistory: [],
  createdAt: '2024-07-01T00:00:00Z'
};

const mockDataExports: DataExport[] = [
  {
    id: 1,
    userId: 1,
    type: 'work_history',
    format: 'excel',
    status: 'completed',
    fileSize: 2048576,
    createdAt: '2024-07-22T10:00:00Z',
    completedAt: '2024-07-22T10:05:00Z'
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class PersonalService {
  static async getUserProfile(): Promise<PersonalApiResponse<UserProfile>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/profile`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(300);
      return {
        success: true,
        data: mockUserProfile,
        message: '프로필 조회 성공'
      };
    }
  }

  static async updateProfile(data: ProfileUpdateRequest): Promise<PersonalApiResponse<UserProfile>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/profile`, data);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(500);
      
      Object.assign(mockUserProfile, data);
      
      return {
        success: true,
        data: mockUserProfile,
        message: '프로필 업데이트 성공'
      };
    }
  }

  static async changePassword(data: PasswordChangeRequest): Promise<PersonalApiResponse<null>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/password`, data);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(500);
      
      return {
        success: true,
        data: null,
        message: '비밀번호 변경 성공'
      };
    }
  }

  static async getNotificationSettings(): Promise<PersonalApiResponse<NotificationSettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/notifications`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(300);
      return {
        success: true,
        data: mockNotificationSettings,
        message: '알림 설정 조회 성공'
      };
    }
  }

  static async updateNotificationSettings(data: NotificationSettingsUpdateRequest): Promise<PersonalApiResponse<NotificationSettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/notifications`, data);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(500);
      
      Object.assign(mockNotificationSettings, data);
      
      return {
        success: true,
        data: mockNotificationSettings,
        message: '알림 설정 업데이트 성공'
      };
    }
  }

  static async getReportSettings(): Promise<PersonalApiResponse<ReportSettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/reports`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(300);
      return {
        success: true,
        data: mockReportSettings,
        message: '리포트 설정 조회 성공'
      };
    }
  }

  static async updateReportSettings(data: Partial<ReportSettings>): Promise<PersonalApiResponse<ReportSettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/reports`, data);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(500);
      
      Object.assign(mockReportSettings, data);
      
      return {
        success: true,
        data: mockReportSettings,
        message: '리포트 설정 업데이트 성공'
      };
    }
  }

  static async getDashboardSettings(): Promise<PersonalApiResponse<DashboardSettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/dashboard`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(300);
      return {
        success: true,
        data: mockDashboardSettings,
        message: '대시보드 설정 조회 성공'
      };
    }
  }

  static async updateDashboardSettings(data: DashboardSettingsUpdateRequest): Promise<PersonalApiResponse<DashboardSettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/dashboard`, data);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(500);
      
      if (data.widgets) {
        mockDashboardSettings.widgets = data.widgets;
      }
      if (data.defaultFilters) {
        mockDashboardSettings.defaultFilters = { ...mockDashboardSettings.defaultFilters, ...data.defaultFilters };
      }
      if (data.layout) {
        mockDashboardSettings.layout = { ...mockDashboardSettings.layout, ...data.layout };
      }
      
      return {
        success: true,
        data: mockDashboardSettings,
        message: '대시보드 설정 업데이트 성공'
      };
    }
  }

  static async getUserActivities(page: number = 1, limit: number = 20): Promise<PersonalApiResponse<{ activities: UserActivity[]; total: number }>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/activities?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(500);
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedActivities = mockUserActivities.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: {
          activities: paginatedActivities,
          total: mockUserActivities.length
        },
        message: '활동 내역 조회 성공'
      };
    }
  }

  static async getUserPerformance(): Promise<PersonalApiResponse<UserPerformance>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/performance`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(300);
      return {
        success: true,
        data: mockUserPerformance,
        message: '성과 조회 성공'
      };
    }
  }

  static async getPersonalSettings(): Promise<PersonalApiResponse<PersonalSettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/settings`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(300);
      return {
        success: true,
        data: mockPersonalSettings,
        message: '개인 설정 조회 성공'
      };
    }
  }

  static async updatePersonalSettings(data: PersonalSettingsUpdateRequest): Promise<PersonalApiResponse<PersonalSettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/settings`, data);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(500);
      
      Object.assign(mockPersonalSettings, data);
      
      return {
        success: true,
        data: mockPersonalSettings,
        message: '개인 설정 업데이트 성공'
      };
    }
  }

  static async getSecuritySettings(): Promise<PersonalApiResponse<SecuritySettings>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/security`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(300);
      return {
        success: true,
        data: mockSecuritySettings,
        message: '보안 설정 조회 성공'
      };
    }
  }

  static async updateSecuritySettings(data: SecuritySettingsUpdateRequest): Promise<PersonalApiResponse<SecuritySettings>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/personal/security`, data);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(500);
      
      Object.assign(mockSecuritySettings, data);
      
      return {
        success: true,
        data: mockSecuritySettings,
        message: '보안 설정 업데이트 성공'
      };
    }
  }

  static async getDataExports(): Promise<PersonalApiResponse<DataExport[]>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/exports`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(300);
      return {
        success: true,
        data: mockDataExports,
        message: '데이터 내보내기 목록 조회 성공'
      };
    }
  }

  static async createDataExport(type: 'work_history' | 'settings' | 'all', format: 'excel' | 'csv' | 'json'): Promise<PersonalApiResponse<DataExport>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/personal/exports`, { type, format });
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(1000);
      
      const newExport: DataExport = {
        id: Date.now(),
        userId: 1,
        type,
        format,
        status: 'processing',
        fileSize: undefined,
        createdAt: new Date().toISOString(),
        completedAt: undefined
      };
      
      mockDataExports.push(newExport);
      
      return {
        success: true,
        data: newExport,
        message: '데이터 내보내기 요청 성공'
      };
    }
  }

  static async downloadExport(exportId: number, format: 'excel' | 'csv' | 'json'): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal/exports/${exportId}/download`);
      return response.data.downloadUrl;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(500);
      
      const exportItem = mockDataExports.find(e => e.id === exportId);
      if (!exportItem) {
        throw new Error('내보내기 항목을 찾을 수 없습니다.');
      }
      
      return `/mock-exports/export_${exportId}.${format}`;
    }
  }

  static async testNotification(channel: 'web' | 'email' | 'push'): Promise<PersonalApiResponse<null>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/personal/test-notification`, { channel });
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      await delay(1000);
      
      return {
        success: true,
        data: null,
        message: `${channel} 알림 테스트 성공`
      };
    }
  }
}
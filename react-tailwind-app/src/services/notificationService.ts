import { Notification, NotificationSettings, Report, NotificationFilter, NotificationStats } from '../types/notification';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock data for development
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'bid',
    title: '새로운 입찰 공고',
    message: '2024년도 IT 시스템 구축 사업 입찰이 등록되었습니다.',
    priority: 'high',
    status: 'unread',
    assignedTo: 1,
    createdAt: '2024-07-22T10:30:00Z',
    readAt: null,
    metadata: { bidId: 123, bidNo: '2024001' }
  },
  {
    id: 2,
    type: 'deadline',
    title: '입찰 마감 임박',
    message: '소프트웨어 개발 사업 입찰이 3일 후 마감됩니다.',
    priority: 'urgent',
    status: 'unread',
    assignedTo: 1,
    createdAt: '2024-07-22T09:15:00Z',
    readAt: null,
    metadata: { bidId: 124, bidNo: '2024002', deadline: '2024-07-25T18:00:00Z' }
  },
  {
    id: 3,
    type: 'achievement',
    title: '입찰 성과 달성',
    message: '이번 달 목표 입찰 건수를 달성했습니다.',
    priority: 'normal',
    status: 'read',
    assignedTo: 1,
    createdAt: '2024-07-21T16:45:00Z',
    readAt: '2024-07-21T17:00:00Z',
    metadata: { achievement: 'monthly_goal', count: 15 }
  }
];

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

const mockNotificationStats: NotificationStats = {
  total: 45,
  unread: 12,
  read: 33,
  byType: {
    bid: 20,
    deadline: 15,
    achievement: 10
  },
  byPriority: {
    urgent: 8,
    high: 15,
    normal: 22
  },
  byStatus: {
    unread: 12,
    read: 33
  }
};

const mockReports: Report[] = [
  {
    id: '1',
    type: 'daily',
    title: '일일 입찰 현황 보고서',
    status: 'completed',
    createdAt: '2024-07-22T00:00:00Z',
    completedAt: '2024-07-22T06:00:00Z',
    downloadUrl: '/reports/daily-2024-07-22.pdf',
    metadata: {
      totalBids: 25,
      newBids: 8,
      closingBids: 3
    }
  },
  {
    id: '2',
    type: 'weekly',
    title: '주간 입찰 분석 보고서',
    status: 'processing',
    createdAt: '2024-07-21T00:00:00Z',
    completedAt: null,
    downloadUrl: null,
    metadata: {
      period: '2024-07-15 ~ 2024-07-21'
    }
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class NotificationService {
  // 알림 목록 조회
  static async getNotifications(filter?: NotificationFilter, page = 1, limit = 20): Promise<{
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      if (filter?.type) params.append('type', filter.type);
      if (filter?.status) params.append('status', filter.status);
      if (filter?.priority) params.append('priority', filter.priority);
      if (filter?.startDate) params.append('startDate', filter.startDate);
      if (filter?.endDate) params.append('endDate', filter.endDate);
      if (filter?.assignedTo) params.append('assignedTo', filter.assignedTo.toString());
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await fetch(`${API_BASE_URL}/notifications?${params}`);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    let filteredNotifications = [...mockNotifications];
    
    if (filter?.type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === filter.type);
    }
    if (filter?.status) {
      filteredNotifications = filteredNotifications.filter(n => n.status === filter.status);
    }
    if (filter?.priority) {
      filteredNotifications = filteredNotifications.filter(n => n.priority === filter.priority);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
    
    return {
      notifications: paginatedNotifications,
      pagination: {
        page,
        limit,
        total: filteredNotifications.length,
        totalPages: Math.ceil(filteredNotifications.length / limit)
      }
    };
  }

  // 알림 상태 변경
  static async updateNotificationStatus(id: number, status: string): Promise<Notification> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);
    
    const notification = mockNotifications.find(n => n.id === id);
    if (!notification) {
      throw new Error('알림을 찾을 수 없습니다.');
    }
    
    notification.status = status;
    if (status === 'read') {
      notification.readAt = new Date().toISOString();
    }
    
    return notification;
  }

  // 알림 설정 조회
  static async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.data.settings;
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);
    return mockNotificationSettings;
  }

  // 알림 설정 저장
  static async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        const data = await response.json();
        return data.data.settings;
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);
    Object.assign(mockNotificationSettings, settings);
    return mockNotificationSettings;
  }

  // 알림 통계 조회
  static async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);
    return mockNotificationStats;
  }

  // 리포트 목록 조회
  static async getReports(type?: string, page = 1, limit = 10): Promise<{
    reports: Report[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await fetch(`${API_BASE_URL}/reports?${params}`);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    let filteredReports = [...mockReports];
    if (type) {
      filteredReports = filteredReports.filter(r => r.type === type);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);
    
    return {
      reports: paginatedReports,
      pagination: {
        page,
        limit,
        total: filteredReports.length,
        totalPages: Math.ceil(filteredReports.length / limit)
      }
    };
  }

  // 리포트 생성
  static async generateReport(type: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string): Promise<Report> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ type, startDate, endDate }),
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(1000);
    
    const newReport: Report = {
      id: Date.now().toString(),
      type,
      title: `${type === 'daily' ? '일일' : type === 'weekly' ? '주간' : '월간'} 입찰 보고서`,
      status: 'processing',
      createdAt: new Date().toISOString(),
      completedAt: null,
      downloadUrl: null,
      metadata: {
        startDate,
        endDate,
        period: `${startDate} ~ ${endDate}`
      }
    };
    
    mockReports.push(newReport);
    return newReport;
  }

  // 리포트 다운로드
  static async downloadReport(reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        return response.blob();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    // Create a mock blob
    const mockContent = `Mock ${format.toUpperCase()} Report Content for Report ID: ${reportId}`;
    return new Blob([mockContent], { type: `application/${format}` });
  }

  // 알림 일괄 업데이트
  static async bulkUpdateNotifications(ids: number[], status: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ids, status }),
      });
      if (response.ok) {
        return;
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    ids.forEach(id => {
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.status = status;
        if (status === 'read') {
          notification.readAt = new Date().toISOString();
        }
      }
    });
  }
}
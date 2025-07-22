import { Notification, NotificationSettings, Report, NotificationFilter, NotificationStats } from '../types/notification';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
    if (!response.ok) {
      throw new Error('알림 목록을 불러오는데 실패했습니다.');
    }
    return response.json();
  }

  // 알림 상태 변경
  static async updateNotificationStatus(id: number, status: string): Promise<Notification> {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('알림 상태 변경에 실패했습니다.');
    }
    return response.json();
  }

  // 알림 설정 조회
  static async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('알림 설정을 불러오는데 실패했습니다.');
    }
    const data = await response.json();
    return data.data.settings;
  }

  // 알림 설정 저장
  static async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('알림 설정 저장에 실패했습니다.');
    }
    const data = await response.json();
    return data.data.settings;
  }

  // 알림 통계 조회
  static async getNotificationStats(): Promise<NotificationStats> {
    const response = await fetch(`${API_BASE_URL}/notifications/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('알림 통계를 불러오는데 실패했습니다.');
    }
    const data = await response.json();
    return data.data;
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
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/reports?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('리포트 목록을 불러오는데 실패했습니다.');
    }
    return response.json();
  }

  // 리포트 생성
  static async generateReport(type: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ type, startDate, endDate }),
    });
    if (!response.ok) {
      throw new Error('리포트 생성에 실패했습니다.');
    }
    const data = await response.json();
    return data.data;
  }

  // 리포트 다운로드
  static async downloadReport(reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('리포트 다운로드에 실패했습니다.');
    }
    return response.blob();
  }

  // 알림 일괄 처리
  static async bulkUpdateNotifications(ids: number[], status: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/bulk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ ids, status }),
    });
    if (!response.ok) {
      throw new Error('알림 일괄 처리에 실패했습니다.');
    }
  }
}
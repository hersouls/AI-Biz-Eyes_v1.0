import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  FetchLog,
  SystemLog,
  NotificationConfig,
  ReportConfig,
  SystemStatistics,
  SystemConfig,
  BackupInfo,
  AdminApiResponse,
  UsersResponse,
  LogsResponse,
  FetchLogsResponse,
  PaginationInfo
} from '../types/admin';
import {
  mockUsers,
  mockSystemLogs,
  mockFetchLogs,
  mockNotificationConfigs,
  mockReportConfigs,
  mockSystemConfigs,
  mockBackups,
  mockSystemStatistics
} from '../utils/mockData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to create paginated response
const createPaginatedResponse = <T>(data: T[], page: number = 1, limit: number = 20): { data: T[], pagination: PaginationInfo } => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit)
    }
  };
};

class AdminService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // 사용자 관리
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    organization?: string;
  }): Promise<AdminApiResponse<UsersResponse>> {
    try {
      // Try real API first
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    let filteredUsers = [...mockUsers];
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (params.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role);
    }
    
    if (params.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === params.isActive);
    }
    
    if (params.organization) {
      filteredUsers = filteredUsers.filter(user => 
        user.organization.toLowerCase().includes(params.organization!.toLowerCase())
      );
    }

    const { data: users, pagination } = createPaginatedResponse(
      filteredUsers, 
      params.page || 1, 
      params.limit || 20
    );

    return {
      success: true,
      data: { users, pagination }
    };
  }

  async createUser(userData: UserCreateRequest): Promise<AdminApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    const newUser: User = {
      id: Date.now(),
      email: userData.email,
      name: userData.name,
      organization: userData.organization,
      role: userData.role,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      data: newUser,
      message: '사용자가 등록되었습니다.'
    };
  }

  async updateUser(id: number, userData: UserUpdateRequest): Promise<AdminApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };

    return {
      success: true,
      data: updatedUser,
      message: '사용자 정보가 수정되었습니다.'
    };
  }

  async deleteUser(id: number): Promise<AdminApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);

    return {
      success: true,
      message: '사용자가 삭제되었습니다.'
    };
  }

  // 시스템 로그
  async getSystemLogs(params: {
    page?: number;
    limit?: number;
    level?: string;
    category?: string;
    userId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<AdminApiResponse<LogsResponse>> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/admin/logs?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    let filteredLogs = [...mockSystemLogs];
    
    if (params.level) {
      filteredLogs = filteredLogs.filter(log => log.level === params.level);
    }
    
    if (params.category) {
      filteredLogs = filteredLogs.filter(log => log.category === params.category);
    }
    
    if (params.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === params.userId);
    }

    const { data: logs, pagination } = createPaginatedResponse(
      filteredLogs, 
      params.page || 1, 
      params.limit || 20
    );

    return {
      success: true,
      data: { logs, pagination }
    };
  }

  // 수집 이력
  async getFetchLogs(params: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AdminApiResponse<FetchLogsResponse>> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/admin/fetch-logs?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    let filteredLogs = [...mockFetchLogs];
    
    if (params.status) {
      filteredLogs = filteredLogs.filter(log => log.status === params.status);
    }

    const { data: logs, pagination } = createPaginatedResponse(
      filteredLogs, 
      params.page || 1, 
      params.limit || 20
    );

    return {
      success: true,
      data: { logs, pagination }
    };
  }

  async retryFailedFetch(logId: number): Promise<AdminApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/fetch-logs/${logId}/retry`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(1000);

    return {
      success: true,
      message: '재시도가 시작되었습니다.'
    };
  }

  // 시스템 통계
  async getSystemStatistics(period?: string): Promise<AdminApiResponse<SystemStatistics>> {
    try {
      const queryParams = period ? `?period=${period}` : '';
      const response = await fetch(`${API_BASE_URL}/admin/statistics${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);

    return {
      success: true,
      data: mockSystemStatistics
    };
  }

  // 알림 설정
  async getNotificationConfigs(): Promise<AdminApiResponse<NotificationConfig[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notification-configs`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);

    return {
      success: true,
      data: mockNotificationConfigs
    };
  }

  async updateNotificationConfig(id: number, config: Partial<NotificationConfig>): Promise<AdminApiResponse<NotificationConfig>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notification-configs/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(config)
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);

    const existingConfig = mockNotificationConfigs.find(c => c.id === id);
    if (!existingConfig) {
      throw new Error('Notification config not found');
    }

    const updatedConfig = { ...existingConfig, ...config, updatedAt: new Date().toISOString() };

    return {
      success: true,
      data: updatedConfig
    };
  }

  // 리포트 설정
  async getReportConfigs(): Promise<AdminApiResponse<ReportConfig[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/report-configs`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);

    return {
      success: true,
      data: mockReportConfigs
    };
  }

  async updateReportConfig(id: number, config: Partial<ReportConfig>): Promise<AdminApiResponse<ReportConfig>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/report-configs/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(config)
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);

    const existingConfig = mockReportConfigs.find(c => c.id === id);
    if (!existingConfig) {
      throw new Error('Report config not found');
    }

    const updatedConfig = { ...existingConfig, ...config, updatedAt: new Date().toISOString() };

    return {
      success: true,
      data: updatedConfig
    };
  }

  // 시스템 설정
  async getSystemConfigs(): Promise<AdminApiResponse<SystemConfig[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/system-configs`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);

    return {
      success: true,
      data: mockSystemConfigs
    };
  }

  async updateSystemConfig(id: number, config: Partial<SystemConfig>): Promise<AdminApiResponse<SystemConfig>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/system-configs/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(config)
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);

    const existingConfig = mockSystemConfigs.find(c => c.id === id);
    if (!existingConfig) {
      throw new Error('System config not found');
    }

    const updatedConfig = { ...existingConfig, ...config, updatedAt: new Date().toISOString() };

    return {
      success: true,
      data: updatedConfig
    };
  }

  // 백업 관리
  async getBackups(): Promise<AdminApiResponse<BackupInfo[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/backups`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);

    return {
      success: true,
      data: mockBackups
    };
  }

  async createBackup(): Promise<AdminApiResponse<BackupInfo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/backups`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(2000); // Simulate backup creation time

    const newBackup: BackupInfo = {
      id: Date.now(),
      filename: `backup-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`,
      size: 52428800, // 50MB
      type: 'manual',
      status: 'completed',
      createdAt: new Date().toISOString(),
      downloadUrl: `/api/admin/backups/${Date.now()}/download`
    };

    return {
      success: true,
      data: newBackup
    };
  }

  async downloadBackup(backupId: number): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/backups/${backupId}/download`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.blob();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data - create a dummy blob
    await delay(1000);
    
    const backup = mockBackups.find(b => b.id === backupId);
    if (!backup) {
      throw new Error('Backup not found');
    }

    // Create a dummy text file as blob
    const content = `Backup: ${backup.filename}\nCreated: ${backup.createdAt}\nSize: ${backup.size} bytes\nThis is a mock backup file.`;
    return new Blob([content], { type: 'application/zip' });
  }

  // 데이터 내보내기
  async exportData(type: 'users' | 'bids' | 'logs', format: 'csv' | 'excel' | 'json'): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/export?type=${type}&format=${format}`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.blob();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(1000);
    
    let content = '';
    let mimeType = '';
    
    switch (format) {
      case 'csv':
        mimeType = 'text/csv';
        content = 'id,name,email,role\n1,관리자,admin@example.com,admin\n2,홍길동,user1@example.com,user';
        break;
      case 'excel':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        content = 'Mock Excel file content';
        break;
      case 'json':
        mimeType = 'application/json';
        content = JSON.stringify({ type, data: 'mock data' }, null, 2);
        break;
    }
    
    return new Blob([content], { type: mimeType });
  }
}

export const adminService = new AdminService();
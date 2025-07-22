import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hersouls.github.io/AI-Biz-Eyes_v1.0/api';

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
    await delay(500);
    
    // Mock blob data
    const mockData = `Mock ${type} data in ${format} format`;
    return new Blob([mockData], { type: 'text/plain' });
  }

  // 품질/감사 기능 서비스 메서드
  async getQualityMetrics(): Promise<AdminApiResponse<{
    metrics: {
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
    };
    lastUpdated: string;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/quality/metrics`, {
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
      data: {
        metrics: {
          systemHealth: {
            uptime: 99.8,
            responseTime: 245,
            errorRate: 0.2,
            successRate: 99.8
          },
          dataQuality: {
            totalRecords: 15420,
            validRecords: 15380,
            duplicateRecords: 25,
            missingDataRate: 0.1
          },
          apiPerformance: {
            totalCalls: 12500,
            successCalls: 12450,
            failedCalls: 50,
            averageResponseTime: 180
          },
          userActivity: {
            activeUsers: 45,
            totalSessions: 120,
            averageSessionDuration: 1800,
            pageViews: 850
          },
          securityMetrics: {
            failedLogins: 12,
            suspiciousActivities: 3,
            blockedRequests: 8,
            lastSecurityScan: new Date().toISOString()
          }
        },
        lastUpdated: new Date().toISOString()
      }
    };
  }

  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    severity?: string;
    category?: string;
    userId?: number;
    startDate?: string;
    endDate?: string;
    action?: string;
    resource?: string;
  }): Promise<AdminApiResponse<{
    logs: Array<{
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
    }>;
    pagination: PaginationInfo;
  }>> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/admin/quality/audit-logs?${queryParams}`, {
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
    
    const mockAuditLogs = [
      {
        id: 1,
        userId: 1,
        userName: '관리자',
        action: 'LOGIN',
        resource: 'AUTH',
        details: { ipAddress: '192.168.1.100' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        severity: 'low' as const,
        category: 'user_activity' as const,
        timestamp: new Date().toISOString(),
        sessionId: 'sess_123',
        requestId: 'req_456'
      },
      {
        id: 2,
        userId: 2,
        userName: '사용자1',
        action: 'DATA_ACCESS',
        resource: 'BIDS',
        resourceId: 'bid_123',
        details: { recordCount: 50 },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0...',
        severity: 'medium' as const,
        category: 'data_access' as const,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        sessionId: 'sess_124',
        requestId: 'req_457'
      },
      {
        id: 3,
        userId: 1,
        userName: '관리자',
        action: 'SYSTEM_CONFIG_CHANGE',
        resource: 'SYSTEM',
        details: { configKey: 'api_timeout', oldValue: '30', newValue: '60' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        severity: 'high' as const,
        category: 'system_change' as const,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        sessionId: 'sess_123',
        requestId: 'req_458'
      }
    ];

    const result = createPaginatedResponse(mockAuditLogs, params.page, params.limit);
    
    return {
      success: true,
      data: {
        logs: result.data,
        pagination: result.pagination
      }
    };
  }

  async getQualityReport(period?: string): Promise<AdminApiResponse<{
    report: {
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
    };
    generatedAt: string;
  }>> {
    try {
      const queryParams = period ? `?period=${period}` : '';
      const response = await fetch(`${API_BASE_URL}/admin/quality/report${queryParams}`, {
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
      data: {
        report: {
          period: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          summary: {
            totalIssues: 15,
            criticalIssues: 2,
            resolvedIssues: 12,
            openIssues: 3
          },
          trends: {
            daily: [
              { date: '2024-01-01', issues: 2, resolved: 1 },
              { date: '2024-01-02', issues: 3, resolved: 2 },
              { date: '2024-01-03', issues: 1, resolved: 3 },
              { date: '2024-01-04', issues: 4, resolved: 2 },
              { date: '2024-01-05', issues: 2, resolved: 3 },
              { date: '2024-01-06', issues: 1, resolved: 1 },
              { date: '2024-01-07', issues: 2, resolved: 0 }
            ],
            weekly: [
              { week: '2024-W01', issues: 15, resolved: 12 },
              { week: '2024-W02', issues: 12, resolved: 15 },
              { week: '2024-W03', issues: 18, resolved: 14 }
            ]
          },
          categories: [
            { category: '데이터 품질', count: 8, percentage: 53.3 },
            { category: '시스템 성능', count: 4, percentage: 26.7 },
            { category: '보안 이슈', count: 2, percentage: 13.3 },
            { category: '사용자 경험', count: 1, percentage: 6.7 }
          ],
          recommendations: [
            {
              id: 1,
              title: '데이터 중복 검증 강화',
              description: '중복 데이터 발생률이 증가하고 있습니다. 데이터 검증 로직을 강화해야 합니다.',
              priority: 'high' as const,
              status: 'open' as const
            },
            {
              id: 2,
              title: 'API 응답 시간 최적화',
              description: '일부 API 응답 시간이 임계값을 초과하고 있습니다. 성능 최적화가 필요합니다.',
              priority: 'medium' as const,
              status: 'in_progress' as const
            }
          ]
        },
        generatedAt: new Date().toISOString()
      }
    };
  }

  async getAuditSettings(): Promise<AdminApiResponse<{
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
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/quality/audit-settings`, {
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
      data: {
        id: 1,
        enabled: true,
        retentionDays: 90,
        logLevel: 'all',
        categories: ['user_activity', 'data_access', 'system_change', 'security_event'],
        excludedUsers: [],
        excludedActions: ['HEARTBEAT', 'HEALTH_CHECK'],
        realTimeAlerts: true,
        alertThresholds: {
          failedLogins: 5,
          suspiciousActivities: 3,
          dataAccess: 100
        },
        exportSettings: {
          format: 'json',
          includeDetails: true,
          compression: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  async updateAuditSettings(settings: any): Promise<AdminApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/quality/audit-settings`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(settings)
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
      data: {
        ...settings,
        id: 1,
        updatedAt: new Date().toISOString()
      }
    };
  }

  async exportAuditLogs(params: {
    format?: string;
    startDate?: string;
    endDate?: string;
    severity?: string;
    category?: string;
  }): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/admin/quality/export-audit-logs?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return response.blob();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    const mockData = `Mock audit logs export in ${params.format || 'json'} format`;
    return new Blob([mockData], { type: 'text/plain' });
  }
}

export const adminService = new AdminService();
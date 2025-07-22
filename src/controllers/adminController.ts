import { Request, Response } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { 
  mockUsers, 
  initialMockSystemLogs, 
  mockSystemStatistics,
  mockFetchLogs,
  mockNotificationConfigs,
  mockReportConfigs,
  mockSystemConfigs,
  mockBackups
} from '../data/mockData';
import { 
  UserCreateRequest, 
  UserUpdateRequest,
  NotificationConfig,
  ReportConfig,
  SystemConfig,
  BackupInfo
} from '../types';

// 사용자 관리
export const getUsers = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      ));
    }

    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      organization
    } = req.query;

    let filteredUsers = [...mockUsers];

    // 검색 필터링
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(String(search).toLowerCase()) ||
        user.email.toLowerCase().includes(String(search).toLowerCase())
      );
    }

    // 역할 필터링
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // 활성화 상태 필터링
    if (isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === (isActive === 'true'));
    }

    // 기관 필터링
    if (organization) {
      filteredUsers = filteredUsers.filter(user => user.organization === organization);
    }

    // 페이지네이션
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return res.json(createSuccessResponse({
      users: paginatedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / Number(limit))
      }
    }));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      ));
    }

    const userData: UserCreateRequest = req.body;

    // 이메일 중복 확인
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      return res.status(422).json(createErrorResponse(
        'VALIDATION_DUPLICATE_EMAIL',
        '이미 존재하는 이메일입니다.'
      ));
    }

    // Mock 사용자 생성
    const newUser = {
      id: mockUsers.length + 1,
      email: userData.email,
      name: userData.name,
      organization: userData.organization,
      role: userData.role || 'user',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return res.status(201).json(createSuccessResponse({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    }, '사용자가 등록되었습니다.'));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      ));
    }

    const userId = Number(req.params.id);
    const updateData: UserUpdateRequest = req.body;

    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json(createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '사용자를 찾을 수 없습니다.'
      ));
    }

    // Mock 사용자 업데이트
    const updatedUser = {
      ...mockUsers[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return res.json(createSuccessResponse({
      id: updatedUser.id,
      updatedAt: updatedUser.updatedAt
    }, '사용자 정보가 수정되었습니다.'));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json(createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '사용자를 찾을 수 없습니다.'
      ));
    }

    // Mock 사용자 삭제
    mockUsers.splice(userIndex, 1);

    return res.json(createSuccessResponse(null, '사용자가 삭제되었습니다.'));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 시스템 로그
export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 50,
      level,
      category,
      userId,
      startDate,
      endDate
    } = req.query;

    let filteredLogs = [...initialMockSystemLogs];

    // 레벨 필터링
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    // 카테고리 필터링
    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }

    // 사용자 ID 필터링
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === Number(userId));
    }

    // 날짜 필터링
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => log.createdAt >= String(startDate));
    }
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => log.createdAt <= String(endDate));
    }

    // 페이지네이션
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return res.json(createSuccessResponse({
      logs: paginatedLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / Number(limit))
      }
    }));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 공고 수집 이력
export const getFetchLogs = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      startDate,
      endDate
    } = req.query;

    let filteredLogs = [...mockFetchLogs];

    // 상태 필터링
    if (status) {
      filteredLogs = filteredLogs.filter(log => log.status === status);
    }

    // 날짜 필터링
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => log.requestedAt >= String(startDate));
    }
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => log.requestedAt <= String(endDate));
    }

    // 페이지네이션
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return res.json(createSuccessResponse({
      logs: paginatedLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / Number(limit))
      }
    }));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const retryFailedFetch = async (req: Request, res: Response) => {
  try {
    const logId = Number(req.params.id);
    const logIndex = mockFetchLogs.findIndex(log => log.id === logId);
    
    if (logIndex === -1) {
      return res.status(404).json(createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '수집 이력을 찾을 수 없습니다.'
      ));
    }

    // Mock 재시도 로직
    mockFetchLogs[logIndex].status = 'pending';
    mockFetchLogs[logIndex].requestedAt = new Date().toISOString();

    return res.json(createSuccessResponse(null, '재시도가 시작되었습니다.'));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 시스템 통계
export const getSystemStatistics = async (req: Request, res: Response) => {
  try {
    const { period } = req.query;
    
    // Mock 시스템 통계 반환
    return res.json(createSuccessResponse(mockSystemStatistics));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 알림 설정
export const getNotificationConfigs = async (req: Request, res: Response) => {
  try {
    return res.json(createSuccessResponse(mockNotificationConfigs));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const updateNotificationConfig = async (req: Request, res: Response) => {
  try {
    const configId = Number(req.params.id);
    const updateData = req.body;

    if (configId === 0) {
      // 새 설정 생성 - 타입을 정확히 맞춤
      const newConfig = {
        id: mockNotificationConfigs.length + 1,
        type: updateData.type as 'new_bid' | 'urgent' | 'deadline',
        channel: updateData.channel as 'web' | 'email' | 'push',
        frequency: updateData.frequency as 'immediate' | 'daily' | 'weekly',
        recipients: updateData.recipients as string[],
        isActive: updateData.isActive as boolean,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any; // 타입 단언으로 해결
      mockNotificationConfigs.push(newConfig);
      
      return res.status(201).json(createSuccessResponse(newConfig, '알림 설정이 생성되었습니다.'));
    } else {
      // 기존 설정 수정
      const configIndex = mockNotificationConfigs.findIndex(config => config.id === configId);
      if (configIndex === -1) {
        return res.status(404).json(createErrorResponse(
          'RESOURCE_NOT_FOUND',
          '알림 설정을 찾을 수 없습니다.'
        ));
      }

      mockNotificationConfigs[configIndex] = {
        ...mockNotificationConfigs[configIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      return res.json(createSuccessResponse(mockNotificationConfigs[configIndex], '알림 설정이 수정되었습니다.'));
    }
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 리포트 설정
export const getReportConfigs = async (req: Request, res: Response) => {
  try {
    return res.json(createSuccessResponse(mockReportConfigs));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const updateReportConfig = async (req: Request, res: Response) => {
  try {
    const configId = Number(req.params.id);
    const updateData = req.body;

    const configIndex = mockReportConfigs.findIndex(config => config.id === configId);
    if (configIndex === -1) {
      return res.status(404).json(createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '리포트 설정을 찾을 수 없습니다.'
      ));
    }

    mockReportConfigs[configIndex] = {
      ...mockReportConfigs[configIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return res.json(createSuccessResponse(mockReportConfigs[configIndex], '리포트 설정이 수정되었습니다.'));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 시스템 설정
export const getSystemConfigs = async (req: Request, res: Response) => {
  try {
    return res.json(createSuccessResponse(mockSystemConfigs));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    const configId = Number(req.params.id);
    const updateData = req.body;

    const configIndex = mockSystemConfigs.findIndex(config => config.id === configId);
    if (configIndex === -1) {
      return res.status(404).json(createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '시스템 설정을 찾을 수 없습니다.'
      ));
    }

    mockSystemConfigs[configIndex] = {
      ...mockSystemConfigs[configIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return res.json(createSuccessResponse(mockSystemConfigs[configIndex], '시스템 설정이 수정되었습니다.'));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 백업 관리
export const getBackups = async (req: Request, res: Response) => {
  try {
    return res.json(createSuccessResponse(mockBackups));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const createBackup = async (req: Request, res: Response) => {
  try {
    // 타입을 정확히 맞춤
    const newBackup = {
      id: mockBackups.length + 1,
      filename: `backup_${new Date().toISOString().split('T')[0]}.zip`,
      size: Math.floor(Math.random() * 1000000) + 100000,
      type: 'manual' as const,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
      downloadUrl: `/admin/backups/${mockBackups.length + 1}/download`
    };

    mockBackups.push(newBackup);

    return res.status(201).json(createSuccessResponse(newBackup, '백업이 생성되었습니다.'));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const downloadBackup = async (req: Request, res: Response) => {
  try {
    const backupId = Number(req.params.id);
    const backup = mockBackups.find(b => b.id === backupId);
    
    if (!backup) {
      return res.status(404).json(createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '백업 파일을 찾을 수 없습니다.'
      ));
    }

    // Mock 파일 다운로드 응답
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${backup.filename}"`);
    return res.send(Buffer.from('Mock backup file content'));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 데이터 내보내기
export const exportData = async (req: Request, res: Response) => {
  try {
    const { format = 'json', type = 'all' } = req.query;
    
    // 실제 구현에서는 데이터베이스에서 데이터를 조회하여 내보내기
    const exportData = {
      users: mockUsers,
      systemLogs: initialMockSystemLogs,
      fetchLogs: mockFetchLogs,
      timestamp: new Date().toISOString()
    };

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
      // CSV 변환 로직 구현
      return res.send('CSV data would be here');
    } else {
      return res.json(createSuccessResponse(exportData));
    }
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '데이터 내보내기에 실패했습니다.'
    ));
  }
};

// 품질/감사 기능 컨트롤러
export const getQualityMetrics = async (req: Request, res: Response) => {
  try {
    // 실제 구현에서는 실시간 메트릭을 계산
    const metrics = {
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
    };

    return res.json(createSuccessResponse({
      metrics,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '품질 메트릭을 불러오는데 실패했습니다.'
    ));
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 50,
      severity,
      category,
      userId,
      startDate,
      endDate,
      action,
      resource
    } = req.query;

    // 실제 구현에서는 데이터베이스에서 감사 로그를 조회
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

    let filteredLogs = [...mockAuditLogs];

    // 필터링 로직
    if (severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === severity);
    }
    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === Number(userId));
    }
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action.includes(String(action)));
    }
    if (resource) {
      filteredLogs = filteredLogs.filter(log => log.resource.includes(String(resource)));
    }

    // 페이지네이션
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return res.json(createSuccessResponse({
      logs: paginatedLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / Number(limit))
      }
    }));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '감사 로그를 불러오는데 실패했습니다.'
    ));
  }
};

export const getQualityReport = async (req: Request, res: Response) => {
  try {
    const { period = 'week' } = req.query;
    
    // 실제 구현에서는 기간별 품질 리포트를 생성
    const report = {
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
    };

    return res.json(createSuccessResponse({
      report,
      generatedAt: new Date().toISOString()
    }));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '품질 리포트를 생성하는데 실패했습니다.'
    ));
  }
};

export const getAuditSettings = async (req: Request, res: Response) => {
  try {
    // 실제 구현에서는 데이터베이스에서 감사 설정을 조회
    const settings = {
      id: 1,
      enabled: true,
      retentionDays: 90,
      logLevel: 'all' as const,
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
        format: 'json' as const,
        includeDetails: true,
        compression: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return res.json(createSuccessResponse(settings));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '감사 설정을 불러오는데 실패했습니다.'
    ));
  }
};

export const updateAuditSettings = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      ));
    }

    const updateData = req.body;
    
    // 실제 구현에서는 데이터베이스에 감사 설정을 업데이트
    const updatedSettings = {
      ...updateData,
      id: 1,
      updatedAt: new Date().toISOString()
    };

    return res.json(createSuccessResponse(updatedSettings));
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '감사 설정을 업데이트하는데 실패했습니다.'
    ));
  }
};

export const exportAuditLogs = async (req: Request, res: Response) => {
  try {
    const { format = 'json', startDate, endDate, severity, category } = req.query;
    
    // 실제 구현에서는 조건에 맞는 감사 로그를 조회하여 내보내기
    const exportData = {
      logs: [
        {
          id: 1,
          userId: 1,
          userName: '관리자',
          action: 'LOGIN',
          resource: 'AUTH',
          severity: 'low',
          category: 'user_activity',
          timestamp: new Date().toISOString()
        }
      ],
      exportInfo: {
        format,
        exportedAt: new Date().toISOString(),
        totalRecords: 1
      }
    };

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
      // CSV 변환 로직 구현
      return res.send('CSV audit logs would be here');
    } else {
      return res.json(createSuccessResponse(exportData));
    }
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '감사 로그 내보내기에 실패했습니다.'
    ));
  }
};
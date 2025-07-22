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

    res.json(createSuccessResponse({
      users: paginatedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / Number(limit))
      }
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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

    res.status(201).json(createSuccessResponse({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    }, '사용자가 등록되었습니다.'));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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

    res.json(createSuccessResponse({
      id: updatedUser.id,
      updatedAt: updatedUser.updatedAt
    }, '사용자 정보가 수정되었습니다.'));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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

    res.json(createSuccessResponse(null, '사용자가 삭제되었습니다.'));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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

    res.json(createSuccessResponse({
      logs: paginatedLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / Number(limit))
      }
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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

    res.json(createSuccessResponse({
      logs: paginatedLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / Number(limit))
      }
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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

    res.json(createSuccessResponse(null, '재시도가 시작되었습니다.'));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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
    res.json(createSuccessResponse(mockSystemStatistics));
  } catch (error) {
    res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 알림 설정
export const getNotificationConfigs = async (req: Request, res: Response) => {
  try {
    res.json(createSuccessResponse(mockNotificationConfigs));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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
      // 새 설정 생성
      const newConfig: NotificationConfig = {
        id: mockNotificationConfigs.length + 1,
        ...updateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockNotificationConfigs.push(newConfig);
      
      res.status(201).json(createSuccessResponse(newConfig, '알림 설정이 생성되었습니다.'));
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

      res.json(createSuccessResponse(mockNotificationConfigs[configIndex], '알림 설정이 수정되었습니다.'));
    }
  } catch (error) {
    res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 리포트 설정
export const getReportConfigs = async (req: Request, res: Response) => {
  try {
    res.json(createSuccessResponse(mockReportConfigs));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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

    res.json(createSuccessResponse(mockReportConfigs[configIndex], '리포트 설정이 수정되었습니다.'));
  } catch (error) {
    res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 시스템 설정
export const getSystemConfigs = async (req: Request, res: Response) => {
  try {
    res.json(createSuccessResponse(mockSystemConfigs));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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

    res.json(createSuccessResponse(mockSystemConfigs[configIndex], '시스템 설정이 수정되었습니다.'));
  } catch (error) {
    res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 백업 관리
export const getBackups = async (req: Request, res: Response) => {
  try {
    res.json(createSuccessResponse(mockBackups));
  } catch (error) {
    res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

export const createBackup = async (req: Request, res: Response) => {
  try {
    const newBackup: BackupInfo = {
      id: mockBackups.length + 1,
      filename: `backup_${new Date().toISOString().split('T')[0]}.zip`,
      size: Math.floor(Math.random() * 1000000) + 100000,
      type: 'manual',
      status: 'completed',
      createdAt: new Date().toISOString(),
      downloadUrl: `/admin/backups/${mockBackups.length + 1}/download`
    };

    mockBackups.push(newBackup);

    res.status(201).json(createSuccessResponse(newBackup, '백업이 생성되었습니다.'));
  } catch (error) {
    res.status(500).json(createErrorResponse(
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
    res.send(Buffer.from('Mock backup file content'));
  } catch (error) {
    res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// 데이터 내보내기
export const exportData = async (req: Request, res: Response) => {
  try {
    const { type, format } = req.query;

    // Mock 데이터 내보내기
    let data: any;
    let filename: string;

    switch (type) {
      case 'users':
        data = mockUsers;
        filename = `users_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'bids':
        data = mockFetchLogs;
        filename = `bids_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'logs':
        data = initialMockSystemLogs;
        filename = `logs_${new Date().toISOString().split('T')[0]}`;
        break;
      default:
        return res.status(400).json(createErrorResponse(
          'VALIDATION_ERROR',
          '지원하지 않는 데이터 타입입니다.'
        ));
    }

    let contentType: string;
    let fileExtension: string;

    switch (format) {
      case 'csv':
        contentType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'excel':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
      case 'json':
        contentType = 'application/json';
        fileExtension = 'json';
        break;
      default:
        return res.status(400).json(createErrorResponse(
          'VALIDATION_ERROR',
          '지원하지 않는 형식입니다.'
        ));
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.${fileExtension}"`);
    
    if (format === 'json') {
      res.json(data);
    } else {
      // Mock CSV/Excel 데이터
      res.send('Mock exported data');
    }
  } catch (error) {
    res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};
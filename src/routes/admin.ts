import { Router, Request, Response } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { 
  mockUsers, 
  initialMockSystemLogs, 
  mockSystemStatistics 
} from '../data/mockData';
import { 
  UserCreateRequest, 
  UserUpdateRequest 
} from '../types';
import { requireRole } from '../middleware/auth';

const router = Router();

// 모든 관리자 라우트에 admin 권한 필요
router.use(requireRole(['admin']));

// 사용자 목록 조회
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상이어야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('페이지당 항목 수는 1-100 사이여야 합니다.'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('정렬 순서는 asc 또는 desc여야 합니다.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      organization,
      sortBy = 'createdAt',
      sortOrder = 'desc'
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

    // 정렬
    filteredUsers.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'lastLogin') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // 페이지네이션
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response = createSuccessResponse({
      users: paginatedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / Number(limit))
      }
    });

    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

// 사용자 등록
router.post('/users', [
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
  body('name').notEmpty().withMessage('이름은 필수입니다.'),
  body('role').optional().isIn(['admin', 'user', 'guest']).withMessage('역할은 admin, user, guest 중 하나여야 합니다.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const userData: UserCreateRequest = req.body;

    // 이메일 중복 확인
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      const errorResponse = createErrorResponse(
        'VALIDATION_DUPLICATE_EMAIL',
        '이미 존재하는 이메일입니다.'
      );
      return res.status(422).json(errorResponse);
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

    const response = createSuccessResponse({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    }, '사용자가 등록되었습니다.');

    res.status(201).json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

// 사용자 수정
router.put('/users/:id', [
  param('id').isInt({ min: 1 }).withMessage('유효한 사용자 ID를 입력해주세요.'),
  body('role').optional().isIn(['admin', 'user', 'guest']).withMessage('역할은 admin, user, guest 중 하나여야 합니다.'),
  body('isActive').optional().isBoolean().withMessage('활성화 상태는 boolean 값이어야 합니다.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const userId = Number(req.params.id);
    const updateData: UserUpdateRequest = req.body;

    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      const errorResponse = createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '사용자를 찾을 수 없습니다.'
      );
      return res.status(404).json(errorResponse);
    }

    // Mock 사용자 업데이트
    const updatedUser = {
      ...mockUsers[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    const response = createSuccessResponse({
      id: updatedUser.id,
      updatedAt: updatedUser.updatedAt
    }, '사용자 정보가 수정되었습니다.');

    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

// 시스템 로그 조회
router.get('/logs', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상이어야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('페이지당 항목 수는 1-100 사이여야 합니다.'),
  query('level').optional().isIn(['info', 'warn', 'error']).withMessage('로그 레벨은 info, warn, error 중 하나여야 합니다.'),
  query('category').optional().isString().withMessage('카테고리는 문자열이어야 합니다.'),
  query('userId').optional().isInt({ min: 1 }).withMessage('사용자 ID는 1 이상이어야 합니다.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const {
      page = 1,
      limit = 20,
      level,
      category,
      userId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
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

    // 정렬
    filteredLogs.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // 페이지네이션
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    const response = createSuccessResponse({
      logs: paginatedLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / Number(limit))
      }
    });

    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

// 시스템 통계
router.get('/statistics', [
  query('period').optional().isIn(['today', 'week', 'month', 'year']).withMessage('기간은 today, week, month, year 중 하나여야 합니다.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const { period } = req.query;

    // Mock 시스템 통계 반환
    const response = createSuccessResponse(mockSystemStatistics);
    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

export default router;
import { Router, Request, Response } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { 
  initialMockNotifications 
} from '../data/mockData';
import { 
  NotificationQueryParams, 
  NotificationUpdateRequest,
  NotificationSettings 
} from '../types';

const router = Router();

// 알림 목록 조회
router.get('/', [
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
      type,
      status,
      priority,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    }: NotificationQueryParams = req.query;

    let filteredNotifications = [...initialMockNotifications];

    // 타입 필터링
    if (type) {
      filteredNotifications = filteredNotifications.filter(notification => notification.type === type);
    }

    // 상태 필터링
    if (status) {
      filteredNotifications = filteredNotifications.filter(notification => notification.status === status);
    }

    // 우선순위 필터링
    if (priority) {
      filteredNotifications = filteredNotifications.filter(notification => notification.priority === priority);
    }

    // 날짜 필터링
    if (startDate) {
      filteredNotifications = filteredNotifications.filter(notification => notification.createdAt >= startDate);
    }
    if (endDate) {
      filteredNotifications = filteredNotifications.filter(notification => notification.createdAt <= endDate);
    }

    // 정렬
    filteredNotifications.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
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
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    const response = createSuccessResponse({
      notifications: paginatedNotifications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredNotifications.length,
        totalPages: Math.ceil(filteredNotifications.length / Number(limit))
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

// 알림 상태 변경
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('유효한 알림 ID를 입력해주세요.'),
  body('status').isIn(['read', 'important', 'completed']).withMessage('상태는 read, important, completed 중 하나여야 합니다.')
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

    const notificationId = Number(req.params.id);
    const { status }: NotificationUpdateRequest = req.body;

    const notificationIndex = initialMockNotifications.findIndex(notification => notification.id === notificationId);
    if (notificationIndex === -1) {
      const errorResponse = createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '알림을 찾을 수 없습니다.'
      );
      return res.status(404).json(errorResponse);
    }

    // Mock 알림 상태 업데이트
    const updatedNotification = {
      ...initialMockNotifications[notificationIndex],
      status,
      readAt: status === 'read' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };

    const response = createSuccessResponse({
      id: updatedNotification.id,
      status: updatedNotification.status,
      readAt: updatedNotification.readAt
    }, '알림 상태가 변경되었습니다.');

    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

// 알림 설정
router.post('/settings', [
  body('emailNotifications.enabled').optional().isBoolean().withMessage('이메일 알림 활성화는 boolean 값이어야 합니다.'),
  body('webNotifications.enabled').optional().isBoolean().withMessage('웹 알림 활성화는 boolean 값이어야 합니다.'),
  body('pushNotifications.enabled').optional().isBoolean().withMessage('푸시 알림 활성화는 boolean 값이어야 합니다.')
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

    const settings: NotificationSettings = req.body;

    // Mock 알림 설정 저장
    const savedSettings = {
      emailNotifications: {
        enabled: settings.emailNotifications?.enabled ?? true,
        types: settings.emailNotifications?.types ?? ['urgent', 'deadline', 'new'],
        frequency: settings.emailNotifications?.frequency ?? 'immediate'
      },
      webNotifications: {
        enabled: settings.webNotifications?.enabled ?? true,
        types: settings.webNotifications?.types ?? ['urgent', 'deadline', 'missing', 'duplicate']
      },
      pushNotifications: {
        enabled: settings.pushNotifications?.enabled ?? false
      }
    };

    const response = createSuccessResponse({
      settings: savedSettings
    }, '알림 설정이 저장되었습니다.');

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
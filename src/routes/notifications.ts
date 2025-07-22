import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { initialMockNotifications } from '../data/mockData';

const router = express.Router();

// 알림 목록 조회
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      priority,
      startDate,
      endDate,
      assignedTo
    } = req.query;

    let filteredNotifications = [...initialMockNotifications];

    // 필터링
    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }

    if (status) {
      filteredNotifications = filteredNotifications.filter(n => n.status === status);
    }

    if (priority) {
      filteredNotifications = filteredNotifications.filter(n => n.priority === priority);
    }

    if (assignedTo) {
      filteredNotifications = filteredNotifications.filter(n => n.assignedTo === Number(assignedTo));
    }

    // 날짜 필터링
    if (startDate) {
      filteredNotifications = filteredNotifications.filter(n => n.createdAt >= startDate);
    }

    if (endDate) {
      filteredNotifications = filteredNotifications.filter(n => n.createdAt <= endDate);
    }

    // 정렬 (최신순)
    filteredNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

    return res.json(response);
  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
    return res.status(500).json({
      success: false,
      message: '알림 목록을 불러오는데 실패했습니다.'
    });
  }
});

// 알림 상태 변경
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const notificationIndex = initialMockNotifications.findIndex(n => n.id === Number(id));

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '알림을 찾을 수 없습니다.'
      });
    }

    // Mock 데이터 업데이트
    initialMockNotifications[notificationIndex] = {
      ...initialMockNotifications[notificationIndex],
      status: status,
      updatedAt: new Date().toISOString()
    };

    return res.json({
      success: true,
      data: initialMockNotifications[notificationIndex],
      message: '알림 상태가 변경되었습니다.'
    });
  } catch (error) {
    console.error('알림 상태 변경 실패:', error);
    return res.status(500).json({
      success: false,
      message: '알림 상태 변경에 실패했습니다.'
    });
  }
});

// 알림 일괄 처리
router.put('/bulk', authenticateToken, async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '처리할 알림을 선택해주세요.'
      });
    }

    // Mock 데이터 일괄 업데이트
    ids.forEach(id => {
      const notificationIndex = initialMockNotifications.findIndex(n => n.id === id);
      if (notificationIndex !== -1) {
        initialMockNotifications[notificationIndex] = {
          ...initialMockNotifications[notificationIndex],
          status: status,
          updatedAt: new Date().toISOString()
        };
      }
    });

    return res.json({
      success: true,
      message: `${ids.length}개의 알림이 처리되었습니다.`
    });
  } catch (error) {
    console.error('알림 일괄 처리 실패:', error);
    return res.status(500).json({
      success: false,
      message: '알림 일괄 처리에 실패했습니다.'
    });
  }
});

// 알림 통계 조회
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const total = initialMockNotifications.length;
    const unread = initialMockNotifications.filter(n => n.status === 'unread').length;
    const urgent = initialMockNotifications.filter(n => n.priority === 'high').length;
    const high = initialMockNotifications.filter(n => n.priority === 'high').length;
    const normal = initialMockNotifications.filter(n => n.priority === 'medium').length;
    const low = initialMockNotifications.filter(n => n.priority === 'low').length;

    const response = createSuccessResponse({
      total,
      unread,
      urgent,
      high,
      normal,
      low
    });

    return res.json(response);
  } catch (error) {
    console.error('알림 통계 조회 실패:', error);
    return res.status(500).json({
      success: false,
      message: '알림 통계를 불러오는데 실패했습니다.'
    });
  }
});

// 알림 설정 조회
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.id || 1;

    const defaultSettings = {
      emailNotifications: {
        enabled: true,
        types: ['urgent', 'deadline'],
        frequency: 'immediate'
      },
      webNotifications: {
        enabled: true,
        types: ['urgent', 'deadline', 'missing', 'duplicate']
      },
      pushNotifications: {
        enabled: false
      }
    };

    const response = createSuccessResponse({
      settings: defaultSettings
    });

    return res.json(response);
  } catch (error) {
    console.error('알림 설정 조회 실패:', error);
    return res.status(500).json({
      success: false,
      message: '알림 설정을 불러오는데 실패했습니다.'
    });
  }
});

// 알림 설정 저장
router.post('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.id || 1;
    const { settings } = req.body;

    const response = createSuccessResponse({
      settings
    }, '알림 설정이 저장되었습니다.');

    return res.json(response);
  } catch (error) {
    console.error('알림 설정 저장 실패:', error);
    return res.status(500).json({
      success: false,
      message: '알림 설정 저장에 실패했습니다.'
    });
  }
});

export default router;
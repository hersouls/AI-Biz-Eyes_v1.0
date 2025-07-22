import { Router } from 'express';
import { StatisticsController } from '../controllers/statisticsController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// 공고 통계 조회
router.get('/bids', authenticateToken, StatisticsController.getBidStatistics);

// 레퍼런스 통계 조회
router.get('/references', authenticateToken, StatisticsController.getReferenceStatistics);

// 알림 통계 조회
router.get('/notifications', authenticateToken, StatisticsController.getNotificationStatistics);

// 시스템 통계 조회 (관리자만)
router.get('/system', authenticateToken, requireRole(['admin']), StatisticsController.getSystemStatistics);

export default router;
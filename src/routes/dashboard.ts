import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 대시보드 메인 데이터
router.get('/', authenticateToken, DashboardController.getDashboardData);

// 대시보드 차트 데이터
router.get('/charts', authenticateToken, DashboardController.getChartData);

// 대시보드 요약 데이터
router.get('/summary', authenticateToken, DashboardController.getSummaryData);

export default router;
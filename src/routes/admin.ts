import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  getSystemLogs,
  getFetchLogs,
  retryFailedFetch,
  getSystemStatistics,
  getNotificationConfigs,
  updateNotificationConfig,
  getReportConfigs,
  updateReportConfig,
  getSystemConfigs,
  updateSystemConfig,
  getBackups,
  createBackup,
  downloadBackup,
  exportData
} from '../controllers/adminController';

const router = express.Router();

// 모든 관리자 라우트에 인증 및 관리자 권한 미들웨어 적용
router.use(authenticateToken);
router.use(requireAdmin);

// 사용자 관리
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// 시스템 로그
router.get('/logs', getSystemLogs);

// 공고 수집 이력
router.get('/fetch-logs', getFetchLogs);
router.post('/fetch-logs/:id/retry', retryFailedFetch);

// 시스템 통계
router.get('/statistics', getSystemStatistics);

// 알림 설정
router.get('/notification-configs', getNotificationConfigs);
router.put('/notification-configs/:id', updateNotificationConfig);

// 리포트 설정
router.get('/report-configs', getReportConfigs);
router.put('/report-configs/:id', updateReportConfig);

// 시스템 설정
router.get('/system-configs', getSystemConfigs);
router.put('/system-configs/:id', updateSystemConfig);

// 백업 관리
router.get('/backups', getBackups);
router.post('/backups', createBackup);
router.get('/backups/:id/download', downloadBackup);

// 데이터 내보내기
router.get('/export', exportData);

export default router;
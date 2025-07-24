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
  exportData,
  // 품질/감사 기능 추가
  getQualityMetrics,
  getAuditLogs,
  getQualityReport,
  getAuditSettings,
  updateAuditSettings,
  exportAuditLogs
} from '../controllers/adminController';
import {
  validateUserCreate,
  validateUserUpdate,
  validateNotificationConfig,
  validateReportConfig,
  validateSystemConfig,
  validateIdParam,
  validatePagination,
  validateSearchQuery,
  validateDateRange
} from '../middleware/validation';

const router = express.Router();

// 모든 관리자 라우트에 인증 및 관리자 권한 미들웨어 적용
router.use(authenticateToken);
router.use(requireAdmin);

// 사용자 관리
router.get('/users', validatePagination, validateSearchQuery, getUsers);
router.post('/users', validateUserCreate, createUser);
router.put('/users/:id', validateIdParam, validateUserUpdate, updateUser);
router.delete('/users/:id', validateIdParam, deleteUser);

// 시스템 로그
router.get('/logs', validatePagination, validateDateRange, getSystemLogs);

// 공고 수집 이력
router.get('/fetch-logs', validatePagination, validateDateRange, getFetchLogs);
router.post('/fetch-logs/:id/retry', validateIdParam, retryFailedFetch);

// 시스템 통계
router.get('/statistics', getSystemStatistics);

// 알림 설정
router.get('/notification-configs', getNotificationConfigs);
router.put('/notification-configs/:id', validateIdParam, validateNotificationConfig, updateNotificationConfig);

// 리포트 설정
router.get('/report-configs', getReportConfigs);
router.put('/report-configs/:id', validateIdParam, validateReportConfig, updateReportConfig);

// 시스템 설정
router.get('/system-configs', getSystemConfigs);
router.put('/system-configs/:id', validateIdParam, validateSystemConfig, updateSystemConfig);

// 백업 관리
router.get('/backups', getBackups);
router.post('/backups', createBackup);
router.get('/backups/:id/download', validateIdParam, downloadBackup);

// 데이터 내보내기
router.get('/export', exportData);

// 품질/감사 기능
router.get('/quality/metrics', getQualityMetrics);
router.get('/quality/audit-logs', validatePagination, validateDateRange, getAuditLogs);
router.get('/quality/report', getQualityReport);
router.get('/quality/audit-settings', getAuditSettings);
router.put('/quality/audit-settings', updateAuditSettings);
router.get('/quality/export-audit-logs', exportAuditLogs);

export default router;
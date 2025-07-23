import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { PersonalController } from '../controllers/personalController';
import { uploadAvatar, handleUploadError } from '../middleware/upload';

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 프로필 관리
router.get('/profile', PersonalController.getProfile);
router.put('/profile', PersonalController.updateProfile);
router.post('/profile/avatar', uploadAvatar, handleUploadError, PersonalController.uploadAvatar);
router.delete('/profile/avatar', PersonalController.deleteAvatar);

// 알림 설정
router.get('/notifications/settings', PersonalController.getNotificationSettings);
router.put('/notifications/settings', PersonalController.updateNotificationSettings);

// 리포트 설정
router.get('/reports/settings', PersonalController.getReportSettings);
router.put('/reports/settings', PersonalController.updateReportSettings);

// 대시보드 설정
router.get('/dashboard/settings', PersonalController.getDashboardSettings);
router.put('/dashboard/settings', PersonalController.updateDashboardSettings);

// 환경설정
router.get('/settings', PersonalController.getPersonalSettings);
router.put('/settings', PersonalController.updatePersonalSettings);

// 활동 내역
router.get('/activity', PersonalController.getActivityHistory);
router.get('/activity/:id', PersonalController.getActivityDetail);

// 데이터 내보내기
router.post('/export', PersonalController.exportData);
router.get('/export/history', PersonalController.getExportHistory);
router.get('/export/:id/download', PersonalController.downloadExport);

// 보안 설정
router.get('/security', PersonalController.getSecuritySettings);
router.put('/security/password', PersonalController.updatePassword);
router.put('/security/two-factor', PersonalController.updateTwoFactor);

export default router;
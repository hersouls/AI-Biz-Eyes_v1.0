import express from 'express';
import {
  getIntegrationSystems,
  getIntegrationSystem,
  createIntegrationSystem,
  updateIntegrationSystem,
  deleteIntegrationSystem,
  getIntegrationLogs,
  getFieldMappings,
  createFieldMapping,
  getIntegrationStats,
  testIntegrationSystem
} from '../controllers/integrationController';

const router = express.Router();

// 연동 통계 조회
router.get('/stats', getIntegrationStats);

// 연동 시스템 관리
router.get('/systems', getIntegrationSystems);
router.get('/systems/:id', getIntegrationSystem);
router.post('/systems', createIntegrationSystem);
router.put('/systems/:id', updateIntegrationSystem);
router.delete('/systems/:id', deleteIntegrationSystem);

// 연동 시스템 테스트
router.post('/systems/:id/test', testIntegrationSystem);

// 연동 로그 조회
router.get('/logs', getIntegrationLogs);

// 필드 매핑 관리
router.get('/mappings', getFieldMappings);
router.post('/mappings', createFieldMapping);

export default router;
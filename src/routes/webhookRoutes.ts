import { Router } from 'express';
import WebhookController from '../controllers/webhookController';

const router = Router();
const webhookController = new WebhookController();

/**
 * @route   GET /api/webhook/test
 * @desc    Webhook 연결 테스트
 * @access  Public
 */
router.get('/test', webhookController.testWebhook.bind(webhookController));

/**
 * @route   POST /api/webhook/bid-notice
 * @desc    입찰공고 데이터를 조회하고 webhook으로 전송
 * @access  Public
 * @query   pageNo - 페이지 번호 (기본값: 1)
 * @query   numOfRows - 페이지당 행 수 (기본값: 10)
 * @query   fromDt - 조회 시작일 (YYYYMMDD 형식)
 * @query   toDt - 조회 종료일 (YYYYMMDD 형식)
 */
router.post('/bid-notice', webhookController.sendBidNoticeData.bind(webhookController));

/**
 * @route   POST /api/webhook/pre-notice
 * @desc    사전공고 데이터를 조회하고 webhook으로 전송
 * @access  Public
 * @query   pageNo - 페이지 번호 (기본값: 1)
 * @query   numOfRows - 페이지당 행 수 (기본값: 10)
 * @query   fromDt - 조회 시작일 (YYYYMMDD 형식)
 * @query   toDt - 조회 종료일 (YYYYMMDD 형식)
 */
router.post('/pre-notice', webhookController.sendPreNoticeData.bind(webhookController));

/**
 * @route   POST /api/webhook/contract
 * @desc    계약현황 데이터를 조회하고 webhook으로 전송
 * @access  Public
 * @query   pageNo - 페이지 번호 (기본값: 1)
 * @query   numOfRows - 페이지당 행 수 (기본값: 10)
 * @query   fromDt - 조회 시작일 (YYYYMMDD 형식)
 * @query   toDt - 조회 종료일 (YYYYMMDD 형식)
 */
router.post('/contract', webhookController.sendContractData.bind(webhookController));

/**
 * @route   POST /api/webhook/all
 * @desc    모든 데이터를 일괄 조회하고 webhook으로 전송
 * @access  Public
 * @query   pageNo - 페이지 번호 (기본값: 1)
 * @query   numOfRows - 페이지당 행 수 (기본값: 10)
 * @query   fromDt - 조회 시작일 (YYYYMMDD 형식)
 * @query   toDt - 조회 종료일 (YYYYMMDD 형식)
 */
router.post('/all', webhookController.sendAllData.bind(webhookController));

export default router;
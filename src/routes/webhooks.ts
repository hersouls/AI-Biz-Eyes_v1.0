import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { Webhook, WebhookCreateRequest } from '../types';

const router = Router();

// 웹훅 등록
router.post('/', [
  body('url').isURL().withMessage('유효한 URL을 입력해주세요.'),
  body('events').isArray().withMessage('이벤트는 배열이어야 합니다.'),
  body('events.*').isIn(['bid.created', 'notification.sent', 'reference.created']).withMessage('유효한 이벤트 타입을 입력해주세요.')
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

    const webhookData: WebhookCreateRequest = req.body;

    // Mock 웹훅 생성
    const newWebhook: Webhook = {
      id: Math.floor(Math.random() * 1000) + 1,
      url: webhookData.url,
      events: webhookData.events,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const response = createSuccessResponse(newWebhook, '웹훅이 등록되었습니다.');
    return res.status(201).json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

// 웹훅 목록 조회
router.get('/', (req: Request, res: Response) => {
  try {
    // Mock 웹훅 목록
    const webhooks: Webhook[] = [
      {
        id: 1,
        url: 'https://your-domain.com/webhook',
        events: ['bid.created', 'notification.sent'],
        isActive: true,
        lastTriggered: '2024-07-22T10:30:00Z',
        createdAt: '2024-07-01T00:00:00Z'
      },
      {
        id: 2,
        url: 'https://another-domain.com/webhook',
        events: ['reference.created'],
        isActive: false,
        createdAt: '2024-07-15T00:00:00Z'
      }
    ];

    const response = createSuccessResponse({ webhooks });
    return res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

export default router;
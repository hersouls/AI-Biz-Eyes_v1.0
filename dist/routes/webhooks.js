"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.post('/', [
    (0, express_validator_1.body)('url').isURL().withMessage('유효한 URL을 입력해주세요.'),
    (0, express_validator_1.body)('events').isArray().withMessage('이벤트는 배열이어야 합니다.'),
    (0, express_validator_1.body)('events.*').isIn(['bid.created', 'notification.sent', 'reference.created']).withMessage('유효한 이벤트 타입을 입력해주세요.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const webhookData = req.body;
        const newWebhook = {
            id: Math.floor(Math.random() * 1000) + 1,
            url: webhookData.url,
            events: webhookData.events,
            isActive: true,
            createdAt: new Date().toISOString()
        };
        const response = (0, response_1.createSuccessResponse)(newWebhook, '웹훅이 등록되었습니다.');
        return res.status(201).json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.get('/', (req, res) => {
    try {
        const webhooks = [
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
        const response = (0, response_1.createSuccessResponse)({ webhooks });
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
exports.default = router;
//# sourceMappingURL=webhooks.js.map
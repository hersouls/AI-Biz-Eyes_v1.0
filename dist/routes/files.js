"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.post('/upload', (req, res) => {
    try {
        const fileResponse = {
            id: Math.floor(Math.random() * 1000) + 1,
            name: 'document.pdf',
            url: 'https://s3.amazonaws.com/ai-biz-eyes-files/mock-document.pdf',
            size: 2048576,
            mimeType: 'application/pdf',
            category: 'reference',
            uploadedAt: new Date().toISOString()
        };
        const response = (0, response_1.createSuccessResponse)(fileResponse, '파일이 업로드되었습니다.');
        return res.status(201).json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('FILE_UPLOAD_ERROR', '파일 업로드 중 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.get('/:id/download', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('유효한 파일 ID를 입력해주세요.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const fileId = Number(req.params.id);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
        res.setHeader('Content-Length', '2048576');
        return res.send(Buffer.alloc(1024));
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('FILE_DOWNLOAD_ERROR', '파일 다운로드 중 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
exports.default = router;
//# sourceMappingURL=files.js.map
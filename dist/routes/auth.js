"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const mockData_1 = require("../data/mockData");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const { email, password } = req.body;
        const user = mockData_1.mockUsers.find(u => u.email === email);
        if (!user) {
            const errorResponse = (0, response_1.createErrorResponse)('AUTH_INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.');
            return res.status(401).json(errorResponse);
        }
        if (password !== 'password123') {
            const errorResponse = (0, response_1.createErrorResponse)('AUTH_INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.');
            return res.status(401).json(errorResponse);
        }
        const token = (0, auth_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role
        });
        const refreshToken = (0, auth_1.generateRefreshToken)({
            id: user.id,
            email: user.email
        });
        const response = (0, response_1.createSuccessResponse)({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                organization: user.organization,
                role: user.role
            },
            token,
            refreshToken
        }, '로그인에 성공했습니다.');
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.post('/logout', (req, res) => {
    try {
        const response = (0, response_1.createSuccessResponse)(null, '로그아웃되었습니다.');
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.post('/refresh', [
    (0, express_validator_1.body)('refreshToken').notEmpty().withMessage('리프레시 토큰이 필요합니다.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const { refreshToken } = req.body;
        if (!refreshToken || refreshToken === 'invalid_token') {
            const errorResponse = (0, response_1.createErrorResponse)('AUTH_TOKEN_INVALID', '유효하지 않은 리프레시 토큰입니다.');
            return res.status(401).json(errorResponse);
        }
        const newToken = (0, auth_1.generateToken)({ id: 1, email: 'user@example.com', role: 'user' });
        const newRefreshToken = (0, auth_1.generateRefreshToken)({ id: 1, email: 'user@example.com' });
        const response = (0, response_1.createSuccessResponse)({
            token: newToken,
            refreshToken: newRefreshToken
        }, '토큰이 갱신되었습니다.');
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.get('/me', auth_2.authenticateToken, (req, res) => {
    try {
        const user = mockData_1.mockUsers[1];
        const response = (0, response_1.createSuccessResponse)({
            id: user.id,
            email: user.email,
            name: user.name,
            organization: user.organization,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        });
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map
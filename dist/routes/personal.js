"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../utils/response");
const mockData_1 = require("../data/mockData");
const router = (0, express_1.Router)();
router.get('/profile', (req, res) => {
    try {
        const user = mockData_1.mockUsers[0];
        const profile = {
            id: user.id,
            email: user.email,
            name: user.name,
            organization: user.organization,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            phone: '010-1234-5678',
            department: 'IT 개발팀',
            position: '시니어 개발자',
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
            experience: '8년',
            education: '컴퓨터공학 학사',
            certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
            preferences: {
                notifications: {
                    email: true,
                    push: true,
                    sms: false
                },
                language: 'ko',
                timezone: 'Asia/Seoul'
            }
        };
        const response = (0, response_1.createSuccessResponse)(profile, '프로필을 성공적으로 조회했습니다.');
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
exports.default = router;
//# sourceMappingURL=personal.js.map
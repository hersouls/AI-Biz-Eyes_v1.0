"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const response_1 = require("../utils/response");
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, type, status, priority, startDate, endDate, assignedTo } = req.query;
        let filteredNotifications = [...mockData_1.initialMockNotifications];
        if (type) {
            filteredNotifications = filteredNotifications.filter(n => n.type === type);
        }
        if (status) {
            filteredNotifications = filteredNotifications.filter(n => n.status === status);
        }
        if (priority) {
            filteredNotifications = filteredNotifications.filter(n => n.priority === priority);
        }
        if (assignedTo) {
            filteredNotifications = filteredNotifications.filter(n => n.assignedTo === Number(assignedTo));
        }
        if (startDate) {
            filteredNotifications = filteredNotifications.filter(n => n.createdAt >= startDate);
        }
        if (endDate) {
            filteredNotifications = filteredNotifications.filter(n => n.createdAt <= endDate);
        }
        filteredNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
        const response = (0, response_1.createSuccessResponse)({
            notifications: paginatedNotifications,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: filteredNotifications.length,
                totalPages: Math.ceil(filteredNotifications.length / Number(limit))
            }
        });
        return res.json(response);
    }
    catch (error) {
        console.error('알림 목록 조회 실패:', error);
        return res.status(500).json({
            success: false,
            message: '알림 목록을 불러오는데 실패했습니다.'
        });
    }
});
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const notificationIndex = mockData_1.initialMockNotifications.findIndex(n => n.id === Number(id));
        if (notificationIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '알림을 찾을 수 없습니다.'
            });
        }
        mockData_1.initialMockNotifications[notificationIndex] = {
            ...mockData_1.initialMockNotifications[notificationIndex],
            status: status,
            updatedAt: new Date().toISOString()
        };
        return res.json({
            success: true,
            data: mockData_1.initialMockNotifications[notificationIndex],
            message: '알림 상태가 변경되었습니다.'
        });
    }
    catch (error) {
        console.error('알림 상태 변경 실패:', error);
        return res.status(500).json({
            success: false,
            message: '알림 상태 변경에 실패했습니다.'
        });
    }
});
router.put('/bulk', auth_1.authenticateToken, async (req, res) => {
    try {
        const { ids, status } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: '처리할 알림을 선택해주세요.'
            });
        }
        ids.forEach(id => {
            const notificationIndex = mockData_1.initialMockNotifications.findIndex(n => n.id === id);
            if (notificationIndex !== -1) {
                mockData_1.initialMockNotifications[notificationIndex] = {
                    ...mockData_1.initialMockNotifications[notificationIndex],
                    status: status,
                    updatedAt: new Date().toISOString()
                };
            }
        });
        return res.json({
            success: true,
            message: `${ids.length}개의 알림이 처리되었습니다.`
        });
    }
    catch (error) {
        console.error('알림 일괄 처리 실패:', error);
        return res.status(500).json({
            success: false,
            message: '알림 일괄 처리에 실패했습니다.'
        });
    }
});
router.get('/stats', auth_1.authenticateToken, async (req, res) => {
    try {
        const total = mockData_1.initialMockNotifications.length;
        const unread = mockData_1.initialMockNotifications.filter(n => n.status === 'unread').length;
        const urgent = mockData_1.initialMockNotifications.filter(n => n.priority === 'high').length;
        const high = mockData_1.initialMockNotifications.filter(n => n.priority === 'high').length;
        const normal = mockData_1.initialMockNotifications.filter(n => n.priority === 'medium').length;
        const low = mockData_1.initialMockNotifications.filter(n => n.priority === 'low').length;
        const response = (0, response_1.createSuccessResponse)({
            total,
            unread,
            urgent,
            high,
            normal,
            low
        });
        return res.json(response);
    }
    catch (error) {
        console.error('알림 통계 조회 실패:', error);
        return res.status(500).json({
            success: false,
            message: '알림 통계를 불러오는데 실패했습니다.'
        });
    }
});
router.get('/settings', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id || 1;
        const defaultSettings = {
            emailNotifications: {
                enabled: true,
                types: ['urgent', 'deadline'],
                frequency: 'immediate'
            },
            webNotifications: {
                enabled: true,
                types: ['urgent', 'deadline', 'missing', 'duplicate']
            },
            pushNotifications: {
                enabled: false
            }
        };
        const response = (0, response_1.createSuccessResponse)({
            settings: defaultSettings
        });
        return res.json(response);
    }
    catch (error) {
        console.error('알림 설정 조회 실패:', error);
        return res.status(500).json({
            success: false,
            message: '알림 설정을 불러오는데 실패했습니다.'
        });
    }
});
router.post('/settings', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id || 1;
        const { settings } = req.body;
        const response = (0, response_1.createSuccessResponse)({
            settings
        }, '알림 설정이 저장되었습니다.');
        return res.json(response);
    }
    catch (error) {
        console.error('알림 설정 저장 실패:', error);
        return res.status(500).json({
            success: false,
            message: '알림 설정 저장에 실패했습니다.'
        });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map
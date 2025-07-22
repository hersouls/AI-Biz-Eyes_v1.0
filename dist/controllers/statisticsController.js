"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const mockData_1 = require("../data/mockData");
class StatisticsController {
    static async getBidStatistics(req, res) {
        try {
            const { period, startDate, endDate } = req.query;
            const statistics = mockData_1.mockBidStatistics;
            const response = {
                success: true,
                data: statistics,
                timestamp: new Date().toISOString()
            };
            return res.json(response);
        }
        catch (error) {
            console.error('Error fetching bid statistics:', error);
            return res.status(500).json({
                success: false,
                message: '통계 조회 중 오류가 발생했습니다.',
                timestamp: new Date().toISOString()
            });
        }
    }
    static async getReferenceStatistics(req, res) {
        try {
            const { period, startDate, endDate } = req.query;
            const statistics = {
                totalReferences: 150,
                successRate: 75.5,
                successStats: {
                    success: 113,
                    failure: 25,
                    ongoing: 12
                },
                yearlyStats: [
                    { participationYear: 2024, count: 45, success: 35, totalAmount: 15000000000 },
                    { participationYear: 2023, count: 38, success: 28, totalAmount: 12000000000 },
                    { participationYear: 2022, count: 32, success: 24, totalAmount: 10000000000 }
                ],
                typeStats: [
                    { projectType: '공사', count: 60, success: 45, totalAmount: 20000000000 },
                    { projectType: '용역', count: 70, success: 53, totalAmount: 15000000000 },
                    { projectType: '물품', count: 20, success: 15, totalAmount: 2000000000 }
                ],
                organizationStats: [
                    { organization: '조달청', count: 40, success: 30, totalAmount: 12000000000 },
                    { organization: '한국산업기술진흥원', count: 35, success: 26, totalAmount: 10000000000 },
                    { organization: '중소기업진흥공단', count: 30, success: 22, totalAmount: 8000000000 }
                ]
            };
            const response = {
                success: true,
                data: statistics,
                timestamp: new Date().toISOString()
            };
            return res.json(response);
        }
        catch (error) {
            console.error('Error fetching reference statistics:', error);
            return res.status(500).json({
                success: false,
                message: '레퍼런스 통계 조회 중 오류가 발생했습니다.',
                timestamp: new Date().toISOString()
            });
        }
    }
    static async getNotificationStatistics(req, res) {
        try {
            const { period, startDate, endDate } = req.query;
            const statistics = {
                totalNotifications: 250,
                typeStats: [
                    { type: 'urgent', count: 45, unread: 5 },
                    { type: 'deadline', count: 60, unread: 8 },
                    { type: 'new', count: 80, unread: 12 },
                    { type: 'missing', count: 35, unread: 3 },
                    { type: 'duplicate', count: 30, unread: 2 }
                ],
                statusStats: [
                    { status: 'unread', count: 30 },
                    { status: 'read', count: 180 },
                    { status: 'important', count: 25 },
                    { status: 'completed', count: 15 }
                ],
                priorityStats: [
                    { priority: 'high', count: 45 },
                    { priority: 'medium', count: 120 },
                    { priority: 'low', count: 85 }
                ],
                dailyTrend: [
                    { date: '2024-07-22', count: 12 },
                    { date: '2024-07-21', count: 15 },
                    { date: '2024-07-20', count: 8 },
                    { date: '2024-07-19', count: 20 },
                    { date: '2024-07-18', count: 18 }
                ]
            };
            const response = {
                success: true,
                data: statistics,
                timestamp: new Date().toISOString()
            };
            return res.json(response);
        }
        catch (error) {
            console.error('Error fetching notification statistics:', error);
            return res.status(500).json({
                success: false,
                message: '알림 통계 조회 중 오류가 발생했습니다.',
                timestamp: new Date().toISOString()
            });
        }
    }
    static async getSystemStatistics(req, res) {
        try {
            const statistics = mockData_1.mockSystemStatistics;
            const response = {
                success: true,
                data: statistics,
                timestamp: new Date().toISOString()
            };
            return res.json(response);
        }
        catch (error) {
            console.error('Error fetching system statistics:', error);
            return res.status(500).json({
                success: false,
                message: '시스템 통계 조회 중 오류가 발생했습니다.',
                timestamp: new Date().toISOString()
            });
        }
    }
}
exports.StatisticsController = StatisticsController;
//# sourceMappingURL=statisticsController.js.map
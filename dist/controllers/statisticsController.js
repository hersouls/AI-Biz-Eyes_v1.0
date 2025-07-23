"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const mockData_1 = require("../data/mockData");
const faker_1 = require("@faker-js/faker");
class StatisticsController {
    static async getDashboardStatistics(req, res) {
        try {
            const dashboardStats = {
                totalBids: faker_1.faker.number.int({ min: 100, max: 500 }),
                activeBids: faker_1.faker.number.int({ min: 20, max: 100 }),
                completedBids: faker_1.faker.number.int({ min: 50, max: 200 }),
                totalReferences: mockData_1.initialMockReferences.length,
                successReferences: mockData_1.initialMockReferences.filter(ref => ref.status === 'success').length,
                totalNotifications: faker_1.faker.number.int({ min: 10, max: 50 }),
                unreadNotifications: faker_1.faker.number.int({ min: 1, max: 20 }),
                successRate: Math.round((mockData_1.initialMockReferences.filter(ref => ref.status === 'success').length / mockData_1.initialMockReferences.length) * 100 * 10) / 10,
                averageScore: faker_1.faker.number.float({ min: 3.0, max: 4.5, fractionDigits: 1 }),
                monthlyTrend: Array.from({ length: 12 }, () => faker_1.faker.number.int({ min: 10, max: 50 })),
                categoryDistribution: {
                    '공사': mockData_1.initialMockReferences.filter(ref => ref.projectType === '공사').length,
                    '용역': mockData_1.initialMockReferences.filter(ref => ref.projectType === '용역').length,
                    '물품': mockData_1.initialMockReferences.filter(ref => ref.projectType === '물품').length,
                    'AI': mockData_1.initialMockReferences.filter(ref => ref.projectType === 'AI').length,
                    'IT': mockData_1.initialMockReferences.filter(ref => ref.projectType === 'IT').length,
                    'CT': mockData_1.initialMockReferences.filter(ref => ref.projectType === 'CT').length
                }
            };
            const response = {
                success: true,
                data: dashboardStats,
                timestamp: new Date().toISOString()
            };
            return res.json(response);
        }
        catch (error) {
            console.error('Error fetching dashboard statistics:', error);
            return res.status(500).json({
                success: false,
                message: '대시보드 통계 조회 중 오류가 발생했습니다.',
                timestamp: new Date().toISOString()
            });
        }
    }
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
            const totalReferences = mockData_1.initialMockReferences.length;
            const successCount = mockData_1.initialMockReferences.filter(ref => ref.status === 'success').length;
            const failureCount = mockData_1.initialMockReferences.filter(ref => ref.status === 'failure').length;
            const ongoingCount = mockData_1.initialMockReferences.filter(ref => ref.status === 'ongoing').length;
            const successRate = totalReferences > 0 ? (successCount / totalReferences) * 100 : 0;
            const typeStats = [
                { projectType: '공사', count: mockData_1.initialMockReferences.filter(ref => ref.projectType === '공사').length, success: mockData_1.initialMockReferences.filter(ref => ref.projectType === '공사' && ref.status === 'success').length, totalAmount: mockData_1.initialMockReferences.filter(ref => ref.projectType === '공사').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
                { projectType: '용역', count: mockData_1.initialMockReferences.filter(ref => ref.projectType === '용역').length, success: mockData_1.initialMockReferences.filter(ref => ref.projectType === '용역' && ref.status === 'success').length, totalAmount: mockData_1.initialMockReferences.filter(ref => ref.projectType === '용역').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
                { projectType: '물품', count: mockData_1.initialMockReferences.filter(ref => ref.projectType === '물품').length, success: mockData_1.initialMockReferences.filter(ref => ref.projectType === '물품' && ref.status === 'success').length, totalAmount: mockData_1.initialMockReferences.filter(ref => ref.projectType === '물품').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
                { projectType: 'IT', count: mockData_1.initialMockReferences.filter(ref => ref.projectType === 'IT').length, success: mockData_1.initialMockReferences.filter(ref => ref.projectType === 'IT' && ref.status === 'success').length, totalAmount: mockData_1.initialMockReferences.filter(ref => ref.projectType === 'IT').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
                { projectType: 'CT', count: mockData_1.initialMockReferences.filter(ref => ref.projectType === 'CT').length, success: mockData_1.initialMockReferences.filter(ref => ref.projectType === 'CT' && ref.status === 'success').length, totalAmount: mockData_1.initialMockReferences.filter(ref => ref.projectType === 'CT').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
                { projectType: 'AI', count: mockData_1.initialMockReferences.filter(ref => ref.projectType === 'AI').length, success: mockData_1.initialMockReferences.filter(ref => ref.projectType === 'AI' && ref.status === 'success').length, totalAmount: mockData_1.initialMockReferences.filter(ref => ref.projectType === 'AI').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) }
            ];
            const yearlyStats = [];
            const years = [...new Set(mockData_1.initialMockReferences.map(ref => ref.participationYear))].filter((year) => year !== undefined).sort((a, b) => b - a);
            years.forEach(year => {
                const yearRefs = mockData_1.initialMockReferences.filter(ref => ref.participationYear === year);
                yearlyStats.push({
                    participationYear: year,
                    count: yearRefs.length,
                    success: yearRefs.filter(ref => ref.status === 'success').length,
                    totalAmount: yearRefs.reduce((sum, ref) => sum + (ref.contractAmount || 0), 0)
                });
            });
            const organizationStats = [];
            const organizations = [...new Set(mockData_1.initialMockReferences.map(ref => ref.organization))].filter((org) => org !== undefined);
            organizations.forEach(org => {
                const orgRefs = mockData_1.initialMockReferences.filter(ref => ref.organization === org);
                organizationStats.push({
                    organization: org,
                    count: orgRefs.length,
                    success: orgRefs.filter(ref => ref.status === 'success').length,
                    totalAmount: orgRefs.reduce((sum, ref) => sum + (ref.contractAmount || 0), 0)
                });
            });
            const statistics = {
                totalReferences,
                successRate: Math.round(successRate * 10) / 10,
                successStats: {
                    success: successCount,
                    failure: failureCount,
                    ongoing: ongoingCount
                },
                yearlyStats,
                typeStats,
                organizationStats
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
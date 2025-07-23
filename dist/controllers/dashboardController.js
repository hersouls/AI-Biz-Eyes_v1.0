"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const faker_1 = require("@faker-js/faker");
class DashboardController {
    static async getDashboardData(req, res) {
        try {
            const dashboardData = {
                totalBids: faker_1.faker.number.int({ min: 100, max: 500 }),
                activeBids: faker_1.faker.number.int({ min: 20, max: 100 }),
                completedBids: faker_1.faker.number.int({ min: 50, max: 200 }),
                totalReferences: faker_1.faker.number.int({ min: 30, max: 150 }),
                totalNotifications: faker_1.faker.number.int({ min: 10, max: 50 }),
                unreadNotifications: faker_1.faker.number.int({ min: 1, max: 20 }),
                successRate: faker_1.faker.number.float({ min: 0.6, max: 0.9, fractionDigits: 2 }),
                averageScore: faker_1.faker.number.float({ min: 3.0, max: 4.5, fractionDigits: 1 }),
                monthlyTrend: Array.from({ length: 12 }, () => faker_1.faker.number.int({ min: 10, max: 50 })),
                categoryDistribution: {
                    '공사': faker_1.faker.number.int({ min: 20, max: 40 }),
                    '용역': faker_1.faker.number.int({ min: 15, max: 35 }),
                    '물품': faker_1.faker.number.int({ min: 10, max: 25 }),
                    'AI': faker_1.faker.number.int({ min: 5, max: 15 }),
                    'IT': faker_1.faker.number.int({ min: 8, max: 20 }),
                    'CT': faker_1.faker.number.int({ min: 3, max: 10 })
                }
            };
            res.json({
                success: true,
                data: dashboardData,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Dashboard data error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'DASHBOARD_ERROR',
                    message: '대시보드 데이터를 불러오는 중 오류가 발생했습니다.'
                },
                timestamp: new Date().toISOString()
            });
        }
    }
    static async getChartData(req, res) {
        try {
            const chartData = {
                bidTrend: Array.from({ length: 12 }, () => faker_1.faker.number.int({ min: 5, max: 30 })),
                successRate: Array.from({ length: 12 }, () => faker_1.faker.number.float({ min: 0.5, max: 0.9, fractionDigits: 2 })),
                categoryData: {
                    labels: ['공사', '용역', '물품', 'AI', 'IT', 'CT'],
                    data: Array.from({ length: 6 }, () => faker_1.faker.number.int({ min: 10, max: 50 }))
                },
                monthlyComparison: {
                    current: Array.from({ length: 12 }, () => faker_1.faker.number.int({ min: 10, max: 40 })),
                    previous: Array.from({ length: 12 }, () => faker_1.faker.number.int({ min: 8, max: 35 }))
                }
            };
            res.json({
                success: true,
                data: chartData,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Chart data error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'CHART_DATA_ERROR',
                    message: '차트 데이터를 불러오는 중 오류가 발생했습니다.'
                },
                timestamp: new Date().toISOString()
            });
        }
    }
    static async getSummaryData(req, res) {
        try {
            const summaryData = {
                recentBids: Array.from({ length: 5 }, () => ({
                    id: faker_1.faker.number.int({ min: 1, max: 1000 }),
                    bidNtceNo: faker_1.faker.string.alphanumeric(8).toUpperCase(),
                    bidNtceNm: faker_1.faker.commerce.productName() + ' 구축 사업',
                    status: faker_1.faker.helpers.arrayElement(['일반공고', '긴급공고', '정정공고']),
                    bidClseDate: faker_1.faker.date.future().toISOString().split('T')[0]
                })),
                recentNotifications: Array.from({ length: 5 }, () => ({
                    id: faker_1.faker.number.int({ min: 1, max: 100 }),
                    type: faker_1.faker.helpers.arrayElement(['urgent', 'deadline', 'new', 'duplicate']),
                    title: faker_1.faker.lorem.sentence(),
                    status: faker_1.faker.helpers.arrayElement(['unread', 'read', 'completed']),
                    createdAt: faker_1.faker.date.recent().toISOString()
                })),
                topReferences: Array.from({ length: 3 }, () => ({
                    id: faker_1.faker.number.int({ min: 1, max: 1000 }),
                    projectName: faker_1.faker.commerce.productName() + ' 구축 사업',
                    score: faker_1.faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
                    contractAmount: faker_1.faker.number.int({ min: 10000000, max: 1000000000 })
                }))
            };
            res.json({
                success: true,
                data: summaryData,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Summary data error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SUMMARY_DATA_ERROR',
                    message: '요약 데이터를 불러오는 중 오류가 발생했습니다.'
                },
                timestamp: new Date().toISOString()
            });
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboardController.js.map
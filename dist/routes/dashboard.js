"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.get('/stats', (req, res) => {
    try {
        const stats = {
            totalBids: 156,
            activeBids: 23,
            completedBids: 89,
            totalRevenue: 1250000000,
            monthlyRevenue: 85000000,
            successRate: 78.5,
            averageBidAmount: 8500000,
            topCategories: [
                { name: 'IT/소프트웨어', count: 45, percentage: 28.8 },
                { name: '건설/인프라', count: 32, percentage: 20.5 },
                { name: '마케팅/광고', count: 28, percentage: 17.9 },
                { name: '교육/훈련', count: 18, percentage: 11.5 },
                { name: '기타', count: 33, percentage: 21.2 }
            ],
            recentActivity: [
                { type: 'bid_created', message: '새로운 입찰이 생성되었습니다.', time: '2시간 전' },
                { type: 'bid_won', message: '입찰에 성공했습니다!', time: '5시간 전' },
                { type: 'reference_added', message: '새로운 참고자료가 추가되었습니다.', time: '1일 전' }
            ]
        };
        const response = (0, response_1.createSuccessResponse)(stats, '대시보드 통계를 성공적으로 조회했습니다.');
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map
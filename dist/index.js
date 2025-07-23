"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const bids_1 = __importDefault(require("./routes/bids"));
const references_1 = __importDefault(require("./routes/references"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const reports_1 = __importDefault(require("./routes/reports"));
const admin_1 = __importDefault(require("./routes/admin"));
const files_1 = __importDefault(require("./routes/files"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const personal_1 = __importDefault(require("./routes/personal"));
const statistics_1 = __importDefault(require("./routes/statistics"));
const integration_1 = __importDefault(require("./routes/integration"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://bizeyes.moonwave.kr'],
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
        },
        timestamp: new Date().toISOString()
    }
});
app.use(limiter);
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/bids', bids_1.default);
app.use('/api/references', references_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/reports', reports_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/files', files_1.default);
app.use('/api/webhooks', webhooks_1.default);
app.use('/api/personal', personal_1.default);
app.use('/api/statistics', statistics_1.default);
app.use('/api/integration', integration_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'ENDPOINT_NOT_FOUND',
            message: '요청한 엔드포인트를 찾을 수 없습니다.'
        },
        timestamp: new Date().toISOString()
    });
});
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        success: false,
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: err.message || '서버 오류가 발생했습니다.',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        },
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`🚀 AI Biz Eyes Mock API Server is running on port ${PORT}`);
    console.log(`📚 API Documentation: https://bizeyes.moonwave.kr/api`);
    console.log(`🏥 Health Check: https://bizeyes.moonwave.kr/api/health`);
    console.log(`\n📋 Available endpoints:`);
    console.log(`   POST /api/auth/login - 로그인`);
    console.log(`   POST /api/auth/logout - 로그아웃`);
    console.log(`   POST /api/auth/refresh - 토큰 갱신`);
    console.log(`   GET  /api/auth/me - 내 정보 조회`);
    console.log(`   GET  /api/bids - 공고 목록`);
    console.log(`   GET  /api/bids/:id - 공고 상세`);
    console.log(`   POST /api/bids/sync - 공고 동기화`);
    console.log(`   GET  /api/bids/statistics - 공고 통계`);
    console.log(`   GET  /api/references - 레퍼런스 목록`);
    console.log(`   POST /api/references - 레퍼런스 등록`);
    console.log(`   PUT  /api/references/:id - 레퍼런스 수정`);
    console.log(`   DELETE /api/references/:id - 레퍼런스 삭제`);
    console.log(`   GET  /api/references/match - 유사 공고 매칭`);
    console.log(`   GET  /api/notifications - 알림 목록`);
    console.log(`   PUT  /api/notifications/:id - 알림 상태 변경`);
    console.log(`   POST /api/notifications/settings - 알림 설정`);
    console.log(`   GET  /api/admin/users - 사용자 목록 (관리자)`);
    console.log(`   POST /api/admin/users - 사용자 등록 (관리자)`);
    console.log(`   PUT  /api/admin/users/:id - 사용자 수정 (관리자)`);
    console.log(`   GET  /api/admin/logs - 시스템 로그 (관리자)`);
    console.log(`   GET  /api/admin/statistics - 시스템 통계 (관리자)`);
    console.log(`   POST /api/files/upload - 파일 업로드`);
    console.log(`   GET  /api/files/:id/download - 파일 다운로드`);
    console.log(`   POST /api/webhooks - 웹훅 등록`);
    console.log(`   GET  /api/webhooks - 웹훅 목록`);
    console.log(`\n🔑 Test Credentials:`);
    console.log(`   Admin: admin@example.com / password123`);
    console.log(`   User: user@example.com / password123`);
    console.log(`   Manager: manager@example.com / password123`);
});
exports.default = app;
//# sourceMappingURL=index.js.map
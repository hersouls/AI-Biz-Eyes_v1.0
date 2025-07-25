import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { initializeSentry, sentryErrorHandler } from './utils/monitoring';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// 라우터 임포트
import authRoutes from './routes/auth';
import bidRoutes from './routes/bids';
import referenceRoutes from './routes/references';
import notificationRoutes from './routes/notifications';
import reportRoutes from './routes/reports';
import adminRoutes from './routes/admin';
import fileRoutes from './routes/files';
import webhookRoutes from './routes/webhookRoutes';
import webhooksRoutes from './routes/webhooks';
import personalRoutes from './routes/personal';
import statisticsRoutes from './routes/statistics';
import dashboardRoutes from './routes/dashboard';
import integrationRoutes from './routes/integration';
import g2bRoutes from './routes/g2b';

const app = express();
const PORT = process.env.PORT || 3003;

// Sentry 초기화
initializeSentry(app);

// 보안 미들웨어
app.use(helmet());

// CORS 설정
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://bizeyes.moonwave.kr'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 요청 제한 설정
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // IP당 최대 100개 요청
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

// 로깅
app.use(morgan('combined'));

// JSON 파싱
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 헬스 체크
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

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/references', referenceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/g2b', g2bRoutes);

// 404 핸들러
app.use(notFoundHandler);

// Sentry 에러 핸들러 (커스텀 에러 핸들러 전에)
app.use(sentryErrorHandler);

// 커스텀 에러 핸들러
app.use(errorHandler);

// 서버 시작
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
  console.log(`   GET  /api/g2b/status - 조달청 API 상태 확인`);
  console.log(`   GET  /api/g2b/bids - 입찰공고 목록`);
  console.log(`   GET  /api/g2b/bids/:id - 입찰공고 상세`);
  console.log(`   GET  /api/g2b/bids/search/:keyword - 키워드 검색`);
  console.log(`   GET  /api/g2b/contracts - 계약 정보 목록`);
  console.log(`   GET  /api/g2b/contracts/:id - 계약 정보 상세`);
  console.log(`\n🔑 Test Credentials:`);
  console.log(`   Admin: admin@example.com / password123`);
  console.log(`   User: user@example.com / password123`);
  console.log(`   Manager: manager@example.com / password123`);
});

export default app;
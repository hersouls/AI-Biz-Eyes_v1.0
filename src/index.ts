import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// 라우터 임포트
import authRoutes from './routes/auth';
import bidRoutes from './routes/bids';
import referenceRoutes from './routes/references';
import notificationRoutes from './routes/notifications';
import reportRoutes from './routes/reports';
import adminRoutes from './routes/admin';
import fileRoutes from './routes/files';
import webhookRoutes from './routes/webhooks';
import personalRoutes from './routes/personal';
import statisticsRoutes from './routes/statistics';
import integrationRoutes from './routes/integration';

const app = express();
import { config } from './config/env';

const PORT = config.PORT;

// 보안 미들웨어
app.use(helmet());

// CORS 설정
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
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
app.use('/api/webhooks', webhookRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/integration', integrationRoutes);

// 404 핸들러
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

// 전역 에러 핸들러
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // JWT 토큰 에러
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(createErrorResponse(
      'INVALID_TOKEN',
      '유효하지 않은 토큰입니다.'
    ));
  }

  // 토큰 만료 에러
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(createErrorResponse(
      'TOKEN_EXPIRED',
      '토큰이 만료되었습니다.'
    ));
  }

  // 검증 에러
  if (err.name === 'ValidationError') {
    return res.status(422).json(createErrorResponse(
      'VALIDATION_ERROR',
      '입력값이 올바르지 않습니다.',
      { details: err.message }
    ));
  }

  // 기본 서버 에러
  return res.status(500).json(createErrorResponse(
    'INTERNAL_SERVER_ERROR',
    '서버 오류가 발생했습니다.'
  ));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 AI Biz Eyes Mock API Server is running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
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

export default app;
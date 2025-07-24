# 에러 처리 시스템 가이드

## 개요

이 프로젝트는 Node.js/Express 애플리케이션을 위한 포괄적인 에러 처리 시스템을 제공합니다. 체계적인 에러 분류, 자동화된 로깅, 모니터링을 통해 안정적이고 유지보수가 용이한 애플리케이션을 구축할 수 있습니다.

## 주요 기능

- ✅ **체계적인 에러 분류**: HTTP 상태 코드별 커스텀 에러 클래스
- ✅ **자동화된 에러 처리**: asyncHandler를 통한 try-catch 제거
- ✅ **포괄적인 로깅**: Winston을 사용한 구조화된 로깅
- ✅ **에러 모니터링**: Sentry 연동
- ✅ **타입 안전성**: TypeScript 완전 지원
- ✅ **개발자 경험**: 명확한 에러 메시지와 디버깅 정보

## 설치된 패키지

```bash
npm install winston winston-daily-rotate-file @sentry/node @sentry/tracing
```

## 디렉토리 구조

```
src/
├── errors/
│   ├── AppError.ts          # 기본 에러 클래스 및 특정 에러 타입
│   └── index.ts             # 에러 클래스 export
├── middleware/
│   ├── asyncHandler.ts      # 비동기 에러 처리 래퍼
│   └── errorHandler.ts      # 전역 에러 핸들러
├── utils/
│   ├── logger.ts            # Winston 로깅 시스템
│   ├── monitoring.ts        # Sentry 모니터링 설정
│   └── response.ts          # 응답 유틸리티 (기존)
└── examples/
    └── errorHandlingExamples.ts  # 사용 예시
```

## 에러 클래스

### 기본 AppError 클래스

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;
}
```

### 특정 에러 타입

| 에러 클래스 | 상태 코드 | 설명 |
|------------|-----------|------|
| `ValidationError` | 422 | 유효성 검증 실패 |
| `AuthenticationError` | 401 | 인증 실패 |
| `AuthorizationError` | 403 | 권한 부족 |
| `NotFoundError` | 404 | 리소스 없음 |
| `ConflictError` | 409 | 데이터 충돌 |
| `ExternalAPIError` | 503 | 외부 서비스 오류 |
| `BusinessLogicError` | 400 | 비즈니스 로직 오류 |
| `TokenError` | 401 | 토큰 관련 오류 |

## 사용법

### 1. 기본 사용법

```typescript
import { asyncHandler } from '../middleware/asyncHandler';
import { ValidationError, NotFoundError } from '../errors';

// Before: try-catch 필요
export const getBidDetailOld = async (req: Request, res: Response) => {
  try {
    const bidId = Number(req.params.id);
    if (isNaN(bidId)) {
      return res.status(422).json(createErrorResponse(
        'VALIDATION_ERROR',
        '유효한 공고 ID를 입력해주세요.'
      ));
    }
    // ... 더 많은 코드
  } catch (error) {
    return res.status(500).json(createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    ));
  }
};

// After: asyncHandler 사용
export const getBidDetail = asyncHandler(async (req: Request, res: Response) => {
  const bidId = Number(req.params.id);
  
  if (isNaN(bidId)) {
    throw new ValidationError('유효한 공고 ID를 입력해주세요.');
  }
  
  const bid = await bidService.findById(bidId);
  
  if (!bid) {
    throw new NotFoundError('입찰공고');
  }
  
  return res.json(createSuccessResponse(bid));
});
```

### 2. 유효성 검증 에러

```typescript
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !email.includes('@')) {
    throw new ValidationError('유효한 이메일 주소를 입력해주세요.');
  }

  if (!password || password.length < 8) {
    throw new ValidationError('비밀번호는 8자 이상이어야 합니다.', {
      field: 'password',
      minLength: 8
    });
  }

  // ... 사용자 생성 로직
});
```

### 3. 인증/권한 에러

```typescript
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  // 인증 체크
  if (!req.user) {
    throw new AuthenticationError('로그인이 필요합니다.');
  }

  // 권한 체크
  if (!req.user.isAdmin) {
    throw new AuthorizationError('관리자 권한이 필요합니다.');
  }

  // ... 삭제 로직
});
```

### 4. 외부 API 에러 처리

```typescript
export const fetchExternalData = asyncHandler(async (req: Request, res: Response) => {
  try {
    const data = await externalApiService.fetch();
    return res.json(createSuccessResponse(data));
  } catch (error: any) {
    throw new ExternalAPIError('외부 데이터 서비스', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
});
```

## 로깅 시스템

### 로그 레벨

- `error`: 에러 로그 (파일 저장)
- `warn`: 경고 로그
- `info`: 정보 로그
- `http`: HTTP 요청 로그
- `debug`: 디버그 로그 (개발 환경)

### 로그 파일

- `logs/error-YYYY-MM-DD.log`: 에러 로그만 저장
- `logs/all-YYYY-MM-DD.log`: 모든 로그 저장
- 자동 로테이션 (14일 보관, 20MB 최대)

### 사용법

```typescript
import { logError, logInfo, logWarn, logDebug } from '../utils/logger';

// 에러 로깅
logError(error, req);

// 정보 로깅
logInfo('사용자 로그인 성공', { userId: user.id });

// 경고 로깅
logWarn('API 호출 실패', { endpoint: '/api/data' });

// 디버그 로깅
logDebug('데이터 처리 중', { dataSize: data.length });
```

## 에러 모니터링 (Sentry)

### 설정

```typescript
// src/utils/monitoring.ts
export const initializeSentry = (app: Express) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
};
```

### 환경 변수

```env
SENTRY_DSN=your-sentry-dsn
NODE_ENV=production
```

## 메인 애플리케이션 통합

```typescript
// src/index.ts
import { initializeSentry, sentryErrorHandler } from './utils/monitoring';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Sentry 초기화
initializeSentry(app);

// ... 미들웨어 및 라우트 설정

// 404 핸들러
app.use(notFoundHandler);

// Sentry 에러 핸들러
app.use(sentryErrorHandler);

// 커스텀 에러 핸들러
app.use(errorHandler);
```

## 에러 응답 형식

### 성공 응답

```json
{
  "success": true,
  "data": { ... },
  "message": "작업이 완료되었습니다.",
  "timestamp": "2024-07-24T12:00:00.000Z"
}
```

### 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "유효한 이메일 주소를 입력해주세요.",
    "details": {
      "field": "email"
    }
  },
  "timestamp": "2024-07-24T12:00:00.000Z"
}
```

## 개발 환경 vs 운영 환경

### 개발 환경

- 상세한 에러 스택 트레이스 제공
- 디버그 레벨 로깅 활성화
- Sentry 비활성화

### 운영 환경

- 민감한 정보 제거된 에러 메시지
- 경고 레벨 이상 로깅만 활성화
- Sentry 활성화

## 모범 사례

### 1. 에러 메시지 작성

```typescript
// ❌ 좋지 않은 예
throw new ValidationError('Invalid input');

// ✅ 좋은 예
throw new ValidationError('이메일 주소 형식이 올바르지 않습니다.');
```

### 2. 에러 세분화

```typescript
// ❌ 너무 일반적인 에러
throw new Error('Something went wrong');

// ✅ 구체적인 에러
throw new ValidationError('비밀번호는 8자 이상이어야 합니다.', {
  field: 'password',
  minLength: 8,
  currentLength: password.length
});
```

### 3. 로깅 활용

```typescript
export const processPayment = asyncHandler(async (req: Request, res: Response) => {
  const { amount, method } = req.body;
  
  logInfo('결제 처리 시작', { amount, method, userId: req.user?.id });
  
  try {
    const result = await paymentService.process(amount, method);
    logInfo('결제 처리 완료', { paymentId: result.id });
    return res.json(createSuccessResponse(result));
  } catch (error) {
    logError(error, req);
    throw error; // 에러 핸들러가 처리
  }
});
```

## 테스트

### 에러 처리 테스트 예시

```typescript
import request from 'supertest';
import app from '../src/index';

describe('Error Handling', () => {
  test('should return 422 for validation error', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid-email' });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('should return 404 for not found', async () => {
    const response = await request(app)
      .get('/api/users/999999');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });
});
```

## 문제 해결

### 1. 로그 파일이 생성되지 않는 경우

```bash
# logs 디렉토리 생성
mkdir -p logs

# 권한 확인
ls -la logs/
```

### 2. Sentry가 작동하지 않는 경우

```bash
# 환경 변수 확인
echo $SENTRY_DSN
echo $NODE_ENV

# Sentry DSN이 올바른지 확인
# NODE_ENV가 production인지 확인
```

### 3. 에러 핸들러가 작동하지 않는 경우

```typescript
// 미들웨어 순서 확인
app.use(notFoundHandler);        // 마지막에
app.use(sentryErrorHandler);     // 404 다음
app.use(errorHandler);           // 가장 마지막
```

## 마이그레이션 가이드

### 기존 코드에서 마이그레이션

1. **asyncHandler 적용**
```typescript
// Before
export const handler = async (req, res) => {
  try {
    // 로직
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// After
export const handler = asyncHandler(async (req, res) => {
  // 로직
  throw new ValidationError('에러 메시지');
});
```

2. **에러 클래스 사용**
```typescript
// Before
if (!user) {
  return res.status(404).json({ error: 'User not found' });
}

// After
if (!user) {
  throw new NotFoundError('사용자');
}
```

3. **로깅 추가**
```typescript
// Before
console.error('Error:', error);

// After
logError(error, req);
```

## 결론

이 에러 처리 시스템을 통해 다음과 같은 이점을 얻을 수 있습니다:

- **개발 생산성 향상**: try-catch 블록 제거로 코드 간소화
- **에러 추적 용이성**: 구조화된 로깅과 모니터링
- **사용자 경험 개선**: 명확하고 일관된 에러 메시지
- **유지보수성 향상**: 체계적인 에러 분류와 처리
- **운영 안정성**: 자동화된 에러 모니터링과 알림

이 시스템을 활용하여 안정적이고 사용자 친화적인 애플리케이션을 구축하세요!
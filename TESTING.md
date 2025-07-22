# 테스트 가이드

이 문서는 AI Biz Eyes Mock API 서버의 테스트 구조와 실행 방법을 설명합니다.

## 테스트 구조

```
tests/
├── setup.ts                    # 테스트 환경 설정
├── unit/                       # 단위 테스트
│   ├── auth.test.ts           # 인증 유틸리티 테스트
│   ├── response.test.ts       # 응답 유틸리티 테스트
│   ├── middleware.test.ts     # 미들웨어 테스트
│   └── controllers.test.ts    # 컨트롤러 테스트
└── integration/               # 통합 테스트
    └── personal.test.ts       # Personal API 통합 테스트
```

## 테스트 실행

### 모든 테스트 실행
```bash
npm test
```

### 단위 테스트만 실행
```bash
npm run test:unit
```

### 통합 테스트만 실행
```bash
npm run test:integration
```

### 테스트 커버리지 확인
```bash
npm run test:coverage
```

### 테스트 감시 모드
```bash
npm run test:watch
```

## 테스트 커버리지

현재 테스트 커버리지:
- **전체**: 16.04% (Statements), 11.85% (Branches), 15.05% (Functions), 15.79% (Lines)
- **완전 커버리지**: 
  - `src/utils/auth.ts` (100%)
  - `src/utils/response.ts` (100%)
  - `src/middleware/auth.ts` (100%)
  - `src/routes/personal.ts` (100%)
  - `src/data/mockData.ts` (100%)

## 테스트 작성 가이드

### 단위 테스트 작성

1. **유틸리티 함수 테스트**
   - 순수 함수의 입력/출력 검증
   - 에러 케이스 처리 검증
   - 경계값 테스트

2. **미들웨어 테스트**
   - Mock Request/Response 객체 사용
   - 인증/권한 검증 로직 테스트
   - 에러 응답 검증

3. **컨트롤러 테스트**
   - 비즈니스 로직 검증
   - 응답 형식 검증
   - 에러 처리 검증

### 통합 테스트 작성

1. **API 엔드포인트 테스트**
   - HTTP 요청/응답 검증
   - 인증 토큰 검증
   - 데이터베이스 연동 검증

2. **테스트 데이터 설정**
   - Mock 데이터 사용
   - 테스트 격리 보장

## 테스트 모범 사례

### 1. 테스트 네이밍
```typescript
describe('Auth Utils', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      // 테스트 구현
    });
  });
});
```

### 2. Mock 객체 사용
```typescript
const createMockRequest = (body: any = {}, user?: any) => ({
  body,
  user
} as any);

const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
```

### 3. 비동기 테스트
```typescript
it('should hash password correctly', async () => {
  const password = 'testPassword123';
  const hashedPassword = await hashPassword(password);
  
  expect(hashedPassword).toBeDefined();
  expect(hashedPassword).not.toBe(password);
});
```

### 4. 에러 케이스 테스트
```typescript
it('should throw error for invalid token', () => {
  expect(() => {
    verifyToken('invalid.token.here');
  }).toThrow('Invalid token');
});
```

## 테스트 환경 설정

### Jest 설정 (`jest.config.js`)
- TypeScript 지원
- 테스트 파일 패턴 설정
- 커버리지 설정
- 모듈 경로 매핑

### 테스트 설정 (`tests/setup.ts`)
- 환경 변수 설정
- 전역 테스트 설정
- 타임아웃 설정

## 추가 테스트 작성 계획

### 우선순위 1 (높음)
- [ ] Auth 라우터 테스트
- [ ] Bids 컨트롤러 테스트
- [ ] Notifications 컨트롤러 테스트

### 우선순위 2 (중간)
- [ ] Admin 컨트롤러 테스트
- [ ] Statistics 컨트롤러 테스트
- [ ] Files 컨트롤러 테스트

### 우선순위 3 (낮음)
- [ ] Webhooks 통합 테스트
- [ ] Reports 통합 테스트
- [ ] References 통합 테스트

## 문제 해결

### 일반적인 문제들

1. **JWT 타입 오류**
   - `as any` 타입 캐스팅 사용
   - JWT 라이브러리 버전 확인

2. **Mock 함수 타입 오류**
   - `jest.fn() as any` 사용
   - TypeScript 설정 확인

3. **비동기 테스트 타임아웃**
   - `jest.setTimeout()` 설정
   - Promise 처리 확인

### 디버깅 팁

1. **개별 테스트 실행**
   ```bash
   npm test -- --testNamePattern="should generate a valid JWT token"
   ```

2. **테스트 로그 확인**
   ```bash
   npm test -- --verbose
   ```

3. **커버리지 상세 확인**
   ```bash
   npm run test:coverage
   # coverage/lcov-report/index.html 파일 확인
   ```
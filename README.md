# B2G 공모사업 자동화 관리 웹서비스 - Mock API 서버

B2G 공모사업 자동화 관리 웹서비스의 Mock API 서버입니다. API 명세서에 따라 구현된 모든 엔드포인트를 제공하며, 실제 데이터베이스 없이도 프론트엔드 개발 및 테스트가 가능합니다.

## 🚀 주요 기능

- **인증 시스템**: JWT 기반 로그인/로그아웃/토큰 갱신
- **공고 관리**: 공고 목록 조회, 상세 조회, 동기화, 통계
- **레퍼런스 관리**: 레퍼런스 CRUD, 유사 공고 매칭
- **알림 시스템**: 알림 목록, 상태 변경, 설정 관리
- **관리자 기능**: 사용자 관리, 시스템 로그, 통계
- **파일 관리**: 파일 업로드/다운로드 (Mock)
- **웹훅**: 웹훅 등록 및 관리

## 🛠 기술 스택

- **Runtime**: Node.js 18.x
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting
- **Mock Data**: faker.js

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

## 🔑 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin@example.com | password123 |
| 일반 사용자 | user@example.com | password123 |
| 매니저 | manager@example.com | password123 |

## 📚 API 엔드포인트

### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /api/auth/me` - 내 정보 조회

### 공고 API
- `GET /api/bids` - 공고 목록 조회
- `GET /api/bids/:id` - 공고 상세 조회
- `POST /api/bids/sync` - 공고 동기화
- `GET /api/bids/statistics` - 공고 통계

### 레퍼런스 API
- `GET /api/references` - 레퍼런스 목록
- `POST /api/references` - 레퍼런스 등록
- `PUT /api/references/:id` - 레퍼런스 수정
- `DELETE /api/references/:id` - 레퍼런스 삭제
- `GET /api/references/match` - 유사 공고 매칭

### 알림 API
- `GET /api/notifications` - 알림 목록
- `PUT /api/notifications/:id` - 알림 상태 변경
- `POST /api/notifications/settings` - 알림 설정

### 관리자 API (관리자 권한 필요)
- `GET /api/admin/users` - 사용자 목록
- `POST /api/admin/users` - 사용자 등록
- `PUT /api/admin/users/:id` - 사용자 수정
- `GET /api/admin/logs` - 시스템 로그
- `GET /api/admin/statistics` - 시스템 통계

### 파일 API
- `POST /api/files/upload` - 파일 업로드
- `GET /api/files/:id/download` - 파일 다운로드

### 웹훅 API
- `POST /api/webhooks` - 웹훅 등록
- `GET /api/webhooks` - 웹훅 목록

## 🔧 환경 변수

```env
# 서버 설정
PORT=3001
NODE_ENV=development

# JWT 설정
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS 설정
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 📊 Mock 데이터

서버는 다음과 같은 Mock 데이터를 제공합니다:

- **공고**: 150개의 다양한 공고 데이터
- **레퍼런스**: 50개의 레퍼런스 데이터
- **알림**: 25개의 알림 데이터
- **시스템 로그**: 100개의 로그 데이터
- **사용자**: 3개의 테스트 사용자

## 🧪 API 테스트 예시

### 로그인
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 공고 목록 조회
```bash
curl -X GET "http://localhost:3001/api/bids?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 레퍼런스 등록
```bash
curl -X POST http://localhost:3001/api/references \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "projectName": "스마트공장 구축 사업",
    "projectType": "용역",
    "contractAmount": 500000000,
    "status": "success"
  }'
```

## 🔒 보안 기능

- **Helmet**: 보안 헤더 설정
- **CORS**: Cross-Origin 요청 제어
- **Rate Limiting**: 요청 제한 (15분당 100회)
- **JWT**: 토큰 기반 인증
- **Input Validation**: 입력값 검증

## 📝 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": {},
  "message": "성공적으로 처리되었습니다.",
  "timestamp": "2024-07-22T10:30:00Z"
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": {}
  },
  "timestamp": "2024-07-22T10:30:00Z"
}
```

## 🚨 에러 코드

- `AUTH_INVALID_CREDENTIALS`: 잘못된 로그인 정보
- `AUTH_TOKEN_EXPIRED`: 토큰 만료
- `AUTH_TOKEN_INVALID`: 유효하지 않은 토큰
- `AUTH_INSUFFICIENT_PERMISSIONS`: 권한 부족
- `VALIDATION_ERROR`: 유효성 검증 실패
- `RESOURCE_NOT_FOUND`: 리소스를 찾을 수 없음
- `RATE_LIMIT_EXCEEDED`: 요청 제한 초과
- `INTERNAL_SERVER_ERROR`: 서버 오류

## 📁 프로젝트 구조

```
src/
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수
├── middleware/      # 미들웨어
├── routes/          # API 라우터
├── data/            # Mock 데이터
└── index.ts         # 메인 서버 파일
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

개발팀에 문의사항이 있으시면 이슈를 생성해주세요.

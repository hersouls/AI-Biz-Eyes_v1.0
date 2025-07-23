# AI Biz Eyes 공모사업 자동화 관리 웹서비스

<div align="center">

![AI Biz Eyes Logo](https://img.shields.io/badge/AI%20Biz%20Eyes-v1.0.0-blue?style=for-the-badge&logo=eye)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue?style=for-the-badge&logo=postgresql)

**정부/공공기관 공모·입찰·사업 공고 자동 수집·구조화·분석·알림 시스템**

[🚀 라이브 데모](https://bizeyes.moonwave.kr) | [📚 API 문서](https://docs.ai-biz-eyes.com) | [🐛 이슈 리포트](https://github.com/ai-biz-eyes/issues)

</div>

---

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [빠른 시작](#-빠른-시작)
- [프로젝트 구조](#-프로젝트-구조)
- [API 문서](#-api-문서)
- [개발 가이드](#-개발-가이드)
- [배포 가이드](#-배포-가이드)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 개요

AI Biz Eyes는 정부/공공기관의 공모·입찰·사업 공고를 자동으로 수집하고 분석하여 조직의 사업 참여 의사결정을 지원하는 웹서비스입니다.

### 🎯 개발 목적
- **자동화된 공고 수집**: 나라장터 OpenAPI 연동으로 실시간 공고 수집
- **스마트 분석**: AI 기반 유사 공고 매칭 및 참여 가능성 분석
- **리스크 최소화**: 인적 누락/중복 방지 및 담당자 리스크 관리
- **레퍼런스 관리**: 조직의 사업 경험 체계적 관리 및 활용
- **실시간 알림**: 중요 공고 및 마감일 실시간 알림

### 👥 대상 사용자
- **사업 담당자**: 기획/실무/관리자
- **조직 규모**: 10명 이상 조직
- **접근 환경**: PC/모바일 (Responsive Web, Chrome/Edge 기준)

---

## 🚀 주요 기능

### 🔐 인증 시스템
- **JWT 기반 인증**: 안전한 토큰 기반 인증
- **역할 기반 접근 제어**: admin, user, guest 권한 관리
- **자동 토큰 갱신**: 만료된 토큰 자동 갱신
- **보안 강화**: bcrypt를 통한 비밀번호 해싱

### 📢 공고 관리
- **자동 수집**: 나라장터 OpenAPI 연동 자동 수집
- **실시간 동기화**: 정기적인 공고 데이터 업데이트
- **검색 및 필터링**: 다양한 조건으로 공고 검색
- **상세 분석**: 공고별 상세 정보 및 분석 제공
- **통계 대시보드**: 공고 현황 실시간 통계

### 📚 레퍼런스 관리
- **CRUD 기능**: 완전한 레퍼런스 관리 기능
- **파일 첨부**: 사업 관련 문서 업로드 및 관리
- **AI 기반 매칭**: 유사 공고 자동 매칭
- **성과 분석**: 레퍼런스별 성과 통계
- **검색 기능**: 다양한 조건으로 레퍼런스 검색

### 🔔 알림 시스템
- **실시간 알림**: 중요 공고 및 마감일 알림
- **알림 설정**: 사용자별 알림 설정 관리
- **알림 상태 관리**: 읽음/안읽음 상태 관리
- **알림 분류**: 긴급, 마감일, 누락, 중복 알림

### 👨‍💼 관리자 기능
- **사용자 관리**: 사용자 등록, 수정, 삭제
- **시스템 로그**: 시스템 활동 로그 관리
- **통계 대시보드**: 전체 시스템 통계
- **시스템 설정**: 시스템 설정 관리

### 📁 파일 관리
- **파일 업로드**: 다양한 형식 파일 업로드
- **파일 다운로드**: 안전한 파일 다운로드
- **파일 관리**: 파일 메타데이터 관리
- **AWS S3 연동**: 클라우드 파일 저장

## 🛠 기술 스택

### 🖥️ Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15.x
- **Cache**: Redis 7.x
- **ORM**: Prisma 5.x
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting
- **Mock Data**: faker.js

### 🎨 Frontend
- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Components**: Headless UI, Radix UI
- **Icons**: Heroicons, Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios

### ☁️ Infrastructure
- **Container**: Docker & Docker Compose
- **Cloud**: AWS (EC2, RDS, S3, CloudFront)
- **CI/CD**: GitHub Actions
- **Monitoring**: CloudWatch + Sentry
- **SSL**: Let's Encrypt

## 🚀 빠른 시작

### 📋 필수 요구사항
- Node.js 18.x 이상
- npm 9.x 이상
- PostgreSQL 15.x (선택사항)
- Redis 7.x (선택사항)
- Git

### 🔧 설치 및 실행

#### 1. 프로젝트 클론
```bash
git clone https://github.com/your-org/ai-biz-eyes.git
cd ai-biz-eyes
```

#### 2. 백엔드 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.development

# 개발 서버 실행
npm run dev
```

#### 3. 프론트엔드 설정
```bash
# 프론트엔드 디렉토리로 이동
cd react-tailwind-app

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

#### 4. Docker로 전체 환경 실행 (권장)
```bash
# Docker Compose로 전체 환경 실행
docker-compose -f docker-compose.dev.yml up -d
```

### 🌐 접속 정보
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3001
- **API 문서**: http://localhost:3001/api-docs

## 🔑 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin@example.com | password123 |
| 일반 사용자 | user@example.com | password123 |
| 매니저 | manager@example.com | password123 |

## 📁 프로젝트 구조

```
ai-biz-eyes/
├── src/                          # 백엔드 소스코드
│   ├── controllers/              # 컨트롤러
│   ├── routes/                   # 라우터
│   ├── middleware/               # 미들웨어
│   ├── database/                 # 데이터베이스 관련
│   ├── types/                    # TypeScript 타입
│   ├── utils/                    # 유틸리티 함수
│   └── index.ts                  # 메인 서버 파일
├── react-tailwind-app/           # 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── components/           # React 컴포넌트
│   │   ├── services/             # API 서비스
│   │   ├── types/                # TypeScript 타입
│   │   └── utils/                # 유틸리티 함수
│   ├── public/                   # 정적 파일
│   └── package.json
├── public/docs/                  # 프로젝트 문서
├── tests/                        # 테스트 파일
├── docker-compose.yml            # Docker 설정
├── package.json                  # 백엔드 패키지 설정
└── README.md                     # 프로젝트 README
```

## 📚 API 문서

### 🔗 API 엔드포인트

#### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /api/auth/me` - 내 정보 조회

#### 공고 API
- `GET /api/bids` - 공고 목록 조회
- `GET /api/bids/:id` - 공고 상세 조회
- `POST /api/bids/sync` - 공고 동기화
- `GET /api/bids/statistics` - 공고 통계

#### 레퍼런스 API
- `GET /api/references` - 레퍼런스 목록
- `POST /api/references` - 레퍼런스 등록
- `PUT /api/references/:id` - 레퍼런스 수정
- `DELETE /api/references/:id` - 레퍼런스 삭제
- `GET /api/references/match` - 유사 공고 매칭

#### 알림 API
- `GET /api/notifications` - 알림 목록
- `PUT /api/notifications/:id` - 알림 상태 변경
- `POST /api/notifications/settings` - 알림 설정

#### 관리자 API (관리자 권한 필요)
- `GET /api/admin/users` - 사용자 목록
- `POST /api/admin/users` - 사용자 등록
- `PUT /api/admin/users/:id` - 사용자 수정
- `GET /api/admin/logs` - 시스템 로그
- `GET /api/admin/statistics` - 시스템 통계

#### 파일 API
- `POST /api/files/upload` - 파일 업로드
- `GET /api/files/:id/download` - 파일 다운로드

#### 웹훅 API
- `POST /api/webhooks` - 웹훅 등록
- `GET /api/webhooks` - 웹훅 목록

### 📖 상세 API 문서
- [API 상세 문서](public/docs/API_문서_상세.md)
- [개발 기술명세서](public/docs/개발기술명세서.md)
- [데이터베이스 설계서](public/docs/데이터베이스설계서.md)

## 🔧 환경 변수

### 개발 환경 (.env.development)
```env
# 서버 설정
NODE_ENV=development
PORT=3001
HOST=localhost

# 데이터베이스
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_biz_eyes_dev
REDIS_URL=redis://localhost:6379

# JWT 설정
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS 설정
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# 외부 API
NARA_API_KEY=your-nara-api-key
SENDGRID_API_KEY=your-sendgrid-key

# AWS 설정 (개발용)
AWS_ACCESS_KEY_ID=your-dev-access-key
AWS_SECRET_ACCESS_KEY=your-dev-secret-key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=ai-biz-eyes-dev-files
```

### 프로덕션 환경 (.env.production)
```env
# 서버 설정
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# 데이터베이스
DATABASE_URL=postgresql://username:password@prod-db.region.rds.amazonaws.com:5432/ai_biz_eyes_prod
REDIS_URL=redis://prod-redis.region.cache.amazonaws.com:6379

# JWT 설정
JWT_SECRET=production-secret-key-very-long-and-secure-random-string
JWT_EXPIRES_IN=7d

# CORS 설정
ALLOWED_ORIGINS=https://bizeyes.moonwave.kr,https://www.bizeyes.moonwave.kr

# 외부 API
NARA_API_KEY=your-nara-api-key
SENDGRID_API_KEY=your-sendgrid-key

# AWS 설정
AWS_ACCESS_KEY_ID=your-prod-access-key
AWS_SECRET_ACCESS_KEY=your-prod-secret-key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=ai-biz-eyes-prod-files
```

## 📊 Mock 데이터

서버는 다음과 같은 Mock 데이터를 제공합니다:

- **공고**: 150개의 다양한 공고 데이터
- **레퍼런스**: 50개의 레퍼런스 데이터
- **알림**: 25개의 알림 데이터
- **시스템 로그**: 100개의 로그 데이터
- **사용자**: 3개의 테스트 사용자

## 🧪 테스트

### 테스트 실행
```bash
# 단위 테스트
npm test

# API 테스트
npm run test:api

# 통합 테스트
npm run test:integration

# 전체 테스트
npm run test:complete

# 브라우저 테스트
npm run test:browser
```

### 테스트 커버리지
```bash
# 백엔드 테스트 커버리지
npm run test:coverage

# 프론트엔드 테스트 커버리지
cd react-tailwind-app
npm run test:coverage
```

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
- **bcrypt**: 비밀번호 해싱
- **SQL Injection 방지**: 파라미터화된 쿼리
- **XSS 방지**: 입력값 검증 및 이스케이핑
- **CSRF 보호**: 토큰 기반 CSRF 방지

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

## 📚 개발 가이드

### 📖 문서
- [통합 개발문서](public/docs/개발문서_통합.md)
- [API 상세 문서](public/docs/API_문서_상세.md)
- [배포 가이드](public/docs/배포_가이드.md)
- [개발 기술명세서](public/docs/개발기술명세서.md)
- [데이터베이스 설계서](public/docs/데이터베이스설계서.md)
- [나라장터 API 가이드](react-tailwind-app/README_NARA_API.md)

### 🔧 개발 환경 설정
```bash
# 개발 환경 설정
npm run setup:dev

# 데이터베이스 마이그레이션
npm run migrate

# 시드 데이터 생성
npm run seed

# 린팅 및 포맷팅
npm run lint
npm run format
```

### 🐳 Docker 개발 환경
```bash
# 개발 환경 실행
docker-compose -f docker-compose.dev.yml up -d

# 로그 확인
docker-compose -f docker-compose.dev.yml logs -f

# 컨테이너 중지
docker-compose -f docker-compose.dev.yml down
```

## 🚀 배포 가이드

### 📦 배포 방법
- **로컬 배포**: Docker Compose 사용
- **스테이징 배포**: AWS EC2 + RDS
- **프로덕션 배포**: AWS ECS + RDS + CloudFront

### 🔧 배포 스크립트
```bash
# 로컬 배포
./scripts/deploy-local.sh

# 스테이징 배포
./scripts/deploy-staging.sh

# 프로덕션 배포
./scripts/deploy-production.sh
```

### 📖 상세 배포 문서
- [배포 가이드](public/docs/배포_가이드.md)
- [Docker 설정](docker-compose.yml)
- [AWS 인프라 설정](terraform/)

## 🤝 기여하기

### 📋 기여 가이드라인
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 🏷️ 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

### 🐛 이슈 리포트
- [GitHub Issues](https://github.com/ai-biz-eyes/issues)
- [기술 지원](mailto:dev@ai-biz-eyes.com)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의 및 지원

### 👥 개발팀 연락처
- **프로젝트 매니저**: pm@ai-biz-eyes.com
- **프론트엔드 개발자**: frontend@ai-biz-eyes.com
- **백엔드 개발자**: backend@ai-biz-eyes.com
- **DevOps 엔지니어**: devops@ai-biz-eyes.com
- **기술 지원**: dev@ai-biz-eyes.com

### 📚 유용한 링크
- [라이브 데모](https://bizeyes.moonwave.kr)
- [API 문서](https://docs.ai-biz-eyes.com)
- [개발 문서](public/docs/)
- [GitHub Issues](https://github.com/ai-biz-eyes/issues)
- [상태 페이지](https://status.ai-biz-eyes.com)

### 📊 프로젝트 정보
- **버전**: v1.0.0
- **최종 업데이트**: 2024년 12월
- **다음 릴리스**: 2025년 1월
- **지원 브라우저**: Chrome, Edge, Firefox, Safari (최신 버전)

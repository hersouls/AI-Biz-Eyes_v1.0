# B2G 공모사업 자동화 관리 웹서비스

## 📋 프로젝트 개요

B2G 공모사업 자동화 관리 웹서비스는 정부/공공기관의 공모·입찰·사업 공고를 자동 수집·구조화·분석·알림까지 한 번에 처리하는 올인원 자동화 웹서비스입니다.

### 🎯 주요 목적
- 정부/공공기관 공모·입찰·사업 공고 자동 수집·구조화·분석·알림
- 인적 누락/중복·담당자 리스크 최소화
- 조직 내 사업 경험 레퍼런스 자동 매칭
- 실시간 전략적 의사결정 지원

### 👥 대상 사용자
- B2G 사업 담당자(기획/실무/관리자)
- 10명 이상 조직
- PC/모바일(Responsive Web, Chrome/Edge 기준)

## 🚀 주요 기능

### 📊 대시보드
- 전체 공고 현황 및 KPI 실시간 모니터링
- 그래프/차트를 통한 데이터 시각화
- 공고 타임라인/캘린더 기반 일정 관리
- AI 기반 추천 공고 및 알림 센터

### 📋 공고 관리
- 나라장터 OpenAPI 연동을 통한 실시간 공고 수집
- 고급 검색 및 필터링 기능
- 공고 상세 정보 및 원문 링크 제공
- Excel/CSV 내보내기 기능

### 📚 레퍼런스 관리
- 내부 참여 이력/사업성과 관리
- 유사 공고 자동 매칭 및 추천
- 레퍼런스 등록·수정·성과 분석
- 첨부파일 관리 및 검색

### 🔔 알림 시스템
- 실시간 알림 (신규/긴급/마감임박/누락/중복)
- 이메일, 웹, 푸시 알림 지원
- 개인화된 알림 설정
- 일간/주간/월간 리포트 자동 생성

### ⚙️ 관리자 기능
- 사용자/권한 관리
- 시스템 모니터링 및 로그 관리
- 데이터 백업/복구
- API 연동 상태 관리

## 🛠 기술 스택

### Frontend
- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Components**: Headless UI, Radix UI
- **Icons**: Heroicons, Lucide React, Radix Icons
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15.x
- **Cache**: Redis 7.x
- **ORM**: Prisma 5.x
- **Authentication**: JWT + bcrypt
- **API Documentation**: Swagger/OpenAPI 3.0

### DevOps & Infrastructure
- **Container**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (EC2, RDS, S3, CloudFront)
- **Monitoring**: Winston + Sentry, CloudWatch
- **SSL**: Let's Encrypt

### External APIs & Services
- **나라장터 OpenAPI**: 공고 데이터 수집
- **Google Sheets API**: 데이터 연동
- **Email Service**: SendGrid
- **Push Notification**: Web Push API
- **File Storage**: AWS S3

## 📁 프로젝트 구조

```
B2G_v1.0/
├── Docs/                          # 프로젝트 문서
│   ├── 화면정의서                 # 상세 화면 기능 정의
│   ├── PRD                        # 제품 요구사항 문서
│   ├── 디자인가이드               # UI/UX 디자인 가이드
│   ├── 개발기술명세서.md          # 기술 스택 및 아키텍처
│   ├── 데이터베이스설계서.md      # DB 스키마 및 설계
│   ├── API명세서.md               # REST API 명세
│   └── 개발일정표.md              # 개발 일정 및 마일스톤
├── frontend/                      # React 프론트엔드
├── backend/                       # Node.js 백엔드
├── docker/                        # Docker 설정
├── docs/                          # API 문서
└── README.md                      # 프로젝트 README
```

## 📚 개발 문서

### 📋 요구사항 및 설계 문서
- **[화면정의서](Docs/화면정의서)**: 상세한 화면별 기능 정의
- **[PRD](Docs/PRD)**: 제품 요구사항 및 기능 명세
- **[디자인가이드](Docs/디자인가이드)**: UI/UX 디자인 시스템

### 🔧 기술 문서
- **[개발기술명세서](Docs/개발기술명세서.md)**: 기술 스택, 아키텍처, 개발 환경
- **[데이터베이스설계서](Docs/데이터베이스설계서.md)**: DB 스키마, ERD, 최적화 전략
- **[API명세서](Docs/API명세서.md)**: REST API 엔드포인트 및 응답 형식

### 📅 프로젝트 관리 문서
- **[개발일정표](Docs/개발일정표.md)**: 16주 개발 일정 및 마일스톤

## 🚀 개발 단계

### 1단계: 프로토타입 (4주)
- Mock 데이터 기반 UI/UX 완성
- 주요 기능/데이터 구조 시뮬레이션
- 전체 플로우 설계 및 피드백 반영

### 2단계: 정식 버전 (8주)
- Open API(나라장터 등) 연동
- 실데이터 자동수집/분석/알림
- Google 스프레드시트 자동 저장/관리
- 완전 자동화 시스템 구축

### 3단계: 고도화 (4주)
- 성능 최적화 및 보안 강화
- 모니터링 시스템 구축
- 배포 자동화 및 문서화 완료

## 🛠 개발 환경 설정

### 필수 소프트웨어
- Node.js 18.x 이상
- PostgreSQL 15.x
- Redis 7.x
- Docker & Docker Compose
- Git

### 개발 환경 구성
```bash
# 프로젝트 클론
git clone [repository-url]
cd b2g-automation

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

### 환경변수 설정
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/b2g_db"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# External APIs
G2B_API_KEY="your-g2b-api-key"
GOOGLE_SHEETS_CREDENTIALS="path/to/credentials.json"

# Email
SENDGRID_API_KEY="your-sendgrid-api-key"

# AWS
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-northeast-2"
AWS_S3_BUCKET="your-s3-bucket"
```

## 📊 주요 마일스톤

### 1단계 마일스톤
- **7월 26일**: 프로젝트 초기 설정 완료
- **8월 9일**: 기본 페이지 구현 완료
- **8월 16일**: 프로토타입 완성 및 피드백 수집

### 2단계 마일스톤
- **8월 30일**: 나라장터 API 연동 완료
- **9월 13일**: 레퍼런스 관리 시스템 완료
- **9월 27일**: 알림 시스템 완료
- **10월 11일**: 관리자 기능 완료

### 3단계 마일스톤
- **10월 18일**: 성능 최적화 완료
- **10월 25일**: 보안 및 모니터링 완료
- **11월 1일**: 배포 자동화 완료
- **11월 8일**: 프로젝트 완료

## 👥 개발팀

### 팀 구성
- **프로젝트 매니저**: 1명 (전체 관리)
- **프론트엔드 개발자**: 2명 (React, TypeScript)
- **백엔드 개발자**: 2명 (Node.js, PostgreSQL)
- **DevOps 엔지니어**: 1명 (AWS, Docker)

### 역할 분담
- **프론트엔드**: UI/UX 구현, 컴포넌트 개발
- **백엔드**: API 개발, 데이터베이스 설계
- **DevOps**: 인프라 구축, 배포 자동화

## 🔒 보안 고려사항

### 인증/인가
- JWT 토큰 기반 인증
- Role-based Access Control (RBAC)
- API 요청 제한 (Rate Limiting)

### 데이터 보안
- HTTPS 강제 적용
- 민감 정보 암호화 저장
- SQL Injection 방지 (Prisma ORM 사용)
- XSS 방지 (React 기본 방어)

### 외부 API 보안
- API 키 환경변수 관리
- 요청/응답 로깅
- 에러 처리 및 재시도 로직

## 📈 모니터링 및 로깅

### 로깅 전략
- **Application Logs**: Winston
- **Error Tracking**: Sentry
- **Performance Monitoring**: AWS CloudWatch
- **User Analytics**: Google Analytics

### 알림 설정
- **Critical Errors**: 즉시 알림
- **Performance Issues**: 임계값 초과 시 알림
- **System Status**: 정기 상태 리포트

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**프로젝트 버전**: v1.0  
**최종 업데이트**: 2024년 7월 22일  
**개발팀**: B2G Automation Team

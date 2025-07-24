# AI Biz Eyes - B2G 공모사업 자동화 관리 시스템

## 📋 프로젝트 개요

AI Biz Eyes는 Business to Government(B2G) 공모사업을 위한 종합적인 자동화 관리 시스템입니다. 나라장터 OpenAPI 연동, AI 기반 분석, 자동 알림 시스템을 통해 공모사업 참여 효율성을 극대화합니다.

## 🚀 주요 기능

### 📊 데이터 관리
- **자동화된 공고 수집**: 나라장터 입찰공고정보서비스 API 연동으로 실시간 공고 수집
- **AI 기반 분석**: 머신러닝을 통한 참여 가능성 분석 및 추천
- **레퍼런스 관리**: 과거 사업 이력 및 성과 데이터 체계적 관리

### 🔔 알림 시스템
- **실시간 알림**: 새로운 공고 등록 시 즉시 알림
- **맞춤형 필터링**: 키워드, 예산, 기관별 맞춤 알림 설정
- **다중 채널**: 이메일, SMS, Slack 등 다양한 알림 채널 지원

### 📈 분석 및 리포트
- **대시보드**: 실시간 현황 및 통계 시각화
- **성과 분석**: 참여 이력 및 수주율 분석
- **예측 모델**: AI 기반 수주 가능성 예측

## 🛠 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** - 모던 UI/UX
- **React Router** - SPA 라우팅
- **React Query** - 서버 상태 관리

### Backend
- **Node.js** + **Express**
- **TypeScript** - 타입 안정성
- **PostgreSQL** - 관계형 데이터베이스
- **Redis** - 캐싱 및 세션 관리

### AI/ML
- **Python** + **TensorFlow/PyTorch**
- **Scikit-learn** - 머신러닝
- **NLP** - 텍스트 분석

### DevOps
- **Docker** - 컨테이너화
- **GitHub Actions** - CI/CD
- **AWS/Azure** - 클라우드 배포

## 🔌 외부 시스템 연동

### 나라장터 입찰공고정보서비스 API
- **엔드포인트**: `https://apis.data.go.kr/1230000/ad/BidPublicInfoService`
- **데이터 형식**: JSON+XML
- **인증키**: 조달청 제공 인증키 사용
- **참고문서**: 조달청 OpenAPI참고자료 나라장터 입찰 공고정보서비스 1.0.docx

### 기타 연동 시스템
- **ERP 시스템**: 사내 ERP와 데이터 연동
- **그룹웨어**: 알림 및 승인 프로세스 연동
- **Google Sheets**: 데이터 내보내기/가져오기
- **Slack/Discord**: 실시간 알림 연동

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/ai-biz-eyes.git
cd ai-biz-eyes
```

### 2. 의존성 설치
```bash
# Backend 의존성 설치
npm install

# Frontend 의존성 설치
cd react-tailwind-app
npm install
```

### 3. 환경 변수 설정
```bash
# Backend .env 파일 생성
cp .env.example .env

# Frontend .env 파일 생성
cd react-tailwind-app
cp .env.example .env
```

### 4. 데이터베이스 설정
```bash
# PostgreSQL 데이터베이스 생성
createdb ai_biz_eyes

# 마이그레이션 실행
npm run migrate
```

### 5. 애플리케이션 실행
```bash
# Backend 서버 실행 (개발 모드)
npm run dev

# Frontend 개발 서버 실행
cd react-tailwind-app
npm start
```

## 🔧 환경 변수 설정

### Backend (.env)
```bash
# 데이터베이스 설정
DATABASE_URL=postgresql://username:password@localhost:5432/ai_biz_eyes
REDIS_URL=redis://localhost:6379

# 나라장터 API 설정
BID_API_URL=https://apis.data.go.kr/1230000/ad/BidPublicInfoService
BID_SERVICE_KEY=your_service_key_here

# JWT 설정
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# 이메일 설정
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# 기타 설정
NODE_ENV=development
PORT=3001
```

### Frontend (.env)
```bash
# API 설정
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_BID_API_URL=https://apis.data.go.kr/1230000/ad/BidPublicInfoService
REACT_APP_BID_SERVICE_KEY=your_service_key_here

# 기타 설정
REACT_APP_DEBUG_MODE=true
REACT_APP_MOCK_API=true
```

## 📚 API 문서

### 나라장터 입찰공고정보서비스 API

#### 공고 목록 조회
```http
GET https://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoServc
```

**파라미터:**
- `serviceKey`: 인증키 (필수)
- `pageNo`: 페이지 번호 (기본값: 1)
- `numOfRows`: 페이지당 행 수 (기본값: 20)
- `bidNtceNo`: 입찰공고번호 (선택)
- `bidNtceNm`: 입찰공고명 (선택)
- `ntceInsttNm`: 공고기관명 (선택)

**응답 예시:**
```json
{
  "response": {
    "header": {
      "resultCode": "00",
      "resultMsg": "NORMAL SERVICE"
    },
    "body": {
      "items": {
        "item": [
          {
            "bidNtceNo": "2024000001",
            "bidNtceNm": "○○공사 입찰",
            "ntceInsttNm": "조달청",
            "bidNtceDate": "2024-01-15",
            "presmptPrce": "1000000000",
            "dminsttNm": "○○기관",
            "opengPlce": "조달청 본관",
            "presnatnOprtnPlce": "조달청 세미나실",
            "presnatnOprtnDt": "2024-01-30 14:00",
            "bidMethd": "일반입찰",
            "bidPblancNm": "○○공사 입찰공고",
            "bidNtceUrl": "https://www.g2b.go.kr/..."
          }
        ]
      },
      "numOfRows": 20,
      "pageNo": 1,
      "totalCount": 150
    }
  }
}
```

## 🧪 테스트

### 단위 테스트
```bash
# Backend 테스트
npm test

# Frontend 테스트
cd react-tailwind-app
npm test
```

### 통합 테스트
```bash
# 전체 통합 테스트
npm run test:integration

# API 연동 테스트
npm run test:api
```

### E2E 테스트
```bash
# 브라우저 테스트
npm run test:e2e
```

## 📊 모니터링 및 로깅

### 로그 레벨
- **ERROR**: 시스템 오류 및 예외 상황
- **WARN**: 경고 상황 및 성능 이슈
- **INFO**: 일반적인 시스템 동작 정보
- **DEBUG**: 개발 및 디버깅 정보

### 모니터링 지표
- API 응답 시간
- 데이터베이스 쿼리 성능
- 메모리 및 CPU 사용률
- 사용자 활동 통계

## 🔒 보안

### 인증 및 권한
- **JWT 토큰**: 사용자 인증
- **RBAC**: 역할 기반 접근 제어
- **API 키 관리**: 외부 API 키 암호화 저장

### 데이터 보안
- **HTTPS**: 모든 통신 암호화
- **SQL Injection 방지**: 파라미터화된 쿼리 사용
- **XSS 방지**: 입력 데이터 검증 및 이스케이프

## 🚀 배포

### Docker 배포
```bash
# 이미지 빌드
docker build -t ai-biz-eyes .

# 컨테이너 실행
docker run -p 3001:3001 ai-biz-eyes
```

### 클라우드 배포
```bash
# AWS 배포
npm run deploy:aws

# Azure 배포
npm run deploy:azure
```

## 📈 성능 최적화

### 프론트엔드
- **코드 스플리팅**: React.lazy() 사용
- **이미지 최적화**: WebP 포맷 및 lazy loading
- **캐싱**: React Query 캐싱 전략

### 백엔드
- **데이터베이스 인덱싱**: 쿼리 성능 최적화
- **Redis 캐싱**: 자주 조회되는 데이터 캐싱
- **API 응답 압축**: gzip 압축 적용

## 🤝 기여하기

### 개발 환경 설정
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 코딩 스타일
- **TypeScript**: 엄격한 타입 체크 사용
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Conventional Commits**: 커밋 메시지 규칙

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

### 문서
- [API 문서](./docs/api.md)
- [데이터베이스 설계서](./docs/database.md)
- [개발 가이드](./docs/development.md)

### 연락처
- **이메일**: support@ai-biz-eyes.com
- **GitHub Issues**: [이슈 등록](https://github.com/your-username/ai-biz-eyes/issues)
- **Discord**: [커뮤니티 참여](https://discord.gg/ai-biz-eyes)

## 🔄 업데이트 로그

### v1.2.0 (2024-01-15)
- ✅ 나라장터 입찰공고정보서비스 API 업데이트
- ✅ 새로운 엔드포인트 적용: `https://apis.data.go.kr/1230000/ad/BidPublicInfoService`
- ✅ JSON+XML 데이터 형식 지원
- ✅ 조달청 제공 인증키 적용
- ✅ API 설정 파일 구조화

### v1.1.0 (2024-01-10)
- ✅ AI 기반 분석 기능 추가
- ✅ 실시간 알림 시스템 구현
- ✅ 대시보드 성능 최적화

### v1.0.0 (2024-01-01)
- ✅ 초기 버전 릴리즈
- ✅ 기본 CRUD 기능 구현
- ✅ 나라장터 API 연동

---

**AI Biz Eyes** - B2G 공모사업의 미래를 여는 AI 기반 자동화 시스템 🚀

# API 엔드포인트와 프론트엔드 통합 테스트 가이드

## 📋 개요
이 가이드는 AI Biz Eyes 프로젝트의 API 서버와 React 프론트엔드 간의 통합 테스트를 단계별로 진행하는 방법을 설명합니다.

## 🏗️ 프로젝트 구조
```
/
├── src/                    # API 서버 (Node.js/Express)
│   ├── controllers/        # API 컨트롤러
│   ├── routes/            # API 라우트
│   ├── middleware/        # 미들웨어
│   └── index.ts           # 서버 진입점
├── react-tailwind-app/    # React 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── services/      # API 호출 서비스
│   │   └── App.tsx        # 메인 앱 컴포넌트
│   └── package.json
└── test-api.js            # API 테스트 스크립트
```

## 🚀 Step 1: 환경 설정 및 의존성 설치

### 1.1 API 서버 설정
```bash
# 루트 디렉토리에서
npm install
npm run build
```

### 1.2 React 프론트엔드 설정
```bash
cd react-tailwind-app
npm install
```

## 🚀 Step 2: 서버 시작

### 2.1 API 서버 시작
```bash
# 루트 디렉토리에서
npm run dev
# 또는
npm start
```
- 서버는 https://bizeyes.moonwave.kr/api 에서 실행됩니다
- API 엔드포인트: https://bizeyes.moonwave.kr/api

### 2.2 React 앱 시작
```bash
# 새 터미널에서
cd react-tailwind-app
npm start
```
- 프론트엔드는 https://bizeyes.moonwave.kr 에서 실행됩니다

## 🚀 Step 3: API 서버 테스트

### 3.1 기본 API 테스트 실행
```bash
# 루트 디렉토리에서
node test-api.js
```

### 3.2 개별 API 엔드포인트 테스트
```bash
# 헬스 체크
curl https://bizeyes.moonwave.kr/api/health

# 로그인 테스트
curl -X POST https://bizeyes.moonwave.kr/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 🚀 Step 4: 프론트엔드 통합 테스트

### 4.1 브라우저에서 수동 테스트
1. https://bizeyes.moonwave.kr 접속
2. 로그인 기능 테스트
3. 각 페이지별 기능 테스트:
   - 대시보드
   - 입찰 목록
   - 입찰 상세
   - 참고자료
   - 알림
   - 통계

### 4.2 브라우저 개발자 도구 활용
- Network 탭에서 API 호출 확인
- Console 탭에서 에러 로그 확인
- Application 탭에서 토큰 저장 확인

## 🚀 Step 5: 자동화된 통합 테스트

### 5.1 통합 테스트 스크립트 실행
```bash
node test_integration_feature.js
```

### 5.2 E2E 테스트 시나리오
1. 사용자 로그인
2. 입찰 목록 조회
3. 입찰 상세 정보 조회
4. 참고자료 생성/수정
5. 알림 확인
6. 통계 데이터 조회

## 🚀 Step 6: 에러 처리 및 디버깅

### 6.1 일반적인 문제 해결
- CORS 에러: API 서버의 CORS 설정 확인
- 인증 에러: JWT 토큰 유효성 확인
- 네트워크 에러: 포트 충돌 확인

### 6.2 로그 확인
```bash
# API 서버 로그
npm run dev

# React 앱 로그
cd react-tailwind-app
npm start
```

## 🚀 Step 7: 성능 테스트

### 7.1 API 응답 시간 테스트
```bash
# Apache Bench 사용
ab -n 100 -c 10 https://bizeyes.moonwave.kr/api/health
```

### 7.2 프론트엔드 성능 테스트
- Chrome DevTools의 Performance 탭 활용
- Lighthouse 성능 점수 확인

## 📊 테스트 체크리스트

### API 서버 테스트
- [ ] 서버 시작 확인
- [ ] 헬스 체크 엔드포인트
- [ ] 인증 API (로그인/로그아웃)
- [ ] 입찰 관련 API
- [ ] 참고자료 API
- [ ] 알림 API
- [ ] 통계 API
- [ ] 에러 핸들링

### 프론트엔드 테스트
- [ ] 페이지 로딩
- [ ] 로그인/로그아웃
- [ ] 네비게이션
- [ ] 데이터 표시
- [ ] 폼 제출
- [ ] 에러 메시지
- [ ] 로딩 상태

### 통합 테스트
- [ ] API 호출 성공
- [ ] 데이터 동기화
- [ ] 토큰 관리
- [ ] 에러 처리
- [ ] 사용자 경험

## 🔧 추가 도구

### API 테스트 도구
- Postman
- Insomnia
- curl

### 프론트엔드 테스트 도구
- React Testing Library
- Jest
- Cypress (E2E)

## 📝 테스트 결과 기록

테스트를 완료한 후 다음 정보를 기록하세요:
- 테스트 날짜
- 테스트 환경 (브라우저, OS)
- 발견된 문제점
- 해결된 이슈
- 성능 지표
- 개선 사항
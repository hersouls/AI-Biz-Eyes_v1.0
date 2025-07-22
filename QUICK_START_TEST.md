# 🚀 빠른 테스트 시작 가이드

## 📋 사전 준비

### 1. 의존성 설치
```bash
# 루트 디렉토리에서
npm install

# React 앱 디렉토리에서
cd react-tailwind-app
npm install
cd ..
```

### 2. 서버 시작
```bash
# 터미널 1: API 서버 시작
npm run dev

# 터미널 2: React 앱 시작
cd react-tailwind-app
npm start
```

## 🧪 테스트 실행

### 옵션 1: 모든 테스트 실행 (권장)
```bash
npm run test:all
```

### 옵션 2: 개별 테스트 실행
```bash
# API 테스트만
npm run test:api

# 브라우저 테스트만
npm run test:browser

# 통합 기능 테스트만
npm run test:integration

# 수동 테스트 가이드
npm run test:manual
```

### 옵션 3: 직접 스크립트 실행
```bash
# 모든 테스트
node run-integration-tests.js

# API 테스트만
node run-integration-tests.js api

# 브라우저 테스트만
node run-integration-tests.js browser

# 서버 상태 확인
node run-integration-tests.js check
```

## 📊 테스트 결과 확인

테스트 실행 후 다음 정보를 확인하세요:

1. **성공률**: 90% 이상을 목표로 하세요
2. **실패한 테스트**: 에러 메시지를 확인하고 수정하세요
3. **성능 지표**: 
   - API 응답 시간 < 1초
   - 페이지 로드 시간 < 3초
   - 메모리 사용량 < 100MB

## 🔧 문제 해결

### 서버가 시작되지 않는 경우
```bash
# 포트 확인
lsof -i :3002  # API 서버
lsof -i :3000  # React 앱

# 프로세스 종료
kill -9 <PID>
```

### 테스트가 실패하는 경우
1. 서버가 실행 중인지 확인
2. 네트워크 연결 확인
3. 브라우저 콘솔 에러 확인
4. API 응답 확인

### Puppeteer 오류
```bash
# Puppeteer 재설치
npm uninstall puppeteer
npm install puppeteer
```

## 📝 테스트 체크리스트

### 자동 테스트
- [ ] API 서버 헬스 체크
- [ ] 사용자 로그인
- [ ] 입찰 목록 조회
- [ ] 입찰 상세 조회
- [ ] 참고자료 CRUD
- [ ] 알림 시스템
- [ ] 통계 데이터
- [ ] CORS 설정
- [ ] 에러 핸들링
- [ ] 성능 테스트

### 수동 테스트
- [ ] 브라우저에서 페이지 로딩
- [ ] 로그인/로그아웃
- [ ] 네비게이션
- [ ] 데이터 표시
- [ ] 폼 제출
- [ ] 반응형 디자인
- [ ] 개발자 도구 확인

## 🎯 다음 단계

1. **실패한 테스트 수정**: 에러 메시지를 확인하고 코드 수정
2. **성능 최적화**: 느린 응답 시간 개선
3. **사용자 테스트**: 실제 사용자에게 테스트 요청
4. **지속적 통합**: CI/CD 파이프라인에 테스트 추가

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- `integration-test-guide.md`: 상세한 테스트 가이드
- `README.md`: 프로젝트 개요
- 브라우저 개발자 도구: 실시간 디버깅
- 서버 로그: API 서버 상태 확인
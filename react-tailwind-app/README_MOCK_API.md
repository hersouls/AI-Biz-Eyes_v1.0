# Mock 서버 API 적용 가이드

## 개요

이 프로젝트는 실제 Open API 연동 없이도 프론트엔드가 완전히 동작할 수 있도록 Mock 서버 API를 적용했습니다. 모든 서비스는 실제 API를 먼저 시도하고, 실패할 경우 Mock 데이터를 사용하는 fallback 구조로 구현되어 있습니다.

## 구조

### 서비스 파일들

- `src/services/adminService.ts` - 관리자 기능 Mock 데이터
- `src/services/notificationService.ts` - 알림 기능 Mock 데이터
- `src/services/integrationService.ts` - 연동 기능 Mock 데이터
- `src/services/personalService.ts` - 개인 설정 Mock 데이터
- `src/services/referenceService.ts` - 레퍼런스 기능 Mock 데이터
- `src/services/dashboardService.ts` - 대시보드 Mock 데이터
- `src/services/bidService.ts` - 입찰 기능 Mock 데이터
- `src/services/statisticsService.ts` - 통계 기능 Mock 데이터
- `src/services/publicDataService.ts` - 공공데이터포털 Mock 데이터
- `src/services/mockApiServer.ts` - Mock API 서버 (새로 추가)

### 타입 정의 파일들

- `src/types/dashboard.ts` - 대시보드 관련 타입
- `src/types/bid.ts` - 입찰 관련 타입
- `src/types/statistics.ts` - 통계 관련 타입
- `src/types/publicData.ts` - 공공데이터포털 관련 타입 (새로 추가)

### 컴포넌트 파일들

- `src/components/PublicDataList.tsx` - 공공데이터 목록 컴포넌트
- `src/components/PublicDataStats.tsx` - 공공데이터 통계 컴포넌트
- `src/components/PublicData/PublicDataPage.tsx` - 공공데이터 페이지

## Mock 데이터 특징

### 1. 실제 API와 동일한 구조
모든 Mock 데이터는 실제 API 응답과 동일한 구조로 설계되어 있어, 실제 API로 전환할 때 코드 변경이 최소화됩니다.

### 2. 지연 시간 시뮬레이션
실제 API 호출과 유사한 경험을 위해 `delay()` 함수를 사용하여 적절한 지연 시간을 추가했습니다.

### 3. 동적 데이터 처리
필터링, 페이징, 검색 등의 기능이 Mock 데이터에서도 정상적으로 동작합니다.

### 4. 에러 처리
API 호출 실패 시 자동으로 Mock 데이터로 fallback되며, 콘솔에 로그가 출력됩니다.

### 5. Mock API 서버 (새로 추가)
- 실제 API 서버와 유사한 응답 구조
- 에러 시뮬레이션 기능
- Health check 엔드포인트
- API 통계 엔드포인트

## 환경 설정

### .env 파일 설정

```env
# API Configuration
REACT_APP_API_URL=https://bizeyes.moonwave.kr/api
REACT_APP_API_BASE_URL=https://bizeyes.moonwave.kr/api

# Environment
REACT_APP_ENV=development

# Mock Data Mode (set to true to force mock data usage)
REACT_APP_USE_MOCK_DATA=true

# Feature Flags
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_INTEGRATION=true
REACT_APP_ENABLE_STATISTICS=true

# Debug Mode
REACT_APP_DEBUG=true

# G2B API Configuration (Mock mode)
REACT_APP_G2B_API_ENABLED=false
REACT_APP_G2B_API_URL=https://openapi.g2b.go.kr/openapi/service/rest/CmmnCdService
REACT_APP_G2B_API_KEY=your_api_key_here

# Public Data Portal Configuration (Mock mode)
REACT_APP_PUBLIC_DATA_ENABLED=false
REACT_APP_PUBLIC_DATA_URL=https://api.odcloud.kr/api
REACT_APP_PUBLIC_DATA_KEY=your_api_key_here
```

## 사용 방법

### 1. Mock 데이터 강제 사용
환경 변수 `REACT_APP_USE_MOCK_DATA=true`로 설정하면 모든 API 호출이 Mock 데이터를 사용합니다.

### 2. 실제 API와 Mock 데이터 혼용
기본적으로 실제 API를 먼저 시도하고, 실패할 경우 Mock 데이터를 사용합니다.

### 3. 개발 모드에서 Mock 데이터 사용
개발 환경에서는 자동으로 Mock 데이터가 활성화됩니다.

## Mock 데이터 내용

### 대시보드 데이터
- 전체 입찰 건수: 1,234건
- 진행중인 입찰: 89건
- 완료된 입찰: 1,145건
- 긴급 입찰: 12건
- 월간 성장률: 12.3%

### 입찰 데이터
- AI 기반 품질관리 시스템 구축 사업
- 스마트팩토리 구축 사업
- 웹사이트 구축 프로젝트
- IoT 센서 네트워크 구축
- 클라우드 인프라 구축

### 알림 데이터
- 새로운 입찰 공고 알림
- 마감 임박 알림
- 입찰 성과 달성 알림

### 연동 시스템 데이터
- 공공데이터포털 API 연동
- 나라장터 웹 스크래핑
- 기업정보 API

### 레퍼런스 데이터
- IT 시스템 구축 사업 레퍼런스
- 웹사이트 구축 프로젝트
- 모바일 앱 개발

### 공공데이터포털 데이터 (새로 추가)
- 2024년 IT 시스템 구축 사업 현황
- 스마트시티 구축 사업 데이터
- 기업 입찰 참여 현황 통계
- AI 기술 개발 사업 현황
- 환경 친화적 건설 사업 데이터
- 디지털 헬스케어 서비스 현황
- 교육 디지털 전환 현황
- 블록체인 기술 활용 사례

## 공공데이터포털 Mock API

### 제공 기능
1. **데이터 목록 조회** - 카테고리, 기관, 검색어 필터링 지원
2. **데이터 상세 조회** - 개별 데이터 상세 정보
3. **데이터 검색** - 제목, 설명, 태그, 기관명 검색
4. **데이터 다운로드** - 다운로드 링크 생성
5. **통계 정보** - 전체 통계 및 카테고리별 통계

### Mock API 서버 엔드포인트
- `GET /public-data` - 데이터 목록 조회
- `GET /public-data/:id` - 데이터 상세 조회
- `GET /public-data/search` - 데이터 검색
- `POST /public-data/:id/download` - 다운로드 링크 생성
- `GET /health` - 서버 상태 확인
- `GET /stats` - API 통계

### 데이터 형식
- JSON, CSV, XML, XLSX 형식 지원
- UTF-8 인코딩
- CC BY 4.0 라이선스
- 무료 다운로드

## 컴포넌트 업데이트

### KPICards 컴포넌트
- DashboardService를 사용하여 실제 데이터를 표시
- 로딩 상태 처리
- 에러 상태 처리

### PublicDataList 컴포넌트
- 공공데이터 목록 표시
- 검색 및 필터링 기능
- 다운로드 기능
- 반응형 디자인

### PublicDataStats 컴포넌트
- 공공데이터 통계 표시
- 카테고리별 분포
- 기관별 데이터 현황

### 기타 컴포넌트들
모든 컴포넌트가 해당 서비스를 사용하도록 업데이트되었습니다.

## 실제 API 연동 시 주의사항

1. **환경 변수 변경**: 실제 API 서버 URL로 변경
2. **Mock 데이터 비활성화**: `REACT_APP_USE_MOCK_DATA=false`로 설정
3. **API 응답 구조 확인**: Mock 데이터와 실제 API 응답 구조가 일치하는지 확인
4. **에러 처리 검증**: 실제 API 에러 상황에서의 동작 확인

## 개발 팁

### Mock 데이터 수정
각 서비스 파일의 Mock 데이터를 수정하여 다양한 시나리오를 테스트할 수 있습니다.

### 새로운 API 엔드포인트 추가
1. 서비스 파일에 새로운 메서드 추가
2. Mock 데이터 정의
3. try-catch 구조로 실제 API 호출 후 Mock 데이터 fallback

### Mock API 서버 확장
1. `mockApiServer.ts`에 새로운 엔드포인트 추가
2. 응답 구조 정의
3. 에러 시뮬레이션 추가

### 디버깅
- 브라우저 개발자 도구 콘솔에서 "API not available, using mock data" 메시지 확인
- Mock 데이터 사용 여부 확인
- Mock API 서버 로그 확인

## 결론

이 Mock 서버 API 적용으로 인해 실제 Open API 연동 없이도 프론트엔드 개발과 테스트가 가능해졌습니다. 공공데이터포털 API 승인 전까지 Mock 데이터를 사용하여 완전한 기능을 테스트할 수 있으며, 실제 API가 준비되면 환경 변수만 변경하여 쉽게 전환할 수 있습니다.
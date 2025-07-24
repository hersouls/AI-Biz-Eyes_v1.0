# 조달청 나라장터 API 연동 가이드

## 📋 개요

이 문서는 AI Biz Eyes 프로젝트에서 조달청 나라장터 API를 연동하여 실시간 입찰공고 정보를 제공하는 방법을 설명합니다.

## 🏗️ 아키텍처

### 백엔드 구조
```
src/
├── services/
│   └── g2bApiService.ts      # 조달청 API 서비스
├── controllers/
│   └── g2bController.ts      # 조달청 API 컨트롤러
├── routes/
│   └── g2b.ts               # 조달청 API 라우터
└── index.ts                 # 메인 서버 (라우터 등록)
```

### 프론트엔드 구조
```
react-tailwind-app/src/
├── services/
│   └── g2bApiService.ts      # 프론트엔드 API 서비스
├── hooks/
│   └── useG2BApi.ts         # React 훅
├── components/
│   ├── G2BApiStatus.tsx     # API 상태 컴포넌트
│   ├── BidList.tsx          # 입찰공고 목록 컴포넌트
│   ├── BidSearch.tsx        # 검색 컴포넌트
│   └── G2B/
│       └── G2BPage.tsx      # 메인 페이지
└── App.tsx                  # 라우트 등록
```

## 🚀 설치 및 설정

### 1. 환경 변수 설정

#### 백엔드 (.env)
```bash
# 조달청 API 설정
G2B_SERVICE_KEY=your-g2b-service-key-here

# 서버 설정
PORT=3003
NODE_ENV=development
```

#### 프론트엔드 (.env)
```bash
# API 기본 URL
REACT_APP_API_BASE_URL=http://localhost:3003/api

# 조달청 API 설정
REACT_APP_G2B_SERVICE_KEY=your-g2b-service-key-here
```

### 2. 조달청 API 키 발급

1. [나라장터 OpenAPI](https://openapi.g2b.go.kr/) 접속
2. 회원가입 및 로그인
3. 입찰공고정보서비스 API 신청
4. 승인 후 서비스 키 발급

### 3. 서버 실행

```bash
# 백엔드 서버 실행
npm run dev

# 프론트엔드 개발 서버 실행
cd react-tailwind-app
npm start
```

## 📡 API 엔드포인트

### 조달청 API 상태 확인
```
GET /api/g2b/status
```

### 입찰공고 관련
```
GET /api/g2b/bids                    # 입찰공고 목록
GET /api/g2b/bids/:bidNtceNo         # 입찰공고 상세
GET /api/g2b/bids/search/:keyword    # 키워드 검색
GET /api/g2b/bids/institution/:name  # 기관별 조회
GET /api/g2b/bids/date-range/:from/:to  # 날짜 범위 조회
```

### 계약 정보 관련
```
GET /api/g2b/contracts               # 계약 정보 목록
GET /api/g2b/contracts/:cntrctNo     # 계약 정보 상세
```

## 🎯 주요 기능

### 1. API 상태 모니터링
- 조달청 API 연결 상태 실시간 확인
- 설정 정보 및 응답 시간 모니터링
- 오류 발생 시 자동 재시도

### 2. 입찰공고 조회
- 최신 입찰공고 목록 조회
- 페이지네이션 지원 (5, 10, 20, 50건)
- 다양한 검색 조건 지원

### 3. 키워드 검색
- 실시간 키워드 검색
- 검색 결과 필터링
- 검색 히스토리 관리

### 4. 데이터 포맷팅
- 가격 정보 한국어 포맷팅
- 날짜 정보 표준화
- 입찰방식 한글 변환

## 🔧 사용법

### 1. API 상태 확인
```typescript
import { useG2BApiStatus } from '../hooks/useG2BApi';

const { status, loading, error, refetch } = useG2BApiStatus();
```

### 2. 입찰공고 목록 조회
```typescript
import { useBidList } from '../hooks/useG2BApi';

const { data, loading, error, refetch } = useBidList({
  pageNo: 1,
  numOfRows: 10
});
```

### 3. 키워드 검색
```typescript
import { useBidSearch } from '../hooks/useG2BApi';

const { data, loading, error, refetch } = useBidSearch('IT', {
  pageNo: 1,
  numOfRows: 10
});
```

## 🎨 UI 컴포넌트

### G2BApiStatus
- API 연결 상태 표시
- 설정 정보 확인
- 실시간 상태 업데이트

### BidList
- 입찰공고 목록 테이블
- 페이지네이션
- 정렬 및 필터링

### BidSearch
- 키워드 검색 폼
- 검색 결과 표시
- 검색 히스토리

## 🔍 테스트

### API 테스트
```bash
# API 상태 확인
curl http://localhost:3003/api/g2b/status

# 입찰공고 목록 조회
curl "http://localhost:3003/api/g2b/bids?pageNo=1&numOfRows=5"

# 키워드 검색
curl "http://localhost:3003/api/g2b/bids/search/IT?pageNo=1&numOfRows=5"
```

### 프론트엔드 테스트
1. 브라우저에서 `http://localhost:3000/g2b` 접속
2. API 상태 탭에서 연결 상태 확인
3. 입찰공고 목록 탭에서 데이터 조회
4. 키워드 검색 탭에서 검색 기능 테스트

## 🛠️ 개발 가이드

### 새로운 API 엔드포인트 추가

1. **서비스 레이어 확장**
```typescript
// src/services/g2bApiService.ts
async getNewEndpoint(params: NewParams): Promise<NewResponse> {
  return this.makeRequest<NewData>('/new-endpoint', params);
}
```

2. **컨트롤러 추가**
```typescript
// src/controllers/g2bController.ts
export const getNewData = async (req: Request, res: Response) => {
  try {
    const result = await g2bApiService.getNewEndpoint(req.query);
    return res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};
```

3. **라우터 등록**
```typescript
// src/routes/g2b.ts
router.get('/new-endpoint', getNewData);
```

4. **프론트엔드 훅 추가**
```typescript
// react-tailwind-app/src/hooks/useG2BApi.ts
export const useNewData = (params: NewParams) => {
  // 훅 구현
};
```

### 에러 처리

```typescript
// 백엔드 에러 처리
try {
  const result = await g2bApiService.getData();
  return res.json({ success: true, data: result });
} catch (error: any) {
  return res.status(500).json({
    success: false,
    error: {
      code: 'G2B_API_ERROR',
      message: error.message
    }
  });
}

// 프론트엔드 에러 처리
const { data, loading, error } = useBidList();

if (error) {
  return <div className="error">오류: {error}</div>;
}
```

## 📊 성능 최적화

### 1. 캐싱 전략
- API 응답 캐싱 (Redis/Memory)
- 캐시 TTL 설정 (5분)
- 캐시 무효화 전략

### 2. 요청 최적화
- 배치 요청 처리
- 요청 제한 (Rate Limiting)
- 타임아웃 설정 (15초)

### 3. 프론트엔드 최적화
- React.memo 사용
- useMemo/useCallback 최적화
- 가상화된 리스트 (대용량 데이터)

## 🔒 보안 고려사항

### 1. API 키 보안
- 환경 변수 사용
- API 키 암호화
- 키 순환 정책

### 2. 요청 검증
- 입력 데이터 검증
- SQL Injection 방지
- XSS 방지

### 3. 접근 제어
- 인증/인가 미들웨어
- API 사용량 제한
- 로그 모니터링

## 🐛 문제 해결

### 일반적인 문제들

1. **API 연결 실패**
   - API 키 확인
   - 네트워크 연결 상태 확인
   - 조달청 API 서비스 상태 확인

2. **데이터 로딩 실패**
   - 서버 로그 확인
   - API 응답 형식 확인
   - 에러 핸들링 확인

3. **프론트엔드 렌더링 오류**
   - 브라우저 콘솔 확인
   - React DevTools 사용
   - 컴포넌트 상태 확인

### 디버깅 도구

```bash
# 서버 로그 확인
npm run dev

# API 테스트
curl -v http://localhost:3003/api/g2b/status

# 프론트엔드 개발자 도구
# 브라우저 F12 > Console 탭
```

## 📈 모니터링

### 1. API 모니터링
- 응답 시간 측정
- 오류율 모니터링
- 사용량 통계

### 2. 로그 분석
- 요청/응답 로그
- 오류 로그
- 성능 로그

### 3. 알림 설정
- API 다운타임 알림
- 오류율 임계값 알림
- 성능 저하 알림

## 🔄 업데이트 및 유지보수

### 1. 정기 업데이트
- 조달청 API 스펙 변경 대응
- 보안 패치 적용
- 성능 개선

### 2. 버전 관리
- API 버전 관리
- 호환성 유지
- 마이그레이션 가이드

### 3. 문서화
- API 문서 업데이트
- 사용법 가이드 업데이트
- 변경사항 기록

## 📞 지원

### 기술 지원
- 개발팀 문의
- 이슈 트래커 활용
- 코드 리뷰 요청

### 문서 및 리소스
- [조달청 나라장터 OpenAPI](https://openapi.g2b.go.kr/)
- [API 문서](https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService)
- [개발자 가이드](https://openapi.g2b.go.kr/guide/)

---

**마지막 업데이트**: 2024년 7월 24일
**버전**: 1.0.0
**작성자**: AI Biz Eyes 개발팀
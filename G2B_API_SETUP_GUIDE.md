# 조달청 API 키 설정 및 실제 연동 가이드

## 📋 개요

이 문서는 AI Biz Eyes 프로젝트에서 조달청 나라장터 API를 실제로 연동하기 위한 단계별 설정 가이드를 제공합니다.

## 🔑 조달청 API 키 발급 절차

### 1. 나라장터 OpenAPI 회원가입

1. [나라장터 OpenAPI](https://openapi.g2b.go.kr/) 접속
2. 우측 상단 "회원가입" 클릭
3. 개인정보 입력 및 이메일 인증
4. 로그인 후 "마이페이지" 접속

### 2. API 서비스 신청

1. "API 신청" 메뉴 클릭
2. "입찰공고정보서비스" 선택
3. 신청 목적 및 사용 계획 작성
4. 신청서 제출

### 3. 승인 및 키 발급

1. 관리자 승인 대기 (보통 1-2일 소요)
2. 승인 완료 후 "마이페이지" → "API 키 관리"
3. 발급받은 서비스 키 복사

## ⚙️ 환경 변수 설정

### 백엔드 설정 (.env)

```bash
# 서버 설정
PORT=3003
NODE_ENV=development

# 조달청 API 설정 (실제 키로 교체)
G2B_SERVICE_KEY=여기에_실제_API_키_입력

# CORS 설정
ALLOWED_ORIGINS=http://localhost:3000,https://bizeyes.moonwave.kr
```

### 프론트엔드 설정 (react-tailwind-app/.env)

```bash
# API 기본 URL
REACT_APP_API_BASE_URL=http://localhost:3003/api

# 조달청 API 설정 (실제 키로 교체)
REACT_APP_G2B_SERVICE_KEY=여기에_실제_API_키_입력

# 개발 환경 설정
REACT_APP_NODE_ENV=development
```

## 🔄 Mock 데이터에서 실제 API로 전환

### 1. 백엔드 서버 재시작

```bash
# 서버 중지 후 재시작
npm run dev
```

### 2. API 상태 확인

```bash
curl http://localhost:3003/api/g2b/status
```

응답에서 `isUsingMockData: false`가 나와야 합니다.

### 3. 실제 데이터 테스트

```bash
# 입찰공고 목록 조회
curl "http://localhost:3003/api/g2b/bids?pageNo=1&numOfRows=5"

# 키워드 검색
curl "http://localhost:3003/api/g2b/bids/search/IT?pageNo=1&numOfRows=3"
```

## 🎯 주요 API 엔드포인트

### 입찰공고 관련

| 엔드포인트 | 설명 | 파라미터 |
|-----------|------|----------|
| `GET /api/g2b/bids` | 입찰공고 목록 | pageNo, numOfRows, bidNtceNm, dminsttNm |
| `GET /api/g2b/bids/:bidNtceNo` | 입찰공고 상세 | bidNtceNo |
| `GET /api/g2b/bids/search/:keyword` | 키워드 검색 | keyword, pageNo, numOfRows |
| `GET /api/g2b/bids/institution/:name` | 기관별 조회 | institutionName, pageNo, numOfRows |
| `GET /api/g2b/bids/date-range/:from/:to` | 날짜 범위 조회 | fromDate, toDate, pageNo, numOfRows |

### 계약 정보 관련

| 엔드포인트 | 설명 | 파라미터 |
|-----------|------|----------|
| `GET /api/g2b/contracts` | 계약 정보 목록 | pageNo, numOfRows, cntrctNm, dminsttNm |
| `GET /api/g2b/contracts/:cntrctNo` | 계약 정보 상세 | cntrctNo |

## 🔍 API 응답 구조

### 성공 응답

```json
{
  "success": true,
  "data": {
    "bids": [
      {
        "bidNtceNo": "2024-001",
        "bidNtceNm": "2024년 AI 기술개발사업",
        "dminsttNm": "과학기술정보통신부",
        "bidMethdNm": "일반입찰",
        "presmptPrce": "500000000",
        "bidNtceDt": "2024-07-01",
        "opengDt": "2024-08-15"
      }
    ],
    "pagination": {
      "pageNo": 1,
      "numOfRows": 10,
      "totalCount": 100
    },
    "isUsingMockData": false,
    "timestamp": "2024-07-24T02:00:37.575Z"
  }
}
```

### 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "G2B_API_ERROR",
    "message": "API 요청 실패 메시지"
  },
  "timestamp": "2024-07-24T02:00:37.575Z"
}
```

## 🧪 테스트 방법

### 1. 백엔드 API 테스트

```bash
# API 상태 확인
curl http://localhost:3003/api/g2b/status

# 입찰공고 목록 조회
curl "http://localhost:3003/api/g2b/bids?pageNo=1&numOfRows=5"

# 키워드 검색
curl "http://localhost:3003/api/g2b/bids/search/IT?pageNo=1&numOfRows=3"

# 기관별 조회
curl "http://localhost:3003/api/g2b/bids/institution/과학기술정보통신부?pageNo=1&numOfRows=5"
```

### 2. 프론트엔드 테스트

1. 브라우저에서 `http://localhost:3000/bid-list` 접속
2. Mock 데이터 알림이 사라졌는지 확인
3. 실제 조달청 데이터가 로드되는지 확인
4. 검색 및 필터링 기능 테스트

## 🚨 주의사항

### 1. API 사용량 제한

- 조달청 API는 일일 사용량 제한이 있을 수 있습니다
- 과도한 요청을 피하고 적절한 캐싱을 구현하세요

### 2. API 키 보안

- API 키를 소스코드에 직접 하드코딩하지 마세요
- 환경 변수를 통해 안전하게 관리하세요
- Git 저장소에 API 키가 포함되지 않도록 주의하세요

### 3. 에러 처리

- API 응답이 실패할 경우를 대비한 에러 처리를 구현하세요
- 네트워크 오류, API 서버 오류 등 다양한 상황을 고려하세요

## 🔧 문제 해결

### 1. API 키 인증 실패

```bash
# 응답 확인
curl -v "http://localhost:3003/api/g2b/status"
```

**해결 방법:**
- API 키가 올바르게 설정되었는지 확인
- 나라장터 OpenAPI에서 API 키 상태 확인
- API 서비스 신청이 승인되었는지 확인

### 2. CORS 오류

**해결 방법:**
- 백엔드 CORS 설정 확인
- 프론트엔드 URL이 허용된 origin에 포함되어 있는지 확인

### 3. 데이터 로딩 실패

**해결 방법:**
- 네트워크 연결 상태 확인
- 조달청 API 서버 상태 확인
- 백엔드 서버 로그 확인

## 📞 지원

### 기술 지원
- 개발팀 문의: [이메일 주소]
- 이슈 트래커: [GitHub Issues 링크]

### 조달청 API 지원
- [나라장터 OpenAPI 가이드](https://openapi.g2b.go.kr/guide/)
- [API 문서](https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService)
- [고객센터](https://openapi.g2b.go.kr/contact)

---

**마지막 업데이트**: 2024년 7월 24일  
**버전**: 1.0.0  
**작성자**: AI Biz Eyes 개발팀
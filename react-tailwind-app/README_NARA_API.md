# 🏛️ 나라장터 입찰공고정보 API 가이드

## 📋 개요

이 문서는 조달청 나라장터 입찰공고정보 OpenAPI를 AI Biz Eyes 프로젝트에서 사용하는 방법을 설명합니다.

## 🔗 API 정보

- **📁 참고문서**: [조달청_OpenAPI참고자료_나라장터_입찰공고정보서비스_1.0.docx](public/docs/조달청_OpenAPI참고자료_나라장터_입찰공고정보서비스_1.0.docx)
- **📦 데이터포맷**: JSON + XML
- **🔗 End Point**: `https://apis.data.go.kr/1230000/ad/BidPublicInfoService`

## 🔑 인증키 발급 방법

### 1. 공공데이터포털 가입
1. [공공데이터포털](https://www.data.go.kr) 접속
2. 회원가입 및 로그인

### 2. 나라장터 입찰공고정보 서비스 신청
1. 검색창에 "나라장터 입찰공고정보" 검색
2. "나라장터 입찰공고정보 서비스" 선택
3. "활용신청" 클릭
4. 신청서 작성 및 제출

### 3. 인증키 발급
1. 승인 후 "마이페이지" → "활용신청 현황" 확인
2. 발급받은 인증키 복사

## ⚙️ 설정 방법

### 1. 환경변수 설정

`.env` 파일에 인증키 추가:

```env
REACT_APP_NARA_API_KEY=your_actual_api_key_here
```

### 2. API 서비스 설정 업데이트

`src/services/naraBidApiService.ts` 파일에서 인증키 업데이트:

```typescript
const NARA_API_CONFIG = {
  baseUrl: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  serviceKey: {
    encoding: process.env.REACT_APP_NARA_API_KEY || 'your_actual_api_key_here',
    decoding: process.env.REACT_APP_NARA_API_KEY_DECODED || 'your_decoded_api_key_here'
  },
  // ... 나머지 설정
};
```

## 🧪 테스트 방법

### 1. 웹 인터페이스 테스트

1. 애플리케이션 실행
2. 사이드바에서 "나라장터 API 테스트" 메뉴 클릭
3. `/nara-api-test` 페이지에서 다양한 테스트 실행

### 2. 명령줄 테스트

```bash
# 모든 테스트 실행
node test-nara-api.js

# 개별 테스트 실행
node test-nara-api.js --connection
node test-nara-api.js --bid-list
node test-nara-api.js --keyword
node test-nara-api.js --institution
node test-nara-api.js --date-range
node test-nara-api.js --bid-result
```

## 📡 API 엔드포인트

### 1. 입찰공고 목록 조회
- **Endpoint**: `/getBidPblancListInfoServc`
- **Method**: GET
- **Parameters**:
  - `serviceKey`: 인증키 (필수)
  - `pageNo`: 페이지 번호 (기본값: 1)
  - `numOfRows`: 페이지당 행 수 (기본값: 10)
  - `inqryDiv`: 조회구분 (1: 전체, 2: 입찰공고, 3: 입찰결과)
  - `inqryBgnDt`: 조회시작일 (YYYYMMDD)
  - `inqryEndDt`: 조회종료일 (YYYYMMDD)
  - `dminsttNm`: 수요기관명
  - `bidNtceNm`: 입찰공고명 (키워드 검색)
  - `presmptPrceBgn`: 추정가격 시작
  - `presmptPrceEnd`: 추정가격 종료

### 2. 입찰공고 상세 조회
- **Endpoint**: `/getBidPblancDtlInfoServc`
- **Method**: GET
- **Parameters**:
  - `serviceKey`: 인증키 (필수)
  - `bidNtceNo`: 입찰공고번호 (필수)

### 3. 입찰결과 조회
- **Endpoint**: `/getBidPblancRltInfoServc`
- **Method**: GET
- **Parameters**: 입찰공고 목록 조회와 동일

## 💻 사용 예시

### 1. 기본 입찰공고 목록 조회

```typescript
import { naraBidApiService } from './services/naraBidApiService';

// 기본 목록 조회
const result = await naraBidApiService.getBidList({
  pageNo: 1,
  numOfRows: 10,
  inqryDiv: '1' // 전체
});

if (result.success) {
  console.log('입찰공고 목록:', result.data);
}
```

### 2. 키워드 검색

```typescript
// 키워드로 검색
const result = await naraBidApiService.searchBidByKeyword('시스템 구축', {
  pageNo: 1,
  numOfRows: 20
});
```

### 3. 기관별 검색

```typescript
// 조달청 입찰공고만 조회
const result = await naraBidApiService.getBidListByInstitution('조달청', {
  pageNo: 1,
  numOfRows: 10
});
```

### 4. 기간별 검색

```typescript
// 특정 기간 입찰공고 조회
const result = await naraBidApiService.getBidListByDateRange(
  '20241201', // 시작일
  '20241231', // 종료일
  { pageNo: 1, numOfRows: 10 }
);
```

### 5. 가격 범위 검색

```typescript
// 추정가격 범위로 검색
const result = await naraBidApiService.getBidListByPriceRange(
  10000000, // 1천만원
  100000000, // 1억원
  { pageNo: 1, numOfRows: 10 }
);
```

## 📊 응답 데이터 구조

### 입찰공고 아이템 (NaraBidItem)

```typescript
interface NaraBidItem {
  bidNtceNo: string;           // 입찰공고번호
  bidNtceNm: string;           // 입찰공고명
  dminsttNm: string;           // 수요기관명
  bidNtceDt: string;           // 입찰공고일시
  opengDt: string;             // 개찰일시
  presmptPrce: number;         // 추정가격
  bidwinnrNm?: string;         // 낙찰자명
  bidwinnrPrce?: number;       // 낙찰가격
  bidNtceUrl?: string;         // 입찰공고 URL
  opengPlce?: string;          // 개찰장소
  presnatnOprtnPlce?: string;  // 제출서류 접수장소
  bidMethd?: string;           // 입찰방식
  bidPblancNm?: string;        // 입찰공고기관명
}
```

### API 응답 구조

```typescript
interface NaraBidResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: NaraBidItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}
```

## ⚠️ 주의사항

### 1. API 호출 제한
- 일일 호출 한도 확인 필요
- 초당 호출 제한 준수
- 서버 부하 방지를 위한 적절한 간격 유지

### 2. 인증키 보안
- 인증키를 소스코드에 직접 하드코딩하지 않음
- 환경변수나 설정 파일을 통해 관리
- Git 저장소에 인증키 커밋 금지

### 3. 에러 처리
- API 응답 상태 코드 확인
- 네트워크 오류 처리
- 데이터 유효성 검증

## 🔧 문제 해결

### 1. 인증키 오류
```
SERVICE_KEY_IS_NOT_REGISTERED_ERROR
```
- 공공데이터포털에서 인증키 재발급
- 인증키 형식 확인 (Encoding/Decoding)
- 서비스 신청 상태 확인

### 2. 데이터 없음
```
NO_DATA
```
- 검색 조건 확인
- 날짜 형식 확인 (YYYYMMDD)
- 키워드 철자 확인

### 3. 네트워크 오류
- 인터넷 연결 확인
- 방화벽 설정 확인
- API 서버 상태 확인

## 📞 지원

- **공공데이터포털 고객센터**: 02-2133-4274
- **조달청 고객센터**: 1588-9114
- **프로젝트 이슈**: GitHub Issues

---

*이 문서는 AI Biz Eyes 프로젝트의 나라장터 API 연동을 위한 가이드입니다.*
# 조달청 API 연동 가이드

## 개요

이 프로젝트는 조달청 OpenAPI를 직접 호출하여 실시간 입찰공고 정보를 가져오도록 구성되어 있습니다.

## API 설정

### 환경변수 설정

`.env` 파일에 다음 환경변수들을 설정해야 합니다:

```env
# 조달청 OpenAPI 인증키
REACT_APP_BID_SERVICE_KEY=w8uFE%2BfALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM%2FqByWrt9gZ406%2FITajbX1Q8%2FESHI1LDOADaTMcg%3D%3D
REACT_APP_BID_API_DECODED_KEY=w8uFE+fALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM/qByWrt9gZ406/ITajbX1Q8/ESHI1LDoADaTMcg==

# 조달청 API 엔드포인트
REACT_APP_BID_API_URL=https://apis.data.go.kr/1230000/ad/BidPublicInfoService
```

### API 엔드포인트

- **기본 URL**: `https://apis.data.go.kr/1230000/ad/BidPublicInfoService`
- **입찰공고 목록**: `getBidPblancListInfoServc`
- **입찰공고 상세**: `getBidPblancDetailInfoServc`
- **입찰공고 검색**: `getBidPblancSearchInfoServc`

## 주요 기능

### 1. 입찰공고 목록 조회

```typescript
import g2bApiService from './services/g2bApiService';

// 기본 목록 조회
const bidList = await g2bApiService.getBidList({
  pageNo: 1,
  numOfRows: 20
});

// 검색 조건과 함께 조회
const filteredBids = await g2bApiService.getBidList({
  pageNo: 1,
  numOfRows: 10,
  bidNtceNm: '시스템',
  dminsttNm: '한국전자기술'
});
```

### 2. 키워드 검색

```typescript
// 키워드로 입찰공고 검색
const searchResults = await g2bApiService.searchBidsByKeyword('AI', {
  pageNo: 1,
  numOfRows: 5
});
```

### 3. 기관별 조회

```typescript
// 특정 기관의 입찰공고 조회
const institutionBids = await g2bApiService.getBidsByInstitution('한국전자기술', {
  pageNo: 1,
  numOfRows: 10
});
```

### 4. 날짜 범위 조회

```typescript
// 날짜 범위로 입찰공고 조회
const dateRangeBids = await g2bApiService.getBidsByDateRange('20240101', '20240131', {
  pageNo: 1,
  numOfRows: 20
});
```

### 5. 입찰공고 상세 조회

```typescript
// 특정 입찰공고 상세 정보 조회
const bidDetail = await g2bApiService.getBidDetail('2024-001234');
```

## API 응답 형식

### 입찰공고 정보

```typescript
interface BidInfo {
  bidNtceNo: string;           // 입찰공고번호
  bidNtceNm: string;           // 입찰공고명
  dminsttNm: string;           // 수요기관명
  bidMethdNm: string;          // 입찰방식명
  presmptPrce: string;         // 추정가격
  bidNtceDt: string;           // 입찰공고일시
  opengDt: string;             // 개찰일시
  bidNtceUrl?: string;         // 입찰공고 URL
}
```

### 페이지네이션 정보

```typescript
interface PaginationInfo {
  pageNo: number;              // 현재 페이지
  numOfRows: number;           // 페이지당 항목 수
  totalCount: number;          // 전체 항목 수
}
```

## 유틸리티 함수

### 가격 포맷팅

```typescript
// 숫자를 한국어 통화 형식으로 변환
const formattedPrice = g2bApiService.formatPrice('1000000'); // "1,000,000원"
```

### 날짜 포맷팅

```typescript
// 날짜를 한국어 형식으로 변환
const formattedDate = g2bApiService.formatDate('2024-01-15'); // "2024. 01. 15. 오후 12:00"
```

### 입찰방식 변환

```typescript
// 입찰방식 코드를 한글명으로 변환
const methodName = g2bApiService.getBidMethodName('1'); // "일반입찰"
```

## 개발 환경에서 테스트

개발 환경에서는 브라우저 콘솔에서 다음 함수를 사용하여 API를 테스트할 수 있습니다:

```javascript
// 브라우저 콘솔에서 실행
testG2BApi();
```

이 함수는 다음을 테스트합니다:
1. API 상태 확인
2. 입찰공고 목록 조회
3. 키워드 검색
4. 입찰공고 상세 조회

## 에러 처리

API 호출 시 발생할 수 있는 주요 에러:

- **인증 실패**: API 키가 잘못되었거나 만료됨
- **파라미터 오류**: 잘못된 검색 조건
- **API 한도 초과**: 일일 호출 한도를 초과함
- **서비스 불가**: 조달청 서비스가 일시적으로 불가능
- **타임아웃**: 요청 시간 초과

## 주의사항

1. **API 호출 한도**: 조달청 API는 일일 호출 한도가 있으므로 적절한 캐싱 전략을 사용하세요.
2. **CORS 이슈**: 브라우저에서 직접 API를 호출할 때 CORS 이슈가 발생할 수 있습니다.
3. **데이터 형식**: API 응답은 XML 또는 JSON 형식으로 제공됩니다.
4. **인증키 보안**: API 키는 환경변수로 관리하고 Git에 커밋하지 마세요.

## 문제 해결

### CORS 오류 해결

브라우저에서 직접 조달청 API를 호출할 때 CORS 오류가 발생하는 경우:

1. **프록시 서버 사용**: 백엔드 서버를 통해 API를 호출
2. **브라우저 확장 프로그램**: CORS 우회 확장 프로그램 사용 (개발 환경에서만)
3. **서버사이드 렌더링**: SSR을 통해 서버에서 API 호출

### API 응답이 비어있는 경우

1. 검색 조건이 너무 구체적일 수 있습니다.
2. 해당 기간에 입찰공고가 없을 수 있습니다.
3. API 키에 문제가 있을 수 있습니다.

## 추가 정보

- [조달청 OpenAPI 문서](https://www.data.go.kr/data/1230000/ad/BidPublicInfoService)
- [API 사용 가이드](https://www.data.go.kr/data/1230000/ad/BidPublicInfoService)
- [개발자 포털](https://www.data.go.kr/)
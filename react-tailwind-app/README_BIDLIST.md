# 공고 리스트 (Bid List) 기능

## 개요

공고 리스트는 나라장터 OpenAPI를 연동하여 입찰공고 목록을 실시간으로 조회하고 관리하는 기능입니다. 화면정의서 목차 2번에 해당하는 핵심 기능으로, 실무 업무 흐름에 최적화된 UX를 제공합니다.

## 주요 기능

### 1. 검색 및 필터링
- **키워드 검색**: 공고명, 기관명, 업무구분으로 검색
- **고급 필터**:
  - 기간 필터 (공고일, 마감일)
  - 상태 필터 (일반/긴급/정정/재공고/취소)
  - 예산범위 필터
  - 기관명 필터
  - 지역 필터
  - 업무구분 필터 (공사/용역/물품)
  - 계약형태 필터
  - 입찰방식 필터 (전자/일반/국제)

### 2. 공고 목록 테이블
- **나라장터 OpenAPI 필드 기반 컬럼**:
  - 공고번호 (bidNtceNo)
  - 공고명 (bidNtceNm)
  - 공고기관명 (ntceInsttNm)
  - 업무구분 (bsnsDivNm)
  - 상태 (bidNtceSttusNm)
  - 공고일자 (bidNtceDate)
  - 마감일자 (bidClseDate)
  - 예산금액 (asignBdgtAmt)
- **상태 배지**: 시각적 상태 표시
- **다중선택**: 체크박스로 여러 공고 선택
- **정렬**: 각 컬럼별 오름/내림차순 정렬

### 3. 빠른 액션
- **상세보기**: 공고 상세 페이지로 이동
- **원문 바로가기**: 나라장터 원문 링크
- **레퍼런스 매칭**: 유사 레퍼런스 검색
- **참여판단**: 참여 여부 판단 페이지

### 4. 데이터 관리
- **페이징**: 페이지 단위 데이터 로딩
- **페이지 크기 조정**: 10/20/50/100개 단위
- **데이터 내보내기**: Excel/CSV 형식
- **실시간 통계**: 전체/필터/선택 건수 표시

### 5. 통계 및 분석
- **KPI 카드**: 전체 공고, 필터 결과, 선택된 공고 수
- **상태별 요약**: 현재 페이지 통계 정보
- **진행률 표시**: 필터/선택 비율

## 기술 스택

### Frontend
- **React 19**: 최신 React 버전 사용
- **TypeScript**: 타입 안정성 보장
- **Tailwind CSS**: 모던 UI 스타일링
- **Heroicons**: 아이콘 라이브러리
- **React Router**: SPA 라우팅

### API 연동
- **나라장터 OpenAPI**: 실시간 공고 데이터
- **RESTful API**: 표준 HTTP 통신
- **JSON 응답**: 구조화된 데이터 처리

### 상태 관리
- **React Hooks**: useState, useEffect, useCallback
- **커스텀 훅**: useBidList로 API 로직 분리

## 컴포넌트 구조

```
src/components/BidList/
├── BidList.tsx              # 메인 컴포넌트
├── BidListTable.tsx         # 테이블 컴포넌트
├── BidListFilter.tsx        # 필터 컴포넌트
├── BidListStats.tsx         # 통계 컴포넌트
├── BidListPagination.tsx    # 페이징 컴포넌트
└── index.ts                 # Export 관리
```

## 타입 정의

### BidData 인터페이스
나라장터 OpenAPI 응답 필드에 맞춘 완전한 타입 정의:

```typescript
interface BidData {
  // 기본 정보
  bidNtceNo: string;           // 입찰공고번호
  bidNtceNm: string;           // 입찰공고명
  bidNtceSttusNm: string;      // 공고상태명
  bsnsDivNm: string;           // 업무구분명
  
  // 기관 정보
  ntceInsttNm: string;         // 공고기관명
  dmndInsttNm?: string;        // 수요기관명
  
  // 금액 정보
  asignBdgtAmt?: string;       // 예산금액
  presmptPrce?: string;        // 추정가격
  
  // 날짜 정보
  bidNtceDate: string;         // 공고일자
  bidClseDate: string;         // 마감일자
  
  // 내부 관리 필드
  internalStatus?: string;      // 내부 상태
  isUrgent?: boolean;          // 긴급 여부
  isDeadlineNear?: boolean;    // 마감임박 여부
  aiRecommendationScore?: number; // AI 추천 점수
}
```

## API 연동

### 나라장터 OpenAPI 설정
```typescript
const API_CONFIG = {
  BASE_URL: 'https://openapi.g2b.go.kr:8090/openapi/service/rest/CpcpBidInfoService',
  SERVICE_KEY: process.env.REACT_APP_G2B_SERVICE_KEY,
  DEFAULT_PAGE_SIZE: 20
};
```

### 주요 API 엔드포인트
- **공고 목록 조회**: `getBidPblancListInfoServc`
- **공고 상세 조회**: `getBidPblancDetailInfoServc`
- **응답 형식**: JSON

## 사용법

### 1. 기본 사용
```typescript
import { BidList } from './components/BidList';

function App() {
  return (
    <Router>
      <Route path="/bid-list" element={<BidList />} />
    </Router>
  );
}
```

### 2. 필터링 사용
```typescript
const filters = {
  dateRange: { start: '2024-01-01', end: '2024-12-31' },
  status: '일반공고',
  businessType: '공사',
  budgetRange: { min: '1000', max: '10000' }
};
```

### 3. 정렬 사용
```typescript
const sort = {
  field: 'bidNtceDate',
  order: 'desc'
};
```

## 환경 설정

### 1. 환경 변수
```bash
# .env 파일
REACT_APP_G2B_SERVICE_KEY=your_service_key_here
```

### 2. 의존성 설치
```bash
npm install react-router-dom @heroicons/react
```

## 개발 가이드

### 1. 목업 데이터
개발 중에는 실제 API 대신 목업 데이터를 사용합니다:
- `useBidList` 훅에서 목업 데이터 생성
- 실제 API 연동 시 주석 처리된 코드 활성화

### 2. 스타일링
- Tailwind CSS 클래스 사용
- 반응형 디자인 적용
- 다크모드 지원 준비

### 3. 성능 최적화
- React.memo로 컴포넌트 최적화
- useCallback으로 함수 메모이제이션
- 가상화 스크롤 준비 (대용량 데이터)

## 향후 개선 사항

### 1. 기능 확장
- [ ] 실시간 알림 기능
- [ ] AI 기반 추천 시스템
- [ ] 레퍼런스 자동 매칭
- [ ] 참여 가능성 분석

### 2. 성능 개선
- [ ] 가상화 스크롤 적용
- [ ] 캐싱 시스템 도입
- [ ] 이미지 최적화
- [ ] 번들 크기 최적화

### 3. 사용자 경험
- [ ] 드래그 앤 드롭 정렬
- [ ] 키보드 단축키 지원
- [ ] 접근성 개선
- [ ] 다국어 지원

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.
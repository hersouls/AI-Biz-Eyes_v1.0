# 공고 상세(Bid Detail) 화면 기능

## 개요
공고 상세 화면은 나라장터 OpenAPI의 공고 상세정보를 구조적으로 표시하고, 담당자와 실무자가 실질적인 판단/참여/추적을 빠르게 할 수 있도록 UI/액션·데이터를 제공하는 화면입니다.

## 주요 기능

### 1. 공고 기본정보/상태 요약
- **공고번호(bidNtceNo)**: 고유 식별자
- **공고차수(bidNtceOrd)**: 공고 차수 정보
- **공고명(bidNtceNm)**: 입찰공고명
- **상태명(bidNtceSttusNm)**: 일반/긴급/정정/재공고/취소 등
- **업무구분명(bsnsDivNm)**: 공사/용역/물품 등
- **공고기관명(ntceInsttNm)**: 공고기관 정보
- **수요기관명(dmndInsttNm)**: 수요기관 정보
- **예산금액(asignBdgtAmt)**: 예산 정보
- **추정가격(presmptPrce)**: 추정가격 정보

### 2. 일정 정보
- **공고일시**: 공고일자(bidNtceDate) + 공고시각(bidNtceBgn)
- **마감일시**: 마감일자(bidClseDate) + 마감시각(bidClseTm)
- **개찰일시**: 개찰일자(opengDate) + 개찰시각(opengTm)
- **설명회 정보**: 설명회 실시여부, 일시, 장소

### 3. 입찰 조건
- **전자입찰여부(elctrnBidYn)**: Y/N
- **국제입찰여부(intrntnlBidYn)**: Y/N
- **공동계약여부(cmmnCntrctYn)**: Y/N
- **지역제한(rgnLmtYn)**: Y/N
- **업종제한(indstrytyLmtYn)**: Y/N

### 4. 담당자 정보
- **공고기관 담당자**: 부서, 이름, 전화, 이메일
- **수요기관 담당자**: 부서, 이름, 전화, 이메일

### 5. 내부 상태 관리
- **참여 상태**: 미정/검토중/참여예정/참여중/참여완료/참여취소
- **레퍼런스 매칭**: 매칭된 레퍼런스 건수
- **AI 추천 점수**: AI 기반 참여 가능성 점수 (0-100%)

### 6. 빠른 액션
- **원문 바로가기**: 나라장터 원문 페이지로 이동
- **참여판단**: 참여 여부 결정
- **레퍼런스 매칭**: 유사 레퍼런스 검색
- **알림 설정**: 공고 관련 알림 설정
- **코멘트 추가**: 내부 코멘트 작성

## UI 구성

### 메인 레이아웃
```
┌─────────────────────────────────────────────────────────────┐
│                    공고명 (제목)                              │
│ [상태배지] [긴급/마감임박/신규배지] 공고번호: 2024000001     │
│                    [원문바로가기] [참여판단]                  │
├─────────────────────────────────────────────────────────────┤
│  기본 정보 │  예산 정보 │  일정 정보 │  입찰 조건 │  담당자 정보 │
│            │            │            │            │             │
│  업무구분  │  예산금액  │  공고일시  │ 전자입찰   │ 공고기관    │
│  공고차수  │  추정가격  │  마감일시  │ 국제입찰   │ 수요기관    │
│  공고기관  │            │  개찰일시  │ 공동계약   │             │
│  수요기관  │            │  설명회    │ 지역제한   │             │
└─────────────────────────────────────────────────────────────┘
```

### 사이드바
```
┌─────────────────┐
│   내부 상태      │
│ 참여 상태        │
│ 레퍼런스 매칭    │
│ AI 추천 점수     │
├─────────────────┤
│   빠른 액션      │
│ 레퍼런스 매칭    │
│ 알림 설정        │
│ 코멘트 추가      │
├─────────────────┤
│   관련 정보      │
│ 계약체결형태     │
│ 계약체결방법     │
│ 낙찰자결정방법   │
└─────────────────┘
```

## 기술적 구현

### 컴포넌트 구조
```
BidDetail/
├── BidDetail.tsx          # 메인 컴포넌트
└── index.ts              # 내보내기 파일
```

### 주요 Props
```typescript
interface BidDetailProps {
  // 현재는 props 없음 (URL 파라미터로 bidNtceNo 받음)
}
```

### 상태 관리
- `bidData`: 공고 상세 데이터
- `loading`: 로딩 상태
- `error`: 에러 상태

### API 연동
- **엔드포인트**: `/api/bid-detail/:bidNtceNo`
- **메서드**: GET
- **응답**: BidData 타입

### 라우팅
- **경로**: `/bid-detail/:bidNtceNo`
- **파라미터**: bidNtceNo (공고번호)

## 데이터 타입

### BidData 인터페이스
```typescript
interface BidData {
  // 기본 정보
  bidNtceNo: string;           // 입찰공고번호
  bidNtceOrd?: number;         // 공고차수
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
  bidNtceBgn?: string;         // 공고시각
  bidClseDate: string;         // 마감일자
  bidClseTm?: string;          // 마감시각
  opengDate?: string;          // 개찰일자
  opengTm?: string;            // 개찰시각
  
  // 입찰 정보
  elctrnBidYn?: string;        // 전자입찰여부
  intrntnlBidYn?: string;      // 국제입찰여부
  cmmnCntrctYn?: string;       // 공동계약여부
  
  // 담당자 정보
  ntceInsttOfclDeptNm?: string; // 공고기관담당자부서명
  ntceInsttOfclNm?: string;    // 공고기관담당자명
  ntceInsttOfclTel?: string;   // 공고기관담당자전화번호
  ntceInsttOfclEmailAdrs?: string; // 공고기관담당자이메일주소
  dmndInsttOfclDeptNm?: string; // 수요기관담당자부서명
  dmndInsttOfclNm?: string;    // 수요기관담당자명
  dmndInsttOfclTel?: string;   // 수요기관담당자전화번호
  dmndInsttOfclEmailAdrs?: string; // 수요기관담당자이메일주소
  
  // URL 정보
  bidNtceUrl?: string;         // 입찰공고URL
  
  // 내부 관리 필드
  internalStatus?: string;      // 내부 상태
  isUrgent?: boolean;          // 긴급 여부
  isDeadlineNear?: boolean;    // 마감임박 여부
  isNew?: boolean;             // 신규 여부
  participationStatus?: string; // 참여 상태
  referenceMatchCount?: number; // 레퍼런스 매칭 수
  aiRecommendationScore?: number; // AI 추천 점수
}
```

## 사용된 유틸리티 함수

### formatters.ts
- `formatCurrency()`: 금액 포맷팅 (만원/억원 단위)
- `formatDate()`: 날짜 포맷팅 (YYYY-MM-DD)
- `formatDateTime()`: 날짜+시간 포맷팅
- `getStatusBadge()`: 공고 상태 배지
- `getBusinessTypeBadge()`: 업무구분 배지
- `getUrgentBadge()`: 긴급 배지
- `getDeadlineNearBadge()`: 마감임박 배지
- `getNewBadge()`: 신규 배지
- `getParticipationStatusBadge()`: 참여 상태 배지

## 스타일링

### Tailwind CSS 클래스
- **레이아웃**: grid, flex, space-y, gap
- **색상**: text-gray-900, text-blue-600, text-green-600
- **배경**: bg-gray-50, bg-blue-100, bg-green-100
- **테두리**: border-gray-200, rounded-lg
- **간격**: p-6, px-4, py-2, m-2

### 반응형 디자인
- **모바일**: 단일 컬럼 레이아웃
- **태블릿**: 2컬럼 그리드
- **데스크톱**: 3컬럼 그리드 (메인 2컬럼 + 사이드바 1컬럼)

## 접근성

### 키보드 네비게이션
- 모든 버튼과 링크는 키보드로 접근 가능
- 포커스 표시가 명확함

### 스크린 리더 지원
- 적절한 ARIA 라벨 사용
- 의미있는 HTML 구조
- 상태 변경 시 알림

## 성능 최적화

### 로딩 상태
- 스피너 애니메이션으로 로딩 표시
- 스켈레톤 UI 대신 간단한 스피너 사용

### 에러 처리
- API 오류 시 사용자 친화적 메시지
- 목록으로 돌아가기 버튼 제공

### 메모이제이션
- 불필요한 리렌더링 방지
- useCallback, useMemo 활용

## 테스트

### 단위 테스트
- 컴포넌트 렌더링 테스트
- 사용자 인터랙션 테스트
- 에러 상태 테스트

### 통합 테스트
- API 연동 테스트
- 라우팅 테스트
- 상태 관리 테스트

## 향후 개선 사항

### 기능 확장
- [ ] 첨부파일 다운로드 기능
- [ ] 공고 변경이력 표시
- [ ] AI 기반 자동요약 기능
- [ ] 내부 코멘트 시스템
- [ ] 알림 설정 모달

### 성능 개선
- [ ] 이미지 지연 로딩
- [ ] 가상 스크롤링
- [ ] 캐싱 전략 개선

### 사용자 경험
- [ ] 드래그 앤 드롭 기능
- [ ] 키보드 단축키
- [ ] 다크 모드 지원
- [ ] 인쇄 최적화

## 관련 문서
- [화면정의서](./public/docs/화면정의서) - 3. 공고 상세(Bid Detail) 화면 기능
- [API명세서](./public/docs/API명세서.md)
- [데이터베이스설계서](./public/docs/데이터베이스설계서.md)
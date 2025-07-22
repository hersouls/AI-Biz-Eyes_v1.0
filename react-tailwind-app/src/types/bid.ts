// 나라장터 OpenAPI 공고 데이터 타입 정의
export interface BidData {
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
  cmmnReciptMethdNm?: string;  // 공동수급방식명
  
  // 계약 정보
  cntrctCnclsSttusNm?: string; // 계약체결형태명
  cntrctCnclsMthdNm?: string;  // 계약체결방법명
  bidwinrDcsnMthdNm?: string;  // 낙찰자결정방법명
  
  // 제한 정보
  rgnLmtYn?: string;           // 지역제한여부
  prtcptPsblRgnNm?: string;    // 참여가능지역명
  indstrytyLmtYn?: string;     // 업종제한여부
  bidprcPsblIndstrytyNm?: string; // 입찰참가가능업종명
  
  // 예정가격 정보
  rsrvtnPrceDcsnMthdNm?: string; // 예정가격결정방법명
  
  // 설명회 정보
  presnatnOprtnYn?: string;    // 설명회실시여부
  presnatnOprtnDate?: string;  // 설명회일자
  presnatnOprtnTm?: string;    // 설명회시각
  presnatnOprtnPlce?: string;  // 설명회장소
  
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
  
  // 참조 정보
  refNtceNo?: string;          // 참조공고번호
  
  // 내부 관리 필드 (추가)
  internalStatus?: string;      // 내부 상태
  isUrgent?: boolean;          // 긴급 여부
  isDeadlineNear?: boolean;    // 마감임박 여부
  isNew?: boolean;             // 신규 여부
  participationStatus?: string; // 참여 상태
  referenceMatchCount?: number; // 레퍼런스 매칭 수
  aiRecommendationScore?: number; // AI 추천 점수
}

// API 응답 타입
export interface BidListResponse {
  response: {
    body: {
      items: BidData[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
    header: {
      resultCode: string;
      resultMsg: string;
    };
  };
}

// 필터 타입
export interface BidListFilters {
  dateRange: {
    start: string;
    end: string;
  };
  status: string;
  budgetRange: {
    min: string;
    max: string;
  };
  institution: string;
  businessType: string;
  region: string;
  contractType: string;
  biddingType: string;
}

// 정렬 타입
export interface BidListSort {
  field: string;
  order: 'asc' | 'desc';
}

// 페이징 타입
export interface BidListPagination {
  page: number;
  pageSize: number;
}

// 검색 파라미터 타입
export interface BidListParams {
  searchKeyword?: string;
  filters: BidListFilters;
  sort: BidListSort;
  pagination: BidListPagination;
}
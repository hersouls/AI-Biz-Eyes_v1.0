// 나라장터 입찰공고정보서비스 API 설정
export const BID_API_CONFIG = {
  // 기본 URL
  BASE_URL: process.env.REACT_APP_BID_API_URL || 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  
  // 인증키 (인코딩된 버전)
  SERVICE_KEY_ENCODED: process.env.REACT_APP_BID_SERVICE_KEY || 'w8uFE%2BfALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM%2FqByWrt9gZ406%2FITajbX1Q8%2FESHI1LDOADaTMcg%3D%3D',
  
  // 인증키 (디코딩된 버전)
  SERVICE_KEY_DECODED: process.env.REACT_APP_BID_API_DECODED_KEY || 'w8uFE+fALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM/qByWrt9gZ406/ITajbX1Q8/ESHI1LDoADaTMcg==',
  
  // 데이터 형식
  DATA_FORMAT: 'JSON+XML',
  
  // 기본 페이지 크기
  DEFAULT_PAGE_SIZE: 20,
  
  // 최대 페이지 크기
  MAX_PAGE_SIZE: 100,
  
  // 타임아웃 설정 (밀리초)
  TIMEOUT: 15000,
  
  // 재시도 설정
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // 캐시 설정
  CACHE_DURATION: 5 * 60 * 1000, // 5분
  
  // API 엔드포인트
  ENDPOINTS: {
    // 공고 목록 조회
    BID_LIST: 'getBidPblancListInfoServc',
    
    // 공고 상세 조회
    BID_DETAIL: 'getBidPblancDetailInfoServc',
    
    // 공고 검색
    BID_SEARCH: 'getBidPblancSearchInfoServc'
  },
  
  // 참고 문서
  REFERENCE_DOC: '조달청 OpenAPI참고자료 나라장터 입찰 공고정보서비스 1.0.docx'
};

// API 요청 헤더 설정
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'AI-Biz-Eyes/1.0'
};

// 에러 코드 정의
export const API_ERROR_CODES = {
  AUTH_FAILED: 'AUTH_001',
  INVALID_PARAMETER: 'PARAM_001',
  API_LIMIT_EXCEEDED: 'LIMIT_001',
  SERVICE_UNAVAILABLE: 'SERVICE_001',
  TIMEOUT: 'TIMEOUT_001'
};

// API 응답 상태 코드
export const API_STATUS_CODES = {
  SUCCESS: '00',
  NO_DATA: '99',
  ERROR: 'ERROR'
};

// 공고 상태 코드
export const BID_STATUS_CODES = {
  ACTIVE: '일반공고',
  CLOSED: '마감',
  CANCELLED: '취소',
  AWARDED: '낙찰',
  FAILED: '유찰'
};

// 비즈니스 타입 코드
export const BUSINESS_TYPE_CODES = {
  CONSTRUCTION: '공사',
  GOODS: '물품',
  SERVICE: '용역',
  CONSULTING: '자문',
  RESEARCH: '연구'
};

// 정렬 옵션
export const SORT_OPTIONS = {
  BID_DATE_DESC: { field: 'bidNtceDate', order: 'desc' },
  BID_DATE_ASC: { field: 'bidNtceDate', order: 'asc' },
  BUDGET_DESC: { field: 'presmptPrce', order: 'desc' },
  BUDGET_ASC: { field: 'presmptPrce', order: 'asc' },
  INSTITUTION: { field: 'ntceInsttNm', order: 'asc' }
};

// 필터 옵션
export const FILTER_OPTIONS = {
  DATE_RANGE: {
    TODAY: 'today',
    THIS_WEEK: 'this_week',
    THIS_MONTH: 'this_month',
    LAST_MONTH: 'last_month',
    CUSTOM: 'custom'
  },
  BUDGET_RANGE: {
    UNDER_100M: 'under_100m',
    UNDER_500M: 'under_500m',
    UNDER_1B: 'under_1b',
    UNDER_5B: 'under_5b',
    OVER_5B: 'over_5b'
  },
  STATUS: {
    ACTIVE: 'active',
    CLOSED: 'closed',
    ALL: 'all'
  }
};

// API 요청 파라미터 타입 정의
export interface BidApiParams {
  serviceKey?: string;
  pageNo?: number;
  numOfRows?: number;
  bidNtceNo?: string;
  bidNtceNm?: string;
  ntceInsttNm?: string;
  bidNtceDate?: string;
  presmptPrce?: string;
  dminsttNm?: string;
  opengPlce?: string;
  presnatnOprtnPlce?: string;
  presnatnOprtnDt?: string;
  bidMethd?: string;
  bidPblancNm?: string;
  bidNtceUrl?: string;
}

// API 응답 타입 정의
export interface BidApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: BidItem[] | BidItem;
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 공고 아이템 타입 정의
export interface BidItem {
  bidNtceNo: string;           // 입찰공고번호
  bidNtceNm: string;           // 입찰공고명
  ntceInsttNm: string;         // 공고기관명
  bidNtceDate: string;         // 공고일자
  presmptPrce: string;         // 예가
  dminsttNm: string;           // 수요기관명
  opengPlce: string;           // 개찰장소
  presnatnOprtnPlce: string;   // 제출서류 접수 장소
  presnatnOprtnDt: string;     // 제출서류 접수 일시
  bidMethd: string;            // 입찰방법
  bidPblancNm: string;         // 입찰공고명
  bidNtceUrl: string;          // 입찰공고 URL
}

// API 유틸리티 함수들
export const ApiUtils = {
  // URL 인코딩된 서비스키 반환
  getEncodedServiceKey: (): string => {
    return BID_API_CONFIG.SERVICE_KEY_ENCODED;
  },
  
  // 디코딩된 서비스키 반환
  getDecodedServiceKey: (): string => {
    return BID_API_CONFIG.SERVICE_KEY_DECODED;
  },
  
  // API URL 생성
  buildApiUrl: (endpoint: string, params: BidApiParams = {}): string => {
    const url = new URL(BID_API_CONFIG.BASE_URL);
    url.searchParams.append('serviceKey', params.serviceKey || BID_API_CONFIG.SERVICE_KEY_ENCODED);
    url.searchParams.append('pageNo', (params.pageNo || 1).toString());
    url.searchParams.append('numOfRows', (params.numOfRows || BID_API_CONFIG.DEFAULT_PAGE_SIZE).toString());
    
    // 추가 파라미터들
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== 'serviceKey' && key !== 'pageNo' && key !== 'numOfRows') {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  },
  
  // 에러 메시지 생성
  getErrorMessage: (errorCode: string): string => {
    const errorMessages: { [key: string]: string } = {
      [API_ERROR_CODES.AUTH_FAILED]: '인증에 실패했습니다. API 키를 확인해주세요.',
      [API_ERROR_CODES.INVALID_PARAMETER]: '잘못된 파라미터입니다.',
      [API_ERROR_CODES.API_LIMIT_EXCEEDED]: 'API 호출 한도를 초과했습니다.',
      [API_ERROR_CODES.SERVICE_UNAVAILABLE]: '서비스를 사용할 수 없습니다.',
      [API_ERROR_CODES.TIMEOUT]: '요청 시간이 초과되었습니다.'
    };
    
    return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.';
  }
};
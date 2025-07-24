import axios from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3003/api';

// 조달청 API 응답 타입
export interface G2BApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// 입찰공고 정보 타입
export interface BidInfo {
  bidNtceNo: string;           // 입찰공고번호
  bidNtceNm: string;           // 입찰공고명
  dminsttNm: string;           // 수요기관명
  bidMethdNm: string;          // 입찰방식명
  presmptPrce: string;         // 추정가격
  bidNtceDt: string;           // 입찰공고일시
  opengDt: string;             // 개찰일시
  bidwinnrNm?: string;         // 낙찰자명
  bidwinnrPrce?: string;       // 낙찰가격
  bidNtceUrl?: string;         // 입찰공고 URL
  dminsttUrl?: string;         // 수요기관 URL
}

// 계약 정보 타입
export interface ContractInfo {
  cntrctNo: string;            // 계약번호
  cntrctNm: string;            // 계약명
  dminsttNm: string;           // 수요기관명
  cntrctMthdNm: string;        // 계약방식명
  cntrctPrce: string;          // 계약금액
  cntrctDt: string;            // 계약일자
  cntrctUrl?: string;          // 계약 URL
}

// 페이지네이션 정보 타입
export interface PaginationInfo {
  pageNo: number;
  numOfRows: number;
  totalCount: number;
}

// 입찰공고 목록 응답 타입
export interface BidListResponse {
  bids: BidInfo[];
  pagination: PaginationInfo;
  timestamp: string;
}

// 계약 정보 목록 응답 타입
export interface ContractListResponse {
  contracts: ContractInfo[];
  pagination: PaginationInfo;
  timestamp: string;
}

// API 상태 응답 타입
export interface G2BApiStatusResponse {
  isAvailable: boolean;
  config: {
    BASE_URL: string;
    BID_INFO_URL: string;
    CONTRACT_INFO_URL: string;
    SERVICE_KEY: string;
    TIMEOUT: number;
  };
  timestamp: string;
}

// 검색 파라미터 타입
export interface BidSearchParams {
  pageNo?: number;
  numOfRows?: number;
  bidNtceNm?: string;
  dminsttNm?: string;
  bidMethdNm?: string;
  fromDt?: string;
  toDt?: string;
}

export interface ContractSearchParams {
  pageNo?: number;
  numOfRows?: number;
  cntrctNm?: string;
  dminsttNm?: string;
  fromDt?: string;
  toDt?: string;
}

class G2BApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/g2b`;
  }

  // 기본 API 요청 헬퍼 함수
  private async makeRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('G2B API 요청 오류:', error);
      throw new Error(error.response?.data?.error?.message || 'API 요청에 실패했습니다.');
    }
  }

  // 조달청 API 상태 확인
  async checkApiStatus(): Promise<G2BApiStatusResponse> {
    const response = await this.makeRequest<G2BApiResponse<G2BApiStatusResponse>>('/status');
    return response.data;
  }

  // 입찰공고 목록 조회
  async getBidList(params: BidSearchParams = {}): Promise<BidListResponse> {
    const response = await this.makeRequest<G2BApiResponse<BidListResponse>>('/bids', params);
    return response.data;
  }

  // 입찰공고 상세 조회
  async getBidDetail(bidNtceNo: string): Promise<BidInfo> {
    const response = await this.makeRequest<G2BApiResponse<{ bid: BidInfo }>>(`/bids/${bidNtceNo}`);
    return response.data.bid;
  }

  // 키워드로 입찰공고 검색
  async searchBidsByKeyword(keyword: string, params: BidSearchParams = {}): Promise<BidListResponse> {
    const response = await this.makeRequest<G2BApiResponse<BidListResponse>>(`/bids/search/${encodeURIComponent(keyword)}`, params);
    return response.data;
  }

  // 기관별 입찰공고 조회
  async getBidsByInstitution(institutionName: string, params: BidSearchParams = {}): Promise<BidListResponse> {
    const response = await this.makeRequest<G2BApiResponse<BidListResponse>>(`/bids/institution/${encodeURIComponent(institutionName)}`, params);
    return response.data;
  }

  // 날짜 범위로 입찰공고 조회
  async getBidsByDateRange(fromDate: string, toDate: string, params: BidSearchParams = {}): Promise<BidListResponse> {
    const response = await this.makeRequest<G2BApiResponse<BidListResponse>>(`/bids/date-range/${fromDate}/${toDate}`, params);
    return response.data;
  }

  // 계약 정보 목록 조회
  async getContractList(params: ContractSearchParams = {}): Promise<ContractListResponse> {
    const response = await this.makeRequest<G2BApiResponse<ContractListResponse>>('/contracts', params);
    return response.data;
  }

  // 계약 정보 상세 조회
  async getContractDetail(cntrctNo: string): Promise<ContractInfo> {
    const response = await this.makeRequest<G2BApiResponse<{ contract: ContractInfo }>>(`/contracts/${cntrctNo}`);
    return response.data.contract;
  }

  // 가격 포맷팅 헬퍼 함수
  formatPrice(price: string): string {
    if (!price) return '0원';
    const numPrice = parseInt(price.replace(/[^\d]/g, ''));
    return new Intl.NumberFormat('ko-KR').format(numPrice) + '원';
  }

  // 날짜 포맷팅 헬퍼 함수
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 입찰방식 한글 변환
  getBidMethodName(method: string): string {
    const methodMap: Record<string, string> = {
      '1': '일반입찰',
      '2': '지명입찰',
      '3': '수의계약',
      '4': '제한입찰',
      '5': '공개입찰'
    };
    return methodMap[method] || method;
  }
}

const g2bApiService = new G2BApiService();
export default g2bApiService;
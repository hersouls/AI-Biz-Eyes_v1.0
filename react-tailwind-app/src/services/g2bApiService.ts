import axios from 'axios';
import { BID_API_CONFIG, ApiUtils, BidApiParams, BidApiResponse, BidItem } from '../config/apiConfig';

// Mock data for development
const mockBids: BidInfo[] = [
  {
    bidNtceNo: '2024001',
    bidNtceNm: 'AI 기반 품질관리 시스템 구축 사업',
    dminsttNm: '한국표준과학연구원',
    bidMethdNm: '일반입찰',
    presmptPrce: '350000000',
    bidNtceDt: '2024-07-22',
    opengDt: '2024-08-20',
    bidNtceUrl: 'https://www.g2b.go.kr:8101/ep/main/main.do'
  },
  {
    bidNtceNo: '2024002',
    bidNtceNm: '스마트팩토리 구축 사업',
    dminsttNm: '한국산업기술진흥원',
    bidMethdNm: '일반입찰',
    presmptPrce: '500000000',
    bidNtceDt: '2024-07-20',
    opengDt: '2024-07-30',
    bidNtceUrl: 'https://www.g2b.go.kr:8101/ep/main/main.do'
  },
  {
    bidNtceNo: '2024003',
    bidNtceNm: '클라우드 인프라 구축 사업',
    dminsttNm: '정보통신산업진흥원',
    bidMethdNm: '일반입찰',
    presmptPrce: '200000000',
    bidNtceDt: '2024-07-18',
    opengDt: '2024-08-10',
    bidNtceUrl: 'https://www.g2b.go.kr:8101/ep/main/main.do'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  isUsingMockData?: boolean;
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
    this.baseURL = BID_API_CONFIG.BASE_URL;
  }

  // 실제 조달청 API 호출 헬퍼 함수
  private async callG2BApi<T>(endpoint: string, params: BidApiParams = {}): Promise<T> {
    try {
      const url = ApiUtils.buildApiUrl(endpoint, {
        ...params,
        serviceKey: ApiUtils.getEncodedServiceKey()
      });

      const response = await axios.get(url, {
        timeout: BID_API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'AI-Biz-Eyes/1.0'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('조달청 API 요청 오류:', error);
      throw new Error(error.response?.data?.message || '조달청 API 요청에 실패했습니다.');
    }
  }

  // 조달청 API 응답을 내부 형식으로 변환
  private transformBidResponse(apiResponse: BidApiResponse): BidListResponse {
    const items = Array.isArray(apiResponse.response.body.items.item) 
      ? apiResponse.response.body.items.item 
      : [apiResponse.response.body.items.item];

    const bids: BidInfo[] = items.map((item: BidItem) => ({
      bidNtceNo: item.bidNtceNo,
      bidNtceNm: item.bidNtceNm,
      dminsttNm: item.dminsttNm,
      bidMethdNm: this.getBidMethodName(item.bidMethd),
      presmptPrce: item.presmptPrce,
      bidNtceDt: item.bidNtceDate,
      opengDt: item.presnatnOprtnDt,
      bidNtceUrl: item.bidNtceUrl
    }));

    return {
      bids,
      pagination: {
        pageNo: apiResponse.response.body.pageNo,
        numOfRows: apiResponse.response.body.numOfRows,
        totalCount: apiResponse.response.body.totalCount
      },
      timestamp: new Date().toISOString()
    };
  }

  // 조달청 API 상태 확인
  async checkApiStatus(): Promise<G2BApiStatusResponse> {
    try {
      // 간단한 API 호출로 상태 확인
      await this.callG2BApi<BidApiResponse>(BID_API_CONFIG.ENDPOINTS.BID_LIST, {
        pageNo: 1,
        numOfRows: 1
      });

      return {
        isAvailable: true,
        config: {
          BASE_URL: BID_API_CONFIG.BASE_URL,
          BID_INFO_URL: `${BID_API_CONFIG.BASE_URL}/${BID_API_CONFIG.ENDPOINTS.BID_LIST}`,
          CONTRACT_INFO_URL: `${BID_API_CONFIG.BASE_URL}/${BID_API_CONFIG.ENDPOINTS.BID_DETAIL}`,
          SERVICE_KEY: ApiUtils.getEncodedServiceKey(),
          TIMEOUT: BID_API_CONFIG.TIMEOUT
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        isAvailable: false,
        config: {
          BASE_URL: BID_API_CONFIG.BASE_URL,
          BID_INFO_URL: `${BID_API_CONFIG.BASE_URL}/${BID_API_CONFIG.ENDPOINTS.BID_LIST}`,
          CONTRACT_INFO_URL: `${BID_API_CONFIG.BASE_URL}/${BID_API_CONFIG.ENDPOINTS.BID_DETAIL}`,
          SERVICE_KEY: ApiUtils.getEncodedServiceKey(),
          TIMEOUT: BID_API_CONFIG.TIMEOUT
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  // 입찰공고 목록 조회 (실제 조달청 API 호출)
  async getBidList(params: BidSearchParams = {}): Promise<BidListResponse> {
    try {
      const apiParams: BidApiParams = {
        pageNo: params.pageNo || 1,
        numOfRows: params.numOfRows || BID_API_CONFIG.DEFAULT_PAGE_SIZE,
        bidNtceNm: params.bidNtceNm,
        ntceInsttNm: params.dminsttNm,
        bidNtceDate: params.fromDt
      };

      const response = await this.callG2BApi<BidApiResponse>(
        BID_API_CONFIG.ENDPOINTS.BID_LIST, 
        apiParams
      );

      return this.transformBidResponse(response);
    } catch (error) {
      console.log('조달청 API not available, using mock data');
      
      // Fallback to mock data
      await delay(500);
      
      let filteredBids = [...mockBids];
      
      if (params.bidNtceNm) {
        filteredBids = filteredBids.filter(bid => 
          bid.bidNtceNm.toLowerCase().includes(params.bidNtceNm!.toLowerCase())
        );
      }
      if (params.dminsttNm) {
        filteredBids = filteredBids.filter(bid => 
          bid.dminsttNm.toLowerCase().includes(params.dminsttNm!.toLowerCase())
        );
      }
      
      const pageNo = params.pageNo || 1;
      const numOfRows = params.numOfRows || BID_API_CONFIG.DEFAULT_PAGE_SIZE;
      const startIndex = (pageNo - 1) * numOfRows;
      const endIndex = startIndex + numOfRows;
      const paginatedBids = filteredBids.slice(startIndex, endIndex);
      
      return {
        bids: paginatedBids,
        pagination: {
          pageNo,
          numOfRows,
          totalCount: filteredBids.length
        },
        timestamp: new Date().toISOString(),
        isUsingMockData: true
      };
    }
  }

  // 입찰공고 상세 조회
  async getBidDetail(bidNtceNo: string): Promise<BidInfo> {
    const response = await this.callG2BApi<BidApiResponse>(
      BID_API_CONFIG.ENDPOINTS.BID_DETAIL, 
      { bidNtceNo }
    );

    const items = Array.isArray(response.response.body.items.item) 
      ? response.response.body.items.item 
      : [response.response.body.items.item];

    if (items.length === 0) {
      throw new Error('입찰공고 정보를 찾을 수 없습니다.');
    }

    const item = items[0];
    return {
      bidNtceNo: item.bidNtceNo,
      bidNtceNm: item.bidNtceNm,
      dminsttNm: item.dminsttNm,
      bidMethdNm: this.getBidMethodName(item.bidMethd),
      presmptPrce: item.presmptPrce,
      bidNtceDt: item.bidNtceDate,
      opengDt: item.presnatnOprtnDt,
      bidNtceUrl: item.bidNtceUrl
    };
  }

  // 키워드로 입찰공고 검색
  async searchBidsByKeyword(keyword: string, params: BidSearchParams = {}): Promise<BidListResponse> {
    try {
      const apiParams: BidApiParams = {
        pageNo: params.pageNo || 1,
        numOfRows: params.numOfRows || BID_API_CONFIG.DEFAULT_PAGE_SIZE,
        bidNtceNm: keyword
      };

      const response = await this.callG2BApi<BidApiResponse>(
        BID_API_CONFIG.ENDPOINTS.BID_SEARCH, 
        apiParams
      );

      return this.transformBidResponse(response);
    } catch (error) {
      console.log('조달청 API not available, using mock data for search');
      
      // Fallback to mock data
      await delay(500);
      
      const filteredBids = mockBids.filter(bid => 
        bid.bidNtceNm.toLowerCase().includes(keyword.toLowerCase())
      );
      
      const pageNo = params.pageNo || 1;
      const numOfRows = params.numOfRows || BID_API_CONFIG.DEFAULT_PAGE_SIZE;
      const startIndex = (pageNo - 1) * numOfRows;
      const endIndex = startIndex + numOfRows;
      const paginatedBids = filteredBids.slice(startIndex, endIndex);
      
      return {
        bids: paginatedBids,
        pagination: {
          pageNo,
          numOfRows,
          totalCount: filteredBids.length
        },
        timestamp: new Date().toISOString(),
        isUsingMockData: true
      };
    }
  }

  // 기관별 입찰공고 조회
  async getBidsByInstitution(institutionName: string, params: BidSearchParams = {}): Promise<BidListResponse> {
    try {
      const apiParams: BidApiParams = {
        pageNo: params.pageNo || 1,
        numOfRows: params.numOfRows || BID_API_CONFIG.DEFAULT_PAGE_SIZE,
        ntceInsttNm: institutionName
      };

      const response = await this.callG2BApi<BidApiResponse>(
        BID_API_CONFIG.ENDPOINTS.BID_LIST, 
        apiParams
      );

      return this.transformBidResponse(response);
    } catch (error) {
      console.log('조달청 API not available, using mock data for institution search');
      
      // Fallback to mock data
      await delay(500);
      
      const filteredBids = mockBids.filter(bid => 
        bid.dminsttNm.toLowerCase().includes(institutionName.toLowerCase())
      );
      
      const pageNo = params.pageNo || 1;
      const numOfRows = params.numOfRows || BID_API_CONFIG.DEFAULT_PAGE_SIZE;
      const startIndex = (pageNo - 1) * numOfRows;
      const endIndex = startIndex + numOfRows;
      const paginatedBids = filteredBids.slice(startIndex, endIndex);
      
      return {
        bids: paginatedBids,
        pagination: {
          pageNo,
          numOfRows,
          totalCount: filteredBids.length
        },
        timestamp: new Date().toISOString(),
        isUsingMockData: true
      };
    }
  }

  // 날짜 범위로 입찰공고 조회
  async getBidsByDateRange(fromDate: string, toDate: string, params: BidSearchParams = {}): Promise<BidListResponse> {
    try {
      const apiParams: BidApiParams = {
        pageNo: params.pageNo || 1,
        numOfRows: params.numOfRows || BID_API_CONFIG.DEFAULT_PAGE_SIZE,
        bidNtceDate: fromDate
      };

      const response = await this.callG2BApi<BidApiResponse>(
        BID_API_CONFIG.ENDPOINTS.BID_LIST, 
        apiParams
      );

      return this.transformBidResponse(response);
    } catch (error) {
      console.log('조달청 API not available, using mock data for date range search');
      
      // Fallback to mock data
      await delay(500);
      
      // Simple date filtering for mock data
      const filteredBids = mockBids.filter(bid => {
        const bidDate = new Date(bid.bidNtceDt);
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return bidDate >= from && bidDate <= to;
      });
      
      const pageNo = params.pageNo || 1;
      const numOfRows = params.numOfRows || BID_API_CONFIG.DEFAULT_PAGE_SIZE;
      const startIndex = (pageNo - 1) * numOfRows;
      const endIndex = startIndex + numOfRows;
      const paginatedBids = filteredBids.slice(startIndex, endIndex);
      
      return {
        bids: paginatedBids,
        pagination: {
          pageNo,
          numOfRows,
          totalCount: filteredBids.length
        },
        timestamp: new Date().toISOString(),
        isUsingMockData: true
      };
    }
  }

  // 계약 정보 목록 조회 (현재는 입찰공고로 대체)
  async getContractList(params: ContractSearchParams = {}): Promise<ContractListResponse> {
    // 조달청 API에는 계약 정보 엔드포인트가 없으므로 입찰공고로 대체
    const bidResponse = await this.getBidList({
      pageNo: params.pageNo,
      numOfRows: params.numOfRows
    });

    const contracts: ContractInfo[] = bidResponse.bids.map(bid => ({
      cntrctNo: bid.bidNtceNo,
      cntrctNm: bid.bidNtceNm,
      dminsttNm: bid.dminsttNm,
      cntrctMthdNm: bid.bidMethdNm,
      cntrctPrce: bid.presmptPrce,
      cntrctDt: bid.bidNtceDt,
      cntrctUrl: bid.bidNtceUrl
    }));

    return {
      contracts,
      pagination: bidResponse.pagination,
      timestamp: new Date().toISOString()
    };
  }

  // 계약 정보 상세 조회
  async getContractDetail(cntrctNo: string): Promise<ContractInfo> {
    const bidInfo = await this.getBidDetail(cntrctNo);
    
    return {
      cntrctNo: bidInfo.bidNtceNo,
      cntrctNm: bidInfo.bidNtceNm,
      dminsttNm: bidInfo.dminsttNm,
      cntrctMthdNm: bidInfo.bidMethdNm,
      cntrctPrce: bidInfo.presmptPrce,
      cntrctDt: bidInfo.bidNtceDt,
      cntrctUrl: bidInfo.bidNtceUrl
    };
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
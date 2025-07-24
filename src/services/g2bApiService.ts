import axios, { AxiosResponse } from 'axios';

// 조달청 API 설정
export interface G2BApiConfig {
  BASE_URL: string;
  BID_INFO_URL: string;
  CONTRACT_INFO_URL: string;
  SERVICE_KEY: string;
  TIMEOUT: number;
}

// 조달청 API 응답 타입
export interface G2BApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: T[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
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

// API 파라미터 타입
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

// Mock 데이터 생성 함수
const generateMockBidData = (pageNo: number = 1, numOfRows: number = 10): BidInfo[] => {
  const mockBids: BidInfo[] = [
    {
      bidNtceNo: '2024-001',
      bidNtceNm: '2024년 AI 기술개발사업',
      dminsttNm: '과학기술정보통신부',
      bidMethdNm: '일반입찰',
      presmptPrce: '500000000',
      bidNtceDt: '2024-07-01',
      opengDt: '2024-08-15',
      bidNtceUrl: 'https://example.com/bid1'
    },
    {
      bidNtceNo: '2024-002',
      bidNtceNm: '디지털 전환 지원사업',
      dminsttNm: '중소벤처기업부',
      bidMethdNm: '지명입찰',
      presmptPrce: '300000000',
      bidNtceDt: '2024-07-05',
      opengDt: '2024-07-30',
      bidNtceUrl: 'https://example.com/bid2'
    },
    {
      bidNtceNo: '2024-003',
      bidNtceNm: '스마트팩토리 구축사업',
      dminsttNm: '산업통상자원부',
      bidMethdNm: '일반입찰',
      presmptPrce: '1000000000',
      bidNtceDt: '2024-07-10',
      opengDt: '2024-09-20',
      bidNtceUrl: 'https://example.com/bid3'
    },
    {
      bidNtceNo: '2024-004',
      bidNtceNm: '친환경 에너지 사업',
      dminsttNm: '환경부',
      bidMethdNm: '수의계약',
      presmptPrce: '800000000',
      bidNtceDt: '2024-07-15',
      opengDt: '2024-08-10',
      bidNtceUrl: 'https://example.com/bid4'
    },
    {
      bidNtceNo: '2024-005',
      bidNtceNm: '바이오 헬스케어 혁신사업',
      dminsttNm: '보건복지부',
      bidMethdNm: '일반입찰',
      presmptPrce: '1500000000',
      bidNtceDt: '2024-07-20',
      opengDt: '2024-09-30',
      bidNtceUrl: 'https://example.com/bid5'
    },
    {
      bidNtceNo: '2024-006',
      bidNtceNm: '클라우드 인프라 구축사업',
      dminsttNm: '과학기술정보통신부',
      bidMethdNm: '제한입찰',
      presmptPrce: '1200000000',
      bidNtceDt: '2024-07-25',
      opengDt: '2024-09-15',
      bidNtceUrl: 'https://example.com/bid6'
    },
    {
      bidNtceNo: '2024-007',
      bidNtceNm: '스마트시티 플랫폼 개발',
      dminsttNm: '행정안전부',
      bidMethdNm: '일반입찰',
      presmptPrce: '600000000',
      bidNtceDt: '2024-07-30',
      opengDt: '2024-09-25',
      bidNtceUrl: 'https://example.com/bid7'
    },
    {
      bidNtceNo: '2024-008',
      bidNtceNm: '블록체인 기반 시스템 구축',
      dminsttNm: '금융위원회',
      bidMethdNm: '지명입찰',
      presmptPrce: '400000000',
      bidNtceDt: '2024-08-01',
      opengDt: '2024-09-10',
      bidNtceUrl: 'https://example.com/bid8'
    },
    {
      bidNtceNo: '2024-009',
      bidNtceNm: 'IoT 센서 네트워크 구축',
      dminsttNm: '과학기술정보통신부',
      bidMethdNm: '일반입찰',
      presmptPrce: '700000000',
      bidNtceDt: '2024-08-05',
      opengDt: '2024-09-20',
      bidNtceUrl: 'https://example.com/bid9'
    },
    {
      bidNtceNo: '2024-010',
      bidNtceNm: '데이터 분석 플랫폼 개발',
      dminsttNm: '통계청',
      bidMethdNm: '수의계약',
      presmptPrce: '900000000',
      bidNtceDt: '2024-08-10',
      opengDt: '2024-09-30',
      bidNtceUrl: 'https://example.com/bid10'
    }
  ];

  // 페이지네이션 적용
  const startIndex = (pageNo - 1) * numOfRows;
  const endIndex = startIndex + numOfRows;
  return mockBids.slice(startIndex, endIndex);
};

class G2BApiService {
  private config: G2BApiConfig;
  private useMockData: boolean;

  constructor() {
    this.config = {
      BASE_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService',
      BID_INFO_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService',
      CONTRACT_INFO_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CntrctInfoService',
      SERVICE_KEY: process.env.G2B_SERVICE_KEY || 'test-key',
      TIMEOUT: 15000
    };
    
    // API 키가 test-key이거나 설정되지 않은 경우 Mock 데이터 사용
    this.useMockData = !process.env.G2B_SERVICE_KEY || process.env.G2B_SERVICE_KEY === 'test-key' || process.env.G2B_SERVICE_KEY === 'your-g2b-service-key-here';
  }

  // Mock 응답 생성 함수
  private createMockResponse<T>(items: T[], pageNo: number, numOfRows: number, totalCount: number): G2BApiResponse<T> {
    return {
      response: {
        header: {
          resultCode: '00',
          resultMsg: 'NORMAL SERVICE'
        },
        body: {
          items,
          numOfRows,
          pageNo,
          totalCount
        }
      }
    };
  }

  // 기본 API 요청 헬퍼 함수
  private async makeRequest<T>(
    url: string, 
    params: Record<string, any>
  ): Promise<G2BApiResponse<T>> {
    // Mock 데이터 사용 시
    if (this.useMockData) {
      console.log('Using Mock Data for G2B API');
      const mockBids = generateMockBidData(params.pageNo || 1, params.numOfRows || 10);
      return this.createMockResponse<BidInfo>(
        mockBids as T[],
        params.pageNo || 1,
        params.numOfRows || 10,
        100 // 총 100개의 Mock 데이터가 있다고 가정
      );
    }

    // 실제 API 호출
    try {
      const response: AxiosResponse<G2BApiResponse<T>> = await axios.get(url, {
        timeout: this.config.TIMEOUT,
        params: {
          serviceKey: this.config.SERVICE_KEY,
          type: 'json',
          ...params
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('G2B API 요청 오류:', error.message);
      throw new Error(`조달청 API 요청 실패: ${error.message}`);
    }
  }

  // 입찰공고 목록 조회
  async getBidList(params: BidSearchParams = {}): Promise<G2BApiResponse<BidInfo>> {
    const defaultParams = {
      pageNo: 1,
      numOfRows: 10,
      ...params
    };

    return this.makeRequest<BidInfo>(
      `${this.config.BID_INFO_URL}/getBidPblancListInfoServc`,
      defaultParams
    );
  }

  // 입찰공고 상세 조회
  async getBidDetail(bidNtceNo: string): Promise<G2BApiResponse<BidInfo>> {
    if (this.useMockData) {
      const mockBids = generateMockBidData();
      const bid = mockBids.find(b => b.bidNtceNo === bidNtceNo) || mockBids[0];
      return this.createMockResponse<BidInfo>([bid], 1, 1, 1);
    }

    return this.makeRequest<BidInfo>(
      `${this.config.BID_INFO_URL}/getBidPblancDetailInfoServc`,
      { bidNtceNo }
    );
  }

  // 계약 정보 목록 조회
  async getContractList(params: ContractSearchParams = {}): Promise<G2BApiResponse<ContractInfo>> {
    const defaultParams = {
      pageNo: 1,
      numOfRows: 10,
      ...params
    };

    // Mock 계약 데이터 생성
    if (this.useMockData) {
      const mockContracts: ContractInfo[] = [
        {
          cntrctNo: 'CTR-2024-001',
          cntrctNm: 'AI 시스템 구축 계약',
          dminsttNm: '과학기술정보통신부',
          cntrctMthdNm: '일반계약',
          cntrctPrce: '500000000',
          cntrctDt: '2024-06-15'
        }
      ];
      return this.createMockResponse<ContractInfo>(
        mockContracts,
        defaultParams.pageNo || 1,
        defaultParams.numOfRows || 10,
        1
      );
    }

    return this.makeRequest<ContractInfo>(
      `${this.config.CONTRACT_INFO_URL}/getCntrctInfoServc`,
      defaultParams
    );
  }

  // 계약 정보 상세 조회
  async getContractDetail(cntrctNo: string): Promise<G2BApiResponse<ContractInfo>> {
    if (this.useMockData) {
      const mockContract: ContractInfo = {
        cntrctNo: cntrctNo,
        cntrctNm: 'AI 시스템 구축 계약',
        dminsttNm: '과학기술정보통신부',
        cntrctMthdNm: '일반계약',
        cntrctPrce: '500000000',
        cntrctDt: '2024-06-15'
      };
      return this.createMockResponse<ContractInfo>([mockContract], 1, 1, 1);
    }

    return this.makeRequest<ContractInfo>(
      `${this.config.CONTRACT_INFO_URL}/getCntrctDetailInfoServc`,
      { cntrctNo }
    );
  }

  // 키워드로 입찰공고 검색
  async searchBidsByKeyword(keyword: string, params: BidSearchParams = {}): Promise<G2BApiResponse<BidInfo>> {
    if (this.useMockData) {
      const allMockBids = generateMockBidData();
      const filteredBids = allMockBids.filter(bid => 
        bid.bidNtceNm.toLowerCase().includes(keyword.toLowerCase()) ||
        bid.dminsttNm.toLowerCase().includes(keyword.toLowerCase())
      );
      return this.createMockResponse<BidInfo>(
        filteredBids,
        params.pageNo || 1,
        params.numOfRows || 10,
        filteredBids.length
      );
    }

    return this.getBidList({
      bidNtceNm: keyword,
      ...params
    });
  }

  // 기관별 입찰공고 조회
  async getBidsByInstitution(institutionName: string, params: BidSearchParams = {}): Promise<G2BApiResponse<BidInfo>> {
    if (this.useMockData) {
      const allMockBids = generateMockBidData();
      const filteredBids = allMockBids.filter(bid => 
        bid.dminsttNm.toLowerCase().includes(institutionName.toLowerCase())
      );
      return this.createMockResponse<BidInfo>(
        filteredBids,
        params.pageNo || 1,
        params.numOfRows || 10,
        filteredBids.length
      );
    }

    return this.getBidList({
      dminsttNm: institutionName,
      ...params
    });
  }

  // 날짜 범위로 입찰공고 조회
  async getBidsByDateRange(fromDate: string, toDate: string, params: BidSearchParams = {}): Promise<G2BApiResponse<BidInfo>> {
    if (this.useMockData) {
      const allMockBids = generateMockBidData();
      const filteredBids = allMockBids.filter(bid => {
        const bidDate = new Date(bid.bidNtceDt);
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return bidDate >= from && bidDate <= to;
      });
      return this.createMockResponse<BidInfo>(
        filteredBids,
        params.pageNo || 1,
        params.numOfRows || 10,
        filteredBids.length
      );
    }

    return this.getBidList({
      fromDt: fromDate,
      toDt: toDate,
      ...params
    });
  }

  // API 상태 확인
  async checkApiStatus(): Promise<boolean> {
    if (this.useMockData) {
      return true; // Mock 데이터 사용 시 항상 사용 가능
    }

    try {
      await this.makeRequest<BidInfo>(
        `${this.config.BID_INFO_URL}/getBidPblancListInfoServc`,
        { pageNo: 1, numOfRows: 1 }
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  // 설정 정보 조회
  getConfig(): Omit<G2BApiConfig, 'SERVICE_KEY'> {
    const { SERVICE_KEY, ...config } = this.config;
    return {
      ...config
    };
  }

  // Mock 데이터 사용 여부 확인
  isUsingMockData(): boolean {
    return this.useMockData;
  }
}

const g2bApiService = new G2BApiService();
export default g2bApiService;
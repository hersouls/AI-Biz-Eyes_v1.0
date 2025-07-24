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

class G2BApiService {
  private config: G2BApiConfig;

  constructor() {
    this.config = {
      BASE_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService',
      BID_INFO_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService',
      CONTRACT_INFO_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CntrctInfoService',
      SERVICE_KEY: process.env.G2B_SERVICE_KEY || 'test-key',
      TIMEOUT: 15000
    };
  }

  // 기본 API 요청 헬퍼 함수
  private async makeRequest<T>(
    url: string, 
    params: Record<string, any>
  ): Promise<G2BApiResponse<T>> {
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

    return this.makeRequest<ContractInfo>(
      `${this.config.CONTRACT_INFO_URL}/getCntrctInfoServc`,
      defaultParams
    );
  }

  // 계약 정보 상세 조회
  async getContractDetail(cntrctNo: string): Promise<G2BApiResponse<ContractInfo>> {
    return this.makeRequest<ContractInfo>(
      `${this.config.CONTRACT_INFO_URL}/getCntrctDetailInfoServc`,
      { cntrctNo }
    );
  }

  // 키워드로 입찰공고 검색
  async searchBidsByKeyword(keyword: string, params: BidSearchParams = {}): Promise<G2BApiResponse<BidInfo>> {
    return this.getBidList({
      bidNtceNm: keyword,
      ...params
    });
  }

  // 기관별 입찰공고 조회
  async getBidsByInstitution(institutionName: string, params: BidSearchParams = {}): Promise<G2BApiResponse<BidInfo>> {
    return this.getBidList({
      dminsttNm: institutionName,
      ...params
    });
  }

  // 날짜 범위로 입찰공고 조회
  async getBidsByDateRange(fromDate: string, toDate: string, params: BidSearchParams = {}): Promise<G2BApiResponse<BidInfo>> {
    return this.getBidList({
      fromDt: fromDate,
      toDt: toDate,
      ...params
    });
  }

  // API 상태 확인
  async checkApiStatus(): Promise<boolean> {
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
}

export default new G2BApiService();
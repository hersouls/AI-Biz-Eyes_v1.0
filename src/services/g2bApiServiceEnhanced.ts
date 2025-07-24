import axios, { AxiosResponse, AxiosError } from 'axios';
import { ExternalAPIError } from '../errors';

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

class G2BApiServiceEnhanced {
  private config: G2BApiConfig;
  private useMockData: boolean;

  constructor() {
    this.config = {
      BASE_URL: process.env.G2B_BASE_URL || 'https://apis.data.go.kr/1230000/BidPublicInfoService02',
      BID_INFO_URL: '/getBidPblancListInfoServc',
      CONTRACT_INFO_URL: '/getCntrctInfoServc',
      SERVICE_KEY: process.env.G2B_SERVICE_KEY || '',
      TIMEOUT: 10000
    };
    
    this.useMockData = !this.config.SERVICE_KEY || process.env.NODE_ENV === 'test';
  }

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

  private async makeRequest<T extends BidInfo | ContractInfo>(
    url: string, 
    params: Record<string, any>
  ): Promise<G2BApiResponse<T>> {
    try {
      const response: AxiosResponse<G2BApiResponse<T>> = await axios.get(url, {
        params: {
          ...params,
          serviceKey: this.config.SERVICE_KEY,
          type: 'json'
        },
        timeout: this.config.TIMEOUT
      });

      // API 응답 에러 체크
      if (response.data.response.header.resultCode !== '00') {
        throw new ExternalAPIError('조달청 API', {
          resultCode: response.data.response.header.resultCode,
          resultMsg: response.data.response.header.resultMsg,
          status: response.status
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof ExternalAPIError) {
        throw error;
      }

      const axiosError = error as AxiosError;
      
      // 네트워크 에러 처리
      if (axiosError.code === 'ENOTFOUND') {
        throw new ExternalAPIError('조달청 API', {
          error: 'DNS 조회 실패',
          code: axiosError.code,
          message: axiosError.message
        });
      }

      if (axiosError.code === 'ETIMEDOUT') {
        throw new ExternalAPIError('조달청 API', {
          error: '요청 시간 초과',
          code: axiosError.code,
          message: axiosError.message
        });
      }

      if (axiosError.code === 'ECONNREFUSED') {
        throw new ExternalAPIError('조달청 API', {
          error: '연결 거부',
          code: axiosError.code,
          message: axiosError.message
        });
      }

      // HTTP 상태 코드 에러 처리
      if (axiosError.response) {
        const status = axiosError.response.status;
        let errorMessage = '알 수 없는 오류';
        
        switch (status) {
          case 400:
            errorMessage = '잘못된 요청';
            break;
          case 401:
            errorMessage = '인증 실패';
            break;
          case 403:
            errorMessage = '접근 권한 없음';
            break;
          case 404:
            errorMessage = 'API 엔드포인트를 찾을 수 없음';
            break;
          case 429:
            errorMessage = '요청 한도 초과';
            break;
          case 500:
            errorMessage = '서버 내부 오류';
            break;
          case 502:
            errorMessage = '게이트웨이 오류';
            break;
          case 503:
            errorMessage = '서비스 일시적 사용 불가';
            break;
        }

        throw new ExternalAPIError('조달청 API', {
          status,
          error: errorMessage,
          data: axiosError.response.data
        });
      }

      // 기타 에러
      throw new ExternalAPIError('조달청 API', {
        error: '알 수 없는 오류',
        message: axiosError.message,
        code: axiosError.code
      });
    }
  }

  async getBidList(params: BidSearchParams = {}): Promise<G2BApiResponse<BidInfo>> {
    if (this.useMockData) {
      // Mock 데이터 반환
      const mockBids: BidInfo[] = [
        {
          bidNtceNo: '2024-001',
          bidNtceNm: '2024년 AI 기술개발사업',
          dminsttNm: '과학기술정보통신부',
          bidMethdNm: '일반입찰',
          presmptPrce: '500000000',
          bidNtceDt: '2024-07-01',
          opengDt: '2024-08-15'
        }
      ];
      return this.createMockResponse(mockBids, params.pageNo || 1, params.numOfRows || 10, 1);
    }

    const url = `${this.config.BASE_URL}${this.config.BID_INFO_URL}`;
    return this.makeRequest<BidInfo>(url, params);
  }

  async getBidDetail(bidNtceNo: string): Promise<G2BApiResponse<BidInfo>> {
    if (this.useMockData) {
      const mockBid: BidInfo = {
        bidNtceNo,
        bidNtceNm: '2024년 AI 기술개발사업',
        dminsttNm: '과학기술정보통신부',
        bidMethdNm: '일반입찰',
        presmptPrce: '500000000',
        bidNtceDt: '2024-07-01',
        opengDt: '2024-08-15'
      };
      return this.createMockResponse([mockBid], 1, 1, 1);
    }

    const url = `${this.config.BASE_URL}${this.config.BID_INFO_URL}`;
    return this.makeRequest<BidInfo>(url, { bidNtceNo });
  }

  async getContractList(params: ContractSearchParams = {}): Promise<G2BApiResponse<ContractInfo>> {
    if (this.useMockData) {
      const mockContracts: ContractInfo[] = [
        {
          cntrctNo: '2024-CON-001',
          cntrctNm: 'AI 기술개발 계약',
          dminsttNm: '과학기술정보통신부',
          cntrctMthdNm: '일반계약',
          cntrctPrce: '450000000',
          cntrctDt: '2024-06-15'
        }
      ];
      return this.createMockResponse(mockContracts, params.pageNo || 1, params.numOfRows || 10, 1);
    }

    const url = `${this.config.BASE_URL}${this.config.CONTRACT_INFO_URL}`;
    return this.makeRequest<ContractInfo>(url, params);
  }

  async getContractDetail(cntrctNo: string): Promise<G2BApiResponse<ContractInfo>> {
    if (this.useMockData) {
      const mockContract: ContractInfo = {
        cntrctNo,
        cntrctNm: 'AI 기술개발 계약',
        dminsttNm: '과학기술정보통신부',
        cntrctMthdNm: '일반계약',
        cntrctPrce: '450000000',
        cntrctDt: '2024-06-15'
      };
      return this.createMockResponse([mockContract], 1, 1, 1);
    }

    const url = `${this.config.BASE_URL}${this.config.CONTRACT_INFO_URL}`;
    return this.makeRequest<ContractInfo>(url, { cntrctNo });
  }

  async checkApiStatus(): Promise<boolean> {
    try {
      if (this.useMockData) {
        return true;
      }

      const url = `${this.config.BASE_URL}${this.config.BID_INFO_URL}`;
      await this.makeRequest<BidInfo>(url, { pageNo: 1, numOfRows: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }

  getConfig(): Omit<G2BApiConfig, 'SERVICE_KEY'> {
    const { SERVICE_KEY, ...config } = this.config;
    return config;
  }

  isUsingMockData(): boolean {
    return this.useMockData;
  }
}

export default new G2BApiServiceEnhanced();
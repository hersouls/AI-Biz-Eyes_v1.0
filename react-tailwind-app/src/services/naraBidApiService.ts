import { ApiResponse, PaginatedResponse } from '../types/integration';

// 나라장터 입찰공고정보 API 타입 정의
export interface NaraBidRequest {
  serviceKey: string;
  pageNo?: number;
  numOfRows?: number;
  inqryDiv?: string;
  inqryBgnDt?: string;
  inqryEndDt?: string;
  dminsttNm?: string;
  presmptPrceBgn?: number;
  presmptPrceEnd?: number;
  bidNtceNm?: string;
  dminsttCd?: string;
  type?: string;
}

export interface NaraBidItem {
  bidNtceNo: string;           // 입찰공고번호
  bidNtceNm: string;           // 입찰공고명
  dminsttNm: string;           // 수요기관명
  bidNtceDt: string;           // 입찰공고일시
  opengDt: string;             // 개찰일시
  presmptPrce: number;         // 추정가격
  bidwinnrNm?: string;         // 낙찰자명
  bidwinnrPrce?: number;       // 낙찰가격
  bidNtceUrl?: string;         // 입찰공고 URL
  opengPlce?: string;          // 개찰장소
  presnatnOprtnPlce?: string;  // 제출서류 접수장소
  bidMethd?: string;           // 입찰방식
  bidPblancNm?: string;        // 입찰공고기관명
}

export interface NaraBidResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: NaraBidItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 나라장터 API 설정
const NARA_API_CONFIG = {
  baseUrl: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  serviceKey: {
    encoding: 'w8uFE%2fALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM%2FqByWrt9gZ406%2FITajbX1Q8%2FESHI1LDoADaTMcg%3D%3D',
    decoding: 'w8uFE+fALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM/qByWrt9gZ406/ITajbX1Q8/ESHI1LDoADaTMcg=='
  },
  endpoints: {
    getBidList: '/getBidPblancListInfoServc',      // 입찰공고 목록 조회
    getBidDetail: '/getBidPblancDtlInfoServc',     // 입찰공고 상세 조회
    getBidResult: '/getBidPblancRltInfoServc'      // 입찰결과 조회
  }
};

class NaraBidApiService {
  private async request<T>(endpoint: string, params: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(NARA_API_CONFIG.baseUrl + endpoint);
      
      // 기본 파라미터 설정
      const defaultParams = {
        serviceKey: NARA_API_CONFIG.serviceKey.encoding,
        type: 'json',
        ...params
      };

      // URL 파라미터 추가
      Object.entries(defaultParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        message: 'API 호출 성공'
      };
    } catch (error) {
      console.error('NaraBidApiService request error:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 입찰공고 목록 조회
   */
  async getBidList(params: Omit<NaraBidRequest, 'serviceKey'> = {}): Promise<ApiResponse<NaraBidResponse>> {
    const defaultParams = {
      pageNo: 1,
      numOfRows: 10,
      inqryDiv: '1', // 1: 전체, 2: 입찰공고, 3: 입찰결과
      ...params
    };

    return this.request<NaraBidResponse>(
      NARA_API_CONFIG.endpoints.getBidList,
      defaultParams
    );
  }

  /**
   * 입찰공고 상세 조회
   */
  async getBidDetail(bidNtceNo: string): Promise<ApiResponse<NaraBidResponse>> {
    return this.request<NaraBidResponse>(
      NARA_API_CONFIG.endpoints.getBidDetail,
      { bidNtceNo }
    );
  }

  /**
   * 입찰결과 조회
   */
  async getBidResult(params: Omit<NaraBidRequest, 'serviceKey'> = {}): Promise<ApiResponse<NaraBidResponse>> {
    const defaultParams = {
      pageNo: 1,
      numOfRows: 10,
      inqryDiv: '3', // 입찰결과
      ...params
    };

    return this.request<NaraBidResponse>(
      NARA_API_CONFIG.endpoints.getBidResult,
      defaultParams
    );
  }

  /**
   * 기관별 입찰공고 조회
   */
  async getBidListByInstitution(dminsttNm: string, params: Omit<NaraBidRequest, 'serviceKey'> = {}): Promise<ApiResponse<NaraBidResponse>> {
    return this.request<NaraBidResponse>(
      NARA_API_CONFIG.endpoints.getBidList,
      {
        ...params,
        dminsttNm
      }
    );
  }

  /**
   * 날짜 범위로 입찰공고 조회
   */
  async getBidListByDateRange(
    inqryBgnDt: string, 
    inqryEndDt: string, 
    params: Omit<NaraBidRequest, 'serviceKey'> = {}
  ): Promise<ApiResponse<NaraBidResponse>> {
    return this.request<NaraBidResponse>(
      NARA_API_CONFIG.endpoints.getBidList,
      {
        ...params,
        inqryBgnDt,
        inqryEndDt
      }
    );
  }

  /**
   * 추정가격 범위로 입찰공고 조회
   */
  async getBidListByPriceRange(
    presmptPrceBgn: number,
    presmptPrceEnd: number,
    params: Omit<NaraBidRequest, 'serviceKey'> = {}
  ): Promise<ApiResponse<NaraBidResponse>> {
    return this.request<NaraBidResponse>(
      NARA_API_CONFIG.endpoints.getBidList,
      {
        ...params,
        presmptPrceBgn,
        presmptPrceEnd
      }
    );
  }

  /**
   * 키워드로 입찰공고 검색
   */
  async searchBidByKeyword(
    bidNtceNm: string,
    params: Omit<NaraBidRequest, 'serviceKey'> = {}
  ): Promise<ApiResponse<NaraBidResponse>> {
    return this.request<NaraBidResponse>(
      NARA_API_CONFIG.endpoints.getBidList,
      {
        ...params,
        bidNtceNm
      }
    );
  }

  /**
   * API 연결 테스트
   */
  async testConnection(): Promise<ApiResponse<any>> {
    return this.getBidList({ pageNo: 1, numOfRows: 1 });
  }
}

// 싱글톤 인스턴스 생성
export const naraBidApiService = new NaraBidApiService();

export default naraBidApiService;
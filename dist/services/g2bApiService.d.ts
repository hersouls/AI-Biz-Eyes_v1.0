export interface G2BApiConfig {
    BASE_URL: string;
    BID_INFO_URL: string;
    CONTRACT_INFO_URL: string;
    SERVICE_KEY: string;
    TIMEOUT: number;
}
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
export interface BidInfo {
    bidNtceNo: string;
    bidNtceNm: string;
    dminsttNm: string;
    bidMethdNm: string;
    presmptPrce: string;
    bidNtceDt: string;
    opengDt: string;
    bidwinnrNm?: string;
    bidwinnrPrce?: string;
    bidNtceUrl?: string;
    dminsttUrl?: string;
}
export interface ContractInfo {
    cntrctNo: string;
    cntrctNm: string;
    dminsttNm: string;
    cntrctMthdNm: string;
    cntrctPrce: string;
    cntrctDt: string;
    cntrctUrl?: string;
}
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
declare class G2BApiService {
    private config;
    private useMockData;
    constructor();
    private createMockResponse;
    private makeRequest;
    getBidList(params?: BidSearchParams): Promise<G2BApiResponse<BidInfo>>;
    getBidDetail(bidNtceNo: string): Promise<G2BApiResponse<BidInfo>>;
    getContractList(params?: ContractSearchParams): Promise<G2BApiResponse<ContractInfo>>;
    getContractDetail(cntrctNo: string): Promise<G2BApiResponse<ContractInfo>>;
    searchBidsByKeyword(keyword: string, params?: BidSearchParams): Promise<G2BApiResponse<BidInfo>>;
    getBidsByInstitution(institutionName: string, params?: BidSearchParams): Promise<G2BApiResponse<BidInfo>>;
    getBidsByDateRange(fromDate: string, toDate: string, params?: BidSearchParams): Promise<G2BApiResponse<BidInfo>>;
    checkApiStatus(): Promise<boolean>;
    getConfig(): Omit<G2BApiConfig, 'SERVICE_KEY'>;
    isUsingMockData(): boolean;
}
declare const g2bApiService: G2BApiService;
export default g2bApiService;
//# sourceMappingURL=g2bApiService.d.ts.map
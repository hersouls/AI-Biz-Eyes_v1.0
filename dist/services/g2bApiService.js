"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const generateMockBidData = (pageNo = 1, numOfRows = 10) => {
    const mockBids = [
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
    const startIndex = (pageNo - 1) * numOfRows;
    const endIndex = startIndex + numOfRows;
    return mockBids.slice(startIndex, endIndex);
};
class G2BApiService {
    constructor() {
        this.config = {
            BASE_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService',
            BID_INFO_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService',
            CONTRACT_INFO_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CntrctInfoService',
            SERVICE_KEY: process.env.G2B_SERVICE_KEY || 'test-key',
            TIMEOUT: 15000
        };
        this.useMockData = !process.env.G2B_SERVICE_KEY || process.env.G2B_SERVICE_KEY === 'test-key' || process.env.G2B_SERVICE_KEY === 'your-g2b-service-key-here';
    }
    createMockResponse(items, pageNo, numOfRows, totalCount) {
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
    async makeRequest(url, params) {
        if (this.useMockData) {
            console.log('Using Mock Data for G2B API');
            const mockBids = generateMockBidData(params.pageNo || 1, params.numOfRows || 10);
            return this.createMockResponse(mockBids, params.pageNo || 1, params.numOfRows || 10, 100);
        }
        try {
            const response = await axios_1.default.get(url, {
                timeout: this.config.TIMEOUT,
                params: {
                    serviceKey: this.config.SERVICE_KEY,
                    type: 'json',
                    ...params
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('G2B API 요청 오류:', error.message);
            throw new Error(`조달청 API 요청 실패: ${error.message}`);
        }
    }
    async getBidList(params = {}) {
        const defaultParams = {
            pageNo: 1,
            numOfRows: 10,
            ...params
        };
        return this.makeRequest(`${this.config.BID_INFO_URL}/getBidPblancListInfoServc`, defaultParams);
    }
    async getBidDetail(bidNtceNo) {
        if (this.useMockData) {
            const mockBids = generateMockBidData();
            const bid = mockBids.find(b => b.bidNtceNo === bidNtceNo) || mockBids[0];
            return this.createMockResponse([bid], 1, 1, 1);
        }
        return this.makeRequest(`${this.config.BID_INFO_URL}/getBidPblancDetailInfoServc`, { bidNtceNo });
    }
    async getContractList(params = {}) {
        const defaultParams = {
            pageNo: 1,
            numOfRows: 10,
            ...params
        };
        if (this.useMockData) {
            const mockContracts = [
                {
                    cntrctNo: 'CTR-2024-001',
                    cntrctNm: 'AI 시스템 구축 계약',
                    dminsttNm: '과학기술정보통신부',
                    cntrctMthdNm: '일반계약',
                    cntrctPrce: '500000000',
                    cntrctDt: '2024-06-15'
                }
            ];
            return this.createMockResponse(mockContracts, defaultParams.pageNo || 1, defaultParams.numOfRows || 10, 1);
        }
        return this.makeRequest(`${this.config.CONTRACT_INFO_URL}/getCntrctInfoServc`, defaultParams);
    }
    async getContractDetail(cntrctNo) {
        if (this.useMockData) {
            const mockContract = {
                cntrctNo: cntrctNo,
                cntrctNm: 'AI 시스템 구축 계약',
                dminsttNm: '과학기술정보통신부',
                cntrctMthdNm: '일반계약',
                cntrctPrce: '500000000',
                cntrctDt: '2024-06-15'
            };
            return this.createMockResponse([mockContract], 1, 1, 1);
        }
        return this.makeRequest(`${this.config.CONTRACT_INFO_URL}/getCntrctDetailInfoServc`, { cntrctNo });
    }
    async searchBidsByKeyword(keyword, params = {}) {
        if (this.useMockData) {
            const allMockBids = generateMockBidData();
            const filteredBids = allMockBids.filter(bid => bid.bidNtceNm.toLowerCase().includes(keyword.toLowerCase()) ||
                bid.dminsttNm.toLowerCase().includes(keyword.toLowerCase()));
            return this.createMockResponse(filteredBids, params.pageNo || 1, params.numOfRows || 10, filteredBids.length);
        }
        return this.getBidList({
            bidNtceNm: keyword,
            ...params
        });
    }
    async getBidsByInstitution(institutionName, params = {}) {
        if (this.useMockData) {
            const allMockBids = generateMockBidData();
            const filteredBids = allMockBids.filter(bid => bid.dminsttNm.toLowerCase().includes(institutionName.toLowerCase()));
            return this.createMockResponse(filteredBids, params.pageNo || 1, params.numOfRows || 10, filteredBids.length);
        }
        return this.getBidList({
            dminsttNm: institutionName,
            ...params
        });
    }
    async getBidsByDateRange(fromDate, toDate, params = {}) {
        if (this.useMockData) {
            const allMockBids = generateMockBidData();
            const filteredBids = allMockBids.filter(bid => {
                const bidDate = new Date(bid.bidNtceDt);
                const from = new Date(fromDate);
                const to = new Date(toDate);
                return bidDate >= from && bidDate <= to;
            });
            return this.createMockResponse(filteredBids, params.pageNo || 1, params.numOfRows || 10, filteredBids.length);
        }
        return this.getBidList({
            fromDt: fromDate,
            toDt: toDate,
            ...params
        });
    }
    async checkApiStatus() {
        if (this.useMockData) {
            return true;
        }
        try {
            await this.makeRequest(`${this.config.BID_INFO_URL}/getBidPblancListInfoServc`, { pageNo: 1, numOfRows: 1 });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    getConfig() {
        const { SERVICE_KEY, ...config } = this.config;
        return {
            ...config
        };
    }
    isUsingMockData() {
        return this.useMockData;
    }
}
const g2bApiService = new G2BApiService();
exports.default = g2bApiService;
//# sourceMappingURL=g2bApiService.js.map
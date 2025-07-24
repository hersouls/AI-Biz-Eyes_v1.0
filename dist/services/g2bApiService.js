"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class G2BApiService {
    constructor() {
        this.config = {
            BASE_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService',
            BID_INFO_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService',
            CONTRACT_INFO_URL: 'https://openapi.g2b.go.kr/openapi/service/rest/CntrctInfoService',
            SERVICE_KEY: process.env.G2B_SERVICE_KEY || 'test-key',
            TIMEOUT: 15000
        };
    }
    async makeRequest(url, params) {
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
        return this.makeRequest(`${this.config.BID_INFO_URL}/getBidPblancDetailInfoServc`, { bidNtceNo });
    }
    async getContractList(params = {}) {
        const defaultParams = {
            pageNo: 1,
            numOfRows: 10,
            ...params
        };
        return this.makeRequest(`${this.config.CONTRACT_INFO_URL}/getCntrctInfoServc`, defaultParams);
    }
    async getContractDetail(cntrctNo) {
        return this.makeRequest(`${this.config.CONTRACT_INFO_URL}/getCntrctDetailInfoServc`, { cntrctNo });
    }
    async searchBidsByKeyword(keyword, params = {}) {
        return this.getBidList({
            bidNtceNm: keyword,
            ...params
        });
    }
    async getBidsByInstitution(institutionName, params = {}) {
        return this.getBidList({
            dminsttNm: institutionName,
            ...params
        });
    }
    async getBidsByDateRange(fromDate, toDate, params = {}) {
        return this.getBidList({
            fromDt: fromDate,
            toDt: toDate,
            ...params
        });
    }
    async checkApiStatus() {
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
}
exports.default = new G2BApiService();
//# sourceMappingURL=g2bApiService.js.map
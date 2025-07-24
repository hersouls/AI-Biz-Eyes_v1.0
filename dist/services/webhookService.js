"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class WebhookService {
    constructor() {
        this.webhookUrl = process.env.WEBHOOK_URL || '';
        this.apiKey = process.env.WEBHOOK_API_KEY || '';
        if (!this.webhookUrl) {
            throw new Error('WEBHOOK_URL이 설정되지 않았습니다.');
        }
    }
    async sendG2BData(data, metadata) {
        try {
            const payload = {
                timestamp: new Date().toISOString(),
                source: 'G2B_API',
                data: data,
                metadata: metadata
            };
            const response = await axios_1.default.post(this.webhookUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'User-Agent': 'G2B-Webhook-Service/1.0'
                },
                timeout: 30000
            });
            console.log(`✅ Webhook 전송 성공: ${response.status} ${response.statusText}`);
            return true;
        }
        catch (error) {
            console.error('❌ Webhook 전송 실패:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('응답 상태:', error.response?.status);
                console.error('응답 데이터:', error.response?.data);
            }
            return false;
        }
    }
    async sendBidNoticeData(bidData) {
        const metadata = {
            type: 'bid_notice',
            totalCount: bidData.totalCount,
            pageNo: bidData.pageNo,
            numOfRows: bidData.numOfRows
        };
        return this.sendG2BData(bidData, metadata);
    }
    async sendPreNoticeData(preNoticeData) {
        const metadata = {
            type: 'pre_notice',
            totalCount: preNoticeData.totalCount,
            pageNo: preNoticeData.pageNo,
            numOfRows: preNoticeData.numOfRows
        };
        return this.sendG2BData(preNoticeData, metadata);
    }
    async sendContractData(contractData) {
        const metadata = {
            type: 'contract_status',
            totalCount: contractData.totalCount,
            pageNo: contractData.pageNo,
            numOfRows: contractData.numOfRows
        };
        return this.sendG2BData(contractData, metadata);
    }
    async testConnection() {
        const testPayload = {
            timestamp: new Date().toISOString(),
            source: 'G2B_API_TEST',
            message: 'Webhook 연결 테스트',
            data: {
                test: true,
                timestamp: new Date().toISOString()
            }
        };
        try {
            const response = await axios_1.default.post(this.webhookUrl, testPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'User-Agent': 'G2B-Webhook-Service/1.0'
                },
                timeout: 10000
            });
            console.log(`✅ Webhook 연결 테스트 성공: ${response.status}`);
            return true;
        }
        catch (error) {
            console.error('❌ Webhook 연결 테스트 실패:', error);
            return false;
        }
    }
}
exports.WebhookService = WebhookService;
exports.default = WebhookService;
//# sourceMappingURL=webhookService.js.map
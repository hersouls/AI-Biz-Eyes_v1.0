import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface WebhookPayload {
  timestamp: string;
  source: string;
  data: any;
  metadata?: {
    totalCount?: number;
    pageNo?: number;
    numOfRows?: number;
  };
}

export class WebhookService {
  private webhookUrl: string;
  private apiKey: string;

  constructor() {
    this.webhookUrl = process.env.WEBHOOK_URL || '';
    this.apiKey = process.env.WEBHOOK_API_KEY || '';
    
    if (!this.webhookUrl) {
      throw new Error('WEBHOOK_URL이 설정되지 않았습니다.');
    }
  }

  /**
   * 조달청 API 데이터를 webhook으로 전송
   */
  async sendG2BData(data: any, metadata?: any): Promise<boolean> {
    try {
      const payload: WebhookPayload = {
        timestamp: new Date().toISOString(),
        source: 'G2B_API',
        data: data,
        metadata: metadata
      };

      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'G2B-Webhook-Service/1.0'
        },
        timeout: 30000 // 30초 타임아웃
      });

      console.log(`✅ Webhook 전송 성공: ${response.status} ${response.statusText}`);
      return true;
    } catch (error) {
      console.error('❌ Webhook 전송 실패:', error);
      if (axios.isAxiosError(error)) {
        console.error('응답 상태:', error.response?.status);
        console.error('응답 데이터:', error.response?.data);
      }
      return false;
    }
  }

  /**
   * 입찰공고 데이터를 webhook으로 전송
   */
  async sendBidNoticeData(bidData: any): Promise<boolean> {
    const metadata = {
      type: 'bid_notice',
      totalCount: bidData.totalCount,
      pageNo: bidData.pageNo,
      numOfRows: bidData.numOfRows
    };

    return this.sendG2BData(bidData, metadata);
  }

  /**
   * 사전공고 데이터를 webhook으로 전송
   */
  async sendPreNoticeData(preNoticeData: any): Promise<boolean> {
    const metadata = {
      type: 'pre_notice',
      totalCount: preNoticeData.totalCount,
      pageNo: preNoticeData.pageNo,
      numOfRows: preNoticeData.numOfRows
    };

    return this.sendG2BData(preNoticeData, metadata);
  }

  /**
   * 계약현황 데이터를 webhook으로 전송
   */
  async sendContractData(contractData: any): Promise<boolean> {
    const metadata = {
      type: 'contract_status',
      totalCount: contractData.totalCount,
      pageNo: contractData.pageNo,
      numOfRows: contractData.numOfRows
    };

    return this.sendG2BData(contractData, metadata);
  }

  /**
   * Webhook 연결 테스트
   */
  async testConnection(): Promise<boolean> {
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
      const response = await axios.post(this.webhookUrl, testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'G2B-Webhook-Service/1.0'
        },
        timeout: 10000
      });

      console.log(`✅ Webhook 연결 테스트 성공: ${response.status}`);
      return true;
    } catch (error) {
      console.error('❌ Webhook 연결 테스트 실패:', error);
      return false;
    }
  }
}

export default WebhookService;
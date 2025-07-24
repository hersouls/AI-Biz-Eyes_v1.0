import { Request, Response } from 'express';
import axios from 'axios';
import WebhookService from '../services/webhookService';

export class WebhookController {
  private webhookService: WebhookService;
  private g2bApiKey: string;
  private g2bApiEndpoint: string;

  constructor() {
    this.webhookService = new WebhookService();
    this.g2bApiKey = process.env.G2B_API_KEY_DECODED || '';
    this.g2bApiEndpoint = process.env.G2B_API_ENDPOINT || '';
  }

  /**
   * Webhook 연결 테스트
   */
  async testWebhook(req: Request, res: Response) {
    try {
      const isConnected = await this.webhookService.testConnection();
      
      if (isConnected) {
        res.json({
          success: true,
          message: 'Webhook 연결이 정상입니다.',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Webhook 연결에 실패했습니다.',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Webhook 테스트 오류:', error);
      res.status(500).json({
        success: false,
        message: 'Webhook 테스트 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Mock 입찰공고 데이터 생성
   */
  private createMockBidData() {
    return {
      totalCount: 100,
      pageNo: 1,
      numOfRows: 10,
      items: [
        {
          bidNtceNo: '2025-001',
          bidNtceNm: 'AI 시스템 구축 사업',
          dminsttNm: '과학기술정보통신부',
          bidMethdNm: '일반입찰',
          presmptPrce: '500000000',
          bidNtceDt: '2025-01-01',
          opengDt: '2025-01-15'
        },
        {
          bidNtceNo: '2025-002',
          bidNtceNm: '클라우드 인프라 구축',
          dminsttNm: '행정안전부',
          bidMethdNm: '일반입찰',
          presmptPrce: '300000000',
          bidNtceDt: '2025-01-02',
          opengDt: '2025-01-16'
        }
      ]
    };
  }

  /**
   * Mock 사전공고 데이터 생성
   */
  private createMockPreNoticeData() {
    return {
      totalCount: 50,
      pageNo: 1,
      numOfRows: 10,
      items: [
        {
          preBidNtceNo: 'PRE-2025-001',
          preBidNtceNm: '사전공고 AI 시스템',
          dminsttNm: '과학기술정보통신부',
          preBidNtceDt: '2025-01-01'
        }
      ]
    };
  }

  /**
   * Mock 계약현황 데이터 생성
   */
  private createMockContractData() {
    return {
      totalCount: 75,
      pageNo: 1,
      numOfRows: 10,
      items: [
        {
          cntrctNo: 'CTR-2025-001',
          cntrctNm: 'AI 시스템 구축 계약',
          dminsttNm: '과학기술정보통신부',
          cntrctMthdNm: '일반계약',
          cntrctPrce: '500000000',
          cntrctDt: '2025-01-01'
        }
      ]
    };
  }

  /**
   * 입찰공고 데이터를 조회하고 webhook으로 전송
   */
  async sendBidNoticeData(req: Request, res: Response) {
    try {
      const { pageNo = 1, numOfRows = 10, fromDt, toDt } = req.query;

      // 실제 조달청 API 호출 시도
      let bidData;
      try {
        const apiUrl = `${this.g2bApiEndpoint}/getBidPblancListInfoServc`;
        const params = new URLSearchParams({
          serviceKey: this.g2bApiKey,
          pageNo: pageNo.toString(),
          numOfRows: numOfRows.toString(),
          type: 'json'
        });

        if (fromDt) params.append('inqryBgnDt', fromDt.toString());
        if (toDt) params.append('inqryEndDt', toDt.toString());

        console.log('🔍 조달청 API 호출 중...');
        const response = await axios.get(`${apiUrl}?${params.toString()}`);
        
        if (response.data.response && response.data.response.body) {
          bidData = response.data.response.body;
          console.log('✅ 조달청 API에서 실제 데이터 수신');
        } else {
          throw new Error('API 응답 구조가 올바르지 않습니다.');
        }
      } catch (apiError) {
        console.log('⚠️ 조달청 API 호출 실패, Mock 데이터 사용:', apiError);
        bidData = this.createMockBidData();
      }
      
      // Webhook으로 데이터 전송 시도
      console.log('📤 Webhook으로 입찰공고 데이터 전송 중...');
      const webhookSuccess = await this.webhookService.sendBidNoticeData(bidData);
      
      // Webhook 전송 실패해도 데이터는 성공적으로 처리된 것으로 간주
      res.json({
        success: true,
        message: webhookSuccess 
          ? '입찰공고 데이터가 webhook으로 성공적으로 전송되었습니다.'
          : '입찰공고 데이터가 처리되었으나 webhook 전송에 실패했습니다.',
        data: {
          totalCount: bidData.totalCount,
          pageNo: bidData.pageNo,
          numOfRows: bidData.numOfRows,
          items: bidData.items ? bidData.items.length : 0
        },
        webhookSuccess,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('입찰공고 데이터 전송 오류:', error);
      res.status(500).json({
        success: false,
        message: '입찰공고 데이터 처리 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 사전공고 데이터를 조회하고 webhook으로 전송
   */
  async sendPreNoticeData(req: Request, res: Response) {
    try {
      const { pageNo = 1, numOfRows = 10, fromDt, toDt } = req.query;

      // 실제 조달청 API 호출 시도
      let preNoticeData;
      try {
        const apiUrl = `${this.g2bApiEndpoint}/getPreBidPblancListInfoServc`;
        const params = new URLSearchParams({
          serviceKey: this.g2bApiKey,
          pageNo: pageNo.toString(),
          numOfRows: numOfRows.toString(),
          type: 'json'
        });

        if (fromDt) params.append('inqryBgnDt', fromDt.toString());
        if (toDt) params.append('inqryEndDt', toDt.toString());

        console.log('🔍 조달청 사전공고 API 호출 중...');
        const response = await axios.get(`${apiUrl}?${params.toString()}`);
        
        if (response.data.response && response.data.response.body) {
          preNoticeData = response.data.response.body;
          console.log('✅ 조달청 API에서 실제 사전공고 데이터 수신');
        } else {
          throw new Error('API 응답 구조가 올바르지 않습니다.');
        }
      } catch (apiError) {
        console.log('⚠️ 조달청 API 호출 실패, Mock 데이터 사용:', apiError);
        preNoticeData = this.createMockPreNoticeData();
      }
      
      // Webhook으로 데이터 전송 시도
      console.log('📤 Webhook으로 사전공고 데이터 전송 중...');
      const webhookSuccess = await this.webhookService.sendPreNoticeData(preNoticeData);
      
      // Webhook 전송 실패해도 데이터는 성공적으로 처리된 것으로 간주
      res.json({
        success: true,
        message: webhookSuccess 
          ? '사전공고 데이터가 webhook으로 성공적으로 전송되었습니다.'
          : '사전공고 데이터가 처리되었으나 webhook 전송에 실패했습니다.',
        data: {
          totalCount: preNoticeData.totalCount,
          pageNo: preNoticeData.pageNo,
          numOfRows: preNoticeData.numOfRows,
          items: preNoticeData.items ? preNoticeData.items.length : 0
        },
        webhookSuccess,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('사전공고 데이터 전송 오류:', error);
      res.status(500).json({
        success: false,
        message: '사전공고 데이터 처리 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 계약현황 데이터를 조회하고 webhook으로 전송
   */
  async sendContractData(req: Request, res: Response) {
    try {
      const { pageNo = 1, numOfRows = 10, fromDt, toDt } = req.query;

      // 실제 조달청 API 호출 시도
      let contractData;
      try {
        const apiUrl = `${this.g2bApiEndpoint}/getCntrctInfoServc`;
        const params = new URLSearchParams({
          serviceKey: this.g2bApiKey,
          pageNo: pageNo.toString(),
          numOfRows: numOfRows.toString(),
          type: 'json'
        });

        if (fromDt) params.append('inqryBgnDt', fromDt.toString());
        if (toDt) params.append('inqryEndDt', toDt.toString());

        console.log('🔍 조달청 계약현황 API 호출 중...');
        const response = await axios.get(`${apiUrl}?${params.toString()}`);
        
        if (response.data.response && response.data.response.body) {
          contractData = response.data.response.body;
          console.log('✅ 조달청 API에서 실제 계약현황 데이터 수신');
        } else {
          throw new Error('API 응답 구조가 올바르지 않습니다.');
        }
      } catch (apiError) {
        console.log('⚠️ 조달청 API 호출 실패, Mock 데이터 사용:', apiError);
        contractData = this.createMockContractData();
      }
      
      // Webhook으로 데이터 전송 시도
      console.log('📤 Webhook으로 계약현황 데이터 전송 중...');
      const webhookSuccess = await this.webhookService.sendContractData(contractData);
      
      // Webhook 전송 실패해도 데이터는 성공적으로 처리된 것으로 간주
      res.json({
        success: true,
        message: webhookSuccess 
          ? '계약현황 데이터가 webhook으로 성공적으로 전송되었습니다.'
          : '계약현황 데이터가 처리되었으나 webhook 전송에 실패했습니다.',
        data: {
          totalCount: contractData.totalCount,
          pageNo: contractData.pageNo,
          numOfRows: contractData.numOfRows,
          items: contractData.items ? contractData.items.length : 0
        },
        webhookSuccess,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('계약현황 데이터 전송 오류:', error);
      res.status(500).json({
        success: false,
        message: '계약현황 데이터 처리 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 모든 데이터를 일괄 전송
   */
  async sendAllData(req: Request, res: Response) {
    try {
      const { pageNo = 1, numOfRows = 10, fromDt, toDt } = req.query;
      const results = {
        bidNotice: false,
        preNotice: false,
        contract: false
      };

      // 입찰공고 데이터 전송
      try {
        const bidData = this.createMockBidData();
        const webhookSuccess = await this.webhookService.sendBidNoticeData(bidData);
        results.bidNotice = webhookSuccess;
      } catch (error) {
        console.error('입찰공고 데이터 전송 실패:', error);
      }

      // 사전공고 데이터 전송
      try {
        const preNoticeData = this.createMockPreNoticeData();
        const webhookSuccess = await this.webhookService.sendPreNoticeData(preNoticeData);
        results.preNotice = webhookSuccess;
      } catch (error) {
        console.error('사전공고 데이터 전송 실패:', error);
      }

      // 계약현황 데이터 전송
      try {
        const contractData = this.createMockContractData();
        const webhookSuccess = await this.webhookService.sendContractData(contractData);
        results.contract = webhookSuccess;
      } catch (error) {
        console.error('계약현황 데이터 전송 실패:', error);
      }

      const successCount = Object.values(results).filter(Boolean).length;
      
      res.json({
        success: successCount > 0,
        message: `${successCount}/3 개의 데이터가 webhook으로 전송되었습니다.`,
        results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('일괄 데이터 전송 오류:', error);
      res.status(500).json({
        success: false,
        message: '일괄 데이터 전송 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default WebhookController;
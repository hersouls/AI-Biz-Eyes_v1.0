const fetch = require('node-fetch');

// 나라장터 API 설정
const NARA_API_CONFIG = {
  baseUrl: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  serviceKey: 'w8uFE+fALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM/qByWrt9gZ406/ITajbX1Q8/ESHI1LDoADaTMcg==',
  endpoints: {
    getBidList: '/getBidPblancListInfoServc',
    getBidDetail: '/getBidPblancDtlInfoServc',
    getBidResult: '/getBidPblancRltInfoServc'
  }
};

class NaraApiDebugger {
  constructor() {
    this.baseUrl = NARA_API_CONFIG.baseUrl;
    this.serviceKey = NARA_API_CONFIG.serviceKey;
  }

  async testEndpoint(endpoint, params = {}) {
    try {
      const url = new URL(this.baseUrl + endpoint);
      
      // URL 파라미터 설정
      url.searchParams.set('serviceKey', this.serviceKey);
      url.searchParams.set('type', 'json');
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value.toString());
        }
      });

      console.log(`🔗 테스트: ${endpoint}`);
      console.log(`📡 URL: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log(`📊 HTTP 상태: ${response.status} ${response.statusText}`);
      
      const responseText = await response.text();
      console.log(`📄 응답 길이: ${responseText.length} 문자`);
      console.log(`📋 응답 내용: ${responseText.substring(0, 200)}...`);
      
      return {
        status: response.status,
        success: response.ok,
        data: responseText
      };
    } catch (error) {
      console.error(`❌ 오류: ${error.message}`);
      return {
        status: 0,
        success: false,
        data: error.message
      };
    }
  }

  async testDifferentEndpoints() {
    console.log('\n🔍 다양한 엔드포인트 테스트');
    console.log('=' .repeat(60));
    
    const endpoints = [
      '/getBidPblancListInfoServc',
      '/getBidPblancListInfoServc/',
      '/getBidPblancListInfoServc.json',
      '/getBidPblancListInfoServc.xml',
      '/getBidPblancListInfoServc/1',
      '/getBidPblancListInfoServc?pageNo=1&numOfRows=1',
      '/getBidPblancListInfoServc?serviceKey=' + this.serviceKey + '&type=json&pageNo=1&numOfRows=1'
    ];

    for (const endpoint of endpoints) {
      console.log(`\n--- ${endpoint} ---`);
      await this.testEndpoint(endpoint, { pageNo: 1, numOfRows: 1 });
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
    }
  }

  async testDifferentBaseUrls() {
    console.log('\n🔍 다양한 기본 URL 테스트');
    console.log('=' .repeat(60));
    
    const baseUrls = [
      'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
      'https://apis.data.go.kr/1230000/ad/BidPublicInfoService/',
      'https://apis.data.go.kr/1230000/ad/BidPublicInfoService/v1',
      'https://apis.data.go.kr/1230000/ad/BidPublicInfoService/v1.0'
    ];

    for (const baseUrl of baseUrls) {
      console.log(`\n--- ${baseUrl} ---`);
      const url = new URL('/getBidPblancListInfoServc', baseUrl);
      url.searchParams.set('serviceKey', this.serviceKey);
      url.searchParams.set('type', 'json');
      url.searchParams.set('pageNo', '1');
      url.searchParams.set('numOfRows', '1');
      
      console.log(`📡 URL: ${url.toString()}`);
      
      try {
        const response = await fetch(url.toString());
        console.log(`📊 HTTP 상태: ${response.status} ${response.statusText}`);
        
        const responseText = await response.text();
        console.log(`📋 응답: ${responseText.substring(0, 200)}...`);
      } catch (error) {
        console.error(`❌ 오류: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
    }
  }
}

// 테스트 실행
async function main() {
  const apiDebugger = new NaraApiDebugger();
  
  await apiDebugger.testDifferentEndpoints();
  await apiDebugger.testDifferentBaseUrls();
}

main().catch(console.error);
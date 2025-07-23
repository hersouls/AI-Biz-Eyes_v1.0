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

      console.log(`🔗 테스트 URL: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log(`📊 응답 상태: ${response.status} ${response.statusText}`);
      console.log(`📋 응답 헤더:`, Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      
      console.log('📄 응답 데이터:');
      console.log(responseText);
      
      return {
        success: response.ok,
        status: response.status,
        data: responseText
      };
    } catch (error) {
      console.error('❌ 오류:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async testDifferentEndpoints() {
    console.log('🔍 나라장터 API 엔드포인트 디버깅');
    console.log('=' .repeat(60));
    
    const testCases = [
      {
        name: '기본 엔드포인트 테스트',
        endpoint: '/getBidPblancListInfoServc',
        params: { pageNo: 1, numOfRows: 1 }
      },
      {
        name: '다른 패턴 테스트 1',
        endpoint: '/getBidPblancList',
        params: { pageNo: 1, numOfRows: 1 }
      },
      {
        name: '다른 패턴 테스트 2',
        endpoint: '/getBidList',
        params: { pageNo: 1, numOfRows: 1 }
      },
      {
        name: '다른 패턴 테스트 3',
        endpoint: '/getBidPblancListInfo',
        params: { pageNo: 1, numOfRows: 1 }
      },
      {
        name: '기본 URL만 테스트',
        endpoint: '',
        params: { pageNo: 1, numOfRows: 1 }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🧪 ${testCase.name}`);
      console.log('-'.repeat(40));
      
      const result = await this.testEndpoint(testCase.endpoint, testCase.params);
      
      if (result.success) {
        console.log('✅ 성공');
      } else {
        console.log('❌ 실패');
      }
      
      // API 호출 간격 조절
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  async testDifferentBaseUrls() {
    console.log('\n🌐 다른 기본 URL 테스트');
    console.log('=' .repeat(60));
    
    const baseUrls = [
      'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
      'https://apis.data.go.kr/1230000/BidPublicInfoService',
      'https://apis.data.go.kr/1230000/ad/BidPublicInfo',
      'https://apis.data.go.kr/1230000/BidPublicInfo'
    ];

    for (const baseUrl of baseUrls) {
      console.log(`\n🔗 테스트 URL: ${baseUrl}`);
      console.log('-'.repeat(40));
      
      try {
        const url = new URL(baseUrl + '/getBidPblancListInfoServc');
        url.searchParams.set('serviceKey', this.serviceKey);
        url.searchParams.set('type', 'json');
        url.searchParams.set('pageNo', '1');
        url.searchParams.set('numOfRows', '1');

        console.log(`📡 호출 URL: ${url.toString()}`);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log(`📊 응답 상태: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const responseText = await response.text();
          console.log('📄 응답 데이터 (처음 200자):');
          console.log(responseText.substring(0, 200) + '...');
        }
        
      } catch (error) {
        console.error('❌ 오류:', error.message);
      }
      
      // API 호출 간격 조절
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// 테스트 실행
async function main() {
  const apiDebugger = new NaraApiDebugger();
  
  await apiDebugger.testDifferentEndpoints();
  await apiDebugger.testDifferentBaseUrls();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = NaraApiDebugger;
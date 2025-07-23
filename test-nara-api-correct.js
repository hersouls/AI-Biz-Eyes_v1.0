const fetch = require('node-fetch');

// 나라장터 API 설정
const NARA_API_CONFIG = {
  baseUrl: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  serviceKey: 'w8uFE+fALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM/qByWrt9gZ406/ITajbX1Q8/ESHI1LDoADaTMcg==',
  // 공공데이터포털에서 제공하는 가능한 엔드포인트들
  endpoints: {
    // 기본 엔드포인트 (문서 기준)
    getBidList: '/getBidPblancListInfoServc',
    getBidDetail: '/getBidPblancDtlInfoServc',
    getBidResult: '/getBidPblancRltInfoServc',
    
    // 대안 엔드포인트들 (공공데이터포털 일반 패턴)
    getBidListAlt1: '/getBidPblancListInfoService',
    getBidListAlt2: '/getBidPblancListInfo',
    getBidListAlt3: '/getBidList',
    getBidListAlt4: '/getBidPblancList',
    
    // 다른 가능한 패턴들
    getBidListAlt5: '/getBidPblancListInfoServc',
    getBidListAlt6: '/getBidPblancListInfoService',
    getBidListAlt7: '/getBidPblancListInfo',
    getBidListAlt8: '/getBidList',
    getBidListAlt9: '/getBidPblancList',
    getBidListAlt10: '/getBidPblancListInfoServc',
    
    // 루트 엔드포인트 테스트
    root: '/'
  }
};

class NaraApiCorrectTester {
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
      
      if (response.ok) {
        console.log('✅ 성공!');
        try {
          const data = JSON.parse(responseText);
          console.log('📋 JSON 응답:', JSON.stringify(data, null, 2));
          return { success: true, endpoint, data };
        } catch (e) {
          console.log('📋 XML 응답:', responseText.substring(0, 500) + '...');
          return { success: true, endpoint, rawResponse: responseText };
        }
      } else {
        console.log('❌ 실패:', responseText.substring(0, 200));
        return { success: false, endpoint, error: responseText };
      }
    } catch (error) {
      console.log('❌ 오류:', error.message);
      return { success: false, endpoint, error: error.message };
    }
  }

  async testAllEndpoints() {
    console.log('\n🔍 나라장터 API 엔드포인트 테스트');
    console.log('=' .repeat(60));
    
    const results = [];
    
    for (const [name, endpoint] of Object.entries(NARA_API_CONFIG.endpoints)) {
      console.log(`\n${'='.repeat(20)} ${name} ${'='.repeat(20)}`);
      const result = await this.testEndpoint(endpoint, {
        pageNo: 1,
        numOfRows: 1
      });
      results.push(result);
      
      // 성공한 경우 중단
      if (result.success) {
        console.log(`\n🎉 성공한 엔드포인트 발견: ${endpoint}`);
        break;
      }
      
      // 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
}

// 테스트 실행
async function main() {
  const tester = new NaraApiCorrectTester();
  const results = await tester.testAllEndpoints();
  
  console.log('\n📊 테스트 결과 요약');
  console.log('=' .repeat(40));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ 성공: ${successful.length}개`);
  console.log(`❌ 실패: ${failed.length}개`);
  
  if (successful.length > 0) {
    console.log('\n🎯 성공한 엔드포인트:');
    successful.forEach(r => console.log(`  - ${r.endpoint}`));
  }
}

main().catch(console.error);
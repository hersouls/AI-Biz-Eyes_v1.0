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

class NaraApiFinalTester {
  constructor() {
    this.baseUrl = NARA_API_CONFIG.baseUrl;
    this.serviceKey = NARA_API_CONFIG.serviceKey;
  }

  async testApi(endpoint, params = {}) {
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

      console.log(`🔗 API 호출: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log(`📊 응답 상태: ${response.status} ${response.statusText}`);

      const responseText = await response.text();
      
      console.log('📄 응답 데이터:');
      console.log(responseText);
      
      // JSON 파싱 시도
      try {
        const jsonData = JSON.parse(responseText);
        console.log('✅ JSON 파싱 성공');
        return {
          success: response.ok,
          status: response.status,
          data: jsonData,
          isJson: true
        };
      } catch (parseError) {
        console.log('⚠️ JSON 파싱 실패, XML 응답으로 보입니다.');
        return {
          success: response.ok,
          status: response.status,
          data: responseText,
          isJson: false
        };
      }
    } catch (error) {
      console.error('❌ 오류:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async testAllEndpoints() {
    console.log('🔍 나라장터 API 최종 테스트');
    console.log('=' .repeat(60));
    
    const testCases = [
      {
        name: '입찰공고 목록 조회 (기본)',
        endpoint: '/getBidPblancListInfoServc',
        params: { pageNo: 1, numOfRows: 5 }
      },
      {
        name: '입찰공고 상세 조회',
        endpoint: '/getBidPblancDtlInfoServc',
        params: { pageNo: 1, numOfRows: 5 }
      },
      {
        name: '입찰결과 조회',
        endpoint: '/getBidPblancRltInfoServc',
        params: { pageNo: 1, numOfRows: 5 }
      },
      {
        name: '키워드 검색',
        endpoint: '/getBidPblancListInfoServc',
        params: { pageNo: 1, numOfRows: 5, keyword: '건설' }
      },
      {
        name: '기관별 검색',
        endpoint: '/getBidPblancListInfoServc',
        params: { pageNo: 1, numOfRows: 5, dminsttNm: '서울시' }
      },
      {
        name: '날짜 범위 검색',
        endpoint: '/getBidPblancListInfoServc',
        params: { 
          pageNo: 1, 
          numOfRows: 5, 
          fromDt: '20240101',
          toDt: '20241231'
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🧪 ${testCase.name}`);
      console.log('-'.repeat(40));
      
      const result = await this.testApi(testCase.endpoint, testCase.params);
      
      if (result.success) {
        console.log('✅ API 호출 성공');
        if (result.isJson) {
          console.log('📊 JSON 데이터 구조:');
          console.log(JSON.stringify(result.data, null, 2));
        }
      } else {
        console.log('❌ API 호출 실패');
      }
      
      // API 호출 간격 조절
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  async testAlternativeEndpoints() {
    console.log('\n🔍 대안 엔드포인트 테스트');
    console.log('=' .repeat(60));
    
    const alternativeEndpoints = [
      '/getBidPblancList',
      '/getBidList',
      '/getBidPblancListInfo',
      '/getBidPblancListInfoService',
      '/getBidPblancListInfoServc',
      '/getBidPblancListInfoService/getBidPblancListInfoServc',
      '/getBidPblancListInfoService/getBidPblancList',
      '/getBidPblancListInfoService/getBidList'
    ];

    for (const endpoint of alternativeEndpoints) {
      console.log(`\n🔗 테스트 엔드포인트: ${endpoint}`);
      console.log('-'.repeat(40));
      
      const result = await this.testApi(endpoint, { pageNo: 1, numOfRows: 1 });
      
      if (result.success) {
        console.log('✅ 성공');
      } else {
        console.log('❌ 실패');
      }
      
      // API 호출 간격 조절
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  async testWithDifferentParameters() {
    console.log('\n🔍 다양한 파라미터 조합 테스트');
    console.log('=' .repeat(60));
    
    const baseEndpoint = '/getBidPblancListInfoServc';
    const testParams = [
      { pageNo: 1, numOfRows: 1 },
      { pageNo: 1, numOfRows: 1, type: 'xml' },
      { pageNo: 1, numOfRows: 1, type: 'json' },
      { pageNo: 1, numOfRows: 1, inqryDiv: '1' },
      { pageNo: 1, numOfRows: 1, inqryBgnDt: '20240101' },
      { pageNo: 1, numOfRows: 1, inqryEndDt: '20241231' },
      { pageNo: 1, numOfRows: 1, dminsttNm: '서울' },
      { pageNo: 1, numOfRows: 1, keyword: '건설' }
    ];

    for (let i = 0; i < testParams.length; i++) {
      const params = testParams[i];
      console.log(`\n🧪 파라미터 테스트 ${i + 1}:`, params);
      console.log('-'.repeat(40));
      
      const result = await this.testApi(baseEndpoint, params);
      
      if (result.success) {
        console.log('✅ 성공');
      } else {
        console.log('❌ 실패');
      }
      
      // API 호출 간격 조절
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// 테스트 실행
async function main() {
  const tester = new NaraApiFinalTester();
  
  console.log('🚀 나라장터 API 최종 테스트 시작');
  console.log('📋 기본 URL:', NARA_API_CONFIG.baseUrl);
  console.log('🔑 인증키:', NARA_API_CONFIG.serviceKey.substring(0, 20) + '...');
  
  await tester.testAllEndpoints();
  await tester.testAlternativeEndpoints();
  await tester.testWithDifferentParameters();
  
  console.log('\n🎉 테스트 완료!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = NaraApiFinalTester;
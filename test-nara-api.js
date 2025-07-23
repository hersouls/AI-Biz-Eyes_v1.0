const fetch = require('node-fetch');

// 나라장터 API 설정
const NARA_API_CONFIG = {
  baseUrl: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  serviceKey: 'w8uFE%2fALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM%2FqByWrt9gZ406%2FITajbX1Q8%2FESHI1LDoADaTMcg%3D%3D',
  endpoints: {
    getBidList: '/getBidPblancListInfoServc',
    getBidDetail: '/getBidPblancDtlInfoServc',
    getBidResult: '/getBidPblancRltInfoServc'
  }
};

class NaraApiTester {
  constructor() {
    this.baseUrl = NARA_API_CONFIG.baseUrl;
    this.serviceKey = NARA_API_CONFIG.serviceKey;
  }

  async testApi(endpoint, params = {}) {
    try {
      const url = new URL(this.baseUrl + endpoint);
      
      // 기본 파라미터 설정
      const defaultParams = {
        serviceKey: this.serviceKey,
        type: 'json',
        ...params
      };

      // URL 파라미터 추가
      Object.entries(defaultParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      
      console.log('✅ API 호출 성공');
      console.log('📊 응답 데이터:');
      console.log(responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.log('⚠️ JSON 파싱 실패, XML 응답으로 보입니다.');
        data = { rawResponse: responseText };
      }
      
      return {
        success: true,
        data,
        message: 'API 호출 성공'
      };
    } catch (error) {
      console.error('❌ API 호출 실패:', error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  async testConnection() {
    console.log('\n🔗 나라장터 API 연결 테스트');
    console.log('=' .repeat(50));
    
    return this.testApi(NARA_API_CONFIG.endpoints.getBidList, {
      pageNo: 1,
      numOfRows: 1
    });
  }

  async testGetBidList() {
    console.log('\n📋 입찰공고 목록 조회 테스트');
    console.log('=' .repeat(50));
    
    return this.testApi(NARA_API_CONFIG.endpoints.getBidList, {
      pageNo: 1,
      numOfRows: 5,
      inqryDiv: '1' // 전체
    });
  }

  async testSearchByKeyword() {
    console.log('\n🔍 키워드 검색 테스트');
    console.log('=' .repeat(50));
    
    return this.testApi(NARA_API_CONFIG.endpoints.getBidList, {
      pageNo: 1,
      numOfRows: 5,
      bidNtceNm: '시스템'
    });
  }

  async testSearchByInstitution() {
    console.log('\n🏢 기관별 검색 테스트');
    console.log('=' .repeat(50));
    
    return this.testApi(NARA_API_CONFIG.endpoints.getBidList, {
      pageNo: 1,
      numOfRows: 5,
      dminsttNm: '조달청'
    });
  }

  async testSearchByDateRange() {
    console.log('\n📅 기간별 검색 테스트');
    console.log('=' .repeat(50));
    
    return this.testApi(NARA_API_CONFIG.endpoints.getBidList, {
      pageNo: 1,
      numOfRows: 5,
      inqryBgnDt: '20241201',
      inqryEndDt: '20241231'
    });
  }

  async testGetBidResult() {
    console.log('\n🏆 입찰결과 조회 테스트');
    console.log('=' .repeat(50));
    
    return this.testApi(NARA_API_CONFIG.endpoints.getBidResult, {
      pageNo: 1,
      numOfRows: 5
    });
  }

  async runAllTests() {
    console.log('🚀 나라장터 입찰공고정보 API 테스트 시작');
    console.log('=' .repeat(60));
    
    const tests = [
      { name: '연결 테스트', test: () => this.testConnection() },
      { name: '입찰공고 목록 조회', test: () => this.testGetBidList() },
      { name: '키워드 검색', test: () => this.testSearchByKeyword() },
      { name: '기관별 검색', test: () => this.testSearchByInstitution() },
      { name: '기간별 검색', test: () => this.testSearchByDateRange() },
      { name: '입찰결과 조회', test: () => this.testGetBidResult() }
    ];

    const results = [];
    
    for (const test of tests) {
      console.log(`\n🧪 ${test.name} 실행 중...`);
      const result = await test.test();
      results.push({
        name: test.name,
        ...result
      });
      
      // API 호출 간격 조절 (서버 부하 방지)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n📊 테스트 결과 요약');
    console.log('=' .repeat(60));
    
    results.forEach((result, index) => {
      const status = result.success ? '✅ 성공' : '❌ 실패';
      console.log(`${index + 1}. ${result.name}: ${status}`);
      if (!result.success) {
        console.log(`   오류: ${result.message}`);
      }
    });

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    console.log(`\n🎯 최종 결과: ${successCount}/${totalCount} 테스트 성공`);
    
    return results;
  }
}

// 테스트 실행
async function main() {
  const tester = new NaraApiTester();
  
  // 개별 테스트 실행
  if (process.argv.includes('--connection')) {
    await tester.testConnection();
  } else if (process.argv.includes('--bid-list')) {
    await tester.testGetBidList();
  } else if (process.argv.includes('--keyword')) {
    await tester.testSearchByKeyword();
  } else if (process.argv.includes('--institution')) {
    await tester.testSearchByInstitution();
  } else if (process.argv.includes('--date-range')) {
    await tester.testSearchByDateRange();
  } else if (process.argv.includes('--bid-result')) {
    await tester.testGetBidResult();
  } else {
    // 모든 테스트 실행
    await tester.runAllTests();
  }
}

// 스크립트가 직접 실행될 때만 테스트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = NaraApiTester;
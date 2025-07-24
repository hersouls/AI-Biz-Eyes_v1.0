const axios = require('axios');

// 나라장터 API 연구용 설정
const G2B_API_RESEARCH = {
  // 가능한 API 엔드포인트들
  POSSIBLE_ENDPOINTS: [
    'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService/getBidPblancListInfoServc',
    'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService/getBidPblancListInfoServc',
    'https://openapi.g2b.go.kr/openapi/service/rest/CntrctInfoService/getCntrctInfoServc',
    'https://openapi.g2b.go.kr/openapi/service/rest/CntrctInfoService/getCntrctInfoServc',
    'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService/getBidPblancListInfoServc',
    'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService/getBidPblancListInfoServc',
    'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService/getBidPblancListInfoServc',
    'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService/getBidPblancListInfoServc',
    'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService/getBidPblancListInfoServc',
    'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService/getBidPblancListInfoServc'
  ],
  
  // 가능한 서비스 이름들
  POSSIBLE_SERVICES: [
    'CpcpBidInfoService',
    'CntrctInfoService',
    'BidInfoService',
    'ContractInfoService',
    'G2BService'
  ],
  
  // 가능한 메서드 이름들
  POSSIBLE_METHODS: [
    'getBidPblancListInfoServc',
    'getBidPblancListInfoService',
    'getBidPblancList',
    'getBidList',
    'getBidInfo',
    'getCntrctInfoServc',
    'getCntrctInfoService',
    'getContractInfo',
    'getContractList'
  ],
  
  // 테스트용 API 키
  SERVICE_KEY: process.env.G2B_SERVICE_KEY || 'test-key',
  
  // 타임아웃
  TIMEOUT: 5000
};

// 테스트 결과 로그 함수
function logTestResult(testName, success, error = null, response = null) {
  const timestamp = new Date().toISOString();
  const status = success ? '✅ PASS' : '❌ FAIL';
  
  console.log(`[${timestamp}] ${status} ${testName}`);
  
  if (error) {
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      if (error.response.data) {
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
  }
  
  if (response && success) {
    console.log(`   Response Time: ${response.responseTime || 'N/A'}ms`);
    if (response.data) {
      console.log(`   Data Preview: ${JSON.stringify(response.data).substring(0, 200)}...`);
    }
  }
  
  console.log('');
}

// 기본 API 엔드포인트 테스트
async function testBasicEndpoints() {
  console.log('🔍 기본 API 엔드포인트 테스트\n');
  
  const baseUrls = [
    'https://openapi.g2b.go.kr',
    'https://openapi.g2b.go.kr:8090',
    'https://api.g2b.go.kr',
    'https://www.g2b.go.kr'
  ];
  
  for (const baseUrl of baseUrls) {
    try {
      console.log(`테스트 중: ${baseUrl}`);
      const response = await axios.get(baseUrl, {
        timeout: G2B_API_RESEARCH.TIMEOUT
      });
      
      logTestResult(`기본 연결 - ${baseUrl}`, true, null, {
        responseTime: response.headers['x-response-time'] || 'N/A',
        data: response.data
      });
    } catch (error) {
      logTestResult(`기본 연결 - ${baseUrl}`, false, error);
    }
  }
}

// 서비스별 엔드포인트 테스트
async function testServiceEndpoints() {
  console.log('🔍 서비스별 엔드포인트 테스트\n');
  
  for (const service of G2B_API_RESEARCH.POSSIBLE_SERVICES) {
    for (const method of G2B_API_RESEARCH.POSSIBLE_METHODS) {
      const url = `https://openapi.g2b.go.kr/openapi/service/rest/${service}/${method}`;
      
      try {
        const response = await axios.get(url, {
          timeout: G2B_API_RESEARCH.TIMEOUT,
          params: {
            serviceKey: G2B_API_RESEARCH.SERVICE_KEY,
            pageNo: 1,
            numOfRows: 1,
            type: 'json'
          }
        });
        
        logTestResult(`${service}/${method}`, true, null, {
          responseTime: response.headers['x-response-time'] || 'N/A',
          data: response.data
        });
        
        // 성공한 경우 더 자세한 정보 출력
        console.log(`   ✅ 성공한 엔드포인트 발견: ${url}`);
        console.log(`   응답 구조: ${JSON.stringify(response.data, null, 2)}`);
        console.log('');
        
      } catch (error) {
        // 404가 아닌 다른 오류는 로그로 남기기
        if (error.response && error.response.status !== 404) {
          logTestResult(`${service}/${method}`, false, error);
        }
      }
    }
  }
}

// 공공데이터포털 API 테스트
async function testPublicDataPortal() {
  console.log('🔍 공공데이터포털 API 테스트\n');
  
  const publicDataEndpoints = [
    'https://api.data.go.kr/openapi/rest/g2b/bid',
    'https://api.data.go.kr/openapi/rest/g2b/contract',
    'https://api.data.go.kr/openapi/rest/g2b/bidinfo'
  ];
  
  for (const endpoint of publicDataEndpoints) {
    try {
      const response = await axios.get(endpoint, {
        timeout: G2B_API_RESEARCH.TIMEOUT,
        params: {
          serviceKey: G2B_API_RESEARCH.SERVICE_KEY,
          pageNo: 1,
          numOfRows: 1
        }
      });
      
      logTestResult(`공공데이터포털 - ${endpoint}`, true, null, {
        responseTime: response.headers['x-response-time'] || 'N/A',
        data: response.data
      });
    } catch (error) {
      logTestResult(`공공데이터포털 - ${endpoint}`, false, error);
    }
  }
}

// 나라장터 웹사이트 스크래핑 테스트
async function testG2BWebsite() {
  console.log('🔍 나라장터 웹사이트 접근 테스트\n');
  
  const g2bUrls = [
    'https://www.g2b.go.kr:8101/ep/main/main.do',
    'https://www.g2b.go.kr:8101/ep/main/index.do',
    'https://www.g2b.go.kr:8101/ep/bid/bidList.do',
    'https://www.g2b.go.kr:8101/ep/bid/bidDetail.do'
  ];
  
  for (const url of g2bUrls) {
    try {
      const response = await axios.get(url, {
        timeout: G2B_API_RESEARCH.TIMEOUT,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      logTestResult(`나라장터 웹사이트 - ${url}`, true, null, {
        responseTime: response.headers['x-response-time'] || 'N/A',
        data: response.data ? 'HTML Content' : 'No Data'
      });
    } catch (error) {
      logTestResult(`나라장터 웹사이트 - ${url}`, false, error);
    }
  }
}

// API 문서 찾기
async function findAPIDocumentation() {
  console.log('🔍 API 문서 찾기\n');
  
  const docUrls = [
    'https://openapi.g2b.go.kr/openapi/service/rest/CpcpBidInfoService',
    'https://openapi.g2b.go.kr/openapi/service/rest/CntrctInfoService',
    'https://www.g2b.go.kr:8101/ep/main/apiGuide.do',
    'https://www.g2b.go.kr:8101/ep/main/apiInfo.do'
  ];
  
  for (const url of docUrls) {
    try {
      const response = await axios.get(url, {
        timeout: G2B_API_RESEARCH.TIMEOUT
      });
      
      logTestResult(`API 문서 - ${url}`, true, null, {
        responseTime: response.headers['x-response-time'] || 'N/A',
        data: response.data ? 'Documentation Found' : 'No Documentation'
      });
    } catch (error) {
      logTestResult(`API 문서 - ${url}`, false, error);
    }
  }
}

// 메인 연구 함수
async function runG2BAPIResearch() {
  console.log('🚀 조달청 나라장터 API 연구 시작\n');
  console.log(`Service Key: ${G2B_API_RESEARCH.SERVICE_KEY.substring(0, 10)}...`);
  console.log(`Timeout: ${G2B_API_RESEARCH.TIMEOUT}ms\n`);
  
  try {
    await testBasicEndpoints();
    await testServiceEndpoints();
    await testPublicDataPortal();
    await testG2BWebsite();
    await findAPIDocumentation();
    
    console.log('✅ 모든 연구가 완료되었습니다.');
    console.log('\n📋 연구 결과 요약:');
    console.log('1. 나라장터 API 엔드포인트가 404 오류를 반환하고 있습니다.');
    console.log('2. 실제 API 키가 필요할 수 있습니다.');
    console.log('3. API 문서나 공식 가이드를 확인해야 합니다.');
    console.log('4. 웹 스크래핑 방식이 대안이 될 수 있습니다.');
  } catch (error) {
    console.error('❌ 연구 중 오류가 발생했습니다:', error.message);
  }
}

// 스크립트 실행
if (require.main === module) {
  runG2BAPIResearch();
}

module.exports = {
  runG2BAPIResearch,
  testBasicEndpoints,
  testServiceEndpoints,
  testPublicDataPortal,
  testG2BWebsite,
  findAPIDocumentation
};
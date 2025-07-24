const axios = require('axios');

// 조달청 API 설정 (올바른 엔드포인트로 수정)
const G2B_API_CONFIG = {
  // 조달청 공공데이터포털 API 기본 URL
  BASE_URL: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  
  // 조달청 입찰공고정보서비스 API URL
  BID_INFO_URL: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  
  // 조달청 계약정보서비스 API URL (필요시 별도 설정)
  CONTRACT_INFO_URL: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  
  // 환경변수에서 API 키 가져오기 (인코딩된 키 사용)
  SERVICE_KEY: process.env.G2B_API_KEY_ENCODED || process.env.G2B_SERVICE_KEY || 'test-key',
  
  // API 타임아웃 설정
  TIMEOUT: 15000
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
      console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
  
  if (response && success) {
    console.log(`   Response Time: ${response.responseTime || 'N/A'}ms`);
    if (response.data) {
      console.log(`   Data Count: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
    }
  }
  
  console.log('');
}

// 나라장터 API 테스트 함수들 (수정된 버전)
async function testG2BAPIConnectivity() {
  console.log('🔍 나라장터 API 연결성 테스트 시작\n');
  
  // 1. 기본 연결 테스트 (올바른 엔드포인트)
  try {
    console.log('1. 기본 연결 테스트...');
    const response = await axios.get(`${G2B_API_CONFIG.BASE_URL}/getBidPblancListInfoServc`, {
      timeout: G2B_API_CONFIG.TIMEOUT,
      params: {
        serviceKey: G2B_API_CONFIG.SERVICE_KEY,
        pageNo: 1,
        numOfRows: 1,
        type: 'json'
      }
    });
    
    logTestResult('기본 연결 테스트', true, null, {
      responseTime: response.headers['x-response-time'] || 'N/A',
      data: response.data
    });
  } catch (error) {
    logTestResult('기본 연결 테스트', false, error);
  }
}

async function testBidInfoAPI() {
  console.log('2. 입찰공고정보서비스 API 테스트...');
  
  try {
    const response = await axios.get(`${G2B_API_CONFIG.BID_INFO_URL}/getBidPblancListInfoServc`, {
      timeout: G2B_API_CONFIG.TIMEOUT,
      params: {
        serviceKey: G2B_API_CONFIG.SERVICE_KEY,
        pageNo: 1,
        numOfRows: 10,
        type: 'json'
      }
    });
    
    logTestResult('입찰공고정보서비스 API', true, null, {
      responseTime: response.headers['x-response-time'] || 'N/A',
      data: response.data
    });
  } catch (error) {
    logTestResult('입찰공고정보서비스 API', false, error);
  }
}

async function testContractInfoAPI() {
  console.log('3. 계약정보서비스 API 테스트...');
  
  try {
    const response = await axios.get(`${G2B_API_CONFIG.CONTRACT_INFO_URL}/getCntrctInfoServc`, {
      timeout: G2B_API_CONFIG.TIMEOUT,
      params: {
        serviceKey: G2B_API_CONFIG.SERVICE_KEY,
        pageNo: 1,
        numOfRows: 10,
        type: 'json'
      }
    });
    
    logTestResult('계약정보서비스 API', true, null, {
      responseTime: response.headers['x-response-time'] || 'N/A',
      data: response.data
    });
  } catch (error) {
    logTestResult('계약정보서비스 API', false, error);
  }
}

async function testAPIAuthentication() {
  console.log('4. API 인증 테스트...');
  
  // 유효하지 않은 API 키로 테스트
  try {
    const response = await axios.get(`${G2B_API_CONFIG.BASE_URL}/getBidPblancListInfoServc`, {
      timeout: G2B_API_CONFIG.TIMEOUT,
      params: {
        serviceKey: 'invalid-key',
        pageNo: 1,
        numOfRows: 1,
        type: 'json'
      }
    });
    
    logTestResult('API 인증 테스트 (무효한 키)', false, new Error('무효한 API 키로도 응답을 받았습니다'));
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logTestResult('API 인증 테스트 (무효한 키)', true, null, {
        message: '올바르게 인증 오류를 반환했습니다'
      });
    } else {
      logTestResult('API 인증 테스트 (무효한 키)', false, error);
    }
  }
}

async function testAPIResponseFormat() {
  console.log('5. API 응답 형식 테스트...');
  
  try {
    const response = await axios.get(`${G2B_API_CONFIG.BID_INFO_URL}/getBidPblancListInfoServc`, {
      timeout: G2B_API_CONFIG.TIMEOUT,
      params: {
        serviceKey: G2B_API_CONFIG.SERVICE_KEY,
        pageNo: 1,
        numOfRows: 5,
        type: 'json'
      }
    });
    
    // 응답 형식 검증
    const data = response.data;
    let isValidFormat = true;
    let errorMessage = '';
    
    if (!data) {
      isValidFormat = false;
      errorMessage = '응답 데이터가 없습니다';
    } else if (data.response && data.response.body) {
      const body = data.response.body;
      if (!body.items || !body.numOfRows || !body.pageNo) {
        isValidFormat = false;
        errorMessage = '필수 응답 필드가 누락되었습니다';
      }
    } else {
      isValidFormat = false;
      errorMessage = '예상된 응답 구조가 아닙니다';
    }
    
    logTestResult('API 응답 형식 테스트', isValidFormat, 
      isValidFormat ? null : new Error(errorMessage), {
        responseTime: response.headers['x-response-time'] || 'N/A',
        data: data
      });
  } catch (error) {
    logTestResult('API 응답 형식 테스트', false, error);
  }
}

async function testAPIParameters() {
  console.log('6. API 파라미터 테스트...');
  
  const testCases = [
    { name: '기본 파라미터', params: { pageNo: 1, numOfRows: 10 } },
    { name: '페이지네이션', params: { pageNo: 2, numOfRows: 5 } },
    { name: '최대 행 수', params: { pageNo: 1, numOfRows: 100 } }
  ];
  
  for (const testCase of testCases) {
    try {
      const response = await axios.get(`${G2B_API_CONFIG.BID_INFO_URL}/getBidPblancListInfoServc`, {
        timeout: G2B_API_CONFIG.TIMEOUT,
        params: {
          serviceKey: G2B_API_CONFIG.SERVICE_KEY,
          type: 'json',
          ...testCase.params
        }
      });
      
      logTestResult(`API 파라미터 테스트 - ${testCase.name}`, true, null, {
        responseTime: response.headers['x-response-time'] || 'N/A',
        data: response.data
      });
    } catch (error) {
      logTestResult(`API 파라미터 테스트 - ${testCase.name}`, false, error);
    }
  }
}

async function testErrorHandling() {
  console.log('7. 오류 처리 테스트...');
  
  const errorTestCases = [
    { name: '잘못된 엔드포인트', url: `${G2B_API_CONFIG.BASE_URL}/invalid-endpoint` },
    { name: '잘못된 파라미터', url: `${G2B_API_CONFIG.BID_INFO_URL}/getBidPblancListInfoServc`, 
      params: { serviceKey: G2B_API_CONFIG.SERVICE_KEY, invalidParam: 'test' } }
  ];
  
  for (const testCase of errorTestCases) {
    try {
      const response = await axios.get(testCase.url, {
        timeout: G2B_API_CONFIG.TIMEOUT,
        params: testCase.params || {
          serviceKey: G2B_API_CONFIG.SERVICE_KEY,
          pageNo: 1,
          numOfRows: 1,
          type: 'json'
        }
      });
      
      logTestResult(`오류 처리 테스트 - ${testCase.name}`, false, 
        new Error('오류 상황에서도 정상 응답을 받았습니다'));
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        logTestResult(`오류 처리 테스트 - ${testCase.name}`, true, null, {
          message: '올바르게 오류를 반환했습니다'
        });
      } else {
        logTestResult(`오류 처리 테스트 - ${testCase.name}`, false, error);
      }
    }
  }
}

// 실제 나라장터 API 키로 테스트하는 함수
async function testWithRealAPIKey() {
  console.log('8. 실제 API 키 테스트...');
  
  // 실제 API 키가 있는지 확인
  const realApiKey = process.env.G2B_SERVICE_KEY;
  if (!realApiKey || realApiKey === 'test-key') {
    console.log('   실제 API 키가 설정되지 않았습니다. 환경변수 G2B_SERVICE_KEY를 설정해주세요.');
    return;
  }
  
  try {
    const response = await axios.get(`${G2B_API_CONFIG.BID_INFO_URL}/getBidPblancListInfoServc`, {
      timeout: G2B_API_CONFIG.TIMEOUT,
      params: {
        serviceKey: realApiKey,
        pageNo: 1,
        numOfRows: 5,
        type: 'json'
      }
    });
    
    logTestResult('실제 API 키 테스트', true, null, {
      responseTime: response.headers['x-response-time'] || 'N/A',
      data: response.data
    });
  } catch (error) {
    logTestResult('실제 API 키 테스트', false, error);
  }
}

// 메인 테스트 실행 함수
async function runG2BAPITests() {
  console.log('🚀 조달청 나라장터 API 연동 테스트 시작 (수정된 버전)\n');
  console.log(`API Base URL: ${G2B_API_CONFIG.BASE_URL}`);
  console.log(`Service Key: ${G2B_API_CONFIG.SERVICE_KEY.substring(0, 10)}...`);
  console.log(`Timeout: ${G2B_API_CONFIG.TIMEOUT}ms\n`);
  
  try {
    await testG2BAPIConnectivity();
    await testBidInfoAPI();
    await testContractInfoAPI();
    await testAPIAuthentication();
    await testAPIResponseFormat();
    await testAPIParameters();
    await testErrorHandling();
    await testWithRealAPIKey();
    
    console.log('✅ 모든 테스트가 완료되었습니다.');
  } catch (error) {
    console.error('❌ 테스트 실행 중 오류가 발생했습니다:', error.message);
  }
}

// 스크립트 실행
if (require.main === module) {
  runG2BAPITests();
}

module.exports = {
  runG2BAPITests,
  testG2BAPIConnectivity,
  testBidInfoAPI,
  testContractInfoAPI,
  testAPIAuthentication,
  testAPIResponseFormat,
  testAPIParameters,
  testErrorHandling,
  testWithRealAPIKey
};
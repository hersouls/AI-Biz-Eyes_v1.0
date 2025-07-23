const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// 설정
const API_BASE_URL = 'http://localhost:3003';
const FRONTEND_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  auth: `${API_BASE_URL}/api/auth`,
  bids: `${API_BASE_URL}/api/bids`,
  references: `${API_BASE_URL}/api/references`,
  notifications: `${API_BASE_URL}/api/notifications`,
  statistics: `${API_BASE_URL}/api/statistics`,
  integration: `${API_BASE_URL}/api/integration`
};

// 테스트 결과 저장
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// 유틸리티 함수
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const emoji = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    test: '🧪'
  };
  console.log(`${emoji[type]} [${timestamp}] ${message}`);
}

function logTestResult(testName, success, error = null) {
  if (success) {
    testResults.passed++;
    log(`${testName}: PASSED`, 'success');
  } else {
    testResults.failed++;
    testResults.errors.push({ test: testName, error: error?.message || 'Unknown error' });
    log(`${testName}: FAILED - ${error?.message || 'Unknown error'}`, 'error');
  }
}

// Step 1: 서버 상태 확인
async function checkServerStatus() {
  log('Step 1: 서버 상태 확인', 'test');
  
  try {
    // API 서버 헬스 체크
    const healthResponse = await axios.get(API_ENDPOINTS.health, { timeout: 5000 });
    if (healthResponse.data.success) {
      logTestResult('API Server Health Check', true);
    } else {
      logTestResult('API Server Health Check', false, new Error('Health check failed'));
    }
  } catch (error) {
    logTestResult('API Server Health Check', false, error);
  }
}

// Step 2: 인증 테스트
async function testAuthentication() {
  log('Step 2: 인증 시스템 테스트', 'test');
  
  try {
    // 로그인 테스트
    const loginResponse = await axios.post(`${API_ENDPOINTS.auth}/login`, {
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (loginResponse.data.success && loginResponse.data.data.token) {
      logTestResult('User Login', true);
      return loginResponse.data.data.token;
    } else {
      logTestResult('User Login', false, new Error('Login response invalid'));
      return null;
    }
  } catch (error) {
    logTestResult('User Login', false, error);
    return null;
  }
}

// Step 3: 입찰 관련 API 테스트
async function testBidAPIs(token) {
  log('Step 3: 입찰 관련 API 테스트', 'test');
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  try {
    // 입찰 목록 조회
    const bidsResponse = await axios.get(`${API_ENDPOINTS.bids}?page=1&limit=5`, { headers });
    if (bidsResponse.data.success) {
      logTestResult('Bids List API', true);
    } else {
      logTestResult('Bids List API', false, new Error('Bids list response invalid'));
    }
  } catch (error) {
    logTestResult('Bids List API', false, error);
  }
  
  try {
    // 입찰 상세 조회
    const bidDetailResponse = await axios.get(`${API_ENDPOINTS.bids}/1`, { headers });
    if (bidDetailResponse.data.success) {
      logTestResult('Bid Detail API', true);
    } else {
      logTestResult('Bid Detail API', false, new Error('Bid detail response invalid'));
    }
  } catch (error) {
    logTestResult('Bid Detail API', false, error);
  }
  
  try {
    // 입찰 통계
    const statsResponse = await axios.get(`${API_ENDPOINTS.bids}/statistics`, { headers });
    if (statsResponse.data.success) {
      logTestResult('Bid Statistics API', true);
    } else {
      logTestResult('Bid Statistics API', false, new Error('Statistics response invalid'));
    }
  } catch (error) {
    logTestResult('Bid Statistics API', false, error);
  }
}

// Step 4: 참고자료 API 테스트
async function testReferenceAPIs(token) {
  log('Step 4: 참고자료 API 테스트', 'test');
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  try {
    // 참고자료 목록 조회
    const refsResponse = await axios.get(`${API_ENDPOINTS.references}?page=1&limit=5`, { headers });
    if (refsResponse.data.success) {
      logTestResult('References List API', true);
    } else {
      logTestResult('References List API', false, new Error('References list response invalid'));
    }
  } catch (error) {
    logTestResult('References List API', false, error);
  }
  
  try {
    // 참고자료 생성
    const createRefResponse = await axios.post(`${API_ENDPOINTS.references}`, {
      title: 'Test Reference',
      content: 'Test content for integration testing',
      category: 'test'
    }, { headers });
    
    if (createRefResponse.data.success) {
      logTestResult('Create Reference API', true);
    } else {
      logTestResult('Create Reference API', false, new Error('Create reference response invalid'));
    }
  } catch (error) {
    logTestResult('Create Reference API', false, error);
  }
}

// Step 5: 알림 API 테스트
async function testNotificationAPIs(token) {
  log('Step 5: 알림 API 테스트', 'test');
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  try {
    // 알림 목록 조회
    const notifsResponse = await axios.get(`${API_ENDPOINTS.notifications}?page=1&limit=5`, { headers });
    if (notifsResponse.data.success) {
      logTestResult('Notifications List API', true);
    } else {
      logTestResult('Notifications List API', false, new Error('Notifications list response invalid'));
    }
  } catch (error) {
    logTestResult('Notifications List API', false, error);
  }
}

// Step 6: 통합 시스템 API 테스트
async function testIntegrationAPIs(token) {
  log('Step 6: 통합 시스템 API 테스트', 'test');
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  try {
    // 통합 통계
    const integrationStatsResponse = await axios.get(`${API_ENDPOINTS.integration}/stats`, { headers });
    if (integrationStatsResponse.data.success) {
      logTestResult('Integration Stats API', true);
    } else {
      logTestResult('Integration Stats API', false, new Error('Integration stats response invalid'));
    }
  } catch (error) {
    logTestResult('Integration Stats API', false, error);
  }
  
  try {
    // 통합 시스템 목록
    const systemsResponse = await axios.get(`${API_ENDPOINTS.integration}/systems`, { headers });
    if (systemsResponse.data.success) {
      logTestResult('Integration Systems API', true);
    } else {
      logTestResult('Integration Systems API', false, new Error('Integration systems response invalid'));
    }
  } catch (error) {
    logTestResult('Integration Systems API', false, error);
  }
}

// Step 7: 프론트엔드 접근성 테스트
async function testFrontendAccessibility() {
  log('Step 7: 프론트엔드 접근성 테스트', 'test');
  
  try {
    // React 앱 접근 테스트
    const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 10000 });
    if (frontendResponse.status === 200) {
      logTestResult('Frontend Accessibility', true);
    } else {
      logTestResult('Frontend Accessibility', false, new Error(`Frontend returned status ${frontendResponse.status}`));
    }
  } catch (error) {
    logTestResult('Frontend Accessibility', false, error);
  }
}

// Step 8: CORS 설정 테스트
async function testCORSSettings() {
  log('Step 8: CORS 설정 테스트', 'test');
  
  try {
    // CORS preflight 요청 테스트
    const corsResponse = await axios.options(`${API_ENDPOINTS.bids}`, {
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization'
      }
    });
    
    if (corsResponse.headers['access-control-allow-origin']) {
      logTestResult('CORS Configuration', true);
    } else {
      logTestResult('CORS Configuration', false, new Error('CORS headers not found'));
    }
  } catch (error) {
    logTestResult('CORS Configuration', false, error);
  }
}

// Step 9: 에러 핸들링 테스트
async function testErrorHandling() {
  log('Step 9: 에러 핸들링 테스트', 'test');
  
  try {
    // 존재하지 않는 엔드포인트 테스트
    const errorResponse = await axios.get(`${API_BASE_URL}/api/nonexistent`, { 
      validateStatus: () => true 
    });
    
    if (errorResponse.status === 404) {
      logTestResult('404 Error Handling', true);
    } else {
      logTestResult('404 Error Handling', false, new Error(`Expected 404, got ${errorResponse.status}`));
    }
  } catch (error) {
    logTestResult('404 Error Handling', false, error);
  }
  
  try {
    // 잘못된 토큰으로 인증 테스트
    const authErrorResponse = await axios.get(`${API_ENDPOINTS.bids}`, {
      headers: { Authorization: 'Bearer invalid-token' },
      validateStatus: () => true
    });
    
    if (authErrorResponse.status === 401) {
      logTestResult('Authentication Error Handling', true);
    } else {
      logTestResult('Authentication Error Handling', false, new Error(`Expected 401, got ${authErrorResponse.status}`));
    }
  } catch (error) {
    logTestResult('Authentication Error Handling', false, error);
  }
}

// Step 10: 성능 테스트
async function testPerformance() {
  log('Step 10: 성능 테스트', 'test');
  
  const startTime = Date.now();
  
  try {
    // 헬스 체크 응답 시간 테스트
    await axios.get(API_ENDPOINTS.health);
    const responseTime = Date.now() - startTime;
    
    if (responseTime < 1000) {
      logTestResult('API Response Time', true);
      log(`Response time: ${responseTime}ms`, 'info');
    } else {
      logTestResult('API Response Time', false, new Error(`Response time too slow: ${responseTime}ms`));
    }
  } catch (error) {
    logTestResult('API Response Time', false, error);
  }
}

// 메인 테스트 실행 함수
async function runIntegrationTests() {
  log('🚀 API 엔드포인트와 프론트엔드 통합 테스트 시작', 'test');
  log('=' * 60, 'info');
  
  // Step 1: 서버 상태 확인
  await checkServerStatus();
  
  // Step 2: 인증 테스트
  const token = await testAuthentication();
  
  // Step 3-6: API 테스트들
  await testBidAPIs(token);
  await testReferenceAPIs(token);
  await testNotificationAPIs(token);
  await testIntegrationAPIs(token);
  
  // Step 7-10: 시스템 테스트들
  await testFrontendAccessibility();
  await testCORSSettings();
  await testErrorHandling();
  await testPerformance();
  
  // 결과 요약
  log('=' * 60, 'info');
  log('📊 테스트 결과 요약', 'test');
  log(`✅ 통과: ${testResults.passed}`, 'success');
  log(`❌ 실패: ${testResults.failed}`, 'error');
  log(`📈 성공률: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`, 'info');
  
  if (testResults.errors.length > 0) {
    log('\n❌ 실패한 테스트들:', 'error');
    testResults.errors.forEach((error, index) => {
      log(`${index + 1}. ${error.test}: ${error.error}`, 'error');
    });
  }
  
  log('\n🎯 다음 단계:', 'info');
  log('1. 실패한 테스트들을 수정하세요', 'info');
  log('2. 브라우저에서 수동 테스트를 진행하세요', 'info');
  log('3. 성능 최적화를 고려하세요', 'info');
  
  log('\n🌐 접속 정보:', 'info');
  log(`API 서버: ${API_BASE_URL}`, 'info');
  log(`프론트엔드: ${FRONTEND_URL}`, 'info');
  log(`API 문서: ${API_BASE_URL}/health`, 'info');
}

// 테스트 실행
if (require.main === module) {
  runIntegrationTests().catch(error => {
    log(`테스트 실행 중 오류 발생: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  runIntegrationTests,
  testResults
};
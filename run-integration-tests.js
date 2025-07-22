#!/usr/bin/env node

const { runIntegrationTests } = require('./integration-test-complete');
const { runBrowserIntegrationTests } = require('./browser-integration-test');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// 전체 테스트 결과
const overallResults = {
  apiTests: { passed: 0, failed: 0 },
  browserTests: { passed: 0, failed: 0 },
  totalPassed: 0,
  totalFailed: 0
};

// 로깅 함수
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const emoji = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    test: '🧪',
    start: '🚀',
    finish: '🏁'
  };
  console.log(`${emoji[type]} [${timestamp}] ${message}`);
}

// 서버 상태 확인
async function checkServers() {
  log('서버 상태 확인 중...', 'info');
  
  try {
    // API 서버 확인
    const apiCheck = await execAsync('curl -s http://localhost:3002/health');
    if (apiCheck.stdout.includes('"success":true')) {
      log('API 서버가 실행 중입니다', 'success');
    } else {
      log('API 서버가 실행되지 않았습니다. 먼저 서버를 시작해주세요.', 'error');
      log('npm run dev 또는 npm start를 실행하세요', 'info');
      return false;
    }
    
    // React 앱 확인
    const frontendCheck = await execAsync('curl -s http://localhost:3000');
    if (frontendCheck.stdout.includes('<!DOCTYPE html>') || frontendCheck.stdout.includes('<html')) {
      log('React 앱이 실행 중입니다', 'success');
    } else {
      log('React 앱이 실행되지 않았습니다. 먼저 앱을 시작해주세요.', 'error');
      log('cd react-tailwind-app && npm start를 실행하세요', 'info');
      return false;
    }
    
    return true;
  } catch (error) {
    log('서버 상태 확인 중 오류 발생', 'error');
    log('API 서버와 React 앱이 모두 실행 중인지 확인해주세요', 'warning');
    return false;
  }
}

// API 테스트 실행
async function runAPITests() {
  log('API 통합 테스트 시작', 'start');
  
  try {
    await runIntegrationTests();
    log('API 통합 테스트 완료', 'finish');
    return true;
  } catch (error) {
    log(`API 테스트 실행 중 오류: ${error.message}`, 'error');
    return false;
  }
}

// 브라우저 테스트 실행
async function runBrowserTests() {
  log('브라우저 통합 테스트 시작', 'start');
  
  try {
    // Puppeteer 설치 확인
    try {
      require('puppeteer');
    } catch (error) {
      log('Puppeteer가 설치되지 않았습니다. 설치 중...', 'warning');
      await execAsync('npm install puppeteer');
      log('Puppeteer 설치 완료', 'success');
    }
    
    await runBrowserIntegrationTests();
    log('브라우저 통합 테스트 완료', 'finish');
    return true;
  } catch (error) {
    log(`브라우저 테스트 실행 중 오류: ${error.message}`, 'error');
    return false;
  }
}

// 수동 테스트 가이드 출력
function printManualTestGuide() {
  log('수동 테스트 가이드', 'info');
  console.log(`
📋 수동 테스트 체크리스트:

🌐 브라우저 테스트 (http://localhost:3000):
1. 페이지 로딩 확인
2. 로그인 기능 테스트
   - 올바른 이메일/비밀번호로 로그인
   - 잘못된 정보로 로그인 시도
3. 네비게이션 테스트
   - 메뉴 클릭 시 페이지 이동
   - 브라우저 뒤로가기/앞으로가기
4. 데이터 표시 테스트
   - 입찰 목록 로딩
   - 데이터 정렬/필터링
5. 폼 제출 테스트
   - 참고자료 생성/수정
   - 유효성 검사 확인
6. 반응형 디자인 테스트
   - 모바일/태블릿 뷰
   - 화면 크기 조정

🔧 API 테스트 (http://localhost:3002):
1. 헬스 체크: GET /health
2. 로그인: POST /api/auth/login
3. 입찰 목록: GET /api/bids
4. 입찰 상세: GET /api/bids/:id
5. 참고자료: GET /api/references
6. 알림: GET /api/notifications
7. 통계: GET /api/statistics

🛠️ 개발자 도구 활용:
- Network 탭: API 호출 모니터링
- Console 탭: 에러 로그 확인
- Application 탭: 로컬 스토리지 확인
- Performance 탭: 성능 측정

📊 성능 체크:
- 페이지 로드 시간 < 3초
- API 응답 시간 < 1초
- 메모리 사용량 < 100MB
`);
}

// 결과 요약 출력
function printResultsSummary() {
  log('전체 테스트 결과 요약', 'info');
  console.log(`
📊 테스트 결과:
API 테스트: ${overallResults.apiTests.passed} 통과, ${overallResults.apiTests.failed} 실패
브라우저 테스트: ${overallResults.browserTests.passed} 통과, ${overallResults.browserTests.failed} 실패
총합: ${overallResults.totalPassed} 통과, ${overallResults.totalFailed} 실패

📈 성공률: ${((overallResults.totalPassed / (overallResults.totalPassed + overallResults.totalFailed)) * 100).toFixed(1)}%

🎯 다음 단계:
1. 실패한 테스트들을 수정하세요
2. 수동 테스트를 진행하세요
3. 성능 최적화를 고려하세요
4. 사용자 피드백을 수집하세요
`);
}

// 메인 실행 함수
async function runAllIntegrationTests() {
  log('🚀 API 엔드포인트와 프론트엔드 통합 테스트 시작', 'start');
  console.log('=' * 80);
  
  // Step 1: 서버 상태 확인
  const serversReady = await checkServers();
  if (!serversReady) {
    log('서버가 준비되지 않았습니다. 테스트를 중단합니다.', 'error');
    process.exit(1);
  }
  
  // Step 2: API 테스트 실행
  log('Step 1: API 통합 테스트 실행', 'test');
  const apiTestSuccess = await runAPITests();
  
  // Step 3: 브라우저 테스트 실행
  log('Step 2: 브라우저 통합 테스트 실행', 'test');
  const browserTestSuccess = await runBrowserTests();
  
  // Step 4: 수동 테스트 가이드 출력
  log('Step 3: 수동 테스트 가이드', 'test');
  printManualTestGuide();
  
  // Step 5: 결과 요약
  log('Step 4: 결과 요약', 'test');
  printResultsSummary();
  
  // Step 6: 완료 메시지
  console.log('=' * 80);
  log('🏁 모든 통합 테스트가 완료되었습니다!', 'finish');
  
  if (apiTestSuccess && browserTestSuccess) {
    log('🎉 모든 테스트가 성공적으로 완료되었습니다!', 'success');
  } else {
    log('⚠️ 일부 테스트에서 문제가 발생했습니다. 위의 결과를 확인하세요.', 'warning');
  }
  
  log('📝 테스트 결과를 기록하고 개선 사항을 적용하세요.', 'info');
}

// 명령행 인수 처리
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'api':
    log('API 테스트만 실행합니다.', 'info');
    runAPITests();
    break;
  case 'browser':
    log('브라우저 테스트만 실행합니다.', 'info');
    runBrowserTests();
    break;
  case 'manual':
    log('수동 테스트 가이드만 출력합니다.', 'info');
    printManualTestGuide();
    break;
  case 'check':
    log('서버 상태만 확인합니다.', 'info');
    checkServers();
    break;
  default:
    // 기본적으로 모든 테스트 실행
    runAllIntegrationTests().catch(error => {
      log(`테스트 실행 중 오류 발생: ${error.message}`, 'error');
      process.exit(1);
    });
}

// 사용법 출력
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🚀 API 엔드포인트와 프론트엔드 통합 테스트

사용법:
  node run-integration-tests.js [명령]

명령:
  api      - API 테스트만 실행
  browser  - 브라우저 테스트만 실행
  manual   - 수동 테스트 가이드 출력
  check    - 서버 상태만 확인
  (없음)   - 모든 테스트 실행

예시:
  node run-integration-tests.js api
  node run-integration-tests.js browser
  node run-integration-tests.js manual

사전 요구사항:
  1. API 서버 실행 (npm run dev)
  2. React 앱 실행 (cd react-tailwind-app && npm start)
  3. Node.js 및 npm 설치
`);
  process.exit(0);
}
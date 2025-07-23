const puppeteer = require('puppeteer');
const axios = require('axios');

// 설정
const FRONTEND_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://localhost:3003/api';

// 테스트 결과
const browserTestResults = {
  passed: 0,
  failed: 0,
  errors: []
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
    browser: '🌐'
  };
  console.log(`${emoji[type]} [${timestamp}] ${message}`);
}

function logTestResult(testName, success, error = null) {
  if (success) {
    browserTestResults.passed++;
    log(`${testName}: PASSED`, 'success');
  } else {
    browserTestResults.failed++;
    browserTestResults.errors.push({ test: testName, error: error?.message || 'Unknown error' });
    log(`${testName}: FAILED - ${error?.message || 'Unknown error'}`, 'error');
  }
}

// 브라우저 테스트 클래스
class BrowserIntegrationTest {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    log('브라우저 초기화 중...', 'browser');
    this.browser = await puppeteer.launch({
      headless: false, // 테스트 중 브라우저 창을 볼 수 있도록
      slowMo: 100, // 각 액션 사이에 100ms 지연
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // 페이지 로드 타임아웃 설정
    this.page.setDefaultTimeout(10000);
    
    // 콘솔 로그 캡처
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        log(`Browser Console Error: ${msg.text()}`, 'error');
      }
    });
    
    // 네트워크 요청 모니터링
    this.page.on('request', request => {
      log(`Request: ${request.method()} ${request.url()}`, 'info');
    });
    
    this.page.on('response', response => {
      if (response.status() >= 400) {
        log(`Response Error: ${response.status()} ${response.url()}`, 'error');
      }
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Step 1: 페이지 로딩 테스트
  async testPageLoading() {
    log('Step 1: 페이지 로딩 테스트', 'test');
    
    try {
      await this.page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
      
      // 페이지 제목 확인
      const title = await this.page.title();
      if (title && title.length > 0) {
        logTestResult('Page Title Loaded', true);
      } else {
        logTestResult('Page Title Loaded', false, new Error('Page title is empty'));
      }
      
      // React 앱이 로드되었는지 확인
      const reactApp = await this.page.$('#root');
      if (reactApp) {
        logTestResult('React App Loaded', true);
      } else {
        logTestResult('React App Loaded', false, new Error('React app not found'));
      }
      
    } catch (error) {
      logTestResult('Page Loading', false, error);
    }
  }

  // Step 2: 로그인 기능 테스트
  async testLoginFunctionality() {
    log('Step 2: 로그인 기능 테스트', 'test');
    
    try {
      // 로그인 폼 요소 찾기
      const emailInput = await this.page.$('input[type="email"], input[name="email"]');
      const passwordInput = await this.page.$('input[type="password"], input[name="password"]');
      
      // JavaScript를 사용하여 로그인 버튼 찾기
      const loginButton = await this.page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('로그인') || 
          button.textContent.includes('Login') ||
          button.type === 'submit'
        );
      });
      
      if (emailInput && passwordInput && loginButton) {
        logTestResult('Login Form Elements Found', true);
        
        // 로그인 정보 입력
        await emailInput.type('user@example.com');
        await passwordInput.type('password123');
        
        // 로그인 버튼 클릭
        await loginButton.click();
        
        // 로그인 성공 확인 (토큰 저장 또는 리다이렉트)
        await this.page.waitForTimeout(2000);
        
        // 로그인 후 상태 확인
        const isLoggedIn = await this.page.evaluate(() => {
          return localStorage.getItem('token') || sessionStorage.getItem('token');
        });
        
        if (isLoggedIn) {
          logTestResult('User Login Success', true);
        } else {
          logTestResult('User Login Success', false, new Error('Login token not found'));
        }
        
      } else {
        logTestResult('Login Form Elements Found', false, new Error('Login form elements not found'));
      }
      
    } catch (error) {
      logTestResult('Login Functionality', false, error);
    }
  }

  // Step 3: 네비게이션 테스트
  async testNavigation() {
    log('Step 3: 네비게이션 테스트', 'test');
    
    try {
      // 네비게이션 메뉴 요소들 찾기
      const navItems = await this.page.$$('nav a, .nav-link, [role="navigation"] a');
      
      if (navItems.length > 0) {
        logTestResult('Navigation Menu Found', true);
        
        // 첫 번째 네비게이션 항목 클릭
        await navItems[0].click();
        await this.page.waitForTimeout(1000);
        
        // URL 변경 확인
        const currentUrl = this.page.url();
        if (currentUrl !== FRONTEND_URL) {
          logTestResult('Navigation Working', true);
        } else {
          logTestResult('Navigation Working', false, new Error('URL did not change after navigation'));
        }
        
      } else {
        logTestResult('Navigation Menu Found', false, new Error('Navigation menu not found'));
      }
      
    } catch (error) {
      logTestResult('Navigation', false, error);
    }
  }

  // Step 4: 데이터 로딩 테스트
  async testDataLoading() {
    log('Step 4: 데이터 로딩 테스트', 'test');
    
    try {
      // 데이터 테이블이나 리스트 요소 찾기
      const dataElements = await this.page.$$('table, .data-table, .list-item, [data-testid*="list"]');
      
      if (dataElements.length > 0) {
        logTestResult('Data Elements Found', true);
        
        // 데이터 로딩 상태 확인
        const loadingSpinner = await this.page.$('.loading, .spinner, [data-testid="loading"]');
        if (!loadingSpinner) {
          logTestResult('Data Loading Complete', true);
        } else {
          logTestResult('Data Loading Complete', false, new Error('Loading spinner still visible'));
        }
        
      } else {
        logTestResult('Data Elements Found', false, new Error('Data elements not found'));
      }
      
    } catch (error) {
      logTestResult('Data Loading', false, error);
    }
  }

  // Step 5: 폼 제출 테스트
  async testFormSubmission() {
    log('Step 5: 폼 제출 테스트', 'test');
    
    try {
      // 폼 요소 찾기
      const forms = await this.page.$$('form');
      
      if (forms.length > 0) {
        logTestResult('Forms Found', true);
        
        // 첫 번째 폼의 입력 필드들 찾기
        const inputs = await this.page.$$('form input, form textarea, form select');
        
        if (inputs.length > 0) {
          logTestResult('Form Inputs Found', true);
          
          // 폼 제출 버튼 찾기
          const submitButton = await this.page.$('form button[type="submit"], form input[type="submit"]');
          
          if (submitButton) {
            logTestResult('Submit Button Found', true);
          } else {
            logTestResult('Submit Button Found', false, new Error('Submit button not found'));
          }
          
        } else {
          logTestResult('Form Inputs Found', false, new Error('Form inputs not found'));
        }
        
      } else {
        logTestResult('Forms Found', false, new Error('No forms found on page'));
      }
      
    } catch (error) {
      logTestResult('Form Submission', false, error);
    }
  }

  // Step 6: 에러 처리 테스트
  async testErrorHandling() {
    log('Step 6: 에러 처리 테스트', 'test');
    
    try {
      // 에러 메시지 요소 찾기
      const errorElements = await this.page.$$('.error, .alert-error, [data-testid*="error"]');
      
      if (errorElements.length === 0) {
        logTestResult('No Error Messages Displayed', true);
      } else {
        logTestResult('No Error Messages Displayed', false, new Error('Error messages are displayed'));
      }
      
      // 네트워크 에러 시뮬레이션 (선택적)
      // await this.page.setOfflineMode(true);
      // await this.page.reload();
      // await this.page.waitForTimeout(2000);
      
    } catch (error) {
      logTestResult('Error Handling', false, error);
    }
  }

  // Step 7: 반응형 디자인 테스트
  async testResponsiveDesign() {
    log('Step 7: 반응형 디자인 테스트', 'test');
    
    try {
      // 모바일 뷰포트 설정
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(1000);
      
      // 모바일에서 요소들이 제대로 표시되는지 확인
      const mobileElements = await this.page.$$('nav, .mobile-menu, .hamburger');
      
      if (mobileElements.length > 0) {
        logTestResult('Mobile Responsive Elements', true);
      } else {
        logTestResult('Mobile Responsive Elements', false, new Error('Mobile responsive elements not found'));
      }
      
      // 데스크톱 뷰포트로 복원
      await this.page.setViewport({ width: 1920, height: 1080 });
      await this.page.waitForTimeout(1000);
      
    } catch (error) {
      logTestResult('Responsive Design', false, error);
    }
  }

  // Step 8: 성능 테스트
  async testPerformance() {
    log('Step 8: 성능 테스트', 'test');
    
    try {
      // 페이지 로드 성능 측정
      const startTime = Date.now();
      await this.page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;
      
      if (loadTime < 5000) {
        logTestResult('Page Load Performance', true);
        log(`Page load time: ${loadTime}ms`, 'info');
      } else {
        logTestResult('Page Load Performance', false, new Error(`Page load time too slow: ${loadTime}ms`));
      }
      
      // 메모리 사용량 확인
      const metrics = await this.page.metrics();
      const memoryUsage = metrics.JSHeapUsedSize / 1024 / 1024; // MB
      
      if (memoryUsage < 100) {
        logTestResult('Memory Usage', true);
        log(`Memory usage: ${memoryUsage.toFixed(2)}MB`, 'info');
      } else {
        logTestResult('Memory Usage', false, new Error(`Memory usage too high: ${memoryUsage.toFixed(2)}MB`));
      }
      
    } catch (error) {
      logTestResult('Performance', false, error);
    }
  }

  // 메인 테스트 실행 함수
  async runBrowserTests() {
    log('🚀 브라우저 통합 테스트 시작', 'test');
    log('=' * 60, 'info');
    
    try {
      await this.init();
      
      // Step 1-8: 브라우저 테스트들
      await this.testPageLoading();
      await this.testLoginFunctionality();
      await this.testNavigation();
      await this.testDataLoading();
      await this.testFormSubmission();
      await this.testErrorHandling();
      await this.testResponsiveDesign();
      await this.testPerformance();
      
    } catch (error) {
      log(`브라우저 테스트 실행 중 오류: ${error.message}`, 'error');
    } finally {
      await this.cleanup();
    }
    
    // 결과 요약
    log('=' * 60, 'info');
    log('📊 브라우저 테스트 결과 요약', 'test');
    log(`✅ 통과: ${browserTestResults.passed}`, 'success');
    log(`❌ 실패: ${browserTestResults.failed}`, 'error');
    log(`📈 성공률: ${((browserTestResults.passed / (browserTestResults.passed + browserTestResults.failed)) * 100).toFixed(1)}%`, 'info');
    
    if (browserTestResults.errors.length > 0) {
      log('\n❌ 실패한 브라우저 테스트들:', 'error');
      browserTestResults.errors.forEach((error, index) => {
        log(`${index + 1}. ${error.test}: ${error.error}`, 'error');
      });
    }
    
    log('\n🎯 브라우저 테스트 완료', 'info');
    log('1. 실패한 테스트들을 수정하세요', 'info');
    log('2. 수동으로 브라우저에서 확인하세요', 'info');
    log('3. 사용자 경험을 개선하세요', 'info');
  }
}

// 테스트 실행
async function runBrowserIntegrationTests() {
  const browserTest = new BrowserIntegrationTest();
  await browserTest.runBrowserTests();
}

// 메인 실행
if (require.main === module) {
  runBrowserIntegrationTests().catch(error => {
    log(`브라우저 테스트 실행 중 오류 발생: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  runBrowserIntegrationTests,
  BrowserIntegrationTest,
  browserTestResults
};
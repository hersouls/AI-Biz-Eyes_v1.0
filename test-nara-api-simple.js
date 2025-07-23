const fetch = require('node-fetch');

// 나라장터 API 설정
const NARA_API_CONFIG = {
  baseUrl: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
  serviceKey: 'w8uFE+fALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM/qByWrt9gZ406/ITajbX1Q8/ESHI1LDoADaTMcg=='
};

async function testBasicConnection() {
  try {
    const url = new URL(NARA_API_CONFIG.baseUrl);
    url.searchParams.set('serviceKey', NARA_API_CONFIG.serviceKey);
    url.searchParams.set('type', 'json');
    
    console.log('🔗 기본 연결 테스트');
    console.log('📡 URL:', url.toString());
    
    const response = await fetch(url.toString());
    console.log('📊 HTTP 상태:', response.status, response.statusText);
    
    const text = await response.text();
    console.log('📋 응답:', text.substring(0, 500));
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

testBasicConnection();
const axios = require('axios');
require('dotenv').config();

const WEBHOOK_URL = process.env.WEBHOOK_URL;

console.log('🚀 조달청 API Webhook (인증 없음) 테스트 시작\n');

// Mock 데이터 생성
function createMockBidData() {
  return {
    totalCount: 100,
    pageNo: 1,
    numOfRows: 10,
    items: [
      {
        bidNtceNo: '2025-001',
        bidNtceNm: 'AI 시스템 구축 사업',
        dminsttNm: '과학기술정보통신부',
        bidMethdNm: '일반입찰',
        presmptPrce: '500000000',
        bidNtceDt: '2025-01-01',
        opengDt: '2025-01-15'
      }
    ]
  };
}

// Webhook 전송 함수 (인증 없음)
async function sendWebhook(data, type) {
  const payload = {
    timestamp: new Date().toISOString(),
    source: 'G2B_API',
    message: '조달청 API 데이터 전송',
    data: data,
    metadata: {
      type: type,
      totalCount: data.totalCount,
      pageNo: data.pageNo,
      numOfRows: data.numOfRows
    }
  };

  try {
    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'G2B-Webhook-Service/1.0'
      },
      timeout: 30000
    });

    console.log(`✅ ${type} 데이터 전송 성공: ${response.status} ${response.statusText}`);
    return true;
  } catch (error) {
    console.error(`❌ ${type} 데이터 전송 실패:`, error.response?.status || error.message);
    if (axios.isAxiosError(error)) {
      console.error('응답 상태:', error.response?.status);
      console.error('응답 데이터:', error.response?.data);
    }
    return false;
  }
}

// 메인 테스트 함수
async function runTests() {
  console.log('📋 환경 설정 확인:');
  console.log(`   Webhook URL: ${WEBHOOK_URL ? '✅ 설정됨' : '❌ 설정되지 않음'}\n`);

  // 입찰공고 데이터 전송
  console.log('1️⃣ 입찰공고 데이터 전송 테스트 (인증 없음)...');
  const bidData = createMockBidData();
  const result = await sendWebhook(bidData, 'bid_notice');

  if (result) {
    console.log('\n🎉 Webhook 전송이 성공했습니다!');
    console.log('\n📤 전송된 데이터:');
    console.log(JSON.stringify(bidData, null, 2));
  } else {
    console.log('\n⚠️  Webhook 전송에 실패했습니다.');
    console.log('\n💡 해결 방법:');
    console.log('   1. Webhook URL이 유효한지 확인');
    console.log('   2. 네트워크 연결 상태 확인');
    console.log('   3. Webhook 서비스 상태 확인');
  }
}

// 실행
runTests().catch(console.error);
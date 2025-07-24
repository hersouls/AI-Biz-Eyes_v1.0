const axios = require('axios');
require('dotenv').config();

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const API_KEY = process.env.WEBHOOK_API_KEY;

console.log('🚀 조달청 API Webhook 직접 테스트 시작\n');

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
      },
      {
        bidNtceNo: '2025-002',
        bidNtceNm: '클라우드 인프라 구축',
        dminsttNm: '행정안전부',
        bidMethdNm: '일반입찰',
        presmptPrce: '300000000',
        bidNtceDt: '2025-01-02',
        opengDt: '2025-01-16'
      }
    ]
  };
}

function createMockPreNoticeData() {
  return {
    totalCount: 50,
    pageNo: 1,
    numOfRows: 10,
    items: [
      {
        preBidNtceNo: 'PRE-2025-001',
        preBidNtceNm: '사전공고 AI 시스템',
        dminsttNm: '과학기술정보통신부',
        preBidNtceDt: '2025-01-01'
      }
    ]
  };
}

function createMockContractData() {
  return {
    totalCount: 75,
    pageNo: 1,
    numOfRows: 10,
    items: [
      {
        cntrctNo: 'CTR-2025-001',
        cntrctNm: 'AI 시스템 구축 계약',
        dminsttNm: '과학기술정보통신부',
        cntrctMthdNm: '일반계약',
        cntrctPrce: '500000000',
        cntrctDt: '2025-01-01'
      }
    ]
  };
}

// Webhook 전송 함수
async function sendWebhook(data, type) {
  const payload = {
    timestamp: new Date().toISOString(),
    source: 'G2B_API',
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
        'Authorization': `Bearer ${API_KEY}`,
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
  console.log(`   Webhook URL: ${WEBHOOK_URL ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
  console.log(`   API Key: ${API_KEY ? '✅ 설정됨' : '❌ 설정되지 않음'}\n`);

  const results = {
    bidNotice: false,
    preNotice: false,
    contract: false
  };

  // 입찰공고 데이터 전송
  console.log('1️⃣ 입찰공고 데이터 전송 테스트...');
  const bidData = createMockBidData();
  results.bidNotice = await sendWebhook(bidData, 'bid_notice');

  // 사전공고 데이터 전송
  console.log('\n2️⃣ 사전공고 데이터 전송 테스트...');
  const preNoticeData = createMockPreNoticeData();
  results.preNotice = await sendWebhook(preNoticeData, 'pre_notice');

  // 계약현황 데이터 전송
  console.log('\n3️⃣ 계약현황 데이터 전송 테스트...');
  const contractData = createMockContractData();
  results.contract = await sendWebhook(contractData, 'contract_status');

  // 결과 요약
  console.log('\n📊 테스트 결과 요약:');
  console.log('='.repeat(50));
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ 성공' : '❌ 실패';
    console.log(`${test.padEnd(20)}: ${status}`);
  });

  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log('='.repeat(50));
  console.log(`총 ${totalCount}개 테스트 중 ${successCount}개 성공 (${Math.round(successCount/totalCount*100)}%)`);

  if (successCount === totalCount) {
    console.log('\n🎉 모든 테스트가 성공했습니다!');
  } else {
    console.log('\n⚠️  일부 테스트가 실패했습니다.');
    console.log('\n💡 해결 방법:');
    console.log('   1. Webhook URL이 유효한지 확인');
    console.log('   2. API 키가 올바른지 확인');
    console.log('   3. 네트워크 연결 상태 확인');
  }

  // 전송된 데이터 샘플 출력
  console.log('\n📤 전송된 데이터 샘플:');
  console.log('입찰공고:', JSON.stringify(bidData, null, 2));
}

// 실행
runTests().catch(console.error);
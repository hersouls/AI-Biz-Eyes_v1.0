const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3003';
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const API_KEY = process.env.WEBHOOK_API_KEY;

console.log('🚀 조달청 API Webhook 테스트 시작\n');

// Webhook 연결 테스트
async function testWebhookConnection() {
  console.log('1️⃣ Webhook 연결 테스트...');
  try {
    const response = await axios.get(`${BASE_URL}/api/webhook/test`);
    console.log('✅ Webhook 연결 성공:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Webhook 연결 실패:', error.response?.data || error.message);
    return false;
  }
}

// 입찰공고 데이터 전송 테스트
async function testBidNoticeWebhook() {
  console.log('\n2️⃣ 입찰공고 데이터 Webhook 전송 테스트...');
  try {
    const response = await axios.post(`${BASE_URL}/api/webhook/bid-notice`, {}, {
      params: {
        pageNo: 1,
        numOfRows: 5,
        fromDt: '20240101',
        toDt: '20241231'
      }
    });
    console.log('✅ 입찰공고 데이터 전송 성공:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 입찰공고 데이터 전송 실패:', error.response?.data || error.message);
    return false;
  }
}

// 사전공고 데이터 전송 테스트
async function testPreNoticeWebhook() {
  console.log('\n3️⃣ 사전공고 데이터 Webhook 전송 테스트...');
  try {
    const response = await axios.post(`${BASE_URL}/api/webhook/pre-notice`, {}, {
      params: {
        pageNo: 1,
        numOfRows: 5,
        fromDt: '20240101',
        toDt: '20241231'
      }
    });
    console.log('✅ 사전공고 데이터 전송 성공:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 사전공고 데이터 전송 실패:', error.response?.data || error.message);
    return false;
  }
}

// 계약현황 데이터 전송 테스트
async function testContractWebhook() {
  console.log('\n4️⃣ 계약현황 데이터 Webhook 전송 테스트...');
  try {
    const response = await axios.post(`${BASE_URL}/api/webhook/contract`, {}, {
      params: {
        pageNo: 1,
        numOfRows: 5,
        fromDt: '20240101',
        toDt: '20241231'
      }
    });
    console.log('✅ 계약현황 데이터 전송 성공:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 계약현황 데이터 전송 실패:', error.response?.data || error.message);
    return false;
  }
}

// 일괄 데이터 전송 테스트
async function testAllDataWebhook() {
  console.log('\n5️⃣ 일괄 데이터 Webhook 전송 테스트...');
  try {
    const response = await axios.post(`${BASE_URL}/api/webhook/all`, {}, {
      params: {
        pageNo: 1,
        numOfRows: 3,
        fromDt: '20240101',
        toDt: '20241231'
      }
    });
    console.log('✅ 일괄 데이터 전송 성공:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 일괄 데이터 전송 실패:', error.response?.data || error.message);
    return false;
  }
}

// 직접 webhook 테스트
async function testDirectWebhook() {
  console.log('\n6️⃣ 직접 Webhook 전송 테스트...');
  try {
    const testPayload = {
      timestamp: new Date().toISOString(),
      source: 'G2B_API_TEST',
      message: '직접 webhook 테스트',
      data: {
        test: true,
        timestamp: new Date().toISOString(),
        sampleData: {
          bidNo: 'TEST-2025-001',
          bidTitle: '테스트 입찰공고',
          bidDate: '2025-01-01',
          bidAmount: '100000000'
        }
      }
    };

    const response = await axios.post(WEBHOOK_URL, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': 'G2B-Webhook-Test/1.0'
      },
      timeout: 10000
    });

    console.log('✅ 직접 Webhook 전송 성공:', response.status, response.statusText);
    return true;
  } catch (error) {
    console.error('❌ 직접 Webhook 전송 실패:', error.response?.data || error.message);
    return false;
  }
}

// 메인 테스트 함수
async function runAllTests() {
  console.log('📋 환경 설정 확인:');
  console.log(`   Webhook URL: ${WEBHOOK_URL ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
  console.log(`   API Key: ${API_KEY ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
  console.log(`   Base URL: ${BASE_URL}\n`);

  const results = {
    webhookConnection: await testWebhookConnection(),
    bidNotice: await testBidNoticeWebhook(),
    preNotice: await testPreNoticeWebhook(),
    contract: await testContractWebhook(),
    allData: await testAllDataWebhook(),
    directWebhook: await testDirectWebhook()
  };

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
    console.log('\n⚠️  일부 테스트가 실패했습니다. 로그를 확인해주세요.');
  }
}

// 서버 상태 확인
async function checkServerStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ 서버가 정상적으로 실행 중입니다.');
    return true;
  } catch (error) {
    console.error('❌ 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    console.error('   서버 실행 명령어: npm run dev');
    return false;
  }
}

// 메인 실행
async function main() {
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    process.exit(1);
  }

  await runAllTests();
}

main().catch(console.error);
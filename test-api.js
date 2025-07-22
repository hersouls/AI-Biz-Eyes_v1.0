const axios = require('axios');

const BASE_URL = 'https://bizeyes.moonwave.kr/api';

// 테스트 함수들
async function testHealthCheck() {
  try {
    console.log('🏥 Testing Health Check...');
    const response = await axios.get('https://bizeyes.moonwave.kr/api/health');
    console.log('✅ Health Check:', response.data);
  } catch (error) {
    console.error('❌ Health Check failed:', error.message);
  }
}

async function testLogin() {
  try {
    console.log('\n🔐 Testing Login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful:', {
      user: response.data.data.user.name,
      token: response.data.data.token.substring(0, 20) + '...'
    });
    return response.data.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

async function testBidsList(token) {
  try {
    console.log('\n📋 Testing Bids List...');
    const response = await axios.get(`${BASE_URL}/bids?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Bids List:', {
      total: response.data.data.pagination.total,
      page: response.data.data.pagination.page,
      bids: response.data.data.bids.length
    });
  } catch (error) {
    console.error('❌ Bids List failed:', error.response?.data || error.message);
  }
}

async function testBidDetail(token) {
  try {
    console.log('\n📄 Testing Bid Detail...');
    const response = await axios.get(`${BASE_URL}/bids/1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Bid Detail:', {
      id: response.data.data.id,
      name: response.data.data.bidNtceNm,
      organization: response.data.data.ntceInsttNm
    });
  } catch (error) {
    console.error('❌ Bid Detail failed:', error.response?.data || error.message);
  }
}

async function testBidStatistics(token) {
  try {
    console.log('\n📊 Testing Bid Statistics...');
    const response = await axios.get(`${BASE_URL}/bids/statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Bid Statistics:', {
      totalBids: response.data.data.totalBids,
      newBids: response.data.data.newBids,
      urgentBids: response.data.data.urgentBids
    });
  } catch (error) {
    console.error('❌ Bid Statistics failed:', error.response?.data || error.message);
  }
}

async function testReferencesList(token) {
  try {
    console.log('\n📚 Testing References List...');
    const response = await axios.get(`${BASE_URL}/references?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ References List:', {
      total: response.data.data.pagination.total,
      page: response.data.data.pagination.page,
      references: response.data.data.references.length
    });
  } catch (error) {
    console.error('❌ References List failed:', error.response?.data || error.message);
  }
}

async function testCreateReference(token) {
  try {
    console.log('\n➕ Testing Create Reference...');
    const response = await axios.post(`${BASE_URL}/references`, {
      projectName: '테스트 프로젝트',
      projectType: '용역',
      contractAmount: 300000000,
      status: 'success'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Create Reference:', {
      id: response.data.data.id,
      name: response.data.data.projectName,
      message: response.data.message
    });
  } catch (error) {
    console.error('❌ Create Reference failed:', error.response?.data || error.message);
  }
}

async function testNotificationsList(token) {
  try {
    console.log('\n🔔 Testing Notifications List...');
    const response = await axios.get(`${BASE_URL}/notifications?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Notifications List:', {
      total: response.data.data.pagination.total,
      page: response.data.data.pagination.page,
      notifications: response.data.data.notifications.length
    });
  } catch (error) {
    console.error('❌ Notifications List failed:', error.response?.data || error.message);
  }
}

async function testUserInfo(token) {
  try {
    console.log('\n👤 Testing User Info...');
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ User Info:', {
      name: response.data.data.name,
      email: response.data.data.email,
      role: response.data.data.role
    });
  } catch (error) {
    console.error('❌ User Info failed:', error.response?.data || error.message);
  }
}

// 메인 테스트 함수
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // 헬스 체크
  await testHealthCheck();
  
  // 로그인
  const token = await testLogin();
  
  if (token) {
    // 인증이 필요한 API 테스트
    await testUserInfo(token);
    await testBidsList(token);
    await testBidDetail(token);
    await testBidStatistics(token);
    await testReferencesList(token);
    await testCreateReference(token);
    await testNotificationsList(token);
  }
  
  console.log('\n✨ API Tests completed!');
}

// 테스트 실행
runTests().catch(console.error);
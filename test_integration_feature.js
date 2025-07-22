const axios = require('axios');

const BASE_URL = 'https://bizeyes.moonwave.kr/api/integration';

async function testIntegrationAPI() {
  console.log('🧪 Testing External System Integration Feature...\n');
  
  try {
    // Test 1: Get Integration Stats
    console.log('1. Testing Integration Stats...');
    const statsResponse = await axios.get(`${BASE_URL}/stats`);
    console.log('✅ Stats API:', statsResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Data:', statsResponse.data.data);
    
    // Test 2: Get Integration Systems
    console.log('\n2. Testing Integration Systems...');
    const systemsResponse = await axios.get(`${BASE_URL}/systems`);
    console.log('✅ Systems API:', systemsResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Total Systems:', systemsResponse.data.data.length);
    
    // Test 3: Get Integration Logs
    console.log('\n3. Testing Integration Logs...');
    const logsResponse = await axios.get(`${BASE_URL}/logs?page=1&limit=5`);
    console.log('✅ Logs API:', logsResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Total Logs:', logsResponse.data.data.pagination.total);
    
    // Test 4: Get Field Mappings
    console.log('\n4. Testing Field Mappings...');
    const mappingsResponse = await axios.get(`${BASE_URL}/mappings`);
    console.log('✅ Mappings API:', mappingsResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Total Mappings:', mappingsResponse.data.data.length);
    
    // Test 5: Test Integration System
    console.log('\n5. Testing Integration System Test...');
    const testResponse = await axios.post(`${BASE_URL}/systems/1/test`);
    console.log('✅ Test API:', testResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Test Result:', testResponse.data.message);
    
    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📋 Frontend Access:');
    console.log('   - Main App: https://bizeyes.moonwave.kr');
    console.log('   - Integration Page: https://bizeyes.moonwave.kr/integration');
    console.log('\n🔧 Backend API:');
    console.log('   - Base URL: https://bizeyes.moonwave.kr/api/integration');
    console.log('   - Health Check: https://bizeyes.moonwave.kr/api/health');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testIntegrationAPI();
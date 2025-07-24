import g2bApiService from './services/g2bApiService';

// 실제 조달청 API 테스트
async function testG2BApi() {
  console.log('=== 조달청 API 테스트 시작 ===');
  
  try {
    // 1. API 상태 확인
    console.log('1. API 상태 확인 중...');
    const status = await g2bApiService.checkApiStatus();
    console.log('API 상태:', status);
    
    if (!status.isAvailable) {
      console.error('API를 사용할 수 없습니다.');
      return;
    }
    
    // 2. 입찰공고 목록 조회
    console.log('\n2. 입찰공고 목록 조회 중...');
    const bidList = await g2bApiService.getBidList({
      pageNo: 1,
      numOfRows: 5
    });
    console.log('입찰공고 목록:', bidList);
    
    // 3. 키워드 검색
    console.log('\n3. 키워드 검색 중...');
    const searchResults = await g2bApiService.searchBidsByKeyword('시스템', {
      pageNo: 1,
      numOfRows: 3
    });
    console.log('검색 결과:', searchResults);
    
    // 4. 첫 번째 입찰공고 상세 조회
    if (bidList.bids.length > 0) {
      console.log('\n4. 입찰공고 상세 조회 중...');
      const firstBid = bidList.bids[0];
      const bidDetail = await g2bApiService.getBidDetail(firstBid.bidNtceNo);
      console.log('입찰공고 상세:', bidDetail);
    }
    
    console.log('\n=== 테스트 완료 ===');
    
  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
  }
}

// 브라우저에서 실행할 수 있도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  (window as any).testG2BApi = testG2BApi;
}

export default testG2BApi;
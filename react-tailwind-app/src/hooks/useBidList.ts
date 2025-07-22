import { useState, useCallback } from 'react';
import { BidData, BidListFilters } from '../types/bid';

// 나라장터 OpenAPI 설정
const API_CONFIG = {
  BASE_URL: 'https://openapi.g2b.go.kr:8090/openapi/service/rest/CpcpBidInfoService',
  SERVICE_KEY: process.env.REACT_APP_G2B_SERVICE_KEY || 'YOUR_SERVICE_KEY_HERE',
  DEFAULT_PAGE_SIZE: 20
};

// API 응답 타입
// interface ApiResponse {
//   response: {
//     body: {
//       items: BidData[];
//       numOfRows: number;
//       pageNo: number;
//       totalCount: number;
//     };
//     header: {
//       resultCode: string;
//       resultMsg: string;
//     };
//   };
// }

// 훅 반환 타입
interface UseBidListReturn {
  bids: BidData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  fetchBids: (params: {
    page: number;
    pageSize: number;
    searchKeyword: string;
    filters: BidListFilters;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) => Promise<void>;
  exportBids: (selectedBids: string[], format: 'excel' | 'csv') => Promise<void>;
}

export const useBidList = (): UseBidListReturn => {
  const [bids, setBids] = useState<BidData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);



  // API 호출
  const fetchBids = useCallback(async (params: {
    page: number;
    pageSize: number;
    searchKeyword: string;
    filters: BidListFilters;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) => {
    setLoading(true);
    setError(null);

    try {
      // 실제 API 호출 대신 목업 데이터 사용 (개발용)
      const mockData = generateMockBids(params.page, params.pageSize);
      
      // API 응답 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBids(mockData.items);
      setTotalCount(mockData.totalCount);
      
      // 실제 API 호출 시 사용할 코드:
      /*
      const url = buildApiUrl(params);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.response.header.resultCode !== '00') {
        throw new Error(`API 오류: ${data.response.header.resultMsg}`);
      }
      
      const items = data.response.body.items || [];
      setBids(items);
      setTotalCount(data.response.body.totalCount);
      */
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('공고 목록 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 데이터 내보내기
  const exportBids = useCallback(async (selectedBids: string[], format: 'excel' | 'csv') => {
    try {
      const selectedData = bids.filter(bid => selectedBids.includes(bid.bidNtceNo));
      
      if (format === 'csv') {
        exportToCSV(selectedData);
      } else {
        exportToExcel(selectedData);
      }
    } catch (err) {
      console.error('데이터 내보내기 오류:', err);
      alert('데이터 내보내기 중 오류가 발생했습니다.');
    }
  }, [bids]);

  // CSV 내보내기
  const exportToCSV = (data: BidData[]) => {
    const headers = [
      '공고번호', '공고명', '공고기관명', '업무구분', '상태', 
      '공고일자', '마감일자', '예산금액', '추정가격'
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(bid => [
        bid.bidNtceNo,
        `"${bid.bidNtceNm}"`,
        `"${bid.ntceInsttNm}"`,
        bid.bsnsDivNm,
        bid.bidNtceSttusNm,
        bid.bidNtceDate,
        bid.bidClseDate,
        bid.asignBdgtAmt?.toString() || '',
        bid.presmptPrce?.toString() || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `공고목록_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Excel 내보내기 (간단한 구현)
  const exportToExcel = (data: BidData[]) => {
    // 실제 구현에서는 xlsx 라이브러리 사용 권장
    alert('Excel 내보내기 기능은 추가 라이브러리 설치가 필요합니다.');
  };

  return {
    bids,
    loading,
    error,
    totalCount,
    fetchBids,
    exportBids
  };
};

// 목업 데이터 생성 (개발용)
const generateMockBids = (page: number, pageSize: number) => {
  const mockBids: BidData[] = [];
  const startIndex = (page - 1) * pageSize;
  
  const statuses = ['일반공고', '긴급공고', '정정공고', '재공고', '취소공고'];
  const businessTypes = ['공사', '용역', '물품'];
  const institutions = [
    '조달청', '서울특별시', '부산광역시', '대구광역시', '인천광역시',
    '광주광역시', '대전광역시', '울산광역시', '경기도', '강원도'
  ];
  
  for (let i = 0; i < pageSize; i++) {
    const index = startIndex + i;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    const institution = institutions[Math.floor(Math.random() * institutions.length)];
    
    const bidDate = new Date();
    bidDate.setDate(bidDate.getDate() - Math.floor(Math.random() * 30));
    
    const closeDate = new Date(bidDate);
    closeDate.setDate(closeDate.getDate() + Math.floor(Math.random() * 30) + 7);
    
    const budget = Math.floor(Math.random() * 1000000000) + 10000000;
    
    mockBids.push({
      bidNtceNo: `2024${String(index + 1).padStart(8, '0')}`,
      bidNtceOrd: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 2 : undefined,
      bidNtceNm: `${institution} ${businessType} 입찰공고 ${index + 1}`,
      bidNtceSttusNm: status,
      bsnsDivNm: businessType,
      ntceInsttNm: institution,
      dmndInsttNm: Math.random() > 0.7 ? `${institution} 하부기관` : undefined,
      asignBdgtAmt: budget,
      presmptPrce: Math.floor(budget * 0.9),
      bidNtceDate: bidDate.toISOString().split('T')[0],
      bidNtceBgn: '09:00',
      bidClseDate: closeDate.toISOString().split('T')[0],
      bidClseTm: '18:00',
      opengDate: closeDate.toISOString().split('T')[0],
      opengTm: '19:00',
      elctrnBidYn: Math.random() > 0.3 ? 'Y' : 'N',
      intrntnlBidYn: Math.random() > 0.9 ? 'Y' : 'N',
      cmmnCntrctYn: Math.random() > 0.8 ? 'Y' : 'N',
      cntrctCnclsSttusNm: '일반계약',
      cntrctCnclsMthdNm: '일반입찰',
      bidwinrDcsnMthdNm: '최저가',
      rgnLmtYn: Math.random() > 0.7 ? 'Y' : 'N',
      prtcptPsblRgnNm: Math.random() > 0.7 ? '전국' : undefined,
      indstrytyLmtYn: Math.random() > 0.8 ? 'Y' : 'N',
      bidprcPsblIndstrytyNm: Math.random() > 0.8 ? '전기공사업' : undefined,
      rsrvtnPrceDcsnMthdNm: '예정가격공개',
      presnatnOprtnYn: Math.random() > 0.6 ? 'Y' : 'N',
      presnatnOprtnDate: Math.random() > 0.6 ? bidDate.toISOString().split('T')[0] : undefined,
      presnatnOprtnTm: Math.random() > 0.6 ? '14:00' : undefined,
      presnatnOprtnPlce: Math.random() > 0.6 ? `${institution} 대회의실` : undefined,
      ntceInsttOfclDeptNm: '조달과',
      ntceInsttOfclNm: '홍길동',
      ntceInsttOfclTel: '02-1234-5678',
      ntceInsttOfclEmailAdrs: 'hong@example.com',
      dmndInsttOfclDeptNm: '기획과',
      dmndInsttOfclNm: '김철수',
      dmndInsttOfclTel: '02-2345-6789',
      dmndInsttOfclEmailAdrs: 'kim@example.com',
      bidNtceUrl: `https://www.g2b.go.kr:8101/ep/main/bid/bidDetail.do?bidNo=${index + 1}`,
      refNtceNo: Math.random() > 0.9 ? `2024${String(Math.floor(Math.random() * 1000)).padStart(8, '0')}` : undefined,
      internalStatus: Math.random() > 0.7 ? '검토중' : undefined,
      isUrgent: status === '긴급공고',
      isDeadlineNear: Math.random() > 0.8,
      isNew: Math.random() > 0.9,
      participationStatus: Math.random() > 0.6 ? ['참여예정', '참여중', '참여완료', '검토중'][Math.floor(Math.random() * 4)] : undefined,
      referenceMatchCount: Math.floor(Math.random() * 5),
      aiRecommendationScore: Math.floor(Math.random() * 100) + 1
    });
  }
  
  return {
    items: mockBids,
    totalCount: 1000 // 총 1000개의 목업 데이터
  };
};
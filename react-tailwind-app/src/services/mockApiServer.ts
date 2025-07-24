// Mock API Server for development
// This simulates a real API server with proper response structures

import { PublicDataResponse, PublicDataItem, PublicDataFilters } from '../types/publicData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate API errors
const simulateApiError = (probability: number = 0.1) => {
  if (Math.random() < probability) {
    throw new Error('API temporarily unavailable');
  }
};

// Mock API Response Wrapper
const createApiResponse = <T>(data: T, success: boolean = true, message: string = 'Success') => {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
    requestId: `req_${Math.random().toString(36).substr(2, 9)}`
  };
};

// Mock API Error Response
const createErrorResponse = (message: string, code: string = 'API_ERROR') => {
  return {
    success: false,
    error: {
      code,
      message,
      timestamp: new Date().toISOString()
    },
    data: null
  };
};

// Extended Mock Data
const extendedMockData: PublicDataItem[] = [
  {
    id: 1,
    title: '2024년 IT 시스템 구축 사업 현황',
    description: '전국 지방자치단체 IT 시스템 구축 사업 현황 데이터',
    category: 'IT/소프트웨어',
    organization: '행정안전부',
    publishDate: '2024-07-22',
    updateDate: '2024-07-22',
    dataType: 'JSON',
    fileSize: '2.5MB',
    downloadCount: 1250,
    viewCount: 3450,
    tags: ['IT', '시스템구축', '지방자치단체'],
    url: 'https://api.odcloud.kr/api/1234567/v1/uddi:12345678-1234-1234-1234-123456789012',
    format: 'json',
    encoding: 'UTF-8',
    isOpen: true,
    isFree: true,
    license: 'CC BY 4.0',
    contact: {
      name: '김철수',
      email: 'kim@mopas.go.kr',
      phone: '02-1234-5678'
    }
  },
  {
    id: 2,
    title: '스마트시티 구축 사업 데이터',
    description: '전국 스마트시티 구축 사업 현황 및 성과 데이터',
    category: '도시/교통',
    organization: '국토교통부',
    publishDate: '2024-07-20',
    updateDate: '2024-07-21',
    dataType: 'CSV',
    fileSize: '1.8MB',
    downloadCount: 890,
    viewCount: 2100,
    tags: ['스마트시티', 'IoT', '도시계획'],
    url: 'https://api.odcloud.kr/api/1234567/v1/uddi:87654321-4321-4321-4321-210987654321',
    format: 'csv',
    encoding: 'UTF-8',
    isOpen: true,
    isFree: true,
    license: 'CC BY 4.0',
    contact: {
      name: '이영희',
      email: 'lee@molit.go.kr',
      phone: '02-2345-6789'
    }
  },
  {
    id: 3,
    title: '기업 입찰 참여 현황 통계',
    description: '전국 기업별 입찰 참여 현황 및 성과 통계 데이터',
    category: '경제/금융',
    organization: '중소기업청',
    publishDate: '2024-07-18',
    updateDate: '2024-07-19',
    dataType: 'XML',
    fileSize: '3.2MB',
    downloadCount: 1560,
    viewCount: 4200,
    tags: ['기업', '입찰', '통계', '중소기업'],
    url: 'https://api.odcloud.kr/api/1234567/v1/uddi:11111111-2222-3333-4444-555555555555',
    format: 'xml',
    encoding: 'UTF-8',
    isOpen: true,
    isFree: true,
    license: 'CC BY 4.0',
    contact: {
      name: '박민수',
      email: 'park@semas.go.kr',
      phone: '02-3456-7890'
    }
  },
  {
    id: 4,
    title: 'AI 기술 개발 사업 현황',
    description: '정부 AI 기술 개발 사업 현황 및 투자 실적 데이터',
    category: '과학기술',
    organization: '과학기술정보통신부',
    publishDate: '2024-07-15',
    updateDate: '2024-07-16',
    dataType: 'JSON',
    fileSize: '4.1MB',
    downloadCount: 2100,
    viewCount: 5800,
    tags: ['AI', '기술개발', '투자', '과학기술'],
    url: 'https://api.odcloud.kr/api/1234567/v1/uddi:aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    format: 'json',
    encoding: 'UTF-8',
    isOpen: true,
    isFree: true,
    license: 'CC BY 4.0',
    contact: {
      name: '최지영',
      email: 'choi@msit.go.kr',
      phone: '02-4567-8901'
    }
  },
  {
    id: 5,
    title: '환경 친화적 건설 사업 데이터',
    description: '친환경 건설 사업 현황 및 환경 영향 평가 데이터',
    category: '환경/에너지',
    organization: '환경부',
    publishDate: '2024-07-12',
    updateDate: '2024-07-13',
    dataType: 'CSV',
    fileSize: '2.8MB',
    downloadCount: 980,
    viewCount: 2800,
    tags: ['환경', '건설', '친환경', '영향평가'],
    url: 'https://api.odcloud.kr/api/1234567/v1/uddi:bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
    format: 'csv',
    encoding: 'UTF-8',
    isOpen: true,
    isFree: true,
    license: 'CC BY 4.0',
    contact: {
      name: '정수진',
      email: 'jung@me.go.kr',
      phone: '02-5678-9012'
    }
  },
  {
    id: 6,
    title: '디지털 헬스케어 서비스 현황',
    description: '전국 디지털 헬스케어 서비스 현황 및 이용 통계',
    category: '의료/복지',
    organization: '보건복지부',
    publishDate: '2024-07-10',
    updateDate: '2024-07-11',
    dataType: 'XLSX',
    fileSize: '1.5MB',
    downloadCount: 750,
    viewCount: 1800,
    tags: ['헬스케어', '디지털', '의료', '복지'],
    url: 'https://api.odcloud.kr/api/1234567/v1/uddi:cccccccc-dddd-eeee-ffff-gggggggggggg',
    format: 'xlsx',
    encoding: 'UTF-8',
    isOpen: true,
    isFree: true,
    license: 'CC BY 4.0',
    contact: {
      name: '한미영',
      email: 'han@mohw.go.kr',
      phone: '02-6789-0123'
    }
  },
  {
    id: 7,
    title: '교육 디지털 전환 현황',
    description: '전국 교육기관 디지털 전환 현황 및 성과 데이터',
    category: '교육/문화',
    organization: '교육부',
    publishDate: '2024-07-08',
    updateDate: '2024-07-09',
    dataType: 'JSON',
    fileSize: '3.8MB',
    downloadCount: 1200,
    viewCount: 3200,
    tags: ['교육', '디지털', '전환', '문화'],
    url: 'https://api.odcloud.kr/api/1234567/v1/uddi:dddddddd-eeee-ffff-gggg-hhhhhhhhhhhh',
    format: 'json',
    encoding: 'UTF-8',
    isOpen: true,
    isFree: true,
    license: 'CC BY 4.0',
    contact: {
      name: '송현우',
      email: 'song@moe.go.kr',
      phone: '02-7890-1234'
    }
  },
  {
    id: 8,
    title: '블록체인 기술 활용 사례',
    description: '정부 블록체인 기술 활용 사례 및 성과 분석 데이터',
    category: 'IT/소프트웨어',
    organization: '과학기술정보통신부',
    publishDate: '2024-07-05',
    updateDate: '2024-07-06',
    dataType: 'XML',
    fileSize: '2.2MB',
    downloadCount: 680,
    viewCount: 1500,
    tags: ['블록체인', '기술', '활용', '사례'],
    url: 'https://api.odcloud.kr/api/1234567/v1/uddi:eeeeeeee-ffff-gggg-hhhh-iiiiiiiiiiii',
    format: 'xml',
    encoding: 'UTF-8',
    isOpen: true,
    isFree: true,
    license: 'CC BY 4.0',
    contact: {
      name: '임태호',
      email: 'lim@msit.go.kr',
      phone: '02-8901-2345'
    }
  }
];

export class MockApiServer {
  // Public Data API Endpoints
  static async getPublicDataList(
    filters: PublicDataFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<PublicDataResponse> {
    try {
      console.log('Mock API: Fetching public data list', { filters, page, limit });
      
      await delay(800);
      simulateApiError(0.05);
      
      let filteredData = [...extendedMockData];
      
      // Apply filters
      if (filters.category) {
        filteredData = filteredData.filter(item => 
          item.category === filters.category
        );
      }
      
      if (filters.organization) {
        filteredData = filteredData.filter(item => 
          item.organization.includes(filters.organization!)
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      if (filters.dataType) {
        filteredData = filteredData.filter(item => 
          item.dataType === filters.dataType
        );
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      return createApiResponse({
        items: paginatedData,
        total: filteredData.length,
        page,
        limit,
        totalPages: Math.ceil(filteredData.length / limit),
        hasNext: endIndex < filteredData.length,
        hasPrev: page > 1
      }, true, '데이터를 성공적으로 조회했습니다.');
      
    } catch (error) {
      console.error('Mock API Error:', error);
      return createErrorResponse('데이터 조회 중 오류가 발생했습니다.', 'FETCH_ERROR');
    }
  }

  static async getPublicDataDetail(id: number): Promise<PublicDataResponse> {
    try {
      console.log('Mock API: Fetching public data detail', { id });
      
      await delay(600);
      simulateApiError(0.05);
      
      const item = extendedMockData.find(item => item.id === id);
      
      if (!item) {
        return createErrorResponse('데이터를 찾을 수 없습니다.', 'NOT_FOUND');
      }
      
      return createApiResponse(item, true, '데이터 상세정보를 성공적으로 조회했습니다.');
      
    } catch (error) {
      console.error('Mock API Error:', error);
      return createErrorResponse('데이터 상세 조회 중 오류가 발생했습니다.', 'FETCH_ERROR');
    }
  }

  static async searchPublicData(query: string, filters: PublicDataFilters = {}): Promise<PublicDataResponse> {
    try {
      console.log('Mock API: Searching public data', { query, filters });
      
      await delay(700);
      simulateApiError(0.05);
      
      let searchResults = [...extendedMockData];
      
      // Apply search query
      const searchTerm = query.toLowerCase();
      searchResults = searchResults.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        item.organization.toLowerCase().includes(searchTerm)
      );
      
      // Apply additional filters
      if (filters.category) {
        searchResults = searchResults.filter(item => 
          item.category === filters.category
        );
      }
      
      if (filters.dataType) {
        searchResults = searchResults.filter(item => 
          item.dataType === filters.dataType
        );
      }
      
      return createApiResponse({
        items: searchResults,
        total: searchResults.length,
        query,
        filters,
        searchTime: Date.now()
      }, true, `"${query}" 검색 결과 ${searchResults.length}건을 찾았습니다.`);
      
    } catch (error) {
      console.error('Mock API Error:', error);
      return createErrorResponse('검색 중 오류가 발생했습니다.', 'SEARCH_ERROR');
    }
  }

  static async downloadPublicData(id: number): Promise<PublicDataResponse> {
    try {
      console.log('Mock API: Downloading public data', { id });
      
      await delay(1000);
      simulateApiError(0.02);
      
      const item = extendedMockData.find(item => item.id === id);
      
      if (!item) {
        return createErrorResponse('데이터를 찾을 수 없습니다.', 'NOT_FOUND');
      }
      
      // Simulate download URL generation
      const downloadUrl = `${item.url}?serviceKey=mock_api_key&format=${item.format}&timestamp=${Date.now()}`;
      
      return createApiResponse({
        downloadUrl,
        fileName: `${item.title}.${item.format}`,
        fileSize: item.fileSize,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        downloadId: `dl_${Math.random().toString(36).substr(2, 9)}`
      }, true, '다운로드 링크가 생성되었습니다.');
      
    } catch (error) {
      console.error('Mock API Error:', error);
      return createErrorResponse('다운로드 링크 생성 중 오류가 발생했습니다.', 'DOWNLOAD_ERROR');
    }
  }

  // Health Check Endpoint
  static async healthCheck(): Promise<any> {
    try {
      await delay(200);
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: Math.floor(Math.random() * 86400), // Random uptime in seconds
        services: {
          database: 'connected',
          cache: 'connected',
          storage: 'connected'
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  // API Statistics Endpoint
  static async getApiStats(): Promise<any> {
    try {
      await delay(300);
      
      return {
        totalRequests: Math.floor(Math.random() * 10000) + 5000,
        successfulRequests: Math.floor(Math.random() * 9500) + 4500,
        failedRequests: Math.floor(Math.random() * 500) + 100,
        averageResponseTime: Math.floor(Math.random() * 500) + 200,
        activeConnections: Math.floor(Math.random() * 100) + 20,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return createErrorResponse('API 통계 조회 중 오류가 발생했습니다.', 'STATS_ERROR');
    }
  }
}

// Export for use in other services
export default MockApiServer;
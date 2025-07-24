import { 
  PublicDataResponse, 
  PublicDataItem, 
  PublicDataFilters,
  PublicDataStats,
  PublicDataCategory
} from '../types/publicData';
import MockApiServer from './mockApiServer';

const API_BASE_URL = process.env.REACT_APP_PUBLIC_DATA_URL || 'https://api.odcloud.kr/api';
const API_KEY = process.env.REACT_APP_PUBLIC_DATA_KEY || 'your_api_key_here';
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// Mock data for public data portal
const mockPublicDataItems: PublicDataItem[] = [
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
  }
];

const mockCategories: PublicDataCategory[] = [
  { id: 1, name: 'IT/소프트웨어', count: 45, description: '정보기술 및 소프트웨어 관련 데이터' },
  { id: 2, name: '도시/교통', count: 32, description: '도시계획 및 교통 관련 데이터' },
  { id: 3, name: '경제/금융', count: 28, description: '경제 및 금융 관련 데이터' },
  { id: 4, name: '과학기술', count: 35, description: '과학기술 및 연구개발 관련 데이터' },
  { id: 5, name: '환경/에너지', count: 22, description: '환경 및 에너지 관련 데이터' },
  { id: 6, name: '교육/문화', count: 18, description: '교육 및 문화 관련 데이터' },
  { id: 7, name: '의료/복지', count: 25, description: '의료 및 복지 관련 데이터' },
  { id: 8, name: '기타', count: 15, description: '기타 분야 데이터' }
];

const mockStats: PublicDataStats = {
  totalDatasets: 220,
  totalDownloads: 125000,
  totalViews: 450000,
  activeOrganizations: 45,
  monthlyGrowth: 8.5,
  popularCategories: [
    { category: 'IT/소프트웨어', count: 45, percentage: 20.5 },
    { category: '과학기술', count: 35, percentage: 15.9 },
    { category: '경제/금융', count: 28, percentage: 12.7 },
    { category: '도시/교통', count: 32, percentage: 14.5 },
    { category: '환경/에너지', count: 22, percentage: 10.0 }
  ],
  topOrganizations: [
    { name: '과학기술정보통신부', count: 35 },
    { name: '행정안전부', count: 28 },
    { name: '국토교통부', count: 25 },
    { name: '중소기업청', count: 22 },
    { name: '환경부', count: 20 }
  ]
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class PublicDataService {
  static async getPublicDataList(
    filters: PublicDataFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<PublicDataResponse> {
    // Use Mock API Server if configured
    if (USE_MOCK_DATA) {
      return MockApiServer.getPublicDataList(filters, page, limit);
    }

    try {
      // Simulate API call
      const url = `${API_BASE_URL}/public-data?page=${page}&limit=${limit}`;
      console.log('Attempting to fetch from:', url);
      
      // Simulate network delay
      await delay(800);
      
      // Simulate API failure in some cases
      if (Math.random() < 0.1) {
        throw new Error('API temporarily unavailable');
      }
      
      // Filter mock data based on filters
      let filteredData = [...mockPublicDataItems];
      
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
      
      return {
        success: true,
        data: {
          items: paginatedData,
          total: filteredData.length,
          page,
          limit,
          totalPages: Math.ceil(filteredData.length / limit)
        },
        message: '데이터를 성공적으로 조회했습니다.'
      };
      
    } catch (error) {
      console.log('API not available, using mock data');
      return MockApiServer.getPublicDataList(filters, page, limit);
    }
  }

  static async getPublicDataDetail(id: number): Promise<PublicDataResponse> {
    // Use Mock API Server if configured
    if (USE_MOCK_DATA) {
      return MockApiServer.getPublicDataDetail(id);
    }

    try {
      const url = `${API_BASE_URL}/public-data/${id}`;
      console.log('Attempting to fetch detail from:', url);
      
      await delay(600);
      
      if (Math.random() < 0.1) {
        throw new Error('API temporarily unavailable');
      }
      
      const item = mockPublicDataItems.find(item => item.id === id);
      
      if (!item) {
        throw new Error('데이터를 찾을 수 없습니다.');
      }
      
      return {
        success: true,
        data: item,
        message: '데이터 상세정보를 성공적으로 조회했습니다.'
      };
      
    } catch (error) {
      console.log('API not available, using mock data');
      return MockApiServer.getPublicDataDetail(id);
    }
  }

  static async getPublicDataStats(): Promise<PublicDataResponse> {
    try {
      const url = `${API_BASE_URL}/public-data/stats`;
      console.log('Attempting to fetch stats from:', url);
      
      await delay(500);
      
      if (Math.random() < 0.1) {
        throw new Error('API temporarily unavailable');
      }
      
      return {
        success: true,
        data: mockStats,
        message: '통계 데이터를 성공적으로 조회했습니다.'
      };
      
    } catch (error) {
      console.log('API not available, using mock data');
      
      return {
        success: true,
        data: mockStats,
        message: 'Mock 통계 데이터를 사용합니다.'
      };
    }
  }

  static async getPublicDataCategories(): Promise<PublicDataResponse> {
    try {
      const url = `${API_BASE_URL}/public-data/categories`;
      console.log('Attempting to fetch categories from:', url);
      
      await delay(400);
      
      if (Math.random() < 0.1) {
        throw new Error('API temporarily unavailable');
      }
      
      return {
        success: true,
        data: mockCategories,
        message: '카테고리 목록을 성공적으로 조회했습니다.'
      };
      
    } catch (error) {
      console.log('API not available, using mock data');
      
      return {
        success: true,
        data: mockCategories,
        message: 'Mock 카테고리 데이터를 사용합니다.'
      };
    }
  }

  static async downloadPublicData(id: number): Promise<PublicDataResponse> {
    // Use Mock API Server if configured
    if (USE_MOCK_DATA) {
      return MockApiServer.downloadPublicData(id);
    }

    try {
      const url = `${API_BASE_URL}/public-data/${id}/download`;
      console.log('Attempting to download from:', url);
      
      await delay(1000);
      
      if (Math.random() < 0.05) {
        throw new Error('Download failed');
      }
      
      const item = mockPublicDataItems.find(item => item.id === id);
      
      if (!item) {
        throw new Error('데이터를 찾을 수 없습니다.');
      }
      
      // Simulate download URL generation
      const downloadUrl = `${item.url}?serviceKey=${API_KEY}&format=${item.format}`;
      
      return {
        success: true,
        data: {
          downloadUrl,
          fileName: `${item.title}.${item.format}`,
          fileSize: item.fileSize,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        },
        message: '다운로드 링크가 생성되었습니다.'
      };
      
    } catch (error) {
      console.log('API not available, using mock data');
      return MockApiServer.downloadPublicData(id);
    }
  }

  static async searchPublicData(query: string, filters: PublicDataFilters = {}): Promise<PublicDataResponse> {
    // Use Mock API Server if configured
    if (USE_MOCK_DATA) {
      return MockApiServer.searchPublicData(query, filters);
    }

    try {
      const url = `${API_BASE_URL}/public-data/search?q=${encodeURIComponent(query)}`;
      console.log('Attempting to search from:', url);
      
      await delay(700);
      
      if (Math.random() < 0.1) {
        throw new Error('Search API temporarily unavailable');
      }
      
      let searchResults = [...mockPublicDataItems];
      
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
      
      return {
        success: true,
        data: {
          items: searchResults,
          total: searchResults.length,
          query,
          filters
        },
        message: `"${query}" 검색 결과 ${searchResults.length}건을 찾았습니다.`
      };
      
    } catch (error) {
      console.log('API not available, using mock data');
      return MockApiServer.searchPublicData(query, filters);
    }
  }
}
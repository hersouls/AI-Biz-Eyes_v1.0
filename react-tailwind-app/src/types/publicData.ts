// 공공데이터포털 API 응답 기본 구조
export interface PublicDataResponse {
  success: boolean;
  data: any;
  message: string;
}

// 공공데이터 아이템
export interface PublicDataItem {
  id: number;
  title: string;
  description: string;
  category: string;
  organization: string;
  publishDate: string;
  updateDate: string;
  dataType: 'JSON' | 'CSV' | 'XML' | 'XLSX';
  fileSize: string;
  downloadCount: number;
  viewCount: number;
  tags: string[];
  url: string;
  format: string;
  encoding: string;
  isOpen: boolean;
  isFree: boolean;
  license: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

// 공공데이터 필터
export interface PublicDataFilters {
  category?: string;
  organization?: string;
  search?: string;
  dataType?: string;
  dateFrom?: string;
  dateTo?: string;
  isOpen?: boolean;
  isFree?: boolean;
}

// 공공데이터 통계
export interface PublicDataStats {
  totalDatasets: number;
  totalDownloads: number;
  totalViews: number;
  activeOrganizations: number;
  monthlyGrowth: number;
  popularCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  topOrganizations: Array<{
    name: string;
    count: number;
  }>;
}

// 공공데이터 카테고리
export interface PublicDataCategory {
  id: number;
  name: string;
  count: number;
  description: string;
}

// 공공데이터 목록 응답
export interface PublicDataListResponse {
  items: PublicDataItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 공공데이터 검색 응답
export interface PublicDataSearchResponse {
  items: PublicDataItem[];
  total: number;
  query: string;
  filters: PublicDataFilters;
}

// 공공데이터 다운로드 응답
export interface PublicDataDownloadResponse {
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  expiresAt: string;
}

// 공공데이터 API 설정
export interface PublicDataApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  retryCount: number;
}

// 공공데이터 API 에러
export interface PublicDataApiError {
  code: string;
  message: string;
  details?: any;
}

// 공공데이터 API 요청 옵션
export interface PublicDataRequestOptions {
  timeout?: number;
  retryCount?: number;
  headers?: Record<string, string>;
}

// 공공데이터 메타데이터
export interface PublicDataMetadata {
  totalCount: number;
  pageNo: number;
  numOfRows: number;
  resultCode: string;
  resultMsg: string;
}

// 공공데이터 API 응답 래퍼
export interface PublicDataApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: T[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}
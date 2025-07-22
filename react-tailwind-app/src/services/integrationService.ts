import { 
  IntegrationSystem, 
  IntegrationLog, 
  FieldMapping, 
  IntegrationStats,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  CreateFieldMappingRequest,
  ApiResponse,
  PaginatedResponse
} from '../types/integration';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock data for development
const mockIntegrationStats: IntegrationStats = {
  totalSystems: 5,
  activeSystems: 4,
  failedSystems: 1,
  totalLogs: 1250,
  successRate: 95.2,
  averageResponseTime: 850,
  lastSync: '2024-07-22T10:30:00Z',
  dailySyncs: 48,
  weeklySyncs: 336,
  monthlySyncs: 1440
};

const mockIntegrationSystems: IntegrationSystem[] = [
  {
    id: '1',
    name: '공공데이터포털',
    type: 'api',
    status: 'active',
    description: '공공데이터포털 API 연동',
    config: {
      baseUrl: 'https://api.data.go.kr',
      apiKey: '***',
      timeout: 30000
    },
    lastSync: '2024-07-22T10:30:00Z',
    syncInterval: 3600,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:30:00Z'
  },
  {
    id: '2',
    name: '나라장터',
    type: 'web',
    status: 'active',
    description: '나라장터 웹 스크래핑',
    config: {
      baseUrl: 'https://www.g2b.go.kr',
      selectors: {
        bidList: '.bid-list',
        bidDetail: '.bid-detail'
      }
    },
    lastSync: '2024-07-22T09:15:00Z',
    syncInterval: 1800,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-07-22T09:15:00Z'
  },
  {
    id: '3',
    name: '기업정보 API',
    type: 'api',
    status: 'failed',
    description: '기업정보 조회 API',
    config: {
      baseUrl: 'https://api.business.go.kr',
      apiKey: '***',
      timeout: 15000
    },
    lastSync: '2024-07-22T08:45:00Z',
    syncInterval: 7200,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-07-22T08:45:00Z'
  }
];

const mockIntegrationLogs: IntegrationLog[] = [
  {
    id: '1',
    systemId: '1',
    type: 'sync',
    status: 'success',
    message: '데이터 동기화 완료',
    details: {
      recordsProcessed: 45,
      recordsCreated: 12,
      recordsUpdated: 33
    },
    duration: 2500,
    createdAt: '2024-07-22T10:30:00Z'
  },
  {
    id: '2',
    systemId: '2',
    type: 'sync',
    status: 'success',
    message: '웹 스크래핑 완료',
    details: {
      pagesScraped: 10,
      recordsFound: 28
    },
    duration: 1800,
    createdAt: '2024-07-22T09:15:00Z'
  },
  {
    id: '3',
    systemId: '3',
    type: 'sync',
    status: 'failed',
    message: 'API 호출 실패',
    details: {
      error: 'Connection timeout',
      retryCount: 3
    },
    duration: 15000,
    createdAt: '2024-07-22T08:45:00Z'
  }
];

const mockFieldMappings: FieldMapping[] = [
  {
    id: '1',
    systemId: '1',
    sourceField: 'bidNtceNo',
    targetField: 'bidNumber',
    transformation: 'none',
    isRequired: true,
    description: '입찰공고번호',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    systemId: '1',
    sourceField: 'bidNtceNm',
    targetField: 'bidTitle',
    transformation: 'none',
    isRequired: true,
    description: '입찰공고명',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    systemId: '2',
    sourceField: 'dminsttNm',
    targetField: 'organization',
    transformation: 'none',
    isRequired: true,
    description: '수요기관명',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class IntegrationService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/integration${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log('API not available, using mock data');
      throw error;
    }
  }

  // 연동 통계 조회
  async getStats(): Promise<IntegrationStats> {
    try {
      const response = await this.request<IntegrationStats>('/stats');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '통계 조회에 실패했습니다.');
    } catch (error) {
      // Fallback to mock data
      await delay(300);
      return mockIntegrationStats;
    }
  }

  // 연동 시스템 목록 조회
  async getSystems(): Promise<IntegrationSystem[]> {
    try {
      const response = await this.request<IntegrationSystem[]>('/systems');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '연동 시스템 목록 조회에 실패했습니다.');
    } catch (error) {
      // Fallback to mock data
      await delay(500);
      return mockIntegrationSystems;
    }
  }

  // 연동 시스템 상세 조회
  async getSystem(id: string): Promise<IntegrationSystem> {
    try {
      const response = await this.request<IntegrationSystem>(`/systems/${id}`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '연동 시스템 조회에 실패했습니다.');
    } catch (error) {
      // Fallback to mock data
      await delay(300);
      const system = mockIntegrationSystems.find(s => s.id === id);
      if (!system) {
        throw new Error('연동 시스템을 찾을 수 없습니다.');
      }
      return system;
    }
  }

  // 연동 시스템 생성
  async createSystem(data: CreateIntegrationRequest): Promise<IntegrationSystem> {
    try {
      const response = await this.request<IntegrationSystem>('/systems', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '연동 시스템 생성에 실패했습니다.');
    } catch (error) {
      // Fallback to mock data
      await delay(500);
      const newSystem: IntegrationSystem = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        status: 'active',
        description: data.description || '',
        config: data.config,
        lastSync: null,
        syncInterval: data.syncInterval || 3600,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockIntegrationSystems.push(newSystem);
      return newSystem;
    }
  }

  // 연동 시스템 수정
  async updateSystem(id: string, data: UpdateIntegrationRequest): Promise<IntegrationSystem> {
    try {
      const response = await this.request<IntegrationSystem>(`/systems/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '연동 시스템 수정에 실패했습니다.');
    } catch (error) {
      // Fallback to mock data
      await delay(500);
      const system = mockIntegrationSystems.find(s => s.id === id);
      if (!system) {
        throw new Error('연동 시스템을 찾을 수 없습니다.');
      }
      
      Object.assign(system, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      return system;
    }
  }

  // 연동 시스템 삭제
  async deleteSystem(id: string): Promise<void> {
    try {
      const response = await this.request<void>(`/systems/${id}`, {
        method: 'DELETE',
      });
      if (!response.success) {
        throw new Error(response.message || '연동 시스템 삭제에 실패했습니다.');
      }
    } catch (error) {
      // Fallback to mock data
      await delay(300);
      const index = mockIntegrationSystems.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error('연동 시스템을 찾을 수 없습니다.');
      }
      mockIntegrationSystems.splice(index, 1);
    }
  }

  // 연동 시스템 테스트
  async testSystem(id: string): Promise<any> {
    try {
      const response = await this.request<any>(`/systems/${id}/test`, {
        method: 'POST',
      });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '연동 시스템 테스트에 실패했습니다.');
    } catch (error) {
      // Fallback to mock data
      await delay(1000);
      const system = mockIntegrationSystems.find(s => s.id === id);
      if (!system) {
        throw new Error('연동 시스템을 찾을 수 없습니다.');
      }
      
      return {
        success: system.status === 'active',
        message: system.status === 'active' ? '연동 테스트 성공' : '연동 테스트 실패',
        responseTime: Math.floor(Math.random() * 2000) + 500,
        dataReceived: system.status === 'active' ? Math.floor(Math.random() * 100) + 10 : 0
      };
    }
  }

  // 연동 로그 조회
  async getLogs(params?: {
    systemId?: string;
    type?: string;
    limit?: number;
    page?: number;
  }): Promise<PaginatedResponse<IntegrationLog>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.systemId) queryParams.append('systemId', params.systemId);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.page) queryParams.append('page', params.page.toString());

      const endpoint = `/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.request<PaginatedResponse<IntegrationLog>>(endpoint);
      
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '연동 로그 조회에 실패했습니다.');
    } catch (error) {
      // Fallback to mock data
      await delay(500);
      
      let filteredLogs = [...mockIntegrationLogs];
      
      if (params?.systemId) {
        filteredLogs = filteredLogs.filter(log => log.systemId === params.systemId);
      }
      if (params?.type) {
        filteredLogs = filteredLogs.filter(log => log.type === params.type);
      }
      
      const limit = params?.limit || 20;
      const page = params?.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
      
      return {
        data: paginatedLogs,
        pagination: {
          page,
          limit,
          total: filteredLogs.length,
          totalPages: Math.ceil(filteredLogs.length / limit)
        }
      };
    }
  }

  // 필드 매핑 목록 조회
  async getFieldMappings(systemId?: string): Promise<FieldMapping[]> {
    try {
      const queryParams = systemId ? `?systemId=${systemId}` : '';
      const response = await this.request<FieldMapping[]>(`/mappings${queryParams}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '필드 매핑 조회에 실패했습니다.');
    } catch (error) {
      // Fallback to mock data
      await delay(300);
      
      let filteredMappings = [...mockFieldMappings];
      if (systemId) {
        filteredMappings = filteredMappings.filter(mapping => mapping.systemId === systemId);
      }
      
      return filteredMappings;
    }
  }

  // 필드 매핑 생성
  async createFieldMapping(data: CreateFieldMappingRequest): Promise<FieldMapping> {
    try {
      const response = await this.request<FieldMapping>('/mappings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '필드 매핑 생성에 실패했습니다.');
    } catch (error) {
      // Fallback to mock data
      await delay(500);
      
      const newMapping: FieldMapping = {
        id: Date.now().toString(),
        systemId: data.systemId,
        sourceField: data.sourceField,
        targetField: data.targetField,
        transformation: data.transformation || 'none',
        isRequired: data.isRequired || false,
        description: data.description || '',
        createdAt: new Date().toISOString()
      };
      
      mockFieldMappings.push(newMapping);
      return newMapping;
    }
  }
}

export const integrationService = new IntegrationService();
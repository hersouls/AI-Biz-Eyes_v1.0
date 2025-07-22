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
      console.error('API request failed:', error);
      throw new Error('API 요청에 실패했습니다.');
    }
  }

  // 연동 통계 조회
  async getStats(): Promise<IntegrationStats> {
    const response = await this.request<IntegrationStats>('/stats');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '통계 조회에 실패했습니다.');
  }

  // 연동 시스템 목록 조회
  async getSystems(): Promise<IntegrationSystem[]> {
    const response = await this.request<IntegrationSystem[]>('/systems');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '연동 시스템 목록 조회에 실패했습니다.');
  }

  // 연동 시스템 상세 조회
  async getSystem(id: string): Promise<IntegrationSystem> {
    const response = await this.request<IntegrationSystem>(`/systems/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '연동 시스템 조회에 실패했습니다.');
  }

  // 연동 시스템 생성
  async createSystem(data: CreateIntegrationRequest): Promise<IntegrationSystem> {
    const response = await this.request<IntegrationSystem>('/systems', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '연동 시스템 생성에 실패했습니다.');
  }

  // 연동 시스템 수정
  async updateSystem(id: string, data: UpdateIntegrationRequest): Promise<IntegrationSystem> {
    const response = await this.request<IntegrationSystem>(`/systems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '연동 시스템 수정에 실패했습니다.');
  }

  // 연동 시스템 삭제
  async deleteSystem(id: string): Promise<void> {
    const response = await this.request<void>(`/systems/${id}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new Error(response.message || '연동 시스템 삭제에 실패했습니다.');
    }
  }

  // 연동 시스템 테스트
  async testSystem(id: string): Promise<any> {
    const response = await this.request<any>(`/systems/${id}/test`, {
      method: 'POST',
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '연동 시스템 테스트에 실패했습니다.');
  }

  // 연동 로그 조회
  async getLogs(params?: {
    systemId?: string;
    type?: string;
    limit?: number;
    page?: number;
  }): Promise<PaginatedResponse<IntegrationLog>> {
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
  }

  // 필드 매핑 목록 조회
  async getFieldMappings(systemId?: string): Promise<FieldMapping[]> {
    const queryParams = systemId ? `?systemId=${systemId}` : '';
    const response = await this.request<FieldMapping[]>(`/mappings${queryParams}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '필드 매핑 조회에 실패했습니다.');
  }

  // 필드 매핑 생성
  async createFieldMapping(data: CreateFieldMappingRequest): Promise<FieldMapping> {
    const response = await this.request<FieldMapping>('/mappings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '필드 매핑 생성에 실패했습니다.');
  }
}

export const integrationService = new IntegrationService();
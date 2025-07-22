import {
  ReferenceData,
  ReferenceRequest,
  ReferenceFilters,
  ReferenceListResponse,
  ReferenceResponse,
  ReferenceDeleteResponse,
  ReferenceMatchResponse,
  ReferenceStats
} from '../types/reference';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

// Mock data for development
const mockReferences: ReferenceData[] = [
  {
    id: 1,
    projectName: 'IT 시스템 구축 사업',
    title: 'IT 시스템 구축 사업',
    description: '2023년도 IT 시스템 구축 사업 레퍼런스',
    organization: '테크노파크',
    projectType: 'IT',
    businessType: 'IT',
    budget: 500000000,
    contractAmount: 500000000,
    participationYear: 2023,
    startDate: '2023-03-01',
    endDate: '2023-12-31',
    status: 'success',
    score: 'A',
    successRate: 95,
    tags: ['IT', '시스템구축', '성공사례'],
    attachments: [
      { id: 1, name: '사업계획서.pdf', url: '/attachments/plan.pdf', size: 2048576 },
      { id: 2, name: '결과보고서.pdf', url: '/attachments/report.pdf', size: 3072000 }
    ],
    createdBy: 1,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-07-22T10:30:00Z'
  },
  {
    id: 2,
    title: '웹사이트 구축 프로젝트',
    description: '기업 웹사이트 구축 및 운영 프로젝트',
    organization: '스타트업A',
    businessType: '웹개발',
    budget: 150000000,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'in_progress',
    successRate: 85,
    tags: ['웹개발', '반응형', 'UI/UX'],
    attachments: [
      { id: 3, name: '요구사항서.pdf', url: '/attachments/requirements.pdf', size: 1536000 }
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-07-22T09:15:00Z'
  },
  {
    id: 3,
    title: '모바일 앱 개발',
    description: 'iOS/Android 크로스 플랫폼 앱 개발',
    organization: '모바일컴퍼니',
    businessType: '모바일',
    budget: 300000000,
    startDate: '2023-09-01',
    endDate: '2024-02-29',
    status: 'success',
    successRate: 90,
    tags: ['모바일', '크로스플랫폼', '앱개발'],
    attachments: [
      { id: 4, name: '기술명세서.pdf', url: '/attachments/spec.pdf', size: 2560000 },
      { id: 5, name: '테스트결과.pdf', url: '/attachments/test.pdf', size: 1024000 }
    ],
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  }
];

const mockReferenceStats: ReferenceStats = {
  total: 45,
  byStatus: {
    completed: 28,
    in_progress: 12,
    planned: 5
  },
  byBusinessType: {
    IT: 15,
    웹개발: 12,
    모바일: 8,
    시스템구축: 10
  },
  byBudget: {
    small: 20,
    medium: 15,
    large: 10
  },
  averageSuccessRate: 87.5,
  totalBudget: 8500000000
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 레퍼런스 목록 조회
export const getReferences = async (
  filters: ReferenceFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<ReferenceListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    });

    const response = await fetch(`${API_BASE_URL}/references?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }

  // Fallback to mock data
  await delay(500);
  
  let filteredReferences = [...mockReferences];
  
  if (filters.title) {
    filteredReferences = filteredReferences.filter(ref => 
      ref.title?.toLowerCase().includes(filters.title!.toLowerCase()) || false
    );
  }
  if (filters.organization) {
    filteredReferences = filteredReferences.filter(ref => 
      ref.organization.toLowerCase().includes(filters.organization!.toLowerCase())
    );
  }
  if (filters.businessType) {
    filteredReferences = filteredReferences.filter(ref => 
      ref.businessType === filters.businessType
    );
  }
  if (filters.status) {
    filteredReferences = filteredReferences.filter(ref => 
      ref.status === filters.status
    );
  }
  if (filters.minBudget) {
    filteredReferences = filteredReferences.filter(ref => 
      (ref.budget ?? 0) >= filters.minBudget!
    );
  }
  if (filters.maxBudget) {
    filteredReferences = filteredReferences.filter(ref => 
      (ref.budget ?? 0) <= filters.maxBudget!
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReferences = filteredReferences.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: {
      references: paginatedReferences,
      pagination: {
        page,
        limit,
        total: filteredReferences.length,
        totalPages: Math.ceil(filteredReferences.length / limit)
      }
    },
    message: '레퍼런스 목록 조회 성공'
  };
};

// 레퍼런스 등록
export const createReference = async (data: ReferenceRequest): Promise<ReferenceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/references`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }

  // Fallback to mock data
  await delay(500);
  
  const newReference: ReferenceData = {
    id: Date.now(),
    projectName: data.projectName,
    title: data.title,
    description: data.description,
    organization: data.organization,
    projectType: data.projectType,
    businessType: data.businessType,
    participationYear: data.participationYear,
    contractAmount: data.contractAmount,
    budget: data.budget,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status || 'planned',
    score: data.score,
    successRate: data.successRate || 0,
    tags: data.tags || [],
    files: data.files || [],
    attachments: data.attachments || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockReferences.push(newReference);
  
  return {
    success: true,
    data: newReference,
    message: '레퍼런스 등록 성공'
  };
};

// 레퍼런스 수정
export const updateReference = async (id: number, data: Partial<ReferenceRequest>): Promise<ReferenceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/references/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }

  // Fallback to mock data
  await delay(500);
  
  const reference = mockReferences.find(ref => ref.id === id);
  if (!reference) {
    throw new Error('레퍼런스를 찾을 수 없습니다.');
  }
  
  Object.assign(reference, {
    ...data,
    updatedAt: new Date().toISOString()
  });
  
  return {
    success: true,
    data: reference,
    message: '레퍼런스 수정 성공'
  };
};

// 레퍼런스 삭제
export const deleteReference = async (id: number): Promise<ReferenceDeleteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/references/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }

  // Fallback to mock data
  await delay(300);
  
  const index = mockReferences.findIndex(ref => ref.id === id);
  if (index === -1) {
    throw new Error('레퍼런스를 찾을 수 없습니다.');
  }
  
  mockReferences.splice(index, 1);
  
  return {
    success: true,
    message: '레퍼런스 삭제 성공'
  };
};

// 레퍼런스 상세 조회
export const getReference = async (id: number): Promise<ReferenceData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/references/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }

  // Fallback to mock data
  await delay(300);
  
  const reference = mockReferences.find(ref => ref.id === id);
  if (!reference) {
    throw new Error('레퍼런스를 찾을 수 없습니다.');
  }
  
  return reference;
};

// 레퍼런스 매칭 조회
export const getReferenceMatches = async (referenceId: number): Promise<ReferenceMatchResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/references/${referenceId}/match`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }

  // Fallback to mock data
  await delay(500);
  
  const reference = mockReferences.find(ref => ref.id === referenceId);
  if (!reference) {
    throw new Error('레퍼런스를 찾을 수 없습니다.');
  }
  
  // Find similar references based on business type and budget
  const matches = mockReferences
    .filter(ref => ref.id !== referenceId && ref.businessType === reference.businessType)
    .map(ref => ({
      reference: ref,
      similarity: Math.floor(Math.random() * 30) + 70, // 70-100% similarity
      matchReason: '유사한 사업 분야'
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
  
  return {
    success: true,
    data: {
      matches
    },
    message: '레퍼런스 매칭 조회 성공'
  };
};

// 레퍼런스 통계 조회
export const getReferenceStats = async (): Promise<ReferenceStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/references/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }

  // Fallback to mock data
  await delay(300);
  return mockReferenceStats;
};

// 파일 업로드
export const uploadFile = async (file: File): Promise<{ url: string; name: string; size: number }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }

  // Fallback to mock data
  await delay(1000);
  
  return {
    url: `/mock-uploads/${file.name}`,
    name: file.name,
    size: file.size
  };
};

// Mock data functions (for backward compatibility)
export const getMockReferences = (): ReferenceData[] => [
  {
    id: 1,
    title: 'IT 시스템 구축 사업',
    description: '2023년도 IT 시스템 구축 사업 레퍼런스',
    organization: '테크노파크',
    businessType: 'IT',
    budget: 500000000,
    startDate: '2023-03-01',
    endDate: '2023-12-31',
    status: 'success',
    successRate: 95,
    tags: ['IT', '시스템구축', '성공사례'],
    attachments: [
      { id: 1, name: '사업계획서.pdf', url: '/attachments/plan.pdf', size: 2048576 },
      { id: 2, name: '결과보고서.pdf', url: '/attachments/report.pdf', size: 3072000 }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-07-22T10:30:00Z'
  },
  {
    id: 2,
    title: '웹사이트 구축 프로젝트',
    description: '기업 웹사이트 구축 및 운영 프로젝트',
    organization: '스타트업A',
    businessType: '웹개발',
    budget: 150000000,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'in_progress',
    successRate: 85,
    tags: ['웹개발', '반응형', 'UI/UX'],
    attachments: [
      { id: 3, name: '요구사항서.pdf', url: '/attachments/requirements.pdf', size: 1536000 }
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-07-22T09:15:00Z'
  },
  {
    id: 3,
    title: '모바일 앱 개발',
    description: 'iOS/Android 크로스 플랫폼 앱 개발',
    organization: '모바일컴퍼니',
    businessType: '모바일',
    budget: 300000000,
    startDate: '2023-09-01',
    endDate: '2024-02-29',
    status: 'success',
    successRate: 90,
    tags: ['모바일', '크로스플랫폼', '앱개발'],
    attachments: [
      { id: 4, name: '기술명세서.pdf', url: '/attachments/spec.pdf', size: 2560000 },
      { id: 5, name: '테스트결과.pdf', url: '/attachments/test.pdf', size: 1024000 }
    ],
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  }
];

export const getMockReferenceStats = (): ReferenceStats => ({
  total: 45,
  byStatus: {
    completed: 28,
    in_progress: 12,
    planned: 5
  },
  byBusinessType: {
    IT: 15,
    웹개발: 12,
    모바일: 8,
    시스템구축: 10
  },
  byBudget: {
    small: 20,
    medium: 15,
    large: 10
  },
  averageSuccessRate: 87.5,
  totalBudget: 8500000000
});
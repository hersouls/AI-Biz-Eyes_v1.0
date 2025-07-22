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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// 레퍼런스 목록 조회
export const getReferences = async (
  filters: ReferenceFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<ReferenceListResponse> => {
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

  if (!response.ok) {
    throw new Error('레퍼런스 목록을 불러오는데 실패했습니다.');
  }

  return response.json();
};

// 레퍼런스 등록
export const createReference = async (data: ReferenceRequest): Promise<ReferenceResponse> => {
  const response = await fetch(`${API_BASE_URL}/references`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('레퍼런스 등록에 실패했습니다.');
  }

  return response.json();
};

// 레퍼런스 수정
export const updateReference = async (id: number, data: Partial<ReferenceRequest>): Promise<ReferenceResponse> => {
  const response = await fetch(`${API_BASE_URL}/references/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('레퍼런스 수정에 실패했습니다.');
  }

  return response.json();
};

// 레퍼런스 삭제
export const deleteReference = async (id: number): Promise<ReferenceDeleteResponse> => {
  const response = await fetch(`${API_BASE_URL}/references/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('레퍼런스 삭제에 실패했습니다.');
  }

  return response.json();
};

// 레퍼런스 상세 조회
export const getReference = async (id: number): Promise<ReferenceData> => {
  const response = await fetch(`${API_BASE_URL}/references/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('레퍼런스 상세 정보를 불러오는데 실패했습니다.');
  }

  const result = await response.json();
  return result.data;
};

// 유사 공고 매칭
export const getReferenceMatches = async (referenceId: number): Promise<ReferenceMatchResponse> => {
  const response = await fetch(`${API_BASE_URL}/references/${referenceId}/match`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('유사 공고 매칭에 실패했습니다.');
  }

  return response.json();
};

// 레퍼런스 통계 조회
export const getReferenceStats = async (): Promise<ReferenceStats> => {
  const response = await fetch(`${API_BASE_URL}/references/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('레퍼런스 통계를 불러오는데 실패했습니다.');
  }

  const result = await response.json();
  return result.data;
};

// 파일 업로드
export const uploadFile = async (file: File): Promise<{ url: string; name: string; size: number }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('파일 업로드에 실패했습니다.');
  }

  return response.json();
};

// Mock 데이터 (개발용)
export const getMockReferences = (): ReferenceData[] => [
  {
    id: 1,
    projectName: "스마트공장 구축 사업",
    projectType: "용역",
    bidNtceNo: "20230100001",
    organization: "한국산업기술진흥원",
    participationYear: 2023,
    contractAmount: 500000000,
    status: "success",
    score: "A",
    description: "스마트공장 구축을 위한 종합 용역 사업",
    createdBy: 1,
    createdAt: "2024-07-22T10:30:00Z",
    updatedAt: "2024-07-22T10:30:00Z"
  },
  {
    id: 2,
    projectName: "AI 기반 품질관리 시스템 개발",
    projectType: "개발",
    bidNtceNo: "20230200002",
    organization: "한국표준과학연구원",
    participationYear: 2023,
    contractAmount: 300000000,
    status: "success",
    score: "A",
    description: "AI 기술을 활용한 제품 품질관리 시스템 개발",
    createdBy: 1,
    createdAt: "2024-07-21T14:20:00Z",
    updatedAt: "2024-07-21T14:20:00Z"
  },
  {
    id: 3,
    projectName: "디지털 트윈 플랫폼 구축",
    projectType: "용역",
    bidNtceNo: "20230300003",
    organization: "한국정보통신기술협회",
    participationYear: 2023,
    contractAmount: 800000000,
    status: "ongoing",
    score: "B",
    description: "산업용 디지털 트윈 플랫폼 구축 사업",
    createdBy: 1,
    createdAt: "2024-07-20T09:15:00Z",
    updatedAt: "2024-07-20T09:15:00Z"
  },
  {
    id: 4,
    projectName: "클라우드 인프라 구축",
    projectType: "개발",
    bidNtceNo: "20230400004",
    organization: "한국전자정보통신산업진흥회",
    participationYear: 2023,
    contractAmount: 400000000,
    status: "success",
    score: "A",
    description: "기업용 클라우드 인프라 구축 및 운영",
    createdBy: 1,
    createdAt: "2024-07-19T16:45:00Z",
    updatedAt: "2024-07-19T16:45:00Z"
  },
  {
    id: 5,
    projectName: "IoT 센서 네트워크 구축",
    projectType: "용역",
    bidNtceNo: "20230500005",
    organization: "한국산업기술진흥원",
    participationYear: 2023,
    contractAmount: 600000000,
    status: "failure",
    score: "C",
    description: "산업용 IoT 센서 네트워크 구축 사업",
    createdBy: 1,
    createdAt: "2024-07-18T11:20:00Z",
    updatedAt: "2024-07-18T11:20:00Z"
  }
];

export const getMockReferenceStats = (): ReferenceStats => ({
  totalCount: 15,
  successCount: 10,
  failureCount: 2,
  ongoingCount: 3,
  totalAmount: 2500000000,
  averageScore: 'A',
  yearlyStats: [
    { year: 2024, count: 5, amount: 800000000 },
    { year: 2023, count: 7, amount: 1200000000 },
    { year: 2022, count: 3, amount: 500000000 }
  ],
  typeStats: [
    { type: '용역', count: 8, successRate: 0.75 },
    { type: '개발', count: 4, successRate: 0.8 },
    { type: '공사', count: 2, successRate: 0.5 },
    { type: '연구', count: 1, successRate: 1.0 }
  ]
});
// 레퍼런스 데이터 타입 정의
export interface ReferenceData {
  id: number;
  projectName: string;           // 사업명
  projectType: string;           // 사업유형
  bidNtceNo?: string;            // 연계 공고번호
  organization: string;          // 참여기관
  participationYear: number;     // 참여연도
  contractAmount: number;        // 계약금액
  status: 'success' | 'failure' | 'ongoing'; // 성과상태
  score: 'A' | 'B' | 'C' | 'D'; // 평가등급
  files?: ReferenceFile[];       // 첨부파일 정보
  description?: string;          // 사업 설명
  createdBy: number;             // 등록자 ID
  createdAt: string;             // 생성 시간
  updatedAt: string;             // 수정 시간
}

// 첨부파일 타입
export interface ReferenceFile {
  name: string;                  // 파일명
  url: string;                   // 파일 URL
  size: number;                  // 파일 크기 (bytes)
  type?: string;                 // 파일 타입
}

// 레퍼런스 등록/수정 요청 타입
export interface ReferenceRequest {
  projectName: string;
  projectType: string;
  bidNtceNo?: string;
  organization: string;
  participationYear: number;
  contractAmount: number;
  status: 'success' | 'failure' | 'ongoing';
  score: 'A' | 'B' | 'C' | 'D';
  files?: ReferenceFile[];
  description?: string;
}

// 레퍼런스 목록 조회 필터 타입
export interface ReferenceFilters {
  search?: string;               // 검색어 (사업명)
  type?: string;                 // 사업유형
  status?: 'success' | 'failure' | 'ongoing'; // 성과상태
  year?: number;                 // 참여연도
  organization?: string;         // 참여기관
  sortBy?: string;               // 정렬 기준
  sortOrder?: 'asc' | 'desc';    // 정렬 순서
}

// 레퍼런스 목록 응답 타입
export interface ReferenceListResponse {
  success: boolean;
  data: {
    references: ReferenceData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// 레퍼런스 등록/수정 응답 타입
export interface ReferenceResponse {
  success: boolean;
  data: {
    id: number;
    projectName: string;
    createdAt?: string;
    updatedAt?: string;
  };
  message: string;
}

// 레퍼런스 삭제 응답 타입
export interface ReferenceDeleteResponse {
  success: boolean;
  message: string;
}

// 유사 공고 매칭 응답 타입
export interface ReferenceMatchResponse {
  success: boolean;
  data: {
    matches: Array<{
      bidNtceNo: string;
      bidNtceNm: string;
      similarityScore: number;
      matchReason: string;
    }>;
  };
}

// 레퍼런스 통계 타입
export interface ReferenceStats {
  totalCount: number;
  successCount: number;
  failureCount: number;
  ongoingCount: number;
  totalAmount: number;
  averageScore: string;
  yearlyStats: Array<{
    year: number;
    count: number;
    amount: number;
  }>;
  typeStats: Array<{
    type: string;
    count: number;
    successRate: number;
  }>;
}
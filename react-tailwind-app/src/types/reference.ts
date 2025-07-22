// 레퍼런스 데이터 타입 정의
export interface ReferenceData {
  id: number;
  projectName?: string;          // 사업명 (별칭)
  title?: string;                // 사업명 (별칭, backward compatibility)
  projectType?: string;          // 사업유형 (별칭)
  businessType?: string;         // 사업유형 (별칭, backward compatibility)
  bidNtceNo?: string;            // 연계 공고번호
  organization: string;          // 참여기관
  participationYear?: number;    // 참여연도 (별칭)
  contractAmount?: number;       // 계약금액 (별칭)
  budget?: number;               // 예산 (별칭, backward compatibility)
  status: 'success' | 'failure' | 'ongoing' | 'in_progress'; // 성과상태
  score?: 'A' | 'B' | 'C' | 'D'; // 평가등급 (별칭)
  successRate?: number;          // 성공률
  startDate?: string;            // 시작일
  endDate?: string;              // 종료일
  tags?: string[];               // 태그
  files?: ReferenceFile[];       // 첨부파일 정보
  attachments?: ReferenceFile[]; // 첨부파일 정보 (별칭, backward compatibility)
  description?: string;          // 사업 설명
  createdBy?: number;            // 등록자 ID (별칭)
  createdAt: string;             // 생성 시간
  updatedAt: string;             // 수정 시간
}

// 첨부파일 타입
export interface ReferenceFile {
  id?: number;                   // 파일 ID (별칭, backward compatibility)
  name: string;                  // 파일명
  url: string;                   // 파일 URL
  size: number;                  // 파일 크기 (bytes)
  type?: string;                 // 파일 타입
}

// 레퍼런스 등록/수정 요청 타입
export interface ReferenceRequest {
  projectName: string;
  title?: string;                // 사업명 (별칭, backward compatibility)
  projectType: string;
  businessType?: string;         // 사업유형 (별칭, backward compatibility)
  bidNtceNo?: string;            // 연계 공고번호
  organization: string;          // 참여기관
  participationYear: number;     // 참여연도
  contractAmount: number;        // 계약금액
  budget?: number;               // 예산 (별칭, backward compatibility)
  status: 'success' | 'failure' | 'ongoing' | 'in_progress'; // 성과상태
  score: 'A' | 'B' | 'C' | 'D'; // 평가등급
  successRate?: number;          // 성공률
  startDate?: string;            // 시작일
  endDate?: string;              // 종료일
  tags?: string[];               // 태그
  files?: ReferenceFile[];       // 첨부파일 정보
  attachments?: ReferenceFile[]; // 첨부파일 정보 (별칭, backward compatibility)
  description?: string;          // 사업 설명
}

// 레퍼런스 목록 조회 필터 타입
export interface ReferenceFilters {
  search?: string;               // 검색어 (사업명)
  title?: string;                // 사업명 검색 (별칭)
  type?: string;                 // 사업유형
  projectType?: string;          // 사업유형 (별칭)
  businessType?: string;         // 사업유형 (별칭)
  status?: 'success' | 'failure' | 'ongoing' | 'in_progress'; // 성과상태
  year?: number;                 // 참여연도
  participationYear?: number;    // 참여연도 (별칭)
  organization?: string;         // 참여기관
  minBudget?: number;            // 최소 예산
  maxBudget?: number;            // 최대 예산
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
  message?: string;              // 응답 메시지
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
      bidNtceNo?: string;        // 공고번호 (별칭)
      bidNtceNm?: string;        // 공고명 (별칭)
      reference?: ReferenceData; // 레퍼런스 데이터
      similarity?: number;       // 유사도 (별칭)
      similarityScore?: number;  // 유사도 점수
      matchReason: string;       // 매칭 이유
    }>;
  };
}

// 레퍼런스 통계 타입
export interface ReferenceStats {
  totalCount?: number;           // 총 개수 (별칭)
  total?: number;                // 총 개수
  successCount?: number;         // 성공 개수
  failureCount?: number;         // 실패 개수
  ongoingCount?: number;         // 진행중 개수
  totalAmount?: number;          // 총 금액 (별칭)
  totalBudget?: number;          // 총 예산
  averageScore?: string;         // 평균 점수
  averageSuccessRate?: number;   // 평균 성공률
  byStatus?: {                   // 상태별 통계
    completed?: number;
    in_progress?: number;
    planned?: number;
  };
  byBusinessType?: {             // 사업유형별 통계
    [key: string]: number;
  };
  byBudget?: {                   // 예산별 통계
    small?: number;
    medium?: number;
    large?: number;
  };
  yearlyStats?: Array<{          // 연도별 통계
    year: number;
    count: number;
    amount: number;
  }>;
  typeStats?: Array<{            // 유형별 통계
    type: string;
    count: number;
    successRate: number;
  }>;
}
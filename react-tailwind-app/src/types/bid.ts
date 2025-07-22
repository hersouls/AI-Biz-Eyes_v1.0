// 나라장터 OpenAPI 공고 데이터 타입 정의
export interface BidData {
  // 기본 식별 정보
  id?: number;
  bidNtceNo: string;
  bidNtceOrd?: number;
  bidNtceNm: string;
  bidNtceSttusNm: string;
  bidNtceUrl?: string;
  
  // 기관 정보
  ntceInsttNm: string;
  dmndInsttNm?: string;
  bsnsDivNm: string;
  
  // 예산 정보
  asignBdgtAmt?: number;
  presmptPrce?: number;
  
  // 일정 정보
  bidNtceDate: string;
  bidNtceBgn?: string;
  bidClseDate: string;
  bidClseTm?: string;
  opengDate?: string;
  opengTm?: string;
  
  // 입찰 조건
  elctrnBidYn?: 'Y' | 'N';
  intrntnlBidYn?: 'Y' | 'N';
  cmmnCntrctYn?: 'Y' | 'N';
  rgnLmtYn?: 'Y' | 'N';
  prtcptPsblRgnNm?: string;
  indstrytyLmtYn?: 'Y' | 'N';
  bidprcPsblIndstrytyNm?: string;
  rsrvtnPrceDcsnMthdNm?: string;
  
  // 계약 정보
  cntrctCnclsSttusNm?: string;
  cntrctCnclsMthdNm?: string;
  bidwinrDcsnMthdNm?: string;
  
  // 제안 운영
  presnatnOprtnYn?: 'Y' | 'N';
  presnatnOprtnDate?: string;
  presnatnOprtnTm?: string;
  presnatnOprtnPlce?: string;
  
  // 담당자 정보
  ntceInsttOfclDeptNm?: string;
  ntceInsttOfclNm?: string;
  ntceInsttOfclTel?: string;
  ntceInsttOfclEmailAdrs?: string;
  dmndInsttOfclDeptNm?: string;
  dmndInsttOfclNm?: string;
  dmndInsttOfclTel?: string;
  dmndInsttOfclEmailAdrs?: string;
  
  // 내부 상태 및 우선순위
  internalStatus?: string;
  isUrgent?: boolean;
  isDeadlineNear?: boolean;
  isNew?: boolean;
  participationStatus?: string;
  referenceMatchCount?: number;
  aiRecommendationScore?: number;
  
  // 기존 필드들 (하위 호환성을 위해 유지)
  dminsttNm?: string;
  bidMethdNm?: string;
  bidPblancNmpr?: number;
  bidNtceDt?: string;
  bidClseDt?: string;
  opengDt?: string;
  refNtceNo?: string;
  status?: 'active' | 'urgent' | 'completed' | 'cancelled';
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  requirements?: string[];
  attachments?: Array<{
    id: number;
    name: string;
    url: string;
    size: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface BidFilters {
  category?: string;
  status?: string;
  organization?: string;
  title?: string;
  minBudget?: number;
  maxBudget?: number;
  startDate?: string;
  endDate?: string;
}

export interface BidListFilters {
  businessType?: string;
  status?: string;
  institution?: string;
  region?: string;
  contractType?: string;
  biddingType?: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  budgetRange: {
    min?: string;
    max?: string;
  };
}

export interface BidListSort {
  field: string;
  order: 'asc' | 'desc';
}

export interface BidListPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface BidListResponse {
  success: boolean;
  data: {
    bids: BidData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface BidDetailResponse {
  success: boolean;
  data: BidData;
  message: string;
}

export interface BidStats {
  total: number;
  active: number;
  urgent: number;
  completed: number;
  byCategory: Record<string, number>;
  byBudget: Record<string, number>;
  byStatus: Record<string, number>;
  averageBudget: number;
  totalBudget: number;
}

export interface BidRecommendation {
  id: number;
  bidId: number;
  title: string;
  similarity: number;
  reason: string;
  confidence: number;
  organization: string;
  budget: number;
  deadline: string;
}

export interface BidAnalysis {
  bidId: number;
  marketAnalysis: {
    totalCompetitors: number;
    averageBidPrice: number;
    priceRange: { min: number; max: number };
    successRate: number;
  };
  technicalAnalysis: {
    requiredSkills: string[];
    skillMatch: number;
    complexity: 'low' | 'medium' | 'high';
    estimatedDuration: string;
  };
  riskAnalysis: {
    technicalRisk: 'low' | 'medium' | 'high';
    scheduleRisk: 'low' | 'medium' | 'high';
    costRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  recommendation: {
    shouldBid: boolean;
    confidence: number;
    suggestedPrice: number;
    keyFactors: string[];
  };
}
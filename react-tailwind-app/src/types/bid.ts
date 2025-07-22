// 나라장터 OpenAPI 공고 데이터 타입 정의
export interface BidData {
  id: number;
  bidNtceNo: string;
  bidNtceNm: string;
  dminsttNm: string;
  bidMethdNm: string;
  presmptPrce: number;
  bidPblancNmpr: number;
  bidNtceDt: string;
  bidClseDt: string;
  opengDt: string;
  status: 'active' | 'urgent' | 'completed' | 'cancelled';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  requirements: string[];
  attachments: Array<{
    id: number;
    name: string;
    url: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
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
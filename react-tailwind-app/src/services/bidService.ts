import { 
  BidData, 
  BidListResponse, 
  BidDetailResponse, 
  BidFilters, 
  BidStats,
  BidRecommendation,
  BidAnalysis
} from '../types/bid';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock data for development
const mockBids: BidData[] = [
  {
    id: 1,
    bidNtceNo: '2024001',
    bidNtceNm: 'AI 기반 품질관리 시스템 구축 사업',
    dminsttNm: '한국표준과학연구원',
    bidMethdNm: '일반입찰',
    presmptPrce: 350000000,
    bidPblancNmpr: 5,
    bidNtceDt: '2024-07-22',
    bidClseDt: '2024-08-15',
    opengDt: '2024-08-20',
    status: 'active',
    category: 'IT/소프트웨어',
    priority: 'high',
    description: 'AI 기술을 활용한 제품 품질관리 시스템 구축 및 운영',
    requirements: [
      'AI/ML 기술 보유 기업',
      '품질관리 시스템 개발 경험',
      'ISO 9001 인증 보유'
    ],
    attachments: [
      { id: 1, name: '사업계획서.pdf', url: '/attachments/plan.pdf', size: 2048576 },
      { id: 2, name: '기술명세서.pdf', url: '/attachments/spec.pdf', size: 3072000 }
    ],
    createdAt: '2024-07-22T10:30:00Z',
    updatedAt: '2024-07-22T10:30:00Z'
  },
  {
    id: 2,
    bidNtceNo: '2024002',
    bidNtceNm: '스마트팩토리 구축 사업',
    dminsttNm: '한국산업기술진흥원',
    bidMethdNm: '일반입찰',
    presmptPrce: 500000000,
    bidPblancNmpr: 3,
    bidNtceDt: '2024-07-20',
    bidClseDt: '2024-07-25',
    opengDt: '2024-07-30',
    status: 'urgent',
    category: '제조/자동화',
    priority: 'urgent',
    description: '4차 산업혁명 기술을 적용한 스마트팩토리 구축',
    requirements: [
      '스마트팩토리 구축 경험',
      'IoT 센서 기술 보유',
      '자동화 시스템 개발 능력'
    ],
    attachments: [
      { id: 3, name: '요구사항서.pdf', url: '/attachments/requirements.pdf', size: 1536000 }
    ],
    createdAt: '2024-07-20T09:15:00Z',
    updatedAt: '2024-07-22T09:15:00Z'
  },
  {
    id: 3,
    bidNtceNo: '2024003',
    bidNtceNm: '웹사이트 구축 프로젝트',
    dminsttNm: '스타트업A',
    bidMethdNm: '일반입찰',
    presmptPrce: 150000000,
    bidPblancNmpr: 8,
    bidNtceDt: '2024-07-15',
    bidClseDt: '2024-07-28',
    opengDt: '2024-08-05',
    status: 'active',
    category: '웹개발',
    priority: 'medium',
    description: '기업 웹사이트 구축 및 운영 서비스',
    requirements: [
      '반응형 웹 개발 경험',
      'UI/UX 디자인 능력',
      'SEO 최적화 경험'
    ],
    attachments: [
      { id: 4, name: '디자인가이드.pdf', url: '/attachments/design.pdf', size: 2560000 }
    ],
    createdAt: '2024-07-15T14:20:00Z',
    updatedAt: '2024-07-21T16:45:00Z'
  },
  {
    id: 4,
    bidNtceNo: '2024004',
    bidNtceNm: 'IoT 센서 네트워크 구축',
    dminsttNm: '한국정보통신기술협회',
    bidMethdNm: '일반입찰',
    presmptPrce: 280000000,
    bidPblancNmpr: 4,
    bidNtceDt: '2024-07-18',
    bidClseDt: '2024-08-10',
    opengDt: '2024-08-15',
    status: 'active',
    category: 'IoT/센서',
    priority: 'medium',
    description: '산업용 IoT 센서 네트워크 구축 및 데이터 분석 시스템',
    requirements: [
      'IoT 센서 개발 경험',
      '데이터 분석 시스템 구축 경험',
      '네트워크 보안 기술 보유'
    ],
    attachments: [
      { id: 5, name: '기술명세서.pdf', url: '/attachments/spec.pdf', size: 2048576 },
      { id: 6, name: '보안요구사항.pdf', url: '/attachments/security.pdf', size: 1024000 }
    ],
    createdAt: '2024-07-18T11:30:00Z',
    updatedAt: '2024-07-21T14:20:00Z'
  },
  {
    id: 5,
    bidNtceNo: '2024005',
    bidNtceNm: '클라우드 인프라 구축',
    dminsttNm: '한국전자정보통신산업진흥회',
    bidMethdNm: '일반입찰',
    presmptPrce: 400000000,
    bidPblancNmpr: 6,
    bidNtceDt: '2024-07-19',
    bidClseDt: '2024-08-12',
    opengDt: '2024-08-18',
    status: 'active',
    category: '클라우드/인프라',
    priority: 'high',
    description: '기업용 클라우드 인프라 구축 및 운영 서비스',
    requirements: [
      'AWS/Azure/GCP 인증 보유',
      '클라우드 아키텍처 설계 경험',
      'DevOps 경험'
    ],
    attachments: [
      { id: 7, name: '아키텍처설계서.pdf', url: '/attachments/architecture.pdf', size: 3584000 }
    ],
    createdAt: '2024-07-19T16:45:00Z',
    updatedAt: '2024-07-22T08:30:00Z'
  }
];

const mockBidStats: BidStats = {
  total: 1234,
  active: 89,
  urgent: 12,
  completed: 1145,
  byCategory: {
    'IT/소프트웨어': 45,
    '건설/인프라': 28,
    '연구개발': 20,
    '교육/훈련': 15,
    '기타': 22
  },
  byBudget: {
    '1억 미만': 35,
    '1억-5억': 42,
    '5억-10억': 25,
    '10억-50억': 18,
    '50억 이상': 9
  },
  byStatus: {
    active: 89,
    urgent: 12,
    completed: 1145
  },
  averageBudget: 68900000,
  totalBudget: 85000000000
};

const mockBidRecommendations: BidRecommendation[] = [
  {
    id: 1,
    bidId: 1,
    title: 'AI 기반 품질관리 시스템 구축 사업',
    similarity: 95,
    reason: '유사한 AI 기술 스택과 품질관리 도메인',
    confidence: 0.92,
    organization: '한국표준과학연구원',
    budget: 350000000,
    deadline: '2024-08-15'
  },
  {
    id: 2,
    bidId: 2,
    title: '스마트팩토리 구축 사업',
    similarity: 87,
    reason: '제조업 자동화 및 IoT 기술 요구사항 일치',
    confidence: 0.85,
    organization: '한국산업기술진흥원',
    budget: 500000000,
    deadline: '2024-07-25'
  },
  {
    id: 3,
    bidId: 3,
    title: '웹사이트 구축 프로젝트',
    similarity: 78,
    reason: '웹 개발 기술 스택 및 예산 범위 적합',
    confidence: 0.78,
    organization: '스타트업A',
    budget: 150000000,
    deadline: '2024-07-28'
  }
];

const mockBidAnalysis: BidAnalysis = {
  bidId: 1,
  marketAnalysis: {
    totalCompetitors: 15,
    averageBidPrice: 320000000,
    priceRange: { min: 280000000, max: 380000000 },
    successRate: 85.5
  },
  technicalAnalysis: {
    requiredSkills: ['AI/ML', '품질관리', '시스템구축'],
    skillMatch: 92,
    complexity: 'high',
    estimatedDuration: '6개월'
  },
  riskAnalysis: {
    technicalRisk: 'medium',
    scheduleRisk: 'low',
    costRisk: 'medium',
    overallRisk: 'medium'
  },
  recommendation: {
    shouldBid: true,
    confidence: 0.85,
    suggestedPrice: 340000000,
    keyFactors: [
      '기술적 경쟁력 우수',
      '예산 범위 적절',
      '일정 여유 있음'
    ]
  }
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BidService {
  // 입찰 목록 조회
  static async getBidList(
    filters: BidFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<BidListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await fetch(`${API_BASE_URL}/bids?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(500);
    
    let filteredBids = [...mockBids];
    
    if (filters.category) {
      filteredBids = filteredBids.filter(bid => bid.category === filters.category);
    }
    if (filters.status) {
      filteredBids = filteredBids.filter(bid => bid.status === filters.status);
    }
    if (filters.organization) {
      filteredBids = filteredBids.filter(bid => 
        bid.dminsttNm.toLowerCase().includes(filters.organization!.toLowerCase())
      );
    }
    if (filters.title) {
      filteredBids = filteredBids.filter(bid => 
        bid.bidNtceNm.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }
    if (filters.minBudget) {
      filteredBids = filteredBids.filter(bid => bid.presmptPrce >= filters.minBudget!);
    }
    if (filters.maxBudget) {
      filteredBids = filteredBids.filter(bid => bid.presmptPrce <= filters.maxBudget!);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBids = filteredBids.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        bids: paginatedBids,
        pagination: {
          page,
          limit,
          total: filteredBids.length,
          totalPages: Math.ceil(filteredBids.length / limit)
        }
      },
      message: '입찰 목록 조회 성공'
    };
  }

  // 입찰 상세 조회
  static async getBidDetail(bidId: number): Promise<BidDetailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/${bidId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);
    
    const bid = mockBids.find(b => b.id === bidId);
    if (!bid) {
      throw new Error('입찰 정보를 찾을 수 없습니다.');
    }
    
    return {
      success: true,
      data: bid,
      message: '입찰 상세 조회 성공'
    };
  }

  // 입찰 통계 조회
  static async getBidStats(): Promise<BidStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
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
    return mockBidStats;
  }

  // 입찰 추천 조회
  static async getBidRecommendations(limit: number = 5): Promise<BidRecommendation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/recommendations?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(400);
    return mockBidRecommendations.slice(0, limit);
  }

  // 입찰 분석 조회
  static async getBidAnalysis(bidId: number): Promise<BidAnalysis> {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/${bidId}/analysis`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(600);
    
    // Return analysis for the specific bid or default analysis
    const bid = mockBids.find(b => b.id === bidId);
    if (!bid) {
      throw new Error('입찰 정보를 찾을 수 없습니다.');
    }
    
    return {
      ...mockBidAnalysis,
      bidId: bidId
    };
  }

  // 입찰 북마크 추가/제거
  static async toggleBidBookmark(bidId: number): Promise<{ success: boolean; bookmarked: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/${bidId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);
    
    // Simulate bookmark toggle
    const bookmarked = Math.random() > 0.5;
    
    return {
      success: true,
      bookmarked
    };
  }

  // 입찰 알림 설정
  static async setBidNotification(bidId: number, enabled: boolean): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bids/${bidId}/notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ enabled }),
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(300);
    
    return {
      success: true
    };
  }
}
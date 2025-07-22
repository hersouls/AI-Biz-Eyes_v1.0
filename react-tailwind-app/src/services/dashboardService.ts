import { DashboardData, DashboardStats, RecentActivity, ChartData, TimelineEvent } from '../types/dashboard';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hersouls.github.io/AI-Biz-Eyes_v1.0/api';

// Mock data for development
const mockDashboardStats: DashboardStats = {
  totalBids: 1234,
  activeBids: 89,
  completedBids: 1145,
  urgentBids: 12,
  totalBudget: 85000000000,
  averageBudget: 68900000,
  successRate: 87.5,
  monthlyGrowth: 12.3
};

const mockChartData: ChartData = {
  monthlyTrends: [
    { month: '1월', bids: 85, budget: 5200000000 },
    { month: '2월', bids: 92, budget: 5800000000 },
    { month: '3월', bids: 78, budget: 4500000000 },
    { month: '4월', bids: 105, budget: 6800000000 },
    { month: '5월', bids: 120, budget: 7500000000 },
    { month: '6월', bids: 95, budget: 6200000000 },
    { month: '7월', bids: 89, budget: 5800000000 }
  ],
  categoryDistribution: [
    { category: 'IT/소프트웨어', count: 45, percentage: 35 },
    { category: '건설/인프라', count: 28, percentage: 22 },
    { category: '연구개발', count: 20, percentage: 15 },
    { category: '교육/훈련', count: 15, percentage: 12 },
    { category: '기타', count: 22, percentage: 16 }
  ],
  budgetRanges: [
    { range: '1억 미만', count: 35, percentage: 28 },
    { range: '1억-5억', count: 42, percentage: 33 },
    { range: '5억-10억', count: 25, percentage: 20 },
    { range: '10억-50억', count: 18, percentage: 14 },
    { range: '50억 이상', count: 9, percentage: 5 }
  ],
  successRates: [
    { category: 'IT/소프트웨어', rate: 92.5 },
    { category: '건설/인프라', rate: 85.2 },
    { category: '연구개발', rate: 78.9 },
    { category: '교육/훈련', rate: 88.3 },
    { category: '기타', rate: 82.1 }
  ]
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: 1,
    type: 'new_bid',
    title: 'AI 기반 품질관리 시스템 구축 사업',
    description: '새로운 공고가 등록되었습니다.',
    organization: '한국표준과학연구원',
    budget: 350000000,
    deadline: '2024-08-15',
    priority: 'high',
    timestamp: '2024-07-22T10:30:00Z',
    status: 'active'
  },
  {
    id: 2,
    type: 'deadline_approaching',
    title: '스마트팩토리 구축 사업',
    description: '마감일이 3일 남았습니다.',
    organization: '한국산업기술진흥원',
    budget: 500000000,
    deadline: '2024-07-25',
    priority: 'urgent',
    timestamp: '2024-07-22T09:15:00Z',
    status: 'urgent'
  },
  {
    id: 3,
    type: 'bid_completed',
    title: '웹사이트 구축 프로젝트',
    description: '입찰이 성공적으로 완료되었습니다.',
    organization: '스타트업A',
    budget: 150000000,
    deadline: '2024-07-20',
    priority: 'medium',
    timestamp: '2024-07-21T16:45:00Z',
    status: 'completed'
  },
  {
    id: 4,
    type: 'recommendation',
    title: 'IoT 센서 네트워크 구축',
    description: 'AI가 추천하는 유사 사업입니다.',
    organization: '한국정보통신기술협회',
    budget: 280000000,
    deadline: '2024-08-10',
    priority: 'medium',
    timestamp: '2024-07-21T14:20:00Z',
    status: 'recommended'
  }
];

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 1,
    type: 'deadline',
    title: 'AI 기반 품질관리 시스템 구축 사업',
    description: '입찰 마감일',
    date: '2024-07-25',
    time: '18:00',
    priority: 'high',
    organization: '한국표준과학연구원'
  },
  {
    id: 2,
    type: 'briefing',
    title: '스마트팩토리 구축 사업',
    description: '사전설명회',
    date: '2024-07-23',
    time: '14:00',
    priority: 'medium',
    organization: '한국산업기술진흥원'
  },
  {
    id: 3,
    type: 'submission',
    title: '웹사이트 구축 프로젝트',
    description: '제안서 제출 마감',
    date: '2024-07-28',
    time: '17:00',
    priority: 'high',
    organization: '스타트업A'
  },
  {
    id: 4,
    type: 'evaluation',
    title: 'IoT 센서 네트워크 구축',
    description: '평가 결과 발표',
    date: '2024-07-30',
    time: '10:00',
    priority: 'medium',
    organization: '한국정보통신기술협회'
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class DashboardService {
  // 대시보드 통계 조회
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
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
    return mockDashboardStats;
  }

  // 차트 데이터 조회
  static async getChartData(): Promise<ChartData> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/charts`, {
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
    await delay(500);
    return mockChartData;
  }

  // 최근 활동 조회
  static async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/recent-activity?limit=${limit}`, {
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
    return mockRecentActivity.slice(0, limit);
  }

  // 타임라인 이벤트 조회
  static async getTimelineEvents(): Promise<TimelineEvent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/timeline`, {
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
    return mockTimelineEvents;
  }

  // 전체 대시보드 데이터 조회
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
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
    return {
      stats: mockDashboardStats,
      charts: mockChartData,
      recentActivity: mockRecentActivity,
      timeline: mockTimelineEvents
    };
  }

  // 대시보드 새로고침
  static async refreshDashboard(): Promise<DashboardData> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/refresh`, {
        method: 'POST',
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

    // Fallback to mock data with slight variations
    await delay(800);
    
    // Simulate some data changes
    const updatedStats = {
      ...mockDashboardStats,
      totalBids: mockDashboardStats.totalBids + Math.floor(Math.random() * 5),
      activeBids: mockDashboardStats.activeBids + Math.floor(Math.random() * 3) - 1
    };
    
    return {
      stats: updatedStats,
      charts: mockChartData,
      recentActivity: mockRecentActivity,
      timeline: mockTimelineEvents
    };
  }
}
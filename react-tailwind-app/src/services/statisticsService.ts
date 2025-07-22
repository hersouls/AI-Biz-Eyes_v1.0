import { 
  StatisticsData, 
  StatisticsFilters, 
  ChartData, 
  TrendData, 
  PerformanceMetrics,
  ComparisonData
} from '../types/statistics';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hersouls.github.io/AI-Biz-Eyes_v1.0/api';

// Mock data for development
const mockStatisticsData: StatisticsData = {
  overview: {
    totalBids: 1234,
    totalBudget: 85000000000,
    successRate: 87.5,
    averageResponseTime: 2.3,
    monthlyGrowth: 12.3
  },
  trends: {
    monthly: [
      { month: '1월', bids: 85, budget: 5200000000, success: 74 },
      { month: '2월', bids: 92, budget: 5800000000, success: 81 },
      { month: '3월', bids: 78, budget: 4500000000, success: 68 },
      { month: '4월', bids: 105, budget: 6800000000, success: 92 },
      { month: '5월', bids: 120, budget: 7500000000, success: 108 },
      { month: '6월', bids: 95, budget: 6200000000, success: 83 },
      { month: '7월', bids: 89, budget: 5800000000, success: 78 }
    ],
    weekly: [
      { week: '1주차', bids: 22, budget: 1500000000, success: 19 },
      { week: '2주차', bids: 18, budget: 1200000000, success: 16 },
      { week: '3주차', bids: 25, budget: 1800000000, success: 22 },
      { week: '4주차', bids: 24, budget: 1300000000, success: 21 }
    ]
  },
  categories: {
    distribution: [
      { category: 'IT/소프트웨어', count: 45, percentage: 35, budget: 28000000000 },
      { category: '건설/인프라', count: 28, percentage: 22, budget: 18000000000 },
      { category: '연구개발', count: 20, percentage: 15, budget: 12000000000 },
      { category: '교육/훈련', count: 15, percentage: 12, budget: 8000000000 },
      { category: '기타', count: 22, percentage: 16, budget: 19000000000 }
    ],
    performance: [
      { category: 'IT/소프트웨어', successRate: 92.5, avgBudget: 622000000 },
      { category: '건설/인프라', successRate: 85.2, avgBudget: 642000000 },
      { category: '연구개발', successRate: 78.9, avgBudget: 600000000 },
      { category: '교육/훈련', successRate: 88.3, avgBudget: 533000000 },
      { category: '기타', successRate: 82.1, avgBudget: 863000000 }
    ]
  },
  organizations: {
    topPerformers: [
      { name: '한국표준과학연구원', bids: 15, successRate: 93.3, avgBudget: 350000000 },
      { name: '한국산업기술진흥원', bids: 12, successRate: 91.7, avgBudget: 420000000 },
      { name: '한국정보통신기술협회', bids: 10, successRate: 90.0, avgBudget: 280000000 },
      { name: '한국전자정보통신산업진흥회', bids: 8, successRate: 87.5, avgBudget: 500000000 },
      { name: '한국연구재단', bids: 6, successRate: 83.3, avgBudget: 250000000 }
    ],
    budgetLeaders: [
      { name: '한국산업기술진흥원', totalBudget: 5040000000, avgBudget: 420000000 },
      { name: '한국전자정보통신산업진흥회', totalBudget: 4000000000, avgBudget: 500000000 },
      { name: '한국표준과학연구원', totalBudget: 5250000000, avgBudget: 350000000 },
      { name: '한국정보통신기술협회', totalBudget: 2800000000, avgBudget: 280000000 },
      { name: '한국연구재단', totalBudget: 1500000000, avgBudget: 250000000 }
    ]
  },
  performance: {
    monthly: [
      { month: '1월', successRate: 87.1, avgResponseTime: 2.1, efficiency: 85.2 },
      { month: '2월', successRate: 88.0, avgResponseTime: 2.0, efficiency: 87.1 },
      { month: '3월', successRate: 87.2, avgResponseTime: 2.4, efficiency: 83.5 },
      { month: '4월', successRate: 87.6, avgResponseTime: 2.2, efficiency: 86.8 },
      { month: '5월', successRate: 90.0, avgResponseTime: 2.0, efficiency: 89.2 },
      { month: '6월', successRate: 87.4, avgResponseTime: 2.3, efficiency: 85.7 },
      { month: '7월', successRate: 87.6, avgResponseTime: 2.3, efficiency: 86.1 }
    ],
    trends: {
      successRate: { trend: 'increasing', change: 2.1 },
      responseTime: { trend: 'decreasing', change: -0.3 },
      efficiency: { trend: 'increasing', change: 3.2 }
    }
  }
};

const mockChartData: ChartData = {
  bidTrends: {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
    datasets: [
      {
        label: '입찰 건수',
        data: [85, 92, 78, 105, 120, 95, 89],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      },
      {
        label: '예산 (억원)',
        data: [52, 58, 45, 68, 75, 62, 58],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }
    ]
  },
  categoryDistribution: {
    labels: ['IT/소프트웨어', '건설/인프라', '연구개발', '교육/훈련', '기타'],
    datasets: [{
      data: [35, 22, 15, 12, 16],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ]
    }]
  },
  successRates: {
    labels: ['IT/소프트웨어', '건설/인프라', '연구개발', '교육/훈련', '기타'],
    datasets: [{
      label: '성공률 (%)',
      data: [92.5, 85.2, 78.9, 88.3, 82.1],
      backgroundColor: '#3B82F6'
    }]
  }
};

const mockTrendData: TrendData = {
  bidVolume: {
    current: 89,
    previous: 95,
    change: -6.3,
    trend: 'decreasing'
  },
  budget: {
    current: 5800000000,
    previous: 6200000000,
    change: -6.5,
    trend: 'decreasing'
  },
  successRate: {
    current: 87.6,
    previous: 87.4,
    change: 0.2,
    trend: 'increasing'
  },
  responseTime: {
    current: 2.3,
    previous: 2.3,
    change: 0.0,
    trend: 'stable'
  }
};

const mockPerformanceMetrics: PerformanceMetrics = {
  efficiency: {
    overall: 86.1,
    byCategory: {
      'IT/소프트웨어': 89.2,
      '건설/인프라': 85.7,
      '연구개발': 83.5,
      '교육/훈련': 87.1,
      '기타': 84.3
    }
  },
  productivity: {
    bidsPerMonth: 89,
    avgProcessingTime: 2.3,
    completionRate: 87.6
  },
  quality: {
    accuracy: 94.2,
    consistency: 91.8,
    reliability: 93.5
  }
};

const mockComparisonData: ComparisonData = {
  yearOverYear: {
    currentYear: {
      totalBids: 623,
      totalBudget: 42000000000,
      successRate: 87.6
    },
    previousYear: {
      totalBids: 554,
      totalBudget: 38000000000,
      successRate: 85.2
    },
    change: {
      bids: 12.5,
      budget: 10.5,
      successRate: 2.8
    }
  },
  monthOverMonth: {
    currentMonth: {
      totalBids: 89,
      totalBudget: 5800000000,
      successRate: 87.6
    },
    previousMonth: {
      totalBids: 95,
      totalBudget: 6200000000,
      successRate: 87.4
    },
    change: {
      bids: -6.3,
      budget: -6.5,
      successRate: 0.2
    }
  }
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class StatisticsService {
  // 전체 통계 데이터 조회
  static async getStatisticsData(filters?: StatisticsFilters): Promise<StatisticsData> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.organization) params.append('organization', filters.organization);

      const response = await fetch(`${API_BASE_URL}/statistics?${params}`, {
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
    return mockStatisticsData;
  }

  // 차트 데이터 조회
  static async getChartData(chartType: string, filters?: StatisticsFilters): Promise<ChartData> {
    try {
      const params = new URLSearchParams();
      params.append('type', chartType);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.category) params.append('category', filters.category);

      const response = await fetch(`${API_BASE_URL}/statistics/charts?${params}`, {
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

  // 트렌드 데이터 조회
  static async getTrendData(period: string = 'monthly'): Promise<TrendData> {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/trends?period=${period}`, {
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
    return mockTrendData;
  }

  // 성과 지표 조회
  static async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/performance`, {
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
    return mockPerformanceMetrics;
  }

  // 비교 데이터 조회
  static async getComparisonData(comparisonType: 'year' | 'month' = 'month'): Promise<ComparisonData> {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/comparison?type=${comparisonType}`, {
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
    return mockComparisonData;
  }

  // 통계 리포트 생성
  static async generateReport(
    reportType: 'summary' | 'detailed' | 'custom',
    filters?: StatisticsFilters
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('type', reportType);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.category) params.append('category', filters.category);

      const response = await fetch(`${API_BASE_URL}/statistics/report?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        return response.blob();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await delay(1000);
    
    // Create a mock report blob
    const mockReportContent = `통계 리포트 (${reportType})
생성일: ${new Date().toLocaleDateString()}
필터: ${JSON.stringify(filters || {})}

전체 입찰 건수: ${mockStatisticsData.overview.totalBids}
총 예산: ${mockStatisticsData.overview.totalBudget.toLocaleString()}원
성공률: ${mockStatisticsData.overview.successRate}%
월간 성장률: ${mockStatisticsData.overview.monthlyGrowth}%`;
    
    return new Blob([mockReportContent], { type: 'text/plain' });
  }

  // 실시간 통계 업데이트
  static async getRealTimeStats(): Promise<Partial<StatisticsData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/realtime`, {
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
    await delay(200);
    
    return {
      overview: {
        ...mockStatisticsData.overview,
        totalBids: mockStatisticsData.overview.totalBids + Math.floor(Math.random() * 3),
        successRate: mockStatisticsData.overview.successRate + (Math.random() - 0.5) * 2
      }
    };
  }
}
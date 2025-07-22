export interface StatisticsFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  organization?: string;
  status?: string;
}

export interface StatisticsData {
  overview: {
    totalBids: number;
    totalBudget: number;
    successRate: number;
    averageResponseTime: number;
    monthlyGrowth: number;
  };
  trends: {
    monthly: Array<{
      month: string;
      bids: number;
      budget: number;
      success: number;
    }>;
    weekly: Array<{
      week: string;
      bids: number;
      budget: number;
      success: number;
    }>;
  };
  categories: {
    distribution: Array<{
      category: string;
      count: number;
      percentage: number;
      budget: number;
    }>;
    performance: Array<{
      category: string;
      successRate: number;
      avgBudget: number;
    }>;
  };
  organizations: {
    topPerformers: Array<{
      name: string;
      bids: number;
      successRate: number;
      avgBudget: number;
    }>;
    budgetLeaders: Array<{
      name: string;
      totalBudget: number;
      avgBudget: number;
    }>;
  };
  performance: {
    monthly: Array<{
      month: string;
      successRate: number;
      avgResponseTime: number;
      efficiency: number;
    }>;
    trends: {
      successRate: { trend: 'increasing' | 'decreasing' | 'stable'; change: number };
      responseTime: { trend: 'increasing' | 'decreasing' | 'stable'; change: number };
      efficiency: { trend: 'increasing' | 'decreasing' | 'stable'; change: number };
    };
  };
}

export interface ChartData {
  bidTrends: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }>;
  };
  categoryDistribution: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
    }>;
  };
  successRates: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
    }>;
  };
}

export interface TrendData {
  bidVolume: {
    current: number;
    previous: number;
    change: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  budget: {
    current: number;
    previous: number;
    change: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  successRate: {
    current: number;
    previous: number;
    change: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  responseTime: {
    current: number;
    previous: number;
    change: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface PerformanceMetrics {
  efficiency: {
    overall: number;
    byCategory: Record<string, number>;
  };
  productivity: {
    bidsPerMonth: number;
    avgProcessingTime: number;
    completionRate: number;
  };
  quality: {
    accuracy: number;
    consistency: number;
    reliability: number;
  };
}

export interface ComparisonData {
  yearOverYear: {
    currentYear: {
      totalBids: number;
      totalBudget: number;
      successRate: number;
    };
    previousYear: {
      totalBids: number;
      totalBudget: number;
      successRate: number;
    };
    change: {
      bids: number;
      budget: number;
      successRate: number;
    };
  };
  monthOverMonth: {
    currentMonth: {
      totalBids: number;
      totalBudget: number;
      successRate: number;
    };
    previousMonth: {
      totalBids: number;
      totalBudget: number;
      successRate: number;
    };
    change: {
      bids: number;
      budget: number;
      successRate: number;
    };
  };
}
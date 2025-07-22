export interface DashboardStats {
  totalBids: number;
  activeBids: number;
  completedBids: number;
  urgentBids: number;
  totalBudget: number;
  averageBudget: number;
  successRate: number;
  monthlyGrowth: number;
}

export interface ChartData {
  monthlyTrends: Array<{
    month: string;
    bids: number;
    budget: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  budgetRanges: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  successRates: Array<{
    category: string;
    rate: number;
  }>;
}

export interface RecentActivity {
  id: number;
  type: 'new_bid' | 'deadline_approaching' | 'bid_completed' | 'recommendation';
  title: string;
  description: string;
  organization: string;
  budget: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  status: 'active' | 'urgent' | 'completed' | 'recommended';
}

export interface TimelineEvent {
  id: number;
  type: 'deadline' | 'briefing' | 'submission' | 'evaluation';
  title: string;
  description: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  organization: string;
}

export interface DashboardData {
  stats: DashboardStats;
  charts: ChartData;
  recentActivity: RecentActivity[];
  timeline: TimelineEvent[];
}
import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import clsx from 'clsx';
import { DashboardService } from '../../services/dashboardService';
import { DashboardStats } from '../../types/dashboard';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  description?: string;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-50',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    textColor: 'text-primary-600'
  },
  secondary: {
    bg: 'bg-secondary-50',
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
    textColor: 'text-secondary-600'
  },
  success: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600'
  },
  warning: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-600'
  },
  danger: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-600'
  }
};

function KPICard({ title, value, icon: Icon, change, color, description }: KPICardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white overflow-hidden shadow-md rounded-5 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={clsx('w-12 h-12 rounded-5 flex items-center justify-center', colors.iconBg)}>
              <Icon className={clsx('w-6 h-6', colors.iconColor)} aria-hidden="true" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-body3 font-medium text-gray-600 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-heading3 font-bold text-primary">{value}</div>
                {change && (
                  <div className={clsx(
                    'ml-3 flex items-baseline text-body3 font-medium',
                    change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {change.type === 'increase' ? (
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className="sr-only">
                      {change.type === 'increase' ? '증가' : '감소'}
                    </span>
                    {change.value}%
                  </div>
                )}
              </dd>
              {description && (
                <dd className="text-body3 text-gray-600 mt-2">{description}</dd>
              )}
              {change && (
                <dd className="text-detail1 text-gray-500 mt-1">{change.period}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KPICards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await DashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white overflow-hidden shadow-md rounded-5 border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-5"></div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-md rounded-5 border border-gray-200 p-6">
          <div className="text-center text-gray-500">데이터를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const kpiData = [
    {
      title: '전체 공고',
      value: stats.totalBids.toLocaleString(),
              icon: ClipboardList,
      change: { value: stats.monthlyGrowth, type: 'increase' as const, period: '지난 달 대비' },
      color: 'primary' as const,
      description: '진행중인 공고 수'
    },
    {
      title: '진행중',
      value: stats.activeBids.toLocaleString(),
              icon: Clock,
      change: { value: 5, type: 'increase' as const, period: '지난 주 대비' },
      color: 'secondary' as const,
      description: '현재 진행중인 공고'
    },
    {
      title: '완료',
      value: stats.completedBids.toLocaleString(),
              icon: CheckCircle,
      change: { value: 8, type: 'increase' as const, period: '지난 달 대비' },
      color: 'success' as const,
      description: '완료된 공고 수'
    },
    {
      title: '긴급',
      value: stats.urgentBids.toLocaleString(),
              icon: AlertTriangle,
      change: { value: 3, type: 'decrease' as const, period: '지난 주 대비' },
      color: 'danger' as const,
      description: '긴급 처리 필요'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
}
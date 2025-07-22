import React from 'react';
import { 
  ClipboardDocumentListIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon 
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

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
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500 mr-1" />
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
  const kpiData = [
    {
      title: '전체 공고',
      value: '1,234',
      icon: ClipboardDocumentListIcon,
      change: { value: 12, type: 'increase' as const, period: '지난 달 대비' },
      color: 'primary' as const,
      description: '진행중인 공고 수'
    },
    {
      title: '진행중',
      value: '89',
      icon: ClockIcon,
      change: { value: 5, type: 'increase' as const, period: '지난 주 대비' },
      color: 'secondary' as const,
      description: '현재 진행중인 공고'
    },
    {
      title: '완료',
      value: '1,145',
      icon: CheckCircleIcon,
      change: { value: 8, type: 'increase' as const, period: '지난 달 대비' },
      color: 'success' as const,
      description: '완료된 공고 수'
    },
    {
      title: '긴급',
      value: '12',
      icon: ExclamationTriangleIcon,
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
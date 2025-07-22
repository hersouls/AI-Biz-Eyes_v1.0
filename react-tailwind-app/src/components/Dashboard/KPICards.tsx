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
  color: 'blue' | 'green' | 'yellow' | 'red';
  description?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600'
  },
  yellow: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-600'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-600'
  }
};

function KPICard({ title, value, icon: Icon, change, color, description }: KPICardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={clsx('w-12 h-12 rounded-lg flex items-center justify-center', colors.iconBg)}>
              <Icon className={clsx('w-6 h-6', colors.iconColor)} aria-hidden="true" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div className={clsx(
                    'ml-2 flex items-baseline text-sm font-semibold',
                    change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {change.type === 'increase' ? (
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                    )}
                    <span className="sr-only">
                      {change.type === 'increase' ? '증가' : '감소'}
                    </span>
                    {change.value}%
                  </div>
                )}
              </dd>
              {description && (
                <dd className="text-sm text-gray-600 mt-1">{description}</dd>
              )}
              {change && (
                <dd className="text-xs text-gray-500 mt-1">{change.period}</dd>
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
      title: '전체 공고 수',
      value: '1,247',
      icon: ClipboardDocumentListIcon,
      color: 'blue' as const,
      change: {
        value: 12.5,
        type: 'increase' as const,
        period: '지난 주 대비'
      },
      description: '신규 공고 포함'
    },
    {
      title: '진행 중 공고',
      value: '342',
      icon: ClockIcon,
      color: 'yellow' as const,
      change: {
        value: 3.2,
        type: 'increase' as const,
        period: '지난 주 대비'
      },
      description: '참여 검토 중'
    },
    {
      title: '참여 완료',
      value: '89',
      icon: CheckCircleIcon,
      color: 'green' as const,
      change: {
        value: 8.1,
        type: 'increase' as const,
        period: '지난 주 대비'
      },
      description: '제안서 제출 완료'
    },
    {
      title: '긴급/누락',
      value: '23',
      icon: ExclamationTriangleIcon,
      color: 'red' as const,
      change: {
        value: 2.4,
        type: 'decrease' as const,
        period: '지난 주 대비'
      },
      description: '즉시 조치 필요'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((item, index) => (
        <KPICard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
          change={item.change}
          description={item.description}
        />
      ))}
    </div>
  );
}
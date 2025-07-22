import React, { useState, useEffect, useCallback } from 'react';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { SystemStatistics } from '../../types/admin';
import AdminLayout from './AdminLayout';

const AdminDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<SystemStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('today');

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getSystemStatistics(period);
      setStatistics(response.data || null);
      setError(null);
    } catch (err) {
      setError('통계 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to load statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    changeType = 'neutral',
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    color?: 'blue' | 'green' | 'red' | 'yellow';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600',
      yellow: 'bg-yellow-50 text-yellow-600'
    };

    const changeIcons = {
      positive: <ArrowUpIcon className="h-4 w-4 text-green-500" />,
      negative: <ArrowDownIcon className="h-4 w-4 text-red-500" />,
      neutral: null
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                {changeIcons[changeType]}
                <span className={`text-sm ml-1 ${
                  changeType === 'positive' ? 'text-green-600' : 
                  changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {change}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    onClick, 
    color = 'blue' 
  }: {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    color?: 'blue' | 'green' | 'red' | 'yellow';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      red: 'bg-red-50 text-red-600 hover:bg-red-100',
      yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
    };

    return (
      <button
        onClick={onClick}
        className={`w-full p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 ${colorClasses[color]}`}
      >
        <div className="flex items-center">
          <Icon className="h-8 w-8" />
          <div className="ml-4 text-left">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm opacity-75">{description}</p>
          </div>
        </div>
      </button>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600">시스템 현황 및 주요 지표를 확인하세요</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">오늘</option>
              <option value="week">이번 주</option>
              <option value="month">이번 달</option>
              <option value="year">올해</option>
            </select>
            <button
              onClick={loadStatistics}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="전체 사용자"
              value={statistics.users.total}
              icon={UsersIcon}
              change={`+${statistics.users.newThisMonth}명`}
              changeType="positive"
              color="blue"
            />
            <StatCard
              title="활성 사용자"
              value={statistics.users.active}
              icon={CheckCircleIcon}
              color="green"
            />
            <StatCard
              title="전체 공고"
              value={statistics.bids.total.toLocaleString()}
              icon={DocumentTextIcon}
              change={`+${statistics.bids.newToday}건`}
              changeType="positive"
              color="yellow"
            />
            <StatCard
              title="동기화 성공률"
              value={`${statistics.bids.syncSuccess}%`}
              icon={ChartBarIcon}
              color="green"
            />
            <StatCard
              title="전체 알림"
              value={statistics.notifications.total}
              icon={ExclamationTriangleIcon}
              color="red"
            />
            <StatCard
              title="읽지 않은 알림"
              value={statistics.notifications.unread}
              icon={ClockIcon}
              color="yellow"
            />
            <StatCard
              title="긴급 알림"
              value={statistics.notifications.urgent}
              icon={ExclamationTriangleIcon}
              color="red"
            />
            <StatCard
              title="시스템 가동률"
              value={statistics.system.uptime}
              icon={CheckCircleIcon}
              color="green"
            />
          </div>
        )}

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 상태</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">디스크 사용량</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: statistics?.system.diskUsage || '0%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {statistics?.system.diskUsage}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">메모리 사용량</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: statistics?.system.memoryUsage || '0%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {statistics?.system.memoryUsage}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">마지막 백업</span>
                <span className="text-sm text-gray-900">
                  {statistics?.system.lastBackup ? 
                    new Date(statistics.system.lastBackup).toLocaleString('ko-KR') : 
                    '없음'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
            <div className="space-y-3">
              <QuickActionCard
                title="새 사용자 등록"
                description="새로운 사용자 계정을 생성합니다"
                icon={UsersIcon}
                onClick={() => window.location.href = '/admin/users'}
                color="blue"
              />
              <QuickActionCard
                title="시스템 로그 확인"
                description="시스템 로그를 확인합니다"
                icon={DocumentTextIcon}
                onClick={() => window.location.href = '/admin/logs'}
                color="yellow"
              />
              <QuickActionCard
                title="백업 생성"
                description="시스템 데이터를 백업합니다"
                icon={ChartBarIcon}
                onClick={() => window.location.href = '/admin/backups'}
                color="green"
              />
              <QuickActionCard
                title="알림 설정"
                description="알림 설정을 관리합니다"
                icon={ExclamationTriangleIcon}
                onClick={() => window.location.href = '/admin/notifications'}
                color="red"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
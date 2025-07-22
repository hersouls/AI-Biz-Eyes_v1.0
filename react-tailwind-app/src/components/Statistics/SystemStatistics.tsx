import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import Button from '../Button';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  UsersIcon, 
  DocumentTextIcon,
  BellIcon,
  ServerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SystemStatisticsProps {
  period: string;
}

interface SystemStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  bids: {
    total: number;
    newToday: number;
    syncSuccess: number;
  };
  notifications: {
    total: number;
    unread: number;
    urgent: number;
  };
  system: {
    uptime: string;
    lastBackup?: string;
    diskUsage: string;
    memoryUsage: string;
  };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const SystemStatistics: React.FC<SystemStatisticsProps> = ({ period }) => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemStatistics();
  }, [period]);

  const fetchSystemStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/statistics/system?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('시스템 통계 데이터를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchSystemStatistics} variant="primary">
            다시 시도
          </Button>
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  // 차트 데이터 준비
  const userData = [
    { name: '활성 사용자', value: stats.users.active, color: '#10B981' },
    { name: '비활성 사용자', value: stats.users.total - stats.users.active, color: '#6B7280' }
  ];

  const bidData = [
    { name: '전체 공고', value: stats.bids.total, color: '#3B82F6' },
    { name: '오늘 신규', value: stats.bids.newToday, color: '#10B981' }
  ];

  const notificationData = [
    { name: '읽음', value: stats.notifications.total - stats.notifications.unread, color: '#10B981' },
    { name: '미읽', value: stats.notifications.unread, color: '#F59E0B' },
    { name: '긴급', value: stats.notifications.urgent, color: '#EF4444' }
  ];

  const systemData = [
    { name: '디스크 사용량', value: parseInt(stats.system.diskUsage), color: '#3B82F6' },
    { name: '메모리 사용량', value: parseInt(stats.system.memoryUsage), color: '#10B981' }
  ];

  // 시스템 상태 평가
  const getSystemStatus = () => {
    const diskUsage = parseInt(stats.system.diskUsage);
    const memoryUsage = parseInt(stats.system.memoryUsage);
    
    if (diskUsage > 90 || memoryUsage > 90) return 'critical';
    if (diskUsage > 80 || memoryUsage > 80) return 'warning';
    return 'healthy';
  };

  const systemStatus = getSystemStatus();
  const statusColors = {
    healthy: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600'
  };

  const statusLabels = {
    healthy: '정상',
    warning: '주의',
    critical: '위험'
  };

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 사용자</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.users.total)}</p>
              <p className="text-sm text-gray-500">활성: {formatNumber(stats.users.active)}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 공고</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.bids.total)}</p>
              <p className="text-sm text-gray-500">오늘 신규: {formatNumber(stats.bids.newToday)}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 알림</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.notifications.total)}</p>
              <p className="text-sm text-gray-500">미읽: {formatNumber(stats.notifications.unread)}</p>
            </div>
            <BellIcon className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">시스템 상태</p>
              <p className={`text-2xl font-bold ${statusColors[systemStatus]}`}>
                {statusLabels[systemStatus]}
              </p>
              <p className="text-sm text-gray-500">업타임: {stats.system.uptime}</p>
            </div>
            <ServerIcon className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 사용자 현황 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">사용자 현황</h3>
            <p className="text-sm text-gray-600">활성/비활성 사용자 분포</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatNumber(value as number), '명']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* 공고 현황 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">공고 현황</h3>
            <p className="text-sm text-gray-600">전체 및 신규 공고 현황</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bidData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 알림 현황 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">알림 현황</h3>
            <p className="text-sm text-gray-600">읽음/미읽/긴급 알림 분포</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={notificationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {notificationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* 시스템 리소스 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">시스템 리소스</h3>
            <p className="text-sm text-gray-600">디스크 및 메모리 사용량</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={systemData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, '사용량']} />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 시스템 정보 */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">시스템 정보</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">시스템 업타임</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats.system.uptime}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ServerIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">디스크 사용량</span>
              </div>
              <span className={`text-sm font-semibold ${
                parseInt(stats.system.diskUsage) > 80 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {stats.system.diskUsage}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ServerIcon className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">메모리 사용량</span>
              </div>
              <span className={`text-sm font-semibold ${
                parseInt(stats.system.memoryUsage) > 80 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {stats.system.memoryUsage}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <UsersIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">활성 사용자</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatNumber(stats.users.active)} / {formatNumber(stats.users.total)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">동기화 성공률</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats.bids.syncSuccess}%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">마지막 백업</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stats.system.lastBackup ? formatDate(stats.system.lastBackup) : '없음'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 성능 지표 */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">성능 지표</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  지표
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  현재값
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  권장값
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  디스크 사용량
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.system.diskUsage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={parseInt(stats.system.diskUsage) > 80 ? 'danger' : 'success'}
                    text={parseInt(stats.system.diskUsage) > 80 ? '주의' : '정상'}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  &lt; 80%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  메모리 사용량
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.system.memoryUsage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={parseInt(stats.system.memoryUsage) > 80 ? 'danger' : 'success'}
                    text={parseInt(stats.system.memoryUsage) > 80 ? '주의' : '정상'}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  &lt; 80%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  동기화 성공률
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.bids.syncSuccess}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={stats.bids.syncSuccess < 95 ? 'danger' : 'success'}
                    text={stats.bids.syncSuccess < 95 ? '주의' : '정상'}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  &gt; 95%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  사용자 활성률
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.users.total > 0 ? ((stats.users.active / stats.users.total) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={stats.users.total > 0 && (stats.users.active / stats.users.total) < 0.5 ? 'danger' : 'success'}
                    text={stats.users.total > 0 && (stats.users.active / stats.users.total) < 0.5 ? '주의' : '정상'}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  &gt; 50%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SystemStatistics;
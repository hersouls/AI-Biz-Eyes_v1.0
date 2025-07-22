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
  BellIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface NotificationStatisticsProps {
  period: string;
}

interface NotificationStats {
  totalNotifications: number;
  typeStats: Array<{
    type: string;
    count: number;
    unread: number;
  }>;
  statusStats: Array<{
    status: string;
    count: number;
  }>;
  priorityStats: Array<{
    priority: string;
    count: number;
  }>;
  dailyTrend: Array<{
    date: string;
    count: number;
  }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const NotificationStatistics: React.FC<NotificationStatisticsProps> = ({ period }) => {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotificationStatistics();
  }, [period]);

  const fetchNotificationStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/statistics/notifications?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('알림 통계 데이터를 불러오는데 실패했습니다.');
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

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      'urgent': '긴급',
      'deadline': '마감',
      'missing': '누락',
      'duplicate': '중복',
      'new': '신규'
    };
    return typeLabels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      'unread': '미읽',
      'read': '읽음',
      'important': '중요',
      'completed': '완료'
    };
    return statusLabels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const priorityLabels: Record<string, string> = {
      'low': '낮음',
      'medium': '보통',
      'high': '높음'
    };
    return priorityLabels[priority] || priority;
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
          <Button onClick={fetchNotificationStatistics} variant="primary">
            다시 시도
          </Button>
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  // 차트 데이터 준비
  const typeData = stats.typeStats.map(item => ({
    name: getTypeLabel(item.type),
    count: item.count,
    unread: item.unread,
    type: item.type
  }));

  const statusData = stats.statusStats.map(item => ({
    name: getStatusLabel(item.status),
    value: item.count,
    status: item.status
  }));

  const priorityData = stats.priorityStats.map(item => ({
    name: getPriorityLabel(item.priority),
    value: item.count,
    priority: item.priority
  }));

  const trendData = stats.dailyTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    count: item.count
  }));

  // KPI 계산
  const totalUnread = stats.typeStats.reduce((sum, item) => sum + item.unread, 0);
  const urgentCount = stats.typeStats.find(item => item.type === 'urgent')?.count || 0;
  const readRate = stats.totalNotifications > 0 
    ? ((stats.totalNotifications - totalUnread) / stats.totalNotifications * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 알림</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalNotifications)}</p>
            </div>
            <BellIcon className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">미읽 알림</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalUnread)}</p>
            </div>
            <EyeSlashIcon className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">긴급 알림</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(urgentCount)}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">읽음 비율</p>
              <p className="text-2xl font-bold text-gray-900">{readRate}%</p>
            </div>
            <EyeIcon className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 알림 유형별 분포 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">알림 유형별 분포</h3>
            <p className="text-sm text-gray-600">긴급, 마감, 누락, 중복, 신규 알림 현황</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="전체" />
              <Bar dataKey="unread" fill="#EF4444" name="미읽" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 상태별 분포 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">상태별 분포</h3>
            <p className="text-sm text-gray-600">미읽, 읽음, 중요, 완료 현황</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* 우선순위별 분포 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">우선순위별 분포</h3>
            <p className="text-sm text-gray-600">높음, 보통, 낮음 우선순위 현황</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 일별 발생 추이 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">일별 발생 추이</h3>
            <p className="text-sm text-gray-600">최근 30일간 알림 발생 현황</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 상세 통계 테이블 */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">알림 유형별 상세 통계</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  알림 유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전체 건수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  미읽 건수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  읽음 비율
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  비율
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {typeData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(item.count)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(item.unread)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.count > 0 ? ((item.count - item.unread) / item.count * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.totalNotifications > 0 ? (item.count / stats.totalNotifications * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 상태별 상세 통계 */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">상태별 상세 통계</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  건수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  비율
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statusData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(item.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.totalNotifications > 0 ? (item.value / stats.totalNotifications * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default NotificationStatistics;
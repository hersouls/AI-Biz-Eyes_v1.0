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
  ChartBarIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface BidStatisticsProps {
  period: string;
}

interface BidStats {
  totalBids: number;
  newBids: number;
  urgentBids: number;
  deadlineBids: number;
  byType: {
    construction: number;
    service: number;
    goods: number;
  };
  byStatus: {
    normal: number;
    urgent: number;
    correction: number;
  };
  byInstitution: Record<string, number>;
  budgetRange: {
    under100M: number;
    '100M-500M': number;
    '500M-1B': number;
    over1B: number;
  };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const BidStatistics: React.FC<BidStatisticsProps> = ({ period }) => {
  const [stats, setStats] = useState<BidStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBidStatistics();
  }, [period]);

  const fetchBidStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/statistics/bids?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('통계 데이터를 불러오는데 실패했습니다.');
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

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      notation: 'compact'
    }).format(num);
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
          <Button onClick={fetchBidStatistics} variant="primary">
            다시 시도
          </Button>
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  // 차트 데이터 준비
  const typeData = [
    { name: '공사', value: stats.byType.construction, color: '#3B82F6' },
    { name: '용역', value: stats.byType.service, color: '#10B981' },
    { name: '물품', value: stats.byType.goods, color: '#F59E0B' }
  ];

  const statusData = [
    { name: '일반', value: stats.byStatus.normal, color: '#10B981' },
    { name: '긴급', value: stats.byStatus.urgent, color: '#F59E0B' },
    { name: '정정', value: stats.byStatus.correction, color: '#EF4444' }
  ];

  const institutionData = Object.entries(stats.byInstitution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const budgetData = [
    { name: '1억 미만', value: stats.budgetRange.under100M },
    { name: '1억-5억', value: stats.budgetRange['100M-500M'] },
    { name: '5억-10억', value: stats.budgetRange['500M-1B'] },
    { name: '10억 이상', value: stats.budgetRange.over1B }
  ];

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 공고</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalBids)}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">신규 공고</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.newBids)}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">긴급 공고</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.urgentBids)}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">마감 임박</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.deadlineBids)}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 사업유형별 분포 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">사업유형별 분포</h3>
            <p className="text-sm text-gray-600">공사, 용역, 물품별 공고 현황</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* 상태별 분포 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">상태별 분포</h3>
            <p className="text-sm text-gray-600">일반, 긴급, 정정 공고 현황</p>
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* 기관별 공고 수 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">기관별 공고 수 (TOP 10)</h3>
            <p className="text-sm text-gray-600">발주기관별 공고 현황</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={institutionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 예산 범위별 분포 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">예산 범위별 분포</h3>
            <p className="text-sm text-gray-600">사업 규모별 공고 현황</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatNumber(value as number), '건수']} />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 상세 통계 테이블 */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">상세 통계</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  구분
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  전체 공고
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(stats.totalBids)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  100%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  공사
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(stats.byType.construction)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {((stats.byType.construction / stats.totalBids) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  용역
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(stats.byType.service)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {((stats.byType.service / stats.totalBids) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  물품
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(stats.byType.goods)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {((stats.byType.goods / stats.totalBids) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BidStatistics;
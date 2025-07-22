import React, { useState, useEffect, useCallback } from 'react';
import Card from '../Card';
import Button from '../Button';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  DocumentTextIcon, 
  XCircleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ReferenceStatisticsProps {
  period: string;
}

interface ReferenceStats {
  totalReferences: number;
  successRate: string;
  successStats: {
    success: number;
    failure: number;
    ongoing: number;
  };
  yearlyStats: Array<{
    participationYear: number;
    count: number;
    success: number;
    totalAmount: number;
  }>;
  typeStats: Array<{
    projectType: string;
    count: number;
    success: number;
    totalAmount: number;
  }>;
  organizationStats: Array<{
    organization: string;
    count: number;
    success: number;
    totalAmount: number;
  }>;
}

// const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

const ReferenceStatistics: React.FC<ReferenceStatisticsProps> = ({ period }) => {
  const [stats, setStats] = useState<ReferenceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferenceStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/statistics/references?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('레퍼런스 통계 데이터를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReferenceStatistics();
  }, [fetchReferenceStatistics]);

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
          <Button onClick={fetchReferenceStatistics} variant="primary">
            다시 시도
          </Button>
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  // 차트 데이터 준비
  const statusData = [
    { name: '성공', value: stats.successStats.success, color: '#10B981' },
    { name: '실패', value: stats.successStats.failure, color: '#EF4444' },
    { name: '진행중', value: stats.successStats.ongoing, color: '#F59E0B' }
  ];

  const yearlyData = stats.yearlyStats.map(item => ({
    year: item.participationYear.toString(),
    count: item.count,
    success: item.success,
    totalAmount: item.totalAmount / 100000000 // 억 단위로 변환
  }));

  const typeData = stats.typeStats.map(item => ({
    type: item.projectType || '기타',
    count: item.count,
    success: item.success,
    successRate: item.count > 0 ? (item.success / item.count * 100).toFixed(1) : 0,
    totalAmount: item.totalAmount / 100000000 // 억 단위로 변환
  }));

  const orgData = stats.organizationStats.map(item => ({
    organization: item.organization || '기타',
    count: item.count,
    success: item.success,
    successRate: item.count > 0 ? (item.success / item.count * 100).toFixed(1) : 0,
    totalAmount: item.totalAmount / 100000000 // 억 단위로 변환
  }));

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 레퍼런스</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalReferences)}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">성공률</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">성공 건수</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.successStats.success)}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">진행중</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.successStats.ongoing)}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 성과 상태별 분포 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">성과 상태별 분포</h3>
            <p className="text-sm text-gray-600">성공, 실패, 진행중 현황</p>
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

        {/* 연도별 참여 현황 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">연도별 참여 현황</h3>
            <p className="text-sm text-gray-600">연도별 참여 건수 및 성공률</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'totalAmount' ? formatCurrency(value as number * 100000000) : formatNumber(value as number),
                  name === 'totalAmount' ? '계약금액' : name === 'count' ? '참여건수' : '성공건수'
                ]}
              />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="참여건수" />
              <Bar dataKey="success" fill="#10B981" name="성공건수" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 사업유형별 성과 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">사업유형별 성과</h3>
            <p className="text-sm text-gray-600">사업유형별 참여 및 성공률</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="type" width={100} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'successRate' ? `${value}%` : formatNumber(value as number),
                  name === 'successRate' ? '성공률' : name === 'count' ? '참여건수' : '계약금액(억)'
                ]}
              />
              <Bar dataKey="count" fill="#3B82F6" name="참여건수" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 기관별 성과 */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">기관별 성과 (TOP 10)</h3>
            <p className="text-sm text-gray-600">발주기관별 참여 및 성공률</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orgData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="organization" width={120} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'successRate' ? `${value}%` : formatNumber(value as number),
                  name === 'successRate' ? '성공률' : name === 'count' ? '참여건수' : '계약금액(억)'
                ]}
              />
              <Bar dataKey="count" fill="#10B981" name="참여건수" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 상세 통계 테이블 */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">연도별 상세 통계</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연도
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  참여건수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  성공건수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  성공률
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약금액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.yearlyStats.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.participationYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(item.count)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(item.success)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.count > 0 ? ((item.success / item.count) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 사업유형별 상세 통계 */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">사업유형별 상세 통계</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사업유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  참여건수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  성공건수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  성공률
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약금액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.typeStats.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.projectType || '기타'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(item.count)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(item.success)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.count > 0 ? ((item.success / item.count) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.totalAmount)}
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

export default ReferenceStatistics;
import React from 'react';
import { ReferenceStats as ReferenceStatsType } from '../../types/reference';
import { formatAmount } from '../../utils/formatters';
import Card from '../Card';

interface ReferenceStatsProps {
  stats: ReferenceStatsType;
}

const ReferenceStats: React.FC<ReferenceStatsProps> = ({ stats }) => {
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalCount}</div>
            <div className="text-sm text-gray-600">전체 레퍼런스</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.successCount}</div>
            <div className="text-sm text-gray-600">성공 사례</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.successCount && stats.totalCount ? formatPercentage(stats.successCount / stats.totalCount) : '0%'}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.ongoingCount}</div>
            <div className="text-sm text-gray-600">진행중</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.ongoingCount && stats.totalCount ? formatPercentage(stats.ongoingCount / stats.totalCount) : '0%'}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {formatAmount(stats.totalAmount)}
            </div>
            <div className="text-sm text-gray-600">총 계약금액</div>
          </div>
        </Card>
      </div>

      {/* 연도별 통계 */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">연도별 통계</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연도
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  건수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  비중
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.yearlyStats?.map((yearStat) => (
                <tr key={yearStat.year}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {yearStat.year}년
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {yearStat.count}건
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAmount(yearStat.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.totalCount ? formatPercentage(yearStat.count / stats.totalCount) : '0%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 사업유형별 통계 */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">사업유형별 통계</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사업유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  건수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  성공률
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  비중
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.typeStats?.map((typeStat) => (
                <tr key={typeStat.type}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {typeStat.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeStat.count}건
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPercentage(typeStat.successRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.totalCount ? formatPercentage(typeStat.count / stats.totalCount) : '0%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 성과 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">성과 요약</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">평균 평가등급</span>
              <span className="text-lg font-semibold text-gray-900">{stats.averageScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">성공률</span>
              <span className="text-lg font-semibold text-green-600">
                {stats.successCount && stats.totalCount ? formatPercentage(stats.successCount / stats.totalCount) : '0%'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">평균 계약금액</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats.totalAmount && stats.totalCount ? formatAmount(stats.totalAmount / stats.totalCount) : '금액 미정'}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">상태별 분포</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">성공</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.successCount || 0}건 ({stats.successCount && stats.totalCount ? formatPercentage(stats.successCount / stats.totalCount) : '0%'})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${stats.successCount && stats.totalCount ? (stats.successCount / stats.totalCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">진행중</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.ongoingCount || 0}건 ({stats.ongoingCount && stats.totalCount ? formatPercentage(stats.ongoingCount / stats.totalCount) : '0%'})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${stats.ongoingCount && stats.totalCount ? (stats.ongoingCount / stats.totalCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">실패</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.failureCount || 0}건 ({stats.failureCount && stats.totalCount ? formatPercentage(stats.failureCount / stats.totalCount) : '0%'})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${stats.failureCount && stats.totalCount ? (stats.failureCount / stats.totalCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReferenceStats;
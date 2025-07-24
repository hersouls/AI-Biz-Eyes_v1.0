import React, { useState, useEffect } from 'react';
import { PublicDataService } from '../services/publicDataService';
import { PublicDataStats as PublicDataStatsType } from '../types/publicData';

interface PublicDataStatsProps {
  title?: string;
  showDetails?: boolean;
}

const PublicDataStats: React.FC<PublicDataStatsProps> = ({ 
  title = "공공데이터 통계", 
  showDetails = true 
}) => {
  const [stats, setStats] = useState<PublicDataStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PublicDataService.getPublicDataStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('통계 데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Error loading public data stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">통계를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">오류 발생</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={loadStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <p>통계 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>

      {/* Main Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(stats.totalDatasets)}
            </div>
            <div className="text-sm text-gray-600 mt-1">전체 데이터셋</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(stats.totalDownloads)}
            </div>
            <div className="text-sm text-gray-600 mt-1">총 다운로드</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(stats.totalViews)}
            </div>
            <div className="text-sm text-gray-600 mt-1">총 조회수</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.activeOrganizations}
            </div>
            <div className="text-sm text-gray-600 mt-1">활성 기관</div>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800">월간 성장률</h3>
              <p className="text-sm text-gray-600">전월 대비 데이터셋 증가율</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.monthlyGrowth >= 0 ? '+' : ''}{formatPercentage(stats.monthlyGrowth)}
              </div>
              <div className="text-sm text-gray-500">
                {stats.monthlyGrowth >= 0 ? '증가' : '감소'}
              </div>
            </div>
          </div>
        </div>

        {showDetails && (
          <>
            {/* Popular Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">인기 카테고리</h3>
              <div className="space-y-3">
                {stats.popularCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="ml-3 font-medium text-gray-800">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">{category.count}건</div>
                      <div className="text-sm text-gray-500">{formatPercentage(category.percentage)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Organizations */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">주요 제공 기관</h3>
              <div className="space-y-3">
                {stats.topOrganizations.map((org, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="ml-3 font-medium text-gray-800">{org.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">{org.count}건</div>
                      <div className="text-sm text-gray-500">데이터셋</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>실시간 업데이트되는 통계입니다.</span>
          <button
            onClick={loadStats}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            새로고침
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicDataStats;
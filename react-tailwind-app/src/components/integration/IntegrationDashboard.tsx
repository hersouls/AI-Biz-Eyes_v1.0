import React, { useState, useEffect } from 'react';
import { IntegrationStats, IntegrationSystem, IntegrationLog } from '../../types/integration';
import { integrationService } from '../../services/integrationService';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface IntegrationDashboardProps {
  className?: string;
}

const IntegrationDashboard: React.FC<IntegrationDashboardProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<IntegrationStats | null>(null);
  const [systems, setSystems] = useState<IntegrationSystem[]>([]);
  const [recentLogs, setRecentLogs] = useState<IntegrationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, systemsData, logsData] = await Promise.all([
        integrationService.getStats(),
        integrationService.getSystems(),
        integrationService.getLogs({ limit: 10, page: 1 })
      ]);
      
      setStats(statsData);
      setSystems(systemsData);
      setRecentLogs(logsData.logs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="w-5 h-5" />;
      case 'inactive': return <ClockIcon className="w-5 h-5" />;
      case 'error': return <XCircleIcon className="w-5 h-5" />;
      default: return <ClockIcon className="w-5 h-5" />;
    }
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    return `${duration}ms`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ko-KR');
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-200 h-96 rounded-lg"></div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">오류가 발생했습니다</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 시스템</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalSystems || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">활성 시스템</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeSystems || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">오류 시스템</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.errorSystems || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ArrowPathIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">성공률</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.successRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 연동 시스템 현황 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">연동 시스템 현황</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systems.map((system) => (
                <div key={system.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(system.status)}`}>
                      {getStatusIcon(system.status)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{system.name}</h4>
                      <p className="text-sm text-gray-500">{system.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">동기화 주기</p>
                    <p className="font-medium text-gray-900">{system.syncInterval}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 최근 연동 로그 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">최근 연동 로그</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLogTypeColor(log.type)}`}>
                          {log.type === 'success' ? '성공' : log.type === 'error' ? '오류' : '경고'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-1">{log.message}</p>
                      {log.errorCode && (
                        <p className="text-xs text-red-600">오류 코드: {log.errorCode}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>소요시간: {formatDuration(log.duration)}</p>
                      {log.dataCount && <p>데이터: {log.dataCount}건</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationDashboard;
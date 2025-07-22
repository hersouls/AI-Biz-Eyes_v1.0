import React, { useState, useEffect, useCallback } from 'react';
import { IntegrationLog, IntegrationSystem } from '../../types/integration';
import { integrationService } from '../../services/integrationService';
import { 
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface IntegrationLogsProps {
  className?: string;
}

const IntegrationLogs: React.FC<IntegrationLogsProps> = ({ className = '' }) => {
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [systems, setSystems] = useState<IntegrationSystem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    systemId: '',
    type: '',
    page: 1,
    limit: 20
  });
  
  // 페이지네이션 상태
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page: filters.page,
        limit: filters.limit
      };
      
      if (filters.systemId) params.systemId = filters.systemId;
      if (filters.type) params.type = filters.type;
      
      const response = await integrationService.getLogs(params);
      setLogs(response.logs);
      setPagination(response.pagination);
    } catch (err) {
      console.error('로그 조회에 실패했습니다:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.systemId, filters.type]);

  const fetchSystems = async () => {
    try {
      const data = await integrationService.getSystems();
      setSystems(data);
    } catch (err) {
      console.error('시스템 목록 로드 실패:', err);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // 필터 변경 시 첫 페이지로
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogTypeLabel = (type: string) => {
    switch (type) {
      case 'success': return '성공';
      case 'error': return '오류';
      case 'warning': return '경고';
      default: return type;
    }
  };

  const getSystemName = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    return system?.name || systemId;
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    return `${duration}ms`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ko-KR');
  };

  if (loading && logs.length === 0) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 h-12 rounded-lg mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">연동 로그</h2>
        <button
          onClick={() => fetchLogs()}
          className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          새로고침
        </button>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">필터:</span>
          </div>
          
          {/* 시스템 필터 */}
          <div>
            <select
              value={filters.systemId}
              onChange={(e) => handleFilterChange('systemId', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 시스템</option>
              {systems.map(system => (
                <option key={system.id} value={system.id}>
                  {system.name}
                </option>
              ))}
            </select>
          </div>

          {/* 로그 타입 필터 */}
          <div>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 타입</option>
              <option value="success">성공</option>
              <option value="error">오류</option>
              <option value="warning">경고</option>
            </select>
          </div>

          {/* 페이지 크기 */}
          <div>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10개씩</option>
              <option value="20">20개씩</option>
              <option value="50">50개씩</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 로그 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시스템
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  타입
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  메시지
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  소요시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  데이터
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getSystemName(log.systemId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLogTypeColor(log.type)}`}>
                      {getLogTypeLabel(log.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {log.message}
                      {log.errorCode && (
                        <div className="text-xs text-red-600 mt-1">
                          오류 코드: {log.errorCode}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(log.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.dataCount ? `${log.dataCount}건` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">조회된 로그가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            총 {pagination.total}개 중 {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)}개
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              const isCurrent = page === pagination.page;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm border rounded-lg ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationLogs;
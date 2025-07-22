import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowPathIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { FetchLog } from '../../types/admin';
import AdminLayout from './AdminLayout';
import Badge from '../Badge';

const FetchLogs: React.FC = () => {
  const [logs, setLogs] = useState<FetchLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });
  const [selectedLog, setSelectedLog] = useState<FetchLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [retrying, setRetrying] = useState<number | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await adminService.getFetchLogs(params);
      if (response.data) {
        setLogs(response.data.logs);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleRetry = async (logId: number) => {
    try {
      setRetrying(logId);
      await adminService.retryFailedFetch(logId);
      loadLogs(); // 목록 새로고침
    } catch (err) {
      setError('재시도에 실패했습니다.');
      console.error('Failed to retry fetch:', err);
    } finally {
      setRetrying(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { color: 'green', text: '성공', icon: CheckCircleIcon },
      failed: { color: 'red', text: '실패', icon: XCircleIcon },
      pending: { color: 'yellow', text: '대기중', icon: ClockIcon }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.color as any} className="flex items-center">
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getResultCodeText = (resultCode: string) => {
    const codeMap: Record<string, string> = {
      '00': '정상',
      '01': '인증키 오류',
      '02': '요청 제한 초과',
      '03': '데이터 없음',
      '04': '잘못된 요청',
      '05': '서버 오류',
      '06': '네트워크 오류',
      '07': '타임아웃',
      '08': '잘못된 응답',
      '09': '알 수 없는 오류',
      '10': 'API 버전 오류',
      '11': '필수 파라미터 누락',
      '12': '잘못된 파라미터',
      '13': '권한 없음',
      '14': '서비스 일시 중단',
      '15': '점검 중',
      '16': '데이터 형식 오류',
      '17': '인코딩 오류',
      '18': '압축 해제 오류',
      '19': 'XML 파싱 오류',
      '20': 'JSON 파싱 오류',
      '21': '데이터베이스 오류',
      '22': '파일 시스템 오류',
      '23': '메모리 부족',
      '24': 'CPU 사용률 초과',
      '25': '디스크 공간 부족',
      '26': '네트워크 대역폭 초과',
      '27': '동시 요청 초과',
      '28': '세션 만료',
      '29': '토큰 만료',
      '30': 'IP 제한',
      '31': '사용자 제한',
      '32': '기타 오류'
    };
    return codeMap[resultCode] || `코드 ${resultCode}`;
  };

  const openDetailModal = (log: FetchLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  if (loading && logs.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">공고 수집 이력</h1>
            <p className="text-gray-600">나라장터 API 연동 및 데이터 수집 이력을 확인합니다</p>
          </div>
          <button
            onClick={loadLogs}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            새로고침
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="success">성공</option>
                <option value="failed">실패</option>
                <option value="pending">대기중</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">성공</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.status === 'success').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <XCircleIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">실패</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.status === 'failed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">대기중</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <ArrowPathIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 응답시간</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.length > 0 
                    ? Math.round(logs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / logs.length)
                    : 0
                  }ms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    요청 시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    공고번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결과코드
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    응답시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    데이터 수
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.requestedAt).toLocaleString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.bidNtceNo || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{log.resultCode}</div>
                        <div className="text-gray-500 text-xs">
                          {getResultCodeText(log.resultCode)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.responseTime ? `${log.responseTime}ms` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.dataCount || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openDetailModal(log)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {log.status === 'failed' && (
                          <button
                            onClick={() => handleRetry(log.id)}
                            disabled={retrying === log.id}
                            className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                          >
                            {retrying === log.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <ArrowPathIcon className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  총 <span className="font-medium">{pagination.total}</span>개의 수집 이력
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    이전
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    다음
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Log Detail Modal */}
        {showDetailModal && selectedLog && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">수집 이력 상세 정보</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">로그 ID</label>
                      <p className="text-sm text-gray-900">{selectedLog.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">요청 시간</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedLog.requestedAt).toLocaleString('ko-KR')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">공고번호</label>
                      <p className="text-sm text-gray-900">{selectedLog.bidNtceNo || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                      <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">결과코드</label>
                      <p className="text-sm text-gray-900">
                        {selectedLog.resultCode} - {getResultCodeText(selectedLog.resultCode)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">응답시간</label>
                      <p className="text-sm text-gray-900">
                        {selectedLog.responseTime ? `${selectedLog.responseTime}ms` : '-'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">데이터 수</label>
                      <p className="text-sm text-gray-900">{selectedLog.dataCount || '-'}</p>
                    </div>
                  </div>
                  
                  {selectedLog.errorMessage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">오류 메시지</label>
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-sm text-red-900 whitespace-pre-wrap">{selectedLog.errorMessage}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedLog.status === 'failed' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          handleRetry(selectedLog.id);
                          setShowDetailModal(false);
                        }}
                        disabled={retrying === selectedLog.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                      >
                        {retrying === selectedLog.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            재시도 중...
                          </>
                        ) : (
                          <>
                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                            재시도
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FetchLogs;
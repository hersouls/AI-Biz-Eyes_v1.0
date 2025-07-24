import React, { useState, useEffect } from 'react';
import MockApiServer from '../../services/mockApiServer';

const MockApiStatus: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [apiStats, setApiStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const health = await MockApiServer.healthCheck();
      setHealthStatus(health);
    } catch (err) {
      setError('Health check failed');
      console.error('Health check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getApiStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const stats = await MockApiServer.getApiStats();
      setApiStats(stats);
    } catch (err) {
      setError('API stats failed');
      console.error('API stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    getApiStats();
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Mock API 서버 상태
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">서버 상태</h4>
          
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">확인 중...</span>
            </div>
          ) : healthStatus ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">상태:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  healthStatus.status === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {healthStatus.status === 'healthy' ? '정상' : '오류'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">버전:</span>
                <span className="text-sm font-medium">{healthStatus.version}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">가동시간:</span>
                <span className="text-sm font-medium">{formatUptime(healthStatus.uptime)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">마지막 확인:</span>
                <span className="text-sm font-medium">
                  {new Date(healthStatus.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-600">상태 정보를 불러올 수 없습니다.</div>
          )}
          
          <button
            onClick={checkHealth}
            className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            새로고침
          </button>
        </div>

        {/* API Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">API 통계</h4>
          
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">확인 중...</span>
            </div>
          ) : apiStats ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">총 요청:</span>
                <span className="text-sm font-medium">{apiStats.totalRequests?.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">성공 요청:</span>
                <span className="text-sm font-medium text-green-600">
                  {apiStats.successfulRequests?.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">실패 요청:</span>
                <span className="text-sm font-medium text-red-600">
                  {apiStats.failedRequests?.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">평균 응답시간:</span>
                <span className="text-sm font-medium">{apiStats.averageResponseTime}ms</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">활성 연결:</span>
                <span className="text-sm font-medium">{apiStats.activeConnections}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-600">통계 정보를 불러올 수 없습니다.</div>
          )}
          
          <button
            onClick={getApiStats}
            className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            새로고침
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="text-sm font-medium text-blue-800 mb-2">Mock API 서버 정보</h5>
        <div className="text-xs text-blue-700 space-y-1">
          <p>• 실제 API와 동일한 응답 구조 제공</p>
          <p>• 에러 시뮬레이션 및 지연 시간 적용</p>
          <p>• 개발 환경에서 안정적인 테스트 가능</p>
          <p>• 실제 API 승인 후 쉽게 전환 가능</p>
        </div>
      </div>
    </div>
  );
};

export default MockApiStatus;
import React from 'react';
import { useG2BApiStatus } from '../hooks/useG2BApi';

const G2BApiStatus: React.FC = () => {
  const { status, loading, error, refetch } = useG2BApiStatus();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">조달청 API 상태 확인 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-600 font-medium">조달청 API 연결 실패</span>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            재시도
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${status.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h3 className="text-lg font-semibold text-gray-900">
            조달청 나라장터 API 상태
          </h3>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          새로고침
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">연결 상태:</span>
            <span className={`text-sm font-medium ${status.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {status.isAvailable ? '정상' : '오류'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">타임아웃:</span>
            <span className="text-sm text-gray-900">{status.config.TIMEOUT}ms</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">API 키:</span>
            <span className="text-sm text-gray-900">{status.config.SERVICE_KEY}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">마지막 확인:</span>
            <span className="text-sm text-gray-900">
              {new Date(status.timestamp).toLocaleString('ko-KR')}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">API 엔드포인트</h4>
        <div className="space-y-1">
          <div className="text-xs text-gray-600">
            <span className="font-medium">입찰정보:</span> {status.config.BID_INFO_URL}
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">계약정보:</span> {status.config.CONTRACT_INFO_URL}
          </div>
        </div>
      </div>
    </div>
  );
};

export default G2BApiStatus;
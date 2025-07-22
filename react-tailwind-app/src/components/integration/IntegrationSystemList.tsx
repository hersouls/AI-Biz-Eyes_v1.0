import React, { useState, useEffect } from 'react';
import { IntegrationSystem } from '../../types/integration';
import { integrationService } from '../../services/integrationService';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import IntegrationSystemForm from './IntegrationSystemForm';

interface IntegrationSystemListProps {
  className?: string;
}

const IntegrationSystemList: React.FC<IntegrationSystemListProps> = ({ className = '' }) => {
  const [systems, setSystems] = useState<IntegrationSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSystem, setEditingSystem] = useState<IntegrationSystem | null>(null);
  const [testingSystem, setTestingSystem] = useState<string | null>(null);

  const fetchSystems = async () => {
    try {
      setLoading(true);
      const data = await integrationService.getSystems();
      setSystems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '시스템 목록 로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  const handleCreate = () => {
    setEditingSystem(null);
    setShowForm(true);
  };

  const handleEdit = (system: IntegrationSystem) => {
    setEditingSystem(system);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말로 이 연동 시스템을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await integrationService.deleteSystem(id);
      await fetchSystems();
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  const handleTest = async (id: string) => {
    try {
      setTestingSystem(id);
      const result = await integrationService.testSystem(id);
      alert(`${result.message}\n소요시간: ${result.duration}ms\n데이터: ${result.dataCount}건`);
      await fetchSystems(); // 로그 업데이트를 위해 다시 로드
    } catch (err) {
      alert(err instanceof Error ? err.message : '테스트에 실패했습니다.');
    } finally {
      setTestingSystem(null);
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    await fetchSystems();
  };

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
      case 'active': return <CheckCircleIcon className="w-4 h-4" />;
      case 'inactive': return <ClockIcon className="w-4 h-4" />;
      case 'error': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'OpenAPI': return 'OpenAPI';
      case 'Excel': return 'Excel';
      case 'ERP': return 'ERP';
      case 'Groupware': return '그룹웨어';
      case 'Messenger': return '메신저';
      case 'GoogleSheets': return 'Google Sheets';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 h-12 rounded-lg mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
        <h2 className="text-2xl font-bold text-gray-900">연동 시스템 관리</h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          새 연동 시스템
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 시스템 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시스템명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  동기화 주기
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  최근 동기화
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {systems.map((system) => (
                <tr key={system.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{system.name}</div>
                      {system.url && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{system.url}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getTypeLabel(system.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                      {getStatusIcon(system.status)}
                      <span className="ml-1">
                        {system.status === 'active' ? '활성' : system.status === 'inactive' ? '비활성' : '오류'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {system.syncInterval}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {system.lastSyncAt ? new Date(system.lastSyncAt).toLocaleString('ko-KR') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleTest(system.id)}
                        disabled={testingSystem === system.id}
                        className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                      >
                        <PlayIcon className="w-3 h-3 mr-1" />
                        {testingSystem === system.id ? '테스트중...' : '테스트'}
                      </button>
                      <button
                        onClick={() => handleEdit(system)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <PencilIcon className="w-3 h-3 mr-1" />
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(system.id)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <TrashIcon className="w-3 h-3 mr-1" />
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {systems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">등록된 연동 시스템이 없습니다.</p>
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              첫 번째 연동 시스템 추가
            </button>
          </div>
        )}
      </div>

      {/* 연동 시스템 폼 모달 */}
      {showForm && (
        <IntegrationSystemForm
          system={editingSystem}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default IntegrationSystemList;
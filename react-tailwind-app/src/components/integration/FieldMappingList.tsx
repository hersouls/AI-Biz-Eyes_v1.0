import React, { useState, useEffect } from 'react';
import { FieldMapping, IntegrationSystem } from '../../types/integration';
import { integrationService } from '../../services/integrationService';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface FieldMappingListProps {
  className?: string;
}

const FieldMappingList: React.FC<FieldMappingListProps> = ({ className = '' }) => {
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [systems, setSystems] = useState<IntegrationSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingMapping, setEditingMapping] = useState<FieldMapping | null>(null);

  const fetchMappings = async (systemId?: string) => {
    try {
      setLoading(true);
      const data = await integrationService.getFieldMappings(systemId);
      setMappings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '필드 매핑 로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
    fetchMappings(selectedSystem || undefined);
  }, [selectedSystem]);

  const handleCreate = () => {
    setEditingMapping(null);
    setShowForm(true);
  };

  const handleEdit = (mapping: FieldMapping) => {
    setEditingMapping(mapping);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말로 이 필드 매핑을 삭제하시겠습니까?')) {
      return;
    }

    try {
      // 실제로는 삭제 API 호출
      setMappings(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    await fetchMappings(selectedSystem || undefined);
  };

  const getSystemName = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    return system?.name || systemId;
  };

  if (loading && mappings.length === 0) {
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
        <h2 className="text-2xl font-bold text-gray-900">필드 매핑 관리</h2>
        <button
          onClick={handleCreate}
          disabled={!selectedSystem}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          새 매핑 추가
        </button>
      </div>

      {/* 시스템 선택 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label htmlFor="system-select" className="block text-sm font-medium text-gray-700 mb-2">
          연동 시스템 선택
        </label>
        <select
          id="system-select"
          value={selectedSystem}
          onChange={(e) => setSelectedSystem(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">시스템을 선택하세요</option>
          {systems.map(system => (
            <option key={system.id} value={system.id}>
              {system.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!selectedSystem ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">시스템을 선택하세요</h3>
          <p className="text-gray-500">필드 매핑을 관리할 연동 시스템을 선택해주세요.</p>
        </div>
      ) : (
        <>
          {/* 매핑 목록 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      내부 필드
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      외부 필드
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      설명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      필수 여부
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mappings.map((mapping) => (
                    <tr key={mapping.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {mapping.internalField}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {mapping.externalField}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {mapping.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mapping.isRequired 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {mapping.isRequired ? '필수' : '선택'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(mapping)}
                            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            <PencilIcon className="w-3 h-3 mr-1" />
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(mapping.id)}
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

            {mappings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">등록된 필드 매핑이 없습니다.</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  첫 번째 매핑 추가
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* 필드 매핑 폼 모달 */}
      {showForm && (
        <FieldMappingForm
          mapping={editingMapping}
          systemId={selectedSystem}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

// 필드 매핑 폼 컴포넌트 (간단한 버전)
interface FieldMappingFormProps {
  mapping?: FieldMapping | null;
  systemId: string;
  onClose: () => void;
  onSubmit: () => void;
}

const FieldMappingForm: React.FC<FieldMappingFormProps> = ({ 
  mapping, 
  systemId, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    internalField: '',
    externalField: '',
    description: '',
    isRequired: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!mapping;

  React.useEffect(() => {
    if (mapping) {
      setFormData({
        internalField: mapping.internalField,
        externalField: mapping.externalField,
        description: mapping.description || '',
        isRequired: mapping.isRequired
      });
    }
  }, [mapping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.internalField.trim() || !formData.externalField.trim()) {
      setError('내부 필드와 외부 필드를 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = {
        systemId,
        sourceField: formData.internalField,
        targetField: formData.externalField,
        description: formData.description,
        isRequired: formData.isRequired
      };

      await integrationService.createFieldMapping(data);
      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? '필드 매핑 수정' : '새 필드 매핑'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="internalField" className="block text-sm font-medium text-gray-700 mb-1">
              내부 필드명 *
            </label>
            <input
              type="text"
              id="internalField"
              value={formData.internalField}
              onChange={(e) => setFormData(prev => ({ ...prev, internalField: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: bidNtceNo"
              required
            />
          </div>

          <div>
            <label htmlFor="externalField" className="block text-sm font-medium text-gray-700 mb-1">
              외부 필드명 *
            </label>
            <input
              type="text"
              id="externalField"
              value={formData.externalField}
              onChange={(e) => setFormData(prev => ({ ...prev, externalField: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: bidNtceNo"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="필드에 대한 설명"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRequired"
              checked={formData.isRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-900">
              필수 필드
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '저장중...' : (isEditing ? '수정' : '생성')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldMappingList;
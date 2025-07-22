import React, { useState, useEffect } from 'react';
import { IntegrationSystem, CreateIntegrationRequest, UpdateIntegrationRequest } from '../../types/integration';
import { integrationService } from '../../services/integrationService';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface IntegrationSystemFormProps {
  system?: IntegrationSystem | null;
  onClose: () => void;
  onSubmit: () => void;
}

const IntegrationSystemForm: React.FC<IntegrationSystemFormProps> = ({ 
  system, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<CreateIntegrationRequest>({
    name: '',
    type: 'OpenAPI',
    apiKey: '',
    url: '',
    syncInterval: '5분'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!system;

  useEffect(() => {
    if (system) {
      setFormData({
        name: system.name,
        type: system.type,
        apiKey: system.apiKey || '',
        url: system.url || '',
        syncInterval: system.syncInterval
      });
    }
  }, [system]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('시스템명을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing && system) {
        const updateData: UpdateIntegrationRequest = {
          name: formData.name,
          apiKey: formData.apiKey || undefined,
          url: formData.url || undefined,
          syncInterval: formData.syncInterval
        };
        await integrationService.updateSystem(system.id, updateData);
      } else {
        await integrationService.createSystem(formData);
      }

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeOptions = () => [
    { value: 'OpenAPI', label: 'OpenAPI' },
    { value: 'Excel', label: 'Excel' },
    { value: 'ERP', label: 'ERP' },
    { value: 'Groupware', label: '그룹웨어' },
    { value: 'Messenger', label: '메신저' },
    { value: 'GoogleSheets', label: 'Google Sheets' }
  ];

  const getSyncIntervalOptions = () => [
    { value: '5분', label: '5분' },
    { value: '10분', label: '10분' },
    { value: '30분', label: '30분' },
    { value: '1시간', label: '1시간' },
    { value: '6시간', label: '6시간' },
    { value: '12시간', label: '12시간' },
    { value: '1일', label: '1일' },
    { value: '수동', label: '수동' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? '연동 시스템 수정' : '새 연동 시스템'}
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

          {/* 시스템명 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              시스템명 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="예: 나라장터 OpenAPI"
              required
            />
          </div>

          {/* 시스템 유형 */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              시스템 유형 *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {getTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* API URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              API URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://api.example.com"
            />
          </div>

          {/* API 키 */}
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API 키
            </label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="API 키를 입력하세요"
            />
          </div>

          {/* 동기화 주기 */}
          <div>
            <label htmlFor="syncInterval" className="block text-sm font-medium text-gray-700 mb-1">
              동기화 주기 *
            </label>
            <select
              id="syncInterval"
              name="syncInterval"
              value={formData.syncInterval}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {getSyncIntervalOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 버튼 */}
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

export default IntegrationSystemForm;
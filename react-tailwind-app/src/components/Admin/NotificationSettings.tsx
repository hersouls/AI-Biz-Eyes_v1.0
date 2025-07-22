import React, { useState, useEffect } from 'react';
import { 
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { NotificationConfig } from '../../types/admin';
import AdminLayout from './AdminLayout';
import Badge from '../Badge';

const NotificationSettings: React.FC = () => {
  const [configs, setConfigs] = useState<NotificationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<NotificationConfig | null>(null);
  const [formData, setFormData] = useState({
    type: 'new_bid' as 'new_bid' | 'urgent' | 'deadline' | 'achievement',
    channel: 'web' as 'web' | 'email' | 'push',
    frequency: 'immediate' as 'immediate' | 'daily' | 'weekly',
    recipients: [''],
    isActive: true
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getNotificationConfigs();
      setConfigs(response.data || []);
      setError(null);
    } catch (err) {
      setError('알림 설정을 불러오는데 실패했습니다.');
      console.error('Failed to load notification configs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const configData = {
        ...formData,
        recipients: formData.recipients.filter(r => r.trim() !== '')
      };
      await adminService.updateNotificationConfig(0, configData); // 0은 새로 생성
      setShowCreateModal(false);
      setFormData({
        type: 'new_bid',
        channel: 'web',
        frequency: 'immediate',
        recipients: [''],
        isActive: true
      });
      loadConfigs();
    } catch (err) {
      setError('알림 설정 생성에 실패했습니다.');
      console.error('Failed to create notification config:', err);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConfig) return;
    
    try {
      const configData = {
        ...formData,
        recipients: formData.recipients.filter(r => r.trim() !== '')
      };
      await adminService.updateNotificationConfig(selectedConfig.id, configData);
      setShowEditModal(false);
      setSelectedConfig(null);
      loadConfigs();
    } catch (err) {
      setError('알림 설정 수정에 실패했습니다.');
      console.error('Failed to update notification config:', err);
    }
  };

  const handleToggleActive = async (config: NotificationConfig) => {
    try {
      await adminService.updateNotificationConfig(config.id, {
        isActive: !config.isActive
      });
      loadConfigs();
    } catch (err) {
      setError('알림 설정 상태 변경에 실패했습니다.');
      console.error('Failed to toggle notification config:', err);
    }
  };

  const openEditModal = (config: NotificationConfig) => {
    setSelectedConfig(config);
    setFormData({
      type: config.type,
      channel: config.channel,
      frequency: config.frequency,
      recipients: config.recipients.length > 0 ? config.recipients : [''],
      isActive: config.isActive
    });
    setShowEditModal(true);
  };

  const addRecipient = () => {
    setFormData({
      ...formData,
      recipients: [...formData.recipients, '']
    });
  };

  const removeRecipient = (index: number) => {
    const newRecipients = formData.recipients.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      recipients: newRecipients.length > 0 ? newRecipients : ['']
    });
  };

  const updateRecipient = (index: number, value: string) => {
    const newRecipients = [...formData.recipients];
    newRecipients[index] = value;
    setFormData({
      ...formData,
      recipients: newRecipients
    });
  };

  const getTypeText = (type: string) => {
    const typeMap = {
      new_bid: '신규 공고',
      urgent: '긴급 공고',
      deadline: '마감 임박',
      achievement: '성과 달성'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getChannelIcon = (channel: string) => {
    const iconMap = {
      web: GlobeAltIcon,
      email: EnvelopeIcon,
      push: DevicePhoneMobileIcon
    };
    const Icon = iconMap[channel as keyof typeof iconMap] || GlobeAltIcon;
    return <Icon className="h-4 w-4" />;
  };

  const getFrequencyText = (frequency: string) => {
    const frequencyMap = {
      immediate: '즉시',
      daily: '일간',
      weekly: '주간'
    };
    return frequencyMap[frequency as keyof typeof frequencyMap] || frequency;
  };

  if (loading) {
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
            <h1 className="text-2xl font-bold text-gray-900">알림 설정</h1>
            <p className="text-gray-600">시스템 알림 유형 및 수신자 설정을 관리합니다</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            새 알림 설정
          </button>
        </div>

        {/* Configs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configs.map((config) => (
            <div key={config.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <BellIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {getTypeText(config.type)}
                    </h3>
                    <p className="text-xs text-gray-500">알림 설정</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(config)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      config.isActive ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        config.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => openEditModal(config)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">채널</span>
                  <div className="flex items-center space-x-1">
                    {getChannelIcon(config.channel)}
                    <span className="text-xs text-gray-900 capitalize">{config.channel}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">주기</span>
                  <Badge variant="info" className="text-xs">
                    {getFrequencyText(config.frequency)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">수신자</span>
                  <span className="text-xs text-gray-900">
                    {config.recipients.length}명
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">수신자 목록:</div>
                  <div className="space-y-1">
                    {config.recipients.slice(0, 3).map((recipient, index) => (
                      <div key={index} className="text-xs text-gray-700 truncate">
                        {recipient}
                      </div>
                    ))}
                    {config.recipients.length > 3 && (
                      <div className="text-xs text-gray-500">
                        외 {config.recipients.length - 3}명
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">새 알림 설정</h3>
                <form onSubmit={handleCreateConfig} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">알림 유형</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new_bid">신규 공고</option>
                      <option value="urgent">긴급 공고</option>
                      <option value="deadline">마감 임박</option>
                      <option value="achievement">성과 달성</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">알림 채널</label>
                    <select
                      value={formData.channel}
                      onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="web">웹</option>
                      <option value="email">이메일</option>
                      <option value="push">푸시</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">알림 주기</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="immediate">즉시</option>
                      <option value="daily">일간</option>
                      <option value="weekly">주간</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">수신자</label>
                    <div className="space-y-2">
                      {formData.recipients.map((recipient, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="email"
                            value={recipient}
                            onChange={(e) => updateRecipient(index, e.target.value)}
                            placeholder="이메일 주소"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {formData.recipients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRecipient(index)}
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addRecipient}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        수신자 추가
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      활성화
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      생성
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedConfig && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">알림 설정 수정</h3>
                <form onSubmit={handleUpdateConfig} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">알림 유형</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new_bid">신규 공고</option>
                      <option value="urgent">긴급 공고</option>
                      <option value="deadline">마감 임박</option>
                      <option value="achievement">성과 달성</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">알림 채널</label>
                    <select
                      value={formData.channel}
                      onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="web">웹</option>
                      <option value="email">이메일</option>
                      <option value="push">푸시</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">알림 주기</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="immediate">즉시</option>
                      <option value="daily">일간</option>
                      <option value="weekly">주간</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">수신자</label>
                    <div className="space-y-2">
                      {formData.recipients.map((recipient, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="email"
                            value={recipient}
                            onChange={(e) => updateRecipient(index, e.target.value)}
                            placeholder="이메일 주소"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {formData.recipients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRecipient(index)}
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addRecipient}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        수신자 추가
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActiveEdit"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActiveEdit" className="ml-2 block text-sm text-gray-900">
                      활성화
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      수정
                    </button>
                  </div>
                </form>
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

export default NotificationSettings;
import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { ReportConfig } from '../../types/admin';
import { adminService } from '../../services/adminService';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import Badge from '../Badge';
import Card from '../Card';

const ReportSettings: React.FC = () => {
  const [configs, setConfigs] = useState<ReportConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ReportConfig | null>(null);
  const [deletingConfig, setDeletingConfig] = useState<ReportConfig | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    type: 'daily',
    recipients: '',
    isActive: true,
    schedule: '0 9 * * *' // Default: daily at 9 AM
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReportConfigs();
      setConfigs(response.data || []);
      setError(null);
    } catch (err) {
      setError('리포트 설정을 불러오는데 실패했습니다.');
      console.error('Failed to load report configs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const recipients = formData.recipients.split(',').map(email => email.trim()).filter(Boolean);
      
      if (editingConfig) {
        await adminService.updateReportConfig(editingConfig.id, {
          ...formData,
          type: formData.type as 'daily' | 'weekly' | 'monthly',
          recipients
        });
      } else {
        // Create new config (mock implementation)
        const newConfig: ReportConfig = {
          id: Date.now(),
          type: formData.type as 'daily' | 'weekly' | 'monthly',
          recipients,
          isActive: formData.isActive,
          schedule: formData.schedule,
          createdAt: new Date().toISOString()
        };
        setConfigs(prev => [...prev, newConfig]);
      }
      
      setShowCreateModal(false);
      setEditingConfig(null);
      resetForm();
      loadConfigs();
    } catch (err) {
      setError('설정을 저장하는데 실패했습니다.');
      console.error('Failed to save report config:', err);
    }
  };

  const handleDelete = async () => {
    if (!deletingConfig) return;
    
    try {
      // Mock delete - in real implementation, call API
      setConfigs(prev => prev.filter(config => config.id !== deletingConfig.id));
      setDeletingConfig(null);
    } catch (err) {
      setError('설정을 삭제하는데 실패했습니다.');
      console.error('Failed to delete report config:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'daily',
      recipients: '',
      isActive: true,
      schedule: '0 9 * * *'
    });
  };

  const openEditModal = (config: ReportConfig) => {
    setEditingConfig(config);
    setFormData({
      type: config.type,
      recipients: config.recipients.join(', '),
      isActive: config.isActive,
      schedule: config.schedule
    });
    setShowCreateModal(true);
  };

  const getScheduleDescription = (schedule: string) => {
    // Simple cron expression parsing for display
    if (schedule === '0 9 * * *') return '매일 오전 9시';
    if (schedule === '0 9 * * 1') return '매주 월요일 오전 9시';
    if (schedule === '0 9 1 * *') return '매월 1일 오전 9시';
    return schedule;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <ClockIcon className="h-5 w-5" />;
      case 'weekly': return <ChartBarIcon className="h-5 w-5" />;
      case 'monthly': return <ChartBarIcon className="h-5 w-5" />;
      default: return <ChartBarIcon className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">리포트 설정</h1>
          <p className="text-gray-600">자동 리포트 생성 및 전송 설정을 관리합니다.</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>새 설정 추가</span>
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Configs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config) => (
          <Card key={config.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {getTypeIcon(config.type)}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {config.type === 'daily' ? '일간' : 
                     config.type === 'weekly' ? '주간' : '월간'} 리포트
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getScheduleDescription(config.schedule)}
                  </p>
                </div>
              </div>
              <Badge
                variant={config.isActive ? 'success' : 'secondary'}
                className="ml-2"
              >
                {config.isActive ? '활성' : '비활성'}
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">수신자</p>
                <p className="text-sm text-gray-600">
                  {config.recipients.length}명
                </p>
                <div className="mt-1">
                  {config.recipients.slice(0, 2).map((email, index) => (
                    <span key={index} className="text-xs text-gray-500 block">
                      {email}
                    </span>
                  ))}
                  {config.recipients.length > 2 && (
                    <span className="text-xs text-gray-500">
                      외 {config.recipients.length - 2}명
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  생성일: {new Date(config.createdAt).toLocaleDateString('ko-KR')}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(config)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingConfig(config)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingConfig ? '리포트 설정 수정' : '새 리포트 설정'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    리포트 유형
                  </label>
                  <Select
                    value={formData.type}
                    onChange={(value: string | number) => setFormData(prev => ({ ...prev, type: value as string }))}
                    options={[
                      { value: 'daily', label: '일간 리포트' },
                      { value: 'weekly', label: '주간 리포트' },
                      { value: 'monthly', label: '월간 리포트' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    수신자 이메일 (쉼표로 구분)
                  </label>
                  <Input
                    type="text"
                    value={formData.recipients}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                    placeholder="user1@example.com, user2@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    스케줄 (Cron 표현식)
                  </label>
                  <Input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                    placeholder="0 9 * * *"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    예: 0 9 * * * (매일 오전 9시)
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    활성화
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingConfig(null);
                      resetForm();
                    }}
                  >
                    취소
                  </Button>
                  <Button type="submit">
                    {editingConfig ? '수정' : '생성'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingConfig && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">설정 삭제</h3>
              <p className="text-sm text-gray-600 mb-4">
                "{deletingConfig.type === 'daily' ? '일간' : 
                  deletingConfig.type === 'weekly' ? '주간' : '월간'} 리포트" 설정을 삭제하시겠습니까?
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setDeletingConfig(null)}
                >
                  취소
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSettings;
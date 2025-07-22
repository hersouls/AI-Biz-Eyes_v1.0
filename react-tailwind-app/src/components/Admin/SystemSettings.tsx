import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { SystemConfig } from '../../types/admin';
import { adminService } from '../../services/adminService';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import Badge from '../Badge';
import Card from '../Card';

const SystemSettings: React.FC = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({});

  // Form states
  const [formData, setFormData] = useState({
    value: '',
    description: ''
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSystemConfigs();
      setConfigs(response.data || []);
      setError(null);
    } catch (err) {
      setError('시스템 설정을 불러오는데 실패했습니다.');
      console.error('Failed to load system configs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingConfig) return;
    
    try {
      await adminService.updateSystemConfig(editingConfig.id, {
        value: formData.value,
        description: formData.description
      });
      
      setShowEditModal(false);
      setEditingConfig(null);
      resetForm();
      loadConfigs();
    } catch (err) {
      setError('설정을 저장하는데 실패했습니다.');
      console.error('Failed to save system config:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      value: '',
      description: ''
    });
  };

  const openEditModal = (config: SystemConfig) => {
    setEditingConfig(config);
    setFormData({
      value: config.value,
      description: config.description || ''
    });
    setShowEditModal(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'api': return <GlobeAltIcon className="h-5 w-5" />;
      case 'security': return <ShieldCheckIcon className="h-5 w-5" />;
      case 'notification': return <BellIcon className="h-5 w-5" />;
      case 'system': return <CogIcon className="h-5 w-5" />;
      default: return <CogIcon className="h-5 w-5" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'api': return 'API';
      case 'security': return '보안';
      case 'notification': return '알림';
      case 'system': return '시스템';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'api': return 'blue';
      case 'security': return 'red';
      case 'notification': return 'yellow';
      case 'system': return 'green';
      default: return 'gray';
    }
  };

  const togglePasswordVisibility = (configId: number) => {
    setShowPassword(prev => ({
      ...prev,
      [configId]: !prev[configId]
    }));
  };

  const renderConfigValue = (config: SystemConfig) => {
    if (config.isEncrypted) {
      return (
        <div className="flex items-center space-x-2">
          <Input
            type={showPassword[config.id] ? 'text' : 'password'}
            value={showPassword[config.id] ? config.value : '••••••••'}
            readOnly
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => togglePasswordVisibility(config.id)}
          >
            {showPassword[config.id] ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      );
    }
    
    return (
      <Input
        type="text"
        value={config.value}
        readOnly
        className="flex-1"
      />
    );
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
          <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
          <p className="text-gray-600">시스템 전반의 설정을 관리합니다.</p>
        </div>
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

      {/* Configs by Category */}
      {['api', 'security', 'notification', 'system'].map((category) => {
        const categoryConfigs = configs.filter(config => config.category === category);
        
        if (categoryConfigs.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center space-x-2">
              {getCategoryIcon(category)}
              <h2 className="text-lg font-semibold text-gray-900">
                {getCategoryName(category)} 설정
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {categoryConfigs.map((config) => (
                <Card key={config.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {config.key}
                      </h3>
                      {config.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {config.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge
                        variant={getCategoryColor(category) as any}
                        className="text-xs"
                      >
                        {getCategoryName(category)}
                      </Badge>
                      {config.isEncrypted && (
                        <Badge variant="secondary" className="text-xs">
                          암호화
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        값
                      </label>
                      {renderConfigValue(config)}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        수정일: {config.updatedAt ? 
                          new Date(config.updatedAt).toLocaleDateString('ko-KR') :
                          new Date(config.createdAt).toLocaleDateString('ko-KR')
                        }
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(config)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Edit Modal */}
      {showEditModal && editingConfig && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                설정 수정: {editingConfig.key}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설정 키
                  </label>
                  <Input
                    type="text"
                    value={editingConfig.key}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    값
                  </label>
                  {editingConfig.isEncrypted ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showPassword[editingConfig.id] ? 'text' : 'password'}
                        value={formData.value}
                        onChange={(value: string) => setFormData(prev => ({ ...prev, value }))}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => togglePasswordVisibility(editingConfig.id)}
                      >
                        {showPassword[editingConfig.id] ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={formData.value}
                      onChange={(value: string) => setFormData(prev => ({ ...prev, value }))}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <Input
                    type="text"
                    value={formData.description}
                    onChange={(value: string) => setFormData(prev => ({ ...prev, description: value }))}
                    placeholder="설정에 대한 설명을 입력하세요"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingConfig(null);
                      resetForm();
                    }}
                  >
                    취소
                  </Button>
                  <Button type="submit">
                    저장
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
import React, { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { AuditSettings } from '../../types/admin';
import AdminLayout from './AdminLayout';
import Card from '../Card';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';
import Badge from '../Badge';

const AuditSettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<AuditSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadAuditSettings();
  }, []);

  const loadAuditSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAuditSettings();
      if (response.data) {
        setSettings(response.data);
      }
      setError(null);
    } catch (err) {
      setError('감사 설정을 불러오는데 실패했습니다.');
      console.error('Failed to load audit settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await adminService.updateAuditSettings(settings);
      if (response.success) {
        setSuccess('감사 설정이 성공적으로 저장되었습니다.');
        setTimeout(() => setSuccess(null), 3000);
      }
      setError(null);
    } catch (err) {
      setError('감사 설정 저장에 실패했습니다.');
      console.error('Failed to save audit settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof AuditSettings) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, [key]: !prev[key] } : null);
  };

  const handleInputChange = (key: string, value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleThresholdChange = (key: string, value: number) => {
    if (!settings) return;
    setSettings(prev => prev ? {
      ...prev,
      alertThresholds: { ...prev.alertThresholds, [key]: value }
    } : null);
  };

  const handleExportSettingChange = (key: string, value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? {
      ...prev,
      exportSettings: { ...prev.exportSettings, [key]: value }
    } : null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-600">
          <p>감사 설정을 불러올 수 없습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">감사 설정</h1>
            <p className="text-gray-600">시스템 감사 정책 및 알림 설정</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            {saving ? '저장 중...' : '설정 저장'}
          </Button>
        </div>

        {/* 알림 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* 기본 설정 */}
        <Card>
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">기본 설정</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">감사 로깅 활성화</p>
                <p className="text-sm text-gray-500">시스템 활동 감사 로깅을 활성화합니다</p>
              </div>
              <button
                onClick={() => handleToggle('enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <Input
                label="로그 보관 기간 (일)"
                type="number"
                value={settings.retentionDays}
                onChange={(value) => handleInputChange('retentionDays', parseInt(value))}
                min="1"
                max="365"
              />
            </div>

            <div>
              <Select
                label="로그 레벨"
                value={settings.logLevel}
                onChange={(value) => handleInputChange('logLevel', value)}
                options={[
                  { value: 'all', label: '모든 로그' },
                  { value: 'important', label: '중요 로그만' },
                  { value: 'critical', label: '위험 로그만' }
                ]}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">실시간 알림</p>
                <p className="text-sm text-gray-500">중요한 이벤트 발생 시 즉시 알림</p>
              </div>
              <button
                onClick={() => handleToggle('realTimeAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.realTimeAlerts ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.realTimeAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* 카테고리 설정 */}
        <Card>
          <div className="flex items-center mb-4">
            <Cog6ToothIcon className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">감사 카테고리</h2>
          </div>
          <div className="space-y-3">
            {['user_activity', 'data_access', 'system_change', 'security_event'].map((category) => (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {category === 'user_activity' && '사용자 활동'}
                    {category === 'data_access' && '데이터 접근'}
                    {category === 'system_change' && '시스템 변경'}
                    {category === 'security_event' && '보안 이벤트'}
                  </p>
                  <p className="text-xs text-gray-500">이 카테고리의 활동을 감사합니다</p>
                </div>
                <Badge
                  variant={settings.categories.includes(category) ? 'green' : 'gray'}
                  className="flex items-center"
                >
                  {settings.categories.includes(category) ? (
                    <>
                      <CheckIcon className="h-3 w-3 mr-1" />
                      활성화
                    </>
                  ) : (
                    '비활성화'
                  )}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* 알림 임계값 */}
        <Card>
          <div className="flex items-center mb-4">
            <BellIcon className="h-5 w-5 text-orange-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">알림 임계값</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="실패 로그인 임계값"
              type="number"
              value={settings.alertThresholds.failedLogins}
              onChange={(value) => handleThresholdChange('failedLogins', parseInt(value))}
              min="1"
              max="100"
            />
            <Input
              label="의심스러운 활동 임계값"
              type="number"
              value={settings.alertThresholds.suspiciousActivities}
              onChange={(value) => handleThresholdChange('suspiciousActivities', parseInt(value))}
              min="1"
              max="50"
            />
            <Input
              label="데이터 접근 임계값"
              type="number"
              value={settings.alertThresholds.dataAccess}
              onChange={(value) => handleThresholdChange('dataAccess', parseInt(value))}
              min="1"
              max="1000"
            />
          </div>
        </Card>

        {/* 내보내기 설정 */}
        <Card>
          <div className="flex items-center mb-4">
            <DocumentArrowDownIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">내보내기 설정</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="내보내기 형식"
              value={settings.exportSettings.format}
              onChange={(value) => handleExportSettingChange('format', value)}
              options={[
                { value: 'json', label: 'JSON' },
                { value: 'csv', label: 'CSV' },
                { value: 'xml', label: 'XML' }
              ]}
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">상세 정보 포함</p>
                <p className="text-sm text-gray-500">내보내기에 상세 정보를 포함합니다</p>
              </div>
              <button
                onClick={() => handleExportSettingChange('includeDetails', !settings.exportSettings.includeDetails)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.exportSettings.includeDetails ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.exportSettings.includeDetails ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">압축 사용</p>
                <p className="text-sm text-gray-500">내보내기 파일을 압축합니다</p>
              </div>
              <button
                onClick={() => handleExportSettingChange('compression', !settings.exportSettings.compression)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.exportSettings.compression ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.exportSettings.compression ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* 제외 설정 */}
        <Card>
          <div className="flex items-center mb-4">
            <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">제외 설정</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">제외할 사용자 ID</label>
              <p className="text-sm text-gray-500 mb-2">감사에서 제외할 사용자 ID를 쉼표로 구분하여 입력</p>
              <Input
                value={settings.excludedUsers.join(', ')}
                onChange={(value) => {
                  const userIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                  handleInputChange('excludedUsers', userIds);
                }}
                placeholder="1, 2, 3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">제외할 액션</label>
              <p className="text-sm text-gray-500 mb-2">감사에서 제외할 액션을 쉼표로 구분하여 입력</p>
              <Input
                value={settings.excludedActions.join(', ')}
                onChange={(value) => {
                  const actions = value.split(',').map(action => action.trim()).filter(action => action);
                  handleInputChange('excludedActions', actions);
                }}
                placeholder="HEARTBEAT, HEALTH_CHECK"
              />
            </div>
          </div>
        </Card>

        {/* 설정 정보 */}
        <Card>
          <div className="flex items-center mb-4">
            <Cog6ToothIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">설정 정보</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">생성일</p>
              <p className="font-medium text-gray-900">
                {new Date(settings.createdAt).toLocaleString('ko-KR')}
              </p>
            </div>
            {settings.updatedAt && (
              <div>
                <p className="text-gray-500">수정일</p>
                <p className="font-medium text-gray-900">
                  {new Date(settings.updatedAt).toLocaleString('ko-KR')}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AuditSettingsComponent;
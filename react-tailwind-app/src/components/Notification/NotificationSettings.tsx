import React, { useState, useEffect } from 'react';
import { NotificationSettings as Settings } from '../../types/notification';
import { NotificationService } from '../../services/notificationService';
import { Card } from '../Card';
import { Button } from '../Button';
import { Select } from '../Select';

export const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: {
      enabled: true,
      types: ['urgent', 'deadline'],
      frequency: 'immediate'
    },
    webNotifications: {
      enabled: true,
      types: ['urgent', 'deadline', 'missing', 'duplicate']
    },
    pushNotifications: {
      enabled: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await NotificationService.getNotificationSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('알림 설정 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await NotificationService.updateNotificationSettings(settings);
      alert('알림 설정이 저장되었습니다.');
    } catch (error) {
      console.error('알림 설정 저장 실패:', error);
      alert('알림 설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailTypeChange = (type: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        types: checked
          ? [...prev.emailNotifications.types, type]
          : prev.emailNotifications.types.filter(t => t !== type)
      }
    }));
  };

  const handleWebTypeChange = (type: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      webNotifications: {
        ...prev.webNotifications,
        types: checked
          ? [...prev.webNotifications.types, type]
          : prev.webNotifications.types.filter(t => t !== type)
      }
    }));
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent':
        return '긴급';
      case 'deadline':
        return '마감임박';
      case 'missing':
        return '누락';
      case 'duplicate':
        return '중복';
      case 'new':
        return '신규';
      case 'update':
        return '업데이트';
      default:
        return type;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'immediate':
        return '즉시';
      case 'daily':
        return '일간';
      case 'weekly':
        return '주간';
      default:
        return frequency;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">설정을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">알림 설정</h2>

      {/* 이메일 알림 설정 */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">이메일 알림</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    enabled: e.target.checked
                  }
                }))}
                className="rounded"
              />
              <span className="ml-2 text-sm text-gray-700">활성화</span>
            </label>
          </div>

          {settings.emailNotifications.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  알림 주기
                </label>
                <Select
                  value={settings.emailNotifications.frequency}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    emailNotifications: {
                      ...prev.emailNotifications,
                      frequency: value as any
                    }
                  }))}
                  options={[
                    { value: 'immediate', label: '즉시' },
                    { value: 'daily', label: '일간' },
                    { value: 'weekly', label: '주간' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  알림 유형
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['urgent', 'deadline', 'missing', 'duplicate', 'new', 'update'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications.types.includes(type)}
                        onChange={(e) => handleEmailTypeChange(type, e.target.checked)}
                        className="rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {getNotificationTypeLabel(type)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* 웹 알림 설정 */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">웹 알림</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.webNotifications.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  webNotifications: {
                    ...prev.webNotifications,
                    enabled: e.target.checked
                  }
                }))}
                className="rounded"
              />
              <span className="ml-2 text-sm text-gray-700">활성화</span>
            </label>
          </div>

          {settings.webNotifications.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                알림 유형
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['urgent', 'deadline', 'missing', 'duplicate', 'new', 'update'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.webNotifications.types.includes(type)}
                      onChange={(e) => handleWebTypeChange(type, e.target.checked)}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {getNotificationTypeLabel(type)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 푸시 알림 설정 */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">푸시 알림</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.pushNotifications.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  pushNotifications: {
                    ...prev.pushNotifications,
                    enabled: e.target.checked
                  }
                }))}
                className="rounded"
              />
              <span className="ml-2 text-sm text-gray-700">활성화</span>
            </label>
          </div>

          {settings.pushNotifications.enabled && (
            <div className="text-sm text-gray-600">
              푸시 알림은 브라우저 설정에서 추가로 활성화해야 할 수 있습니다.
            </div>
          )}
        </div>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '설정 저장'}
        </Button>
      </div>

      {/* 알림 유형 설명 */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 유형 설명</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-gray-900">긴급:</strong> 즉시 조치가 필요한 중요한 공고
          </div>
          <div>
            <strong className="text-gray-900">마감임박:</strong> 마감일이 3일 이내인 공고
          </div>
          <div>
            <strong className="text-gray-900">누락:</strong> 처리되지 않은 공고
          </div>
          <div>
            <strong className="text-gray-900">중복:</strong> 유사한 공고가 이미 존재
          </div>
          <div>
            <strong className="text-gray-900">신규:</strong> 새로 등록된 공고
          </div>
          <div>
            <strong className="text-gray-900">업데이트:</strong> 기존 공고 정보 변경
          </div>
        </div>
      </Card>
    </div>
  );
};
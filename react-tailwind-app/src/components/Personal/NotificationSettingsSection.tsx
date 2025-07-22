import React, { useState, useEffect } from 'react';
import { BellIcon, EnvelopeIcon, DevicePhoneMobileIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { PersonalService } from '../../services/personalService';
import { NotificationSettings, NotificationSettingsUpdateRequest } from '../../types/personal';
import { Button } from '../Button';

export const NotificationSettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await PersonalService.getNotificationSettings();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '알림 설정을 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      const response = await PersonalService.updateNotificationSettings(settings);
      if (response.success && response.data) {
        setSettings(response.data);
        setMessage({ type: 'success', text: '알림 설정이 성공적으로 저장되었습니다.' });
      } else {
        setMessage({ type: 'error', text: response.message || '알림 설정 저장에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '알림 설정 저장에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async (channel: 'web' | 'email' | 'push') => {
    try {
      const response = await PersonalService.testNotification(channel);
      if (response.success) {
        setMessage({ type: 'success', text: response.message || '테스트 알림이 발송되었습니다.' });
      } else {
        setMessage({ type: 'error', text: response.message || '테스트 알림 발송에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '테스트 알림 발송에 실패했습니다.' });
    }
  };

  const handleToggle = (field: keyof NotificationSettings) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: !settings[field] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500">알림 설정을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">알림 설정</h2>
          <p className="mt-1 text-gray-600">알림 유형과 채널을 설정하여 원하는 알림을 받을 수 있습니다.</p>
        </div>
        <Button onClick={handleSaveSettings} variant="primary" disabled={isSaving}>
          {isSaving ? '저장 중...' : '설정 저장'}
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notification Types */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">알림 유형</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">신규 공고</h4>
                <p className="text-sm text-gray-600">새로운 공고가 등록될 때 알림</p>
              </div>
              <button
                onClick={() => handleToggle('newBid')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.newBid ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.newBid ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">긴급 공고</h4>
                <p className="text-sm text-gray-600">긴급 공고가 등록될 때 알림</p>
              </div>
              <button
                onClick={() => handleToggle('urgent')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.urgent ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.urgent ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">마감 임박</h4>
                <p className="text-sm text-gray-600">공고 마감일이 임박할 때 알림</p>
              </div>
              <button
                onClick={() => handleToggle('deadline')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.deadline ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.deadline ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">성과 알림</h4>
                <p className="text-sm text-gray-600">업무 성과 및 통계 알림</p>
              </div>
              <button
                onClick={() => handleToggle('achievement')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.achievement ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.achievement ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">알림 채널</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">웹 알림</h4>
                  <p className="text-sm text-gray-600">브라우저 내 알림</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggle('webNotification')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.webNotification ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.webNotification ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <Button
                  onClick={() => handleTestNotification('web')}
                  variant="secondary"
                  size="sm"
                >
                  테스트
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">이메일 알림</h4>
                  <p className="text-sm text-gray-600">이메일로 알림 수신</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggle('emailNotification')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotification ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotification ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <Button
                  onClick={() => handleTestNotification('email')}
                  variant="secondary"
                  size="sm"
                >
                  테스트
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">푸시 알림</h4>
                  <p className="text-sm text-gray-600">모바일 푸시 알림</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggle('pushNotification')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.pushNotification ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.pushNotification ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <Button
                  onClick={() => handleTestNotification('push')}
                  variant="secondary"
                  size="sm"
                >
                  테스트
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Frequency */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">알림 주기</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">즉시 알림</h4>
              <p className="text-sm text-gray-600">실시간으로 즉시 발송</p>
            </div>
            <button
              onClick={() => handleToggle('immediateNotification')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.immediateNotification ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.immediateNotification ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">일간 요약</h4>
              <p className="text-sm text-gray-600">하루 한 번 요약 발송</p>
            </div>
            <button
              onClick={() => handleToggle('dailyNotification')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dailyNotification ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dailyNotification ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">주간 요약</h4>
              <p className="text-sm text-gray-600">일주일 한 번 요약 발송</p>
            </div>
            <button
              onClick={() => handleToggle('weeklyNotification')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.weeklyNotification ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.weeklyNotification ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">현재 설정 요약</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• 활성화된 알림 유형: {[
            settings.newBid && '신규 공고',
            settings.urgent && '긴급 공고',
            settings.deadline && '마감 임박',
            settings.achievement && '성과 알림'
          ].filter(Boolean).join(', ') || '없음'}</p>
          <p>• 활성화된 채널: {[
            settings.webNotification && '웹',
            settings.emailNotification && '이메일',
            settings.pushNotification && '푸시'
          ].filter(Boolean).join(', ') || '없음'}</p>
          <p>• 알림 주기: {[
            settings.immediateNotification && '즉시',
            settings.dailyNotification && '일간',
            settings.weeklyNotification && '주간'
          ].filter(Boolean).join(', ') || '없음'}</p>
        </div>
      </div>
    </div>
  );
};
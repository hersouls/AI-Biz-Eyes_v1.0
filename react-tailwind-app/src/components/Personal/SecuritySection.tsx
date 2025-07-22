import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { PersonalService } from '../../services/personalService';
import { SecuritySettings } from '../../types/personal';
import Button from '../Button';
import Input from '../Input';

export const SecuritySection: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await PersonalService.getSecuritySettings();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '보안 설정을 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      const response = await PersonalService.updateSecuritySettings(settings);
      if (response.success && response.data) {
        setSettings(response.data);
        setMessage({ type: 'success', text: '보안 설정이 성공적으로 저장되었습니다.' });
      } else {
        setMessage({ type: 'error', text: response.message || '보안 설정 저장에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '보안 설정 저장에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle2FA = () => {
    if (!settings) return;
    setSettings({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
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
        <p className="text-gray-500">보안 설정을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">보안 설정</h2>
          <p className="mt-1 text-gray-600">계정 보안을 위한 설정을 관리할 수 있습니다.</p>
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
        {/* Security Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">보안 옵션</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">2단계 인증</h4>
                <p className="text-sm text-gray-600">추가 보안을 위한 2단계 인증</p>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">세션 타임아웃</h4>
              <p className="text-sm text-gray-600 mb-3">자동 로그아웃 시간을 설정합니다.</p>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30 })}
                placeholder="분 단위"
                min="5"
                max="480"
              />
              <p className="text-xs text-gray-500 mt-1">5분 ~ 480분 (8시간) 사이로 설정하세요.</p>
            </div>

            {settings.twoFactorEnabled && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">2단계 인증 방법</h4>
                <select
                  value={settings.twoFactorMethod || 'email'}
                  onChange={(e) => setSettings({ ...settings, twoFactorMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">이메일</option>
                  <option value="sms">SMS</option>
                  <option value="app">인증 앱</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Login History */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">로그인 기록</h3>
          
          <div className="space-y-3">
            {settings.loginHistory.slice(0, 5).map((login) => (
              <div key={login.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {login.success ? '성공' : '실패'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(login.loginAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {login.ipAddress} • {login.location || '위치 정보 없음'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    login.success ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                {!login.success && login.failureReason && (
                  <p className="text-xs text-red-600 mt-1">
                    실패 사유: {login.failureReason}
                  </p>
                )}
              </div>
            ))}
          </div>

          {settings.loginHistory.length === 0 && (
            <div className="text-center p-8">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">로그인 기록이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">보안 상태 요약</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• 2단계 인증: {settings.twoFactorEnabled ? '활성화' : '비활성화'}</p>
          <p>• 세션 타임아웃: {settings.sessionTimeout}분</p>
          <p>• 최근 로그인: {settings.loginHistory.length > 0 ? formatDate(settings.loginHistory[0].loginAt) : '없음'}</p>
        </div>
      </div>
    </div>
  );
};
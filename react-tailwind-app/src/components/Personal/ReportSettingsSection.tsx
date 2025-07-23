import React, { useState, useEffect } from 'react';
import { Mail, Globe } from 'lucide-react';
import { PersonalService } from '../../services/personalService';
import { ReportSettings } from '../../types/personal';
import Button from '../Button';

export const ReportSettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<ReportSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await PersonalService.getReportSettings();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '리포트 설정을 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      const response = await PersonalService.updateReportSettings(settings);
      if (response.success && response.data) {
        setSettings(response.data);
        setMessage({ type: 'success', text: '리포트 설정이 성공적으로 저장되었습니다.' });
      } else {
        setMessage({ type: 'error', text: response.message || '리포트 설정 저장에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '리포트 설정 저장에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (field: keyof ReportSettings) => {
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
        <p className="text-gray-500">리포트 설정을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">리포트 설정</h2>
          <p className="mt-1 text-gray-600">자동 리포트 수신 설정을 관리할 수 있습니다.</p>
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
        {/* Report Types */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">리포트 유형</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">일간 리포트</h4>
                <p className="text-sm text-gray-600">매일 업무 요약 리포트</p>
              </div>
              <button
                onClick={() => handleToggle('dailyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.dailyReport ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.dailyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">주간 리포트</h4>
                <p className="text-sm text-gray-600">주간 업무 요약 리포트</p>
              </div>
              <button
                onClick={() => handleToggle('weeklyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.weeklyReport ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">월간 리포트</h4>
                <p className="text-sm text-gray-600">월간 업무 요약 리포트</p>
              </div>
              <button
                onClick={() => handleToggle('monthlyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.monthlyReport ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.monthlyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Report Channels */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">수신 채널</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">이메일 리포트</h4>
                  <p className="text-sm text-gray-600">이메일로 리포트 수신</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('emailReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailReport ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">웹 리포트</h4>
                  <p className="text-sm text-gray-600">웹에서 리포트 확인</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('webReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.webReport ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.webReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">현재 설정 요약</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• 활성화된 리포트: {[
            settings.dailyReport && '일간',
            settings.weeklyReport && '주간',
            settings.monthlyReport && '월간'
          ].filter(Boolean).join(', ') || '없음'}</p>
          <p>• 수신 채널: {[
            settings.emailReport && '이메일',
            settings.webReport && '웹'
          ].filter(Boolean).join(', ') || '없음'}</p>
        </div>
      </div>
    </div>
  );
};
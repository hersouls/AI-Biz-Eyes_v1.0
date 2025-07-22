import React, { useState } from 'react';
import { 
  CogIcon, 
  ClockIcon, 
  LanguageIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  SunIcon
} from '@heroicons/react/24/outline';

interface SettingOption {
  id: string;
  name: string;
  description: string;
  type: 'select' | 'toggle' | 'radio';
  options?: { value: string; label: string }[];
  icon: React.ComponentType<any>;
}

const settingOptions: SettingOption[] = [
  {
    id: 'timezone',
    name: '시간대',
    description: '시스템에서 사용할 시간대를 설정합니다.',
    type: 'select',
    options: [
      { value: 'Asia/Seoul', label: '한국 표준시 (UTC+9)' },
      { value: 'UTC', label: '협정 세계시 (UTC+0)' },
      { value: 'America/New_York', label: '미국 동부 시간 (UTC-5)' },
      { value: 'Europe/London', label: '영국 시간 (UTC+0)' }
    ],
    icon: ClockIcon
  },
  {
    id: 'language',
    name: '언어',
    description: '인터페이스 언어를 설정합니다.',
    type: 'select',
    options: [
      { value: 'ko', label: '한국어' },
      { value: 'en', label: 'English' },
      { value: 'ja', label: '日本語' }
    ],
    icon: LanguageIcon
  },
  {
    id: 'theme',
    name: '테마',
    description: '화면 테마를 설정합니다.',
    type: 'radio',
    options: [
      { value: 'light', label: '라이트 모드' },
      { value: 'dark', label: '다크 모드' },
      { value: 'auto', label: '시스템 설정 따름' }
    ],
    icon: SunIcon
  },
  {
    id: 'auto-refresh',
    name: '자동 새로고침',
    description: '페이지를 자동으로 새로고침합니다.',
    type: 'toggle',
    icon: CogIcon
  },
  {
    id: 'desktop-notifications',
    name: '데스크톱 알림',
    description: '브라우저 데스크톱 알림을 활성화합니다.',
    type: 'toggle',
    icon: ComputerDesktopIcon
  },
  {
    id: 'mobile-optimization',
    name: '모바일 최적화',
    description: '모바일 기기에서 최적화된 레이아웃을 사용합니다.',
    type: 'toggle',
    icon: DevicePhoneMobileIcon
  }
];

export const PersonalSettingsSection: React.FC = () => {
  const [settings, setSettings] = useState({
    timezone: 'Asia/Seoul',
    language: 'ko',
    theme: 'light',
    autoRefresh: false,
    desktopNotifications: true,
    mobileOptimization: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (settingId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      setIsSaving(false);
      alert('설정이 저장되었습니다.');
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
      setSettings({
        timezone: 'Asia/Seoul',
        language: 'ko',
        theme: 'light',
        autoRefresh: false,
        desktopNotifications: true,
        mobileOptimization: true
      });
    }
  };

  const renderSettingControl = (option: SettingOption) => {
    const currentValue = settings[option.id as keyof typeof settings];

    switch (option.type) {
      case 'select':
        return (
          <select
            value={currentValue as string}
            onChange={(e) => handleSettingChange(option.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {option.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'toggle':
        return (
          <button
            onClick={() => handleSettingChange(option.id, !currentValue)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              currentValue ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                currentValue ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {option.options?.map((opt) => (
              <label key={opt.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={option.id}
                  value={opt.value}
                  checked={currentValue === opt.value}
                  onChange={(e) => handleSettingChange(option.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">환경설정</h2>
        <p className="text-gray-600">
          시스템 환경, 언어, 테마 등 개인 환경을 설정할 수 있습니다.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingOptions.map((option) => {
          const Icon = option.icon;
          
          return (
            <div key={option.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{option.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
              </div>
              
              <div className="mt-4">
                {renderSettingControl(option)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          기본값으로 초기화
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center px-6 py-2 rounded-md font-medium transition-colors ${
              isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? '저장 중...' : '설정 저장'}
          </button>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">현재 설정 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-500">시간대</p>
            <p className="text-sm text-gray-900 mt-1">
              {settingOptions.find(opt => opt.id === 'timezone')?.options?.find(opt => opt.value === settings.timezone)?.label}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-500">언어</p>
            <p className="text-sm text-gray-900 mt-1">
              {settingOptions.find(opt => opt.id === 'language')?.options?.find(opt => opt.value === settings.language)?.label}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-500">테마</p>
            <p className="text-sm text-gray-900 mt-1">
              {settingOptions.find(opt => opt.id === 'theme')?.options?.find(opt => opt.value === settings.theme)?.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { ChartBarIcon, EyeIcon, EyeSlashIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { PersonalService } from '../../services/personalService';
import { DashboardSettings } from '../../types/personal';
import Button from '../Button';

const widgetLabels = {
  overview: '전체 현황',
  trend: '트렌드',
  calendar: '캘린더',
  recommendations: '추천',
  notifications: '알림',
  references: '레퍼런스',
  reports: '리포트'
};

export const DashboardSettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<DashboardSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await PersonalService.getDashboardSettings();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '대시보드 설정을 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      const response = await PersonalService.updateDashboardSettings(settings);
      if (response.success && response.data) {
        setSettings(response.data);
        setMessage({ type: 'success', text: '대시보드 설정이 성공적으로 저장되었습니다.' });
      } else {
        setMessage({ type: 'error', text: response.message || '대시보드 설정 저장에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '대시보드 설정 저장에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleWidget = (widgetId: string) => {
    if (!settings) return;
    const updatedWidgets = settings.widgets.map(widget => 
      widget.id === widgetId ? { ...widget, isVisible: !widget.isVisible } : widget
    );
    setSettings({ ...settings, widgets: updatedWidgets });
  };

  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    if (!settings) return;
    const widgets = [...settings.widgets];
    const currentIndex = widgets.findIndex(w => w.id === widgetId);
    
    if (direction === 'up' && currentIndex > 0) {
      [widgets[currentIndex], widgets[currentIndex - 1]] = [widgets[currentIndex - 1], widgets[currentIndex]];
    } else if (direction === 'down' && currentIndex < widgets.length - 1) {
      [widgets[currentIndex], widgets[currentIndex + 1]] = [widgets[currentIndex + 1], widgets[currentIndex]];
    }
    
    setSettings({ ...settings, widgets });
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
        <p className="text-gray-500">대시보드 설정을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">대시보드 설정</h2>
          <p className="mt-1 text-gray-600">대시보드 위젯의 표시 여부와 순서를 설정할 수 있습니다.</p>
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

      {/* Widget Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">위젯 설정</h3>
        
        <div className="space-y-3">
          {settings.widgets.map((widget, index) => (
            <div key={widget.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">{widgetLabels[widget.type]}</h4>
                  <p className="text-sm text-gray-600">순서: {widget.order}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => moveWidget(widget.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ArrowsUpDownIcon className="w-4 h-4 rotate-90" />
                </button>
                <button
                  onClick={() => moveWidget(widget.id, 'down')}
                  disabled={index === settings.widgets.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ArrowsUpDownIcon className="w-4 h-4 -rotate-90" />
                </button>
                <button
                  onClick={() => handleToggleWidget(widget.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    widget.isVisible ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      widget.isVisible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                {widget.isVisible ? (
                  <EyeIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">현재 설정 요약</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• 표시 중인 위젯: {settings.widgets.filter(w => w.isVisible).length}개</p>
          <p>• 숨겨진 위젯: {settings.widgets.filter(w => !w.isVisible).length}개</p>
          <p>• 위젯 순서: {settings.widgets.map(w => widgetLabels[w.type]).join(' → ')}</p>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  FileText, 
  Settings, 
  Shield, 
  BarChart3,
  Download,
  Clock
} from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { NotificationSettingsSection } from './NotificationSettingsSection';
import { ReportSettingsSection } from './ReportSettingsSection';
import { DashboardSettingsSection } from './DashboardSettingsSection';
import { ActivitySection } from './ActivitySection';
import { SecuritySection } from './SecuritySection';
import { ExportSection } from './ExportSection';
import { PersonalSettingsSection } from './PersonalSettingsSection';

type TabType = 'profile' | 'notifications' | 'reports' | 'dashboard' | 'activity' | 'security' | 'export' | 'settings';

const tabs = [
  { id: 'profile', name: '내 정보', icon: User },
  { id: 'notifications', name: '알림 설정', icon: Bell },
  { id: 'reports', name: '리포트 설정', icon: FileText },
  { id: 'dashboard', name: '대시보드 설정', icon: BarChart3 },
  { id: 'activity', name: '활동 내역', icon: Clock },
  { id: 'security', name: '보안 설정', icon: Shield },
  { id: 'export', name: '데이터 내보내기', icon: Download },
  { id: 'settings', name: '환경설정', icon: Settings },
];

export const PersonalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'notifications':
        return <NotificationSettingsSection />;
      case 'reports':
        return <ReportSettingsSection />;
      case 'dashboard':
        return <DashboardSettingsSection />;
      case 'activity':
        return <ActivitySection />;
      case 'security':
        return <SecuritySection />;
      case 'export':
        return <ExportSection />;
      case 'settings':
        return <PersonalSettingsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">개인화/환경설정</h1>
          <p className="mt-2 text-gray-600">
            내 정보, 알림 설정, 대시보드 커스터마이징 등 개인 환경을 설정할 수 있습니다.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg shadow-sm p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as TabType)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import IntegrationDashboard from './IntegrationDashboard';
import IntegrationSystemList from './IntegrationSystemList';
import IntegrationLogs from './IntegrationLogs';
import FieldMappingList from './FieldMappingList';
import { 
  ChartBarIcon, 
  CogIcon, 
  DocumentTextIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

type TabType = 'dashboard' | 'systems' | 'logs' | 'mappings';

const IntegrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    {
      id: 'dashboard' as TabType,
      name: '대시보드',
      icon: ChartBarIcon,
      description: '연동 현황 및 통계'
    },
    {
      id: 'systems' as TabType,
      name: '시스템 관리',
      icon: CogIcon,
      description: '연동 시스템 설정'
    },
    {
      id: 'logs' as TabType,
      name: '연동 로그',
      icon: DocumentTextIcon,
      description: '연동 이력 및 오류'
    },
    {
      id: 'mappings' as TabType,
      name: '필드 매핑',
      icon: TableCellsIcon,
      description: '데이터 필드 매핑 관리'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <IntegrationDashboard />;
      case 'systems':
        return <IntegrationSystemList />;
      case 'logs':
        return <IntegrationLogs />;
      case 'mappings':
        return <FieldMappingList />;
      default:
        return <IntegrationDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            외부 시스템 연동
          </h1>
          <p className="text-gray-600">
            나라장터 OpenAPI, ERP, 그룹웨어 등 외부 시스템과의 데이터 연동을 관리합니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 탭 설명 */}
        <div className="mb-6">
          {tabs.find(tab => tab.id === activeTab) && (
            <p className="text-sm text-gray-600">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          )}
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white rounded-lg shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default IntegrationPage;
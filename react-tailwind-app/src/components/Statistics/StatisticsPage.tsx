import React, { useState } from 'react';
import Button from '../Button';
import Select from '../Select';
import BidStatistics from './BidStatistics';
import ReferenceStatistics from './ReferenceStatistics';
import NotificationStatistics from './NotificationStatistics';
import SystemStatistics from './SystemStatistics';
import { useAuth } from '../../hooks/useAuth';
import { BarChart3, TrendingUp, Bell, Settings } from 'lucide-react';

type StatisticsTab = 'bids' | 'references' | 'notifications' | 'system';

const StatisticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StatisticsTab>('bids');
  const [period, setPeriod] = useState<string>('month');
  const { user } = useAuth();

  const tabs = [
    { id: 'bids', label: '공고 통계', icon: BarChart3 },
    { id: 'references', label: '레퍼런스 통계', icon: TrendingUp },
    { id: 'notifications', label: '알림 통계', icon: Bell },
    ...(user?.role === 'admin' ? [{ id: 'system', label: '시스템 통계', icon: Settings }] : [])
  ];

  const periodOptions = [
    { value: 'today', label: '오늘' },
    { value: 'week', label: '이번 주' },
    { value: 'month', label: '이번 달' },
    { value: 'year', label: '올해' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bids':
        return <BidStatistics period={period} />;
      case 'references':
        return <ReferenceStatistics period={period} />;
      case 'notifications':
        return <NotificationStatistics period={period} />;
      case 'system':
        return <SystemStatistics period={period} />;
      default:
        return <BidStatistics period={period} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            통계 및 분석
          </h1>
          <p className="text-gray-600">
            공고, 레퍼런스, 알림 데이터를 기반으로 한 종합적인 분석 정보를 제공합니다.
          </p>
        </div>

        {/* 필터 및 컨트롤 */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as StatisticsTab)}
                  className="flex items-center gap-2"
                >
                  <IconComponent size={16} />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">기간:</label>
            <Select
              value={period}
              onChange={(value: string | number) => setPeriod(value as string)}
              options={periodOptions}
              className="w-32"
            />
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
import React, { useState } from 'react';
import { Notification, Report } from '../../types/notification';
import { NotificationList } from './NotificationList';
import { ReportList } from './ReportList';
import { NotificationSettings } from './NotificationSettings';
import { NotificationDetail } from './NotificationDetail';
import { ReportDetail } from './ReportDetail';
import Card from '../Card';
import { Bell, BarChart3, Settings } from 'lucide-react';

type TabType = 'notifications' | 'reports' | 'settings';

export const NotificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('notifications');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);
  const [showReportDetail, setShowReportDetail] = useState(false);

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetail(true);
  };

  const handleNotificationStatusChange = (id: number, status: string) => {
    // 알림 목록 새로고침 로직
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(prev => prev ? { ...prev, status: status as any } : null);
    }
  };

  const tabs = [
    { id: 'notifications', label: '알림', icon: Bell },
    { id: 'reports', label: '리포트', icon: BarChart3 },
    { id: 'settings', label: '설정', icon: Settings }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">알림 & 리포트</h1>
          <p className="mt-2 text-gray-600">
            실시간 알림과 주기적 리포트를 통해 공고 현황을 효율적으로 관리하세요.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <Card className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </Card>

        {/* 탭 컨텐츠 */}
        <div className="space-y-6">
          {activeTab === 'notifications' && (
            <NotificationList
              onNotificationClick={handleNotificationClick}
              onRefresh={() => {
                // 알림 목록 새로고침 로직
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ReportList
              onReportClick={handleReportClick}
            />
          )}

          {activeTab === 'settings' && (
            <NotificationSettings />
          )}
        </div>

        {/* 알림 상세 모달 */}
        <NotificationDetail
          notification={selectedNotification}
          isOpen={showNotificationDetail}
          onClose={() => {
            setShowNotificationDetail(false);
            setSelectedNotification(null);
          }}
          onStatusChange={handleNotificationStatusChange}
        />

        {/* 리포트 상세 모달 */}
        <ReportDetail
          report={selectedReport}
          isOpen={showReportDetail}
          onClose={() => {
            setShowReportDetail(false);
            setSelectedReport(null);
          }}
        />
      </div>
    </div>
  );
};
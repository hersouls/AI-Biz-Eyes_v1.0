import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle,
  Filter,
  Search,
  Settings,
  Trash2,
  Archive,
  Star,
  Clock,
  Mail,
  MessageSquare,
  FileText
} from 'lucide-react';
import { AdvancedCard, AdvancedButton, AdvancedInput, AdvancedBadge, AdvancedModal } from '../ui';

// Mock data
const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: '2024년 AI 기술개발사업 선정',
    message: '축하합니다! AI 기술개발사업에 선정되었습니다. 상세 내용을 확인해주세요.',
    time: '2시간 전',
    read: false,
    priority: 'high',
    category: '선정'
  },
  {
    id: 2,
    type: 'warning',
    title: '디지털 전환 지원사업 마감 임박',
    message: '디지털 전환 지원사업 접수가 3일 후 마감됩니다. 서류를 제출해주세요.',
    time: '4시간 전',
    read: false,
    priority: 'high',
    category: '마감임박'
  },
  {
    id: 3,
    type: 'info',
    title: '스마트팩토리 구축사업 접수 완료',
    message: '스마트팩토리 구축사업 접수가 완료되었습니다. 심사 결과를 기다려주세요.',
    time: '6시간 전',
    read: true,
    priority: 'medium',
    category: '접수완료'
  },
  {
    id: 4,
    type: 'success',
    title: '친환경 에너지 사업 2차 심사 통과',
    message: '친환경 에너지 사업 2차 심사를 통과했습니다. 최종 심사 일정을 확인해주세요.',
    time: '1일 전',
    read: true,
    priority: 'medium',
    category: '심사통과'
  },
  {
    id: 5,
    type: 'error',
    title: '바이오 헬스케어 사업 서류 보완 요청',
    message: '바이오 헬스케어 사업 서류에 보완이 필요합니다. 7일 내에 수정하여 제출해주세요.',
    time: '2일 전',
    read: true,
    priority: 'high',
    category: '보완요청'
  }
];

const typeConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200'
  }
};

const categoryColors: Record<string, string> = {
  '선정': 'bg-green-100 text-green-800',
  '마감임박': 'bg-red-100 text-red-800',
  '접수완료': 'bg-blue-100 text-blue-800',
  '심사통과': 'bg-yellow-100 text-yellow-800',
  '보완요청': 'bg-orange-100 text-orange-800'
};

export default function EnhancedNotification() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'read' && notification.read);
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationItem = ({ notification }: { notification: any }) => {
    const type = typeConfig[notification.type as keyof typeof typeConfig];
    const Icon = type.icon;

    return (
      <AdvancedCard 
        variant={notification.read ? "default" : "elevated"}
        className={clsx(
          'cursor-pointer transition-all duration-200',
          !notification.read && 'border-l-4 border-l-primary'
        )}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex items-start space-x-4">
          <div className={clsx('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', type.bgColor)}>
            <Icon className={clsx('w-5 h-5', type.color)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={clsx('text-sm font-medium', notification.read ? 'text-gray-600' : 'text-gray-900')}>
                {notification.title}
              </h3>
              <div className="flex items-center space-x-2">
                <AdvancedBadge 
                  variant={notification.priority === 'high' ? 'danger' : notification.priority === 'medium' ? 'warning' : 'success'}
                  size="sm"
                >
                  {notification.priority === 'high' ? '높음' : notification.priority === 'medium' ? '보통' : '낮음'}
                </AdvancedBadge>
                <AdvancedBadge 
                  variant="light"
                  size="sm"
                >
                  {notification.category}
                </AdvancedBadge>
              </div>
            </div>
            
            <p className={clsx('text-sm mb-2', notification.read ? 'text-gray-500' : 'text-gray-700')}>
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {notification.time}
              </div>
              
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
                <AdvancedButton
                  size="sm"
                  variant="ghost"
                  icon={<Trash2 className="w-3 h-3" />}
                  onClick={(e) => {
                    e?.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  삭제
                </AdvancedButton>
              </div>
            </div>
          </div>
        </div>
      </AdvancedCard>
    );
  };

  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
          <Bell className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{notifications.length}</h3>
        <p className="text-sm text-gray-600">전체 알림</p>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4 mx-auto">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{unreadCount}</h3>
        <p className="text-sm text-gray-600">읽지 않은 알림</p>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 mx-auto">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {notifications.filter(n => n.type === 'success').length}
        </h3>
        <p className="text-sm text-gray-600">성공 알림</p>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4 mx-auto">
          <Clock className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {notifications.filter(n => n.priority === 'high').length}
        </h3>
        <p className="text-sm text-gray-600">높은 우선순위</p>
      </AdvancedCard>
    </div>
  );

  const FilterPanel = () => (
    <AdvancedCard variant="outlined" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdvancedInput
          placeholder="알림 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">전체 알림</option>
          <option value="unread">읽지 않은 알림</option>
          <option value="read">읽은 알림</option>
        </select>
        
        <AdvancedButton
          variant="outline"
          icon={<Filter className="w-4 h-4" />}
        >
          필터
        </AdvancedButton>
        
        <AdvancedButton
          variant="primary"
          icon={<Settings className="w-4 h-4" />}
          onClick={() => setIsSettingsModalOpen(true)}
        >
          설정
        </AdvancedButton>
      </div>
    </AdvancedCard>
  );

  return (
    <div className="space-y-6 font-pretendard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">알림 센터</h1>
          <p className="text-gray-600">모든 알림과 업데이트를 한 곳에서 관리하세요</p>
        </div>
        <div className="flex space-x-3">
          <AdvancedButton 
            variant="outline" 
            icon={<Archive className="w-4 h-4" />}
            onClick={markAllAsRead}
          >
            모두 읽음 처리
          </AdvancedButton>
          <AdvancedButton 
            variant="primary" 
            icon={<Settings className="w-4 h-4" />}
            onClick={() => setIsSettingsModalOpen(true)}
          >
            알림 설정
          </AdvancedButton>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Filter Panel */}
      <FilterPanel />

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <AdvancedCard variant="filled" className="text-center py-12">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 mx-auto">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">알림이 없습니다</h3>
            <p className="text-gray-600">새로운 알림이 도착하면 여기에 표시됩니다.</p>
          </AdvancedCard>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>

      {/* Detail Modal */}
      <AdvancedModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedNotification?.title}
        size="lg"
      >
        {selectedNotification && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className={clsx(
                'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                typeConfig[selectedNotification.type as keyof typeof typeConfig].bgColor
              )}>
                {React.createElement(typeConfig[selectedNotification.type as keyof typeof typeConfig].icon, {
                  className: clsx('w-6 h-6', typeConfig[selectedNotification.type as keyof typeof typeConfig].color)
                })}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedNotification.title}</h3>
                <p className="text-sm text-gray-500">{selectedNotification.time}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{selectedNotification.message}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <AdvancedBadge variant="light">{selectedNotification.category}</AdvancedBadge>
                <AdvancedBadge 
                  variant={selectedNotification.priority === 'high' ? 'danger' : 'warning'}
                >
                  {selectedNotification.priority === 'high' ? '높은 우선순위' : '보통 우선순위'}
                </AdvancedBadge>
              </div>
              
              <div className="flex space-x-3">
                <AdvancedButton variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  닫기
                </AdvancedButton>
                <AdvancedButton variant="primary">
                  상세 보기
                </AdvancedButton>
              </div>
            </div>
          </div>
        )}
      </AdvancedModal>

      {/* Settings Modal */}
      <AdvancedModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="알림 설정"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">알림 유형</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">선정 결과</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">마감 임박</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">서류 보완</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">시스템 업데이트</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">알림 방법</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">브라우저 알림</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">이메일 알림</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">SMS 알림</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <AdvancedButton variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
              취소
            </AdvancedButton>
            <AdvancedButton variant="primary">
              설정 저장
            </AdvancedButton>
          </div>
        </div>
      </AdvancedModal>
    </div>
  );
}

function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
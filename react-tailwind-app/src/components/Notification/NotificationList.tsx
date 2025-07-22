import React, { useState, useEffect } from 'react';
import { Notification, NotificationFilter, NotificationStats } from '../../types/notification';
import { NotificationService } from '../../services/notificationService';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Select } from '../Select';
import { Input } from '../Input';

interface NotificationListProps {
  onNotificationClick?: (notification: Notification) => void;
  onRefresh?: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  onNotificationClick,
  onRefresh
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationFilter>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    loadNotifications();
    loadStats();
  }, [filter, pagination.page]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getNotifications(
        filter,
        pagination.page,
        pagination.limit
      );
      setNotifications(response.notifications);
      setPagination(response.pagination);
    } catch (error) {
      console.error('알림 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await NotificationService.getNotificationStats();
      setStats(statsData);
    } catch (error) {
      console.error('알림 통계 로드 실패:', error);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await NotificationService.updateNotificationStatus(id, status);
      loadNotifications();
      onRefresh?.();
    } catch (error) {
      console.error('알림 상태 변경 실패:', error);
    }
  };

  const handleBulkAction = async (status: string) => {
    if (selectedIds.length === 0) return;
    
    try {
      await NotificationService.bulkUpdateNotifications(selectedIds, status);
      setSelectedIds([]);
      loadNotifications();
      onRefresh?.();
    } catch (error) {
      console.error('일괄 처리 실패:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return '🚨';
      case 'deadline':
        return '⏰';
      case 'missing':
        return '⚠️';
      case 'duplicate':
        return '🔄';
      case 'new':
        return '📢';
      case 'update':
        return '📝';
      default:
        return '📌';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'normal':
        return 'blue';
      case 'low':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'blue';
      case 'read':
        return 'gray';
      case 'important':
        return 'yellow';
      case 'completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">전체</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
            <div className="text-sm text-gray-600">미읽음</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <div className="text-sm text-gray-600">긴급</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
            <div className="text-sm text-gray-600">높음</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.normal}</div>
            <div className="text-sm text-gray-600">보통</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.low}</div>
            <div className="text-sm text-gray-600">낮음</div>
          </Card>
        </div>
      )}

      {/* 필터 */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="알림 유형"
            value={filter.type || ''}
            onChange={(value) => setFilter(prev => ({ ...prev, type: value || undefined }))}
            options={[
              { value: '', label: '전체' },
              { value: 'urgent', label: '긴급' },
              { value: 'deadline', label: '마감임박' },
              { value: 'missing', label: '누락' },
              { value: 'duplicate', label: '중복' },
              { value: 'new', label: '신규' },
              { value: 'update', label: '업데이트' }
            ]}
          />
          <Select
            label="상태"
            value={filter.status || ''}
            onChange={(value) => setFilter(prev => ({ ...prev, status: value || undefined }))}
            options={[
              { value: '', label: '전체' },
              { value: 'unread', label: '미읽음' },
              { value: 'read', label: '읽음' },
              { value: 'important', label: '중요' },
              { value: 'completed', label: '완료' }
            ]}
          />
          <Select
            label="우선순위"
            value={filter.priority || ''}
            onChange={(value) => setFilter(prev => ({ ...prev, priority: value || undefined }))}
            options={[
              { value: '', label: '전체' },
              { value: 'urgent', label: '긴급' },
              { value: 'high', label: '높음' },
              { value: 'normal', label: '보통' },
              { value: 'low', label: '낮음' }
            ]}
          />
          <div className="flex items-end">
            <Button onClick={loadNotifications} className="w-full">
              필터 적용
            </Button>
          </div>
        </div>
      </Card>

      {/* 일괄 처리 버튼 */}
      {selectedIds.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedIds.length}개 선택됨
            </span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('read')}
              >
                읽음 처리
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('important')}
              >
                중요 표시
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('completed')}
              >
                완료 처리
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 알림 목록 */}
      <Card>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">알림을 불러오는 중...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">알림이 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-4 p-4 border-b">
                <input
                  type="checkbox"
                  checked={selectedIds.length === notifications.length}
                  onChange={handleSelectAll}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">전체 선택</span>
              </div>
              
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                    notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <Badge color={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <Badge color={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </div>
                      
                      {notification.message && (
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      )}
                      
                      {notification.bidNtceNo && (
                        <p className="text-blue-600 text-sm mb-2">
                          공고번호: {notification.bidNtceNo}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNotificationClick?.(notification)}
                          >
                            상세보기
                          </Button>
                          
                          {notification.status === 'unread' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(notification.id, 'read')}
                            >
                              읽음 처리
                            </Button>
                          )}
                          
                          {notification.status !== 'important' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(notification.id, 'important')}
                            >
                              중요 표시
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 페이지네이션 */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    {pagination.total}개 중 {(pagination.page - 1) * pagination.limit + 1}-
                    {Math.min(pagination.page * pagination.limit, pagination.total)}개
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      이전
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      다음
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
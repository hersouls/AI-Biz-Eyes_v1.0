import React, { useState } from 'react';
import { Notification } from '../../types/notification';
import { NotificationService } from '../../services/notificationService';
import Card from '../Card';
import Button from '../Button';
import Badge from '../Badge';
import { AlertTriangle, Clock, AlertCircle, RefreshCw, Megaphone, Edit, MapPin, X } from 'lucide-react';

interface NotificationDetailProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: number, status: string) => void;
}

export const NotificationDetail: React.FC<NotificationDetailProps> = ({
  notification,
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !notification) return null;

  const handleStatusChange = async (status: string) => {
    try {
      setUpdating(true);
      await NotificationService.updateNotificationStatus(notification.id, status as 'unread' | 'read' | 'important' | 'completed');
      onStatusChange?.(notification.id, status);
      onClose();
    } catch (error) {
      console.error('알림 상태 변경 실패:', error);
      alert('알림 상태 변경에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="text-red-500" size={24} />;
      case 'deadline':
        return <Clock className="text-orange-500" size={24} />;
      case 'missing':
        return <AlertCircle className="text-yellow-500" size={24} />;
      case 'duplicate':
        return <RefreshCw className="text-blue-500" size={24} />;
      case 'new':
        return <Megaphone className="text-green-500" size={24} />;
      case 'update':
        return <Edit className="text-purple-500" size={24} />;
      default:
        return <MapPin className="text-gray-500" size={24} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      case 'normal':
        return 'primary';
      case 'low':
        return 'info';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'primary';
      case 'read':
        return 'gray';
      case 'important':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'gray';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent':
        return '긴급';
      case 'deadline':
        return '마감임박';
      case 'missing':
        return '누락';
      case 'duplicate':
        return '중복';
      case 'new':
        return '신규';
      case 'update':
        return '업데이트';
      default:
        return type;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '긴급';
      case 'high':
        return '높음';
      case 'normal':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread':
        return '미읽음';
      case 'read':
        return '읽음';
      case 'important':
        return '중요';
      case 'completed':
        return '완료';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {getNotificationIcon(notification.type)}
            <h2 className="text-xl font-semibold text-gray-900">알림 상세</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </div>

        {/* 알림 정보 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                <Badge variant={getPriorityColor(notification.priority)}>
                  {getPriorityLabel(notification.priority)}
                </Badge>
                <Badge variant={getStatusColor(notification.status)}>
                  {getStatusLabel(notification.status)}
                </Badge>
              </div>

              {notification.message && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">메시지</h4>
                  <p className="text-gray-600">{notification.message}</p>
                </div>
              )}

              {notification.bidNtceNo && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">관련 공고</h4>
                  <p className="text-blue-600 font-medium">공고번호: {notification.bidNtceNo}</p>
                </div>
              )}
            </div>
          </Card>

          {/* 메타 정보 */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">상세 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">알림 유형</label>
                <p className="text-gray-900">{getTypeLabel(notification.type)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">우선순위</label>
                <p className="text-gray-900">{getPriorityLabel(notification.priority)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">상태</label>
                <p className="text-gray-900">{getStatusLabel(notification.status)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">생성일시</label>
                <p className="text-gray-900">
                  {new Date(notification.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>
              {notification.readAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">읽은 일시</label>
                  <p className="text-gray-900">
                    {new Date(notification.readAt).toLocaleString('ko-KR')}
                  </p>
                </div>
              )}
              {notification.assignedTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">담당자</label>
                  <p className="text-gray-900">사용자 ID: {notification.assignedTo}</p>
                </div>
              )}
            </div>
          </Card>

          {/* 액션 버튼 */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">액션</h3>
            <div className="flex flex-wrap gap-2">
              {notification.status === 'unread' && (
                <Button
                  onClick={() => handleStatusChange('read')}
                  disabled={updating}
                  variant="outline"
                >
                  읽음 처리
                </Button>
              )}
              
              {notification.status !== 'important' && (
                <Button
                  onClick={() => handleStatusChange('important')}
                  disabled={updating}
                  variant="outline"
                >
                  중요 표시
                </Button>
              )}
              
              {notification.status !== 'completed' && (
                <Button
                  onClick={() => handleStatusChange('completed')}
                  disabled={updating}
                  variant="outline"
                >
                  완료 처리
                </Button>
              )}
              
              {notification.bidNtceNo && (
                <Button
                  onClick={() => {
                    // 공고 상세 페이지로 이동하는 로직
                    window.open(`/bids/${notification.bidNtceNo}`, '_blank');
                  }}
                  variant="outline"
                >
                  공고 상세보기
                </Button>
              )}
            </div>
          </Card>

          {/* 닫기 버튼 */}
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
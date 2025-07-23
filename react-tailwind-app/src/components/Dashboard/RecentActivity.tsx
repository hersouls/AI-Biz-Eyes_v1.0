import React from 'react';
import { 
  CalendarDays, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Eye,
  ExternalLink,
  Bell,
  FileText,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface RecentBid {
  id: string;
  bidNtceNo: string;
  bidNtceNm: string;
  ntceInsttNm: string;
  bidClseDate: string;
  status: 'urgent' | 'normal' | 'deadline' | 'new';
  asignBdgtAmt: number;
}

interface Notification {
  id: string;
  type: 'urgent' | 'deadline' | 'missing' | 'success';
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

interface AIRecommendation {
  id: string;
  bidNtceNo: string;
  bidNtceNm: string;
  matchScore: number;
  reason: string;
  institution: string;
}

const recentBids: RecentBid[] = [
  {
    id: '1',
    bidNtceNo: '20240101001',
    bidNtceNm: '스마트 공장 IoT 시스템 구축 사업',
    ntceInsttNm: '중소벤처기업부',
    bidClseDate: '2024-01-25',
    status: 'urgent',
    asignBdgtAmt: 5000000000
  },
  {
    id: '2',
    bidNtceNo: '20240101002',
    bidNtceNm: 'AI 기반 데이터 분석 플랫폼 개발',
    ntceInsttNm: '과학기술정보통신부',
    bidClseDate: '2024-01-30',
    status: 'new',
    asignBdgtAmt: 3500000000
  },
  {
    id: '3',
    bidNtceNo: '20240101003',
    bidNtceNm: '차세대 보안 솔루션 구축',
    ntceInsttNm: '국가정보원',
    bidClseDate: '2024-02-05',
    status: 'normal',
    asignBdgtAmt: 8000000000
  }
];

const notifications: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: '긴급 공고 알림',
    message: '마감 임박 공고 3건이 있습니다.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false
  },
  {
    id: '2',
    type: 'success',
    title: '제안서 제출 완료',
    message: 'IoT 시스템 구축 사업 제안서가 성공적으로 제출되었습니다.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '3',
    type: 'deadline',
    title: '마감일 알림',
    message: 'AI 플랫폼 개발 사업 마감까지 3일 남았습니다.',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isRead: false
  }
];

const aiRecommendations: AIRecommendation[] = [
  {
    id: '1',
    bidNtceNo: '20240101004',
    bidNtceNm: '블록체인 기반 전자문서 시스템',
    matchScore: 95,
    reason: '과거 유사 프로젝트 경험 및 기술 매칭도 높음',
    institution: '행정안전부'
  },
  {
    id: '2',
    bidNtceNo: '20240101005',
    bidNtceNm: '클라우드 인프라 구축 및 운영',
    matchScore: 88,
    reason: '클라우드 전문성 및 운영 경험 보유',
    institution: '기획재정부'
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    urgent: { color: 'bg-red-100 text-red-800', text: '긴급' },
    new: { color: 'bg-blue-100 text-blue-800', text: '신규' },
    deadline: { color: 'bg-yellow-100 text-yellow-800', text: '마감임박' },
    normal: { color: 'bg-gray-100 text-gray-800', text: '일반' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.normal;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function RecentActivity() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 최근 공고 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            최근 공고
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentBids.map((bid) => (
            <div key={bid.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <StatusBadge status={bid.status} />
                    <span className="text-sm text-gray-500">{bid.bidNtceNo}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {bid.bidNtceNm}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{bid.ntceInsttNm}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    마감: {bid.bidClseDate}
                  </div>
                  <p className="text-sm font-semibold text-green-600 mt-1">
                    {formatCurrency(bid.asignBdgtAmt)}
                  </p>
                </div>
                <div className="flex flex-col space-y-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                                          <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-gray-50 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            전체 공고 보기
          </button>
        </div>
      </div>

      {/* 알림 센터 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <Bell className="h-5 w-5 mr-2 text-yellow-600" />
            알림 센터
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-6 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'urgent' && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  {notification.type === 'success' && (
                                          <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {notification.type === 'deadline' && (
                                          <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: ko })}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-gray-50 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            모든 알림 보기
          </button>
        </div>
      </div>

      {/* AI 추천 공고 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-purple-600" />
            AI 추천 공고
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {aiRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      매칭도 {recommendation.matchScore}%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {recommendation.bidNtceNm}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{recommendation.institution}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {recommendation.reason}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-purple-700">
                  참여 검토
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-xs font-medium hover:bg-gray-50">
                  상세 보기
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-gray-50 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            더 많은 추천 보기
          </button>
        </div>
      </div>
    </div>
  );
}
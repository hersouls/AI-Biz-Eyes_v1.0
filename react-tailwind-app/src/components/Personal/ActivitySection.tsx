import React, { useState, useEffect } from 'react';
import { ClockIcon, EyeIcon, HandThumbUpIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { PersonalService } from '../../services/personalService';
import { UserActivity, UserPerformance } from '../../types/personal';

const actionLabels = {
  view_bid: '공고 조회',
  participate_bid: '공고 참여',
  add_reference: '레퍼런스 추가',
  view_report: '리포트 조회',
  update_settings: '설정 변경',
  export_data: '데이터 내보내기'
};

export const ActivitySection: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [performance, setPerformance] = useState<UserPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [activitiesResponse, performanceResponse] = await Promise.all([
        PersonalService.getUserActivities(currentPage, 10),
        PersonalService.getUserPerformance()
      ]);

      if (activitiesResponse.success && activitiesResponse.data) {
        setActivities(activitiesResponse.data.activities);
        setTotalPages(Math.ceil(activitiesResponse.data.total / 10));
      }

      if (performanceResponse.success && performanceResponse.data) {
        setPerformance(performanceResponse.data);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">활동 내역</h2>
        <p className="mt-1 text-gray-600">내 업무 활동과 성과를 확인할 수 있습니다.</p>
      </div>

      {/* Performance Summary */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <EyeIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">조회한 공고</p>
                <p className="text-2xl font-bold text-gray-900">{performance.totalBidsViewed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <HandThumbUpIcon className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">참여한 공고</p>
                <p className="text-2xl font-bold text-gray-900">{performance.totalBidsParticipated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <DocumentTextIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">추가한 레퍼런스</p>
                <p className="text-2xl font-bold text-gray-900">{performance.totalReferencesAdded}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">성공률</p>
                <p className="text-2xl font-bold text-gray-900">{performance.successRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">최근 활동</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {actionLabels[activity.action]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.ipAddress}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">활동 내역이 없습니다.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                페이지 {currentPage} / {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
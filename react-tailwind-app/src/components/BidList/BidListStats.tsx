import React from 'react';
import { FileText, Filter, CheckCircle } from 'lucide-react';

interface BidListStatsProps {
  totalCount: number;
  filteredCount: number;
  selectedCount: number;
}

export const BidListStats: React.FC<BidListStatsProps> = ({
  totalCount,
  filteredCount,
  selectedCount
}) => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 전체 공고 수 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">전체 공고</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 필터된 공고 수 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Filter className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">필터 결과</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredCount.toLocaleString()}
              </p>
              {totalCount > 0 && (
                <p className="text-xs text-gray-500">
                  {((filteredCount / totalCount) * 100).toFixed(1)}% 표시
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 선택된 공고 수 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">선택됨</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedCount.toLocaleString()}
              </p>
              {filteredCount > 0 && (
                <p className="text-xs text-gray-500">
                  {((selectedCount / filteredCount) * 100).toFixed(1)}% 선택
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 추가 통계 정보 */}
      {filteredCount > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">현재 페이지 통계</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">평균 예산:</span>
              <span className="ml-2 font-medium text-gray-900">
                {/* 실제 데이터로 계산 필요 */}
                계산 중...
              </span>
            </div>
            <div>
              <span className="text-gray-500">긴급공고:</span>
              <span className="ml-2 font-medium text-gray-900">
                {/* 실제 데이터로 계산 필요 */}
                계산 중...
              </span>
            </div>
            <div>
              <span className="text-gray-500">마감임박:</span>
              <span className="ml-2 font-medium text-gray-900">
                {/* 실제 데이터로 계산 필요 */}
                계산 중...
              </span>
            </div>
            <div>
              <span className="text-gray-500">신규공고:</span>
              <span className="ml-2 font-medium text-gray-900">
                {/* 실제 데이터로 계산 필요 */}
                계산 중...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
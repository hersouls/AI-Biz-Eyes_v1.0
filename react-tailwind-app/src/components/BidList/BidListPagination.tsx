import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BidListPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const BidListPagination: React.FC<BidListPaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const pageSizeOptions = [10, 20, 50, 100];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onPageSizeChange(newPageSize);
    onPageChange(1); // 페이지 크기 변경 시 첫 페이지로 이동
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            총 {totalCount.toLocaleString()}개 항목
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">페이지당:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
      {/* 페이지 정보 */}
      <div className="flex items-center text-sm text-gray-700">
        <span>
          {startItem.toLocaleString()} - {endItem.toLocaleString()} / {totalCount.toLocaleString()}개 항목
        </span>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center space-x-2">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
                          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* 페이지 번호들 */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
                          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* 페이지 크기 선택 */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">페이지당:</span>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
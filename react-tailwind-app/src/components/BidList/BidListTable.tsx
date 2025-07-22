import React from 'react';
import { ChevronUpIcon, ChevronDownIcon, EyeIcon, ClipboardDocumentIcon, UserGroupIcon, BellIcon } from '@heroicons/react/24/outline';
import { BidData } from '../../types/bid';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';

interface BidListTableProps {
  bids: BidData[];
  loading: boolean;
  selectedBids: string[];
  onSelectBid: (bidNo: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onQuickAction: (action: string, bidNo: string) => void;
}

export const BidListTable: React.FC<BidListTableProps> = ({
  bids,
  loading,
  selectedBids,
  onSelectBid,
  onSelectAll,
  onSort,
  sortBy,
  sortOrder,
  onQuickAction
}) => {
  const isAllSelected = bids.length > 0 && selectedBids.length === bids.length;
  const isIndeterminate = selectedBids.length > 0 && selectedBids.length < bids.length;

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4 text-blue-500" /> : 
      <ChevronDownIcon className="h-4 w-4 text-blue-500" />;
  };

  const handleSort = (field: string) => {
    onSort(field);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Checkbox */}
            <th scope="col" className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </th>

            {/* 공고번호 */}
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('bidNtceNo')}
            >
              <div className="flex items-center space-x-1">
                <span>공고번호</span>
                {renderSortIcon('bidNtceNo')}
              </div>
            </th>

            {/* 공고명 */}
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('bidNtceNm')}
            >
              <div className="flex items-center space-x-1">
                <span>공고명</span>
                {renderSortIcon('bidNtceNm')}
              </div>
            </th>

            {/* 공고기관명 */}
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('ntceInsttNm')}
            >
              <div className="flex items-center space-x-1">
                <span>공고기관</span>
                {renderSortIcon('ntceInsttNm')}
              </div>
            </th>

            {/* 업무구분 */}
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('bsnsDivNm')}
            >
              <div className="flex items-center space-x-1">
                <span>업무구분</span>
                {renderSortIcon('bsnsDivNm')}
              </div>
            </th>

            {/* 상태 */}
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('bidNtceSttusNm')}
            >
              <div className="flex items-center space-x-1">
                <span>상태</span>
                {renderSortIcon('bidNtceSttusNm')}
              </div>
            </th>

            {/* 공고일자 */}
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('bidNtceDate')}
            >
              <div className="flex items-center space-x-1">
                <span>공고일자</span>
                {renderSortIcon('bidNtceDate')}
              </div>
            </th>

            {/* 마감일자 */}
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('bidClseDate')}
            >
              <div className="flex items-center space-x-1">
                <span>마감일자</span>
                {renderSortIcon('bidClseDate')}
              </div>
            </th>

            {/* 예산금액 */}
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('asignBdgtAmt')}
            >
              <div className="flex items-center space-x-1">
                <span>예산금액</span>
                {renderSortIcon('asignBdgtAmt')}
              </div>
            </th>

            {/* 빠른 액션 */}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              액션
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bids.map((bid) => (
            <tr 
              key={bid.bidNtceNo} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onQuickAction('detail', bid.bidNtceNo)}
            >
              {/* Checkbox */}
              <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedBids.includes(bid.bidNtceNo)}
                  onChange={(e) => onSelectBid(bid.bidNtceNo, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </td>

              {/* 공고번호 */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {bid.bidNtceNo}
              </td>

              {/* 공고명 */}
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="max-w-xs">
                  <div className="font-medium text-gray-900 truncate" title={bid.bidNtceNm}>
                    {bid.bidNtceNm}
                  </div>
                  {bid.bidNtceOrd && bid.bidNtceOrd > 1 && (
                    <div className="text-xs text-gray-500">
                      {bid.bidNtceOrd}차 공고
                    </div>
                  )}
                </div>
              </td>

              {/* 공고기관명 */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">{bid.ntceInsttNm}</div>
                  {bid.dmndInsttNm && bid.dmndInsttNm !== bid.ntceInsttNm && (
                    <div className="text-xs text-gray-500">
                      수요: {bid.dmndInsttNm}
                    </div>
                  )}
                </div>
              </td>

              {/* 업무구분 */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {bid.bsnsDivNm}
                </span>
              </td>

              {/* 상태 */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getStatusBadge(bid.bidNtceSttusNm)}
              </td>

              {/* 공고일자 */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(bid.bidNtceDate)}
              </td>

              {/* 마감일자 */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">{formatDate(bid.bidClseDate)}</div>
                  {bid.bidClseTm && (
                    <div className="text-xs text-gray-500">
                      {bid.bidClseTm}
                    </div>
                  )}
                </div>
              </td>

              {/* 예산금액 */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">
                    {bid.asignBdgtAmt ? formatCurrency(bid.asignBdgtAmt) : '-'}
                  </div>
                  {bid.presmptPrce && bid.presmptPrce !== bid.asignBdgtAmt && (
                    <div className="text-xs text-gray-500">
                      추정: {formatCurrency(bid.presmptPrce)}
                    </div>
                  )}
                </div>
              </td>

              {/* 빠른 액션 */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onQuickAction('detail', bid.bidNtceNo)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="상세보기"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  {bid.bidNtceUrl && (
                    <button
                      onClick={() => window.open(bid.bidNtceUrl, '_blank')}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="원문 바로가기"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onQuickAction('reference', bid.bidNtceNo)}
                    className="text-purple-600 hover:text-purple-900 p-1 rounded"
                    title="레퍼런스 매칭"
                  >
                    <UserGroupIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => onQuickAction('participate', bid.bidNtceNo)}
                    className="text-orange-600 hover:text-orange-900 p-1 rounded"
                    title="참여판단"
                  >
                    <BellIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bids.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">공고가 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">
              검색 조건을 변경하거나 필터를 조정해보세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
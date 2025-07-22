import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon, EyeIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { BidListTable } from './BidListTable';
import { BidListFilter } from './BidListFilter';
import { BidListStats } from './BidListStats';
import { BidListPagination } from './BidListPagination';
import { useBidList } from '../../hooks/useBidList';
import { BidData } from '../../types/bid';

export const BidList: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    status: '',
    budgetRange: { min: '', max: '' },
    institution: '',
    businessType: '',
    region: '',
    contractType: '',
    biddingType: ''
  });
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('bidNtceDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { 
    bids, 
    loading, 
    error, 
    totalCount, 
    fetchBids,
    exportBids 
  } = useBidList();

  useEffect(() => {
    fetchBids({
      page: currentPage,
      pageSize,
      searchKeyword,
      filters,
      sortBy,
      sortOrder
    });
  }, [currentPage, pageSize, searchKeyword, filters, sortBy, sortOrder]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectBid = (bidNo: string, selected: boolean) => {
    if (selected) {
      setSelectedBids(prev => [...prev, bidNo]);
    } else {
      setSelectedBids(prev => prev.filter(id => id !== bidNo));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedBids(bids.map(bid => bid.bidNtceNo));
    } else {
      setSelectedBids([]);
    }
  };

  const handleExport = async (format: 'excel' | 'csv') => {
    if (selectedBids.length === 0) {
      alert('내보낼 공고를 선택해주세요.');
      return;
    }
    await exportBids(selectedBids, format);
  };

  const handleQuickAction = (action: string, bidNo: string) => {
    switch (action) {
      case 'detail':
        window.open(`/bid-detail/${bidNo}`, '_blank');
        break;
      case 'reference':
        window.open(`/reference-match/${bidNo}`, '_blank');
        break;
      case 'participate':
        window.open(`/participate/${bidNo}`, '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">공고 리스트</h1>
          <p className="mt-2 text-gray-600">
            나라장터 OpenAPI 연동 공고 목록 - 실시간 업데이트
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="공고명, 기관명, 업무구분으로 검색..."
                  value={searchKeyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Button */}
            <div className="flex gap-2">
              <button
                onClick={() => document.getElementById('filter-drawer')?.classList.toggle('hidden')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                필터
              </button>

              {/* Export Button */}
              {selectedBids.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => document.getElementById('export-dropdown')?.classList.toggle('hidden')}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    내보내기 ({selectedBids.length})
                  </button>
                  
                  {/* Export Dropdown */}
                  <div id="export-dropdown" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport('excel')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Excel (.xlsx)
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        CSV (.csv)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Drawer */}
          <div id="filter-drawer" className="hidden mt-6 pt-6 border-t border-gray-200">
            <BidListFilter
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Statistics */}
        <BidListStats
          totalCount={totalCount}
          filteredCount={bids.length}
          selectedCount={selectedBids.length}
        />

        {/* Bid List Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <BidListTable
            bids={bids}
            loading={loading}
            selectedBids={selectedBids}
            onSelectBid={handleSelectBid}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onQuickAction={handleQuickAction}
          />
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <BidListPagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  데이터 로드 중 오류가 발생했습니다
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => fetchBids({
                      page: currentPage,
                      pageSize,
                      searchKeyword,
                      filters,
                      sortBy,
                      sortOrder
                    })}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
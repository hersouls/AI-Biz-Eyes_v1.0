import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BidListFilterProps {
  filters: {
    dateRange: { start: string; end: string };
    status: string;
    budgetRange: { min: string; max: string };
    institution: string;
    businessType: string;
    region: string;
    contractType: string;
    biddingType: string;
  };
  onFilterChange: (filters: any) => void;
}

export const BidListFilter: React.FC<BidListFilterProps> = ({
  filters,
  onFilterChange
}) => {
  const statusOptions = [
    { value: '', label: '전체' },
    { value: '일반공고', label: '일반공고' },
    { value: '긴급공고', label: '긴급공고' },
    { value: '정정공고', label: '정정공고' },
    { value: '재공고', label: '재공고' },
    { value: '취소공고', label: '취소공고' }
  ];

  const businessTypeOptions = [
    { value: '', label: '전체' },
    { value: '공사', label: '공사' },
    { value: '용역', label: '용역' },
    { value: '물품', label: '물품' },
    { value: '기타', label: '기타' }
  ];

  const regionOptions = [
    { value: '', label: '전체' },
    { value: '서울특별시', label: '서울특별시' },
    { value: '부산광역시', label: '부산광역시' },
    { value: '대구광역시', label: '대구광역시' },
    { value: '인천광역시', label: '인천광역시' },
    { value: '광주광역시', label: '광주광역시' },
    { value: '대전광역시', label: '대전광역시' },
    { value: '울산광역시', label: '울산광역시' },
    { value: '세종특별자치시', label: '세종특별자치시' },
    { value: '경기도', label: '경기도' },
    { value: '강원도', label: '강원도' },
    { value: '충청북도', label: '충청북도' },
    { value: '충청남도', label: '충청남도' },
    { value: '전라북도', label: '전라북도' },
    { value: '전라남도', label: '전라남도' },
    { value: '경상북도', label: '경상북도' },
    { value: '경상남도', label: '경상남도' },
    { value: '제주특별자치도', label: '제주특별자치도' }
  ];

  const contractTypeOptions = [
    { value: '', label: '전체' },
    { value: '일반계약', label: '일반계약' },
    { value: '공동계약', label: '공동계약' },
    { value: '단가계약', label: '단가계약' },
    { value: '수량계약', label: '수량계약' }
  ];

  const biddingTypeOptions = [
    { value: '', label: '전체' },
    { value: '전자입찰', label: '전자입찰' },
    { value: '일반입찰', label: '일반입찰' },
    { value: '국제입찰', label: '국제입찰' }
  ];

  const handleFilterChange = (key: string, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: value
      }
    });
  };

  const handleBudgetRangeChange = (type: 'min' | 'max', value: string) => {
    onFilterChange({
      ...filters,
      budgetRange: {
        ...filters.budgetRange,
        [type]: value
      }
    });
  };

  const clearFilters = () => {
    onFilterChange({
      dateRange: { start: '', end: '' },
      status: '',
      budgetRange: { min: '', max: '' },
      institution: '',
      businessType: '',
      region: '',
      contractType: '',
      biddingType: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (typeof value === 'object') {
      return Object.values(value).some(v => v !== '');
    }
    return value !== '';
  });

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">필터 옵션</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            필터 초기화
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 기간 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공고 기간
          </label>
          <div className="space-y-2">
            <div>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="시작일"
              />
            </div>
            <div>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="종료일"
              />
            </div>
          </div>
        </div>

        {/* 상태 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공고 상태
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 업무구분 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            업무구분
          </label>
          <select
            value={filters.businessType}
            onChange={(e) => handleFilterChange('businessType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {businessTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 예산범위 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            예산범위 (만원)
          </label>
          <div className="space-y-2">
            <div>
              <input
                type="number"
                value={filters.budgetRange.min}
                onChange={(e) => handleBudgetRangeChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="최소 예산"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.budgetRange.max}
                onChange={(e) => handleBudgetRangeChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="최대 예산"
              />
            </div>
          </div>
        </div>

        {/* 기관명 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기관명
          </label>
          <input
            type="text"
            value={filters.institution}
            onChange={(e) => handleFilterChange('institution', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="기관명 입력"
          />
        </div>

        {/* 지역 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            지역
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {regionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 계약형태 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계약형태
          </label>
          <select
            value={filters.contractType}
            onChange={(e) => handleFilterChange('contractType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {contractTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 입찰방식 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            입찰방식
          </label>
          <select
            value={filters.biddingType}
            onChange={(e) => handleFilterChange('biddingType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {biddingTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">적용된 필터:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.dateRange.start && filters.dateRange.end && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                기간: {filters.dateRange.start} ~ {filters.dateRange.end}
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                상태: {filters.status}
              </span>
            )}
            {filters.businessType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                업무구분: {filters.businessType}
              </span>
            )}
            {filters.institution && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                기관: {filters.institution}
              </span>
            )}
            {filters.region && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                지역: {filters.region}
              </span>
            )}
            {(filters.budgetRange.min || filters.budgetRange.max) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                예산: {filters.budgetRange.min || '0'} ~ {filters.budgetRange.max || '∞'} 만원
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
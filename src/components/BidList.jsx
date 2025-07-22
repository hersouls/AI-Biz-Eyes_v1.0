import React, { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  EyeIcon,
  BellIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

// Mock 데이터
const mockBids = [
  {
    id: '20240100001',
    bidNtceNo: '20240100001',
    bidNtceNm: 'AI 기반 스마트시티 구축 사업',
    ntceInsttNm: '과학기술정보통신부',
    dmndInsttNm: '한국정보통신기술협회',
    bsnsDivNm: '용역',
    bidNtceSttusNm: '일반공고',
    bidNtceDate: '2024-01-15',
    bidClseDate: '2024-02-15',
    asignBdgtAmt: '2500000000',
    presmptPrce: '2300000000',
    elctrnBidYn: 'Y',
    intrntnlBidYn: 'N',
    cmmnCntrctYn: 'N',
    cntrctCnclsSttusNm: '계약체결대기',
    cntrctCnclsMthdNm: '일반입찰',
    bidwinrDcsnMthdNm: '최저가결정',
    rgnLmtYn: 'N',
    indstrytyLmtYn: 'N',
    bidNtceUrl: 'https://www.g2b.go.kr:8101/ep/main/main.do',
    internalStatus: '검토중',
    priority: 'high',
    similarity: 95,
  },
  {
    id: '20240100002',
    bidNtceNo: '20240100002',
    bidNtceNm: '클라우드 인프라 구축 용역',
    ntceInsttNm: '조달청',
    dmndInsttNm: '한국정보통신기술협회',
    bsnsDivNm: '용역',
    bidNtceSttusNm: '긴급공고',
    bidNtceDate: '2024-01-16',
    bidClseDate: '2024-02-18',
    asignBdgtAmt: '1800000000',
    presmptPrce: '1650000000',
    elctrnBidYn: 'Y',
    intrntnlBidYn: 'N',
    cmmnCntrctYn: 'Y',
    cntrctCnclsSttusNm: '계약체결대기',
    cntrctCnclsMthdNm: '전자입찰',
    bidwinrDcsnMthdNm: '최저가결정',
    rgnLmtYn: 'N',
    indstrytyLmtYn: 'N',
    bidNtceUrl: 'https://www.g2b.go.kr:8101/ep/main/main.do',
    internalStatus: '참여예정',
    priority: 'urgent',
    similarity: 88,
  },
  {
    id: '20240100003',
    bidNtceNo: '20240100003',
    bidNtceNm: '데이터센터 보안시스템 구축',
    ntceInsttNm: '산업통상자원부',
    dmndInsttNm: '한국정보통신기술협회',
    bsnsDivNm: '공사',
    bidNtceSttusNm: '일반공고',
    bidNtceDate: '2024-01-17',
    bidClseDate: '2024-02-20',
    asignBdgtAmt: '3200000000',
    presmptPrce: '2950000000',
    elctrnBidYn: 'Y',
    intrntnlBidYn: 'N',
    cmmnCntrctYn: 'N',
    cntrctCnclsSttusNm: '계약체결대기',
    cntrctCnclsMthdNm: '일반입찰',
    bidwinrDcsnMthdNm: '최저가결정',
    rgnLmtYn: 'Y',
    indstrytyLmtYn: 'N',
    bidNtceUrl: 'https://www.g2b.go.kr:8101/ep/main/main.do',
    internalStatus: '미검토',
    priority: 'normal',
    similarity: 82,
  },
  {
    id: '20240100004',
    bidNtceNo: '20240100004',
    bidNtceNm: '블록체인 기반 디지털 자산 관리 시스템',
    ntceInsttNm: '금융위원회',
    dmndInsttNm: '한국정보통신기술협회',
    bsnsDivNm: '용역',
    bidNtceSttusNm: '일반공고',
    bidNtceDate: '2024-01-18',
    bidClseDate: '2024-02-25',
    asignBdgtAmt: '1500000000',
    presmptPrce: '1350000000',
    elctrnBidYn: 'Y',
    intrntnlBidYn: 'N',
    cmmnCntrctYn: 'N',
    cntrctCnclsSttusNm: '계약체결대기',
    cntrctCnclsMthdNm: '일반입찰',
    bidwinrDcsnMthdNm: '최저가결정',
    rgnLmtYn: 'N',
    indstrytyLmtYn: 'N',
    bidNtceUrl: 'https://www.g2b.go.kr:8101/ep/main/main.do',
    internalStatus: '거절',
    priority: 'low',
    similarity: 45,
  },
  {
    id: '20240100005',
    bidNtceNo: '20240100005',
    bidNtceNm: 'IoT 센서 네트워크 구축 사업',
    ntceInsttNm: '환경부',
    dmndInsttNm: '한국정보통신기술협회',
    bsnsDivNm: '물품',
    bidNtceSttusNm: '일반공고',
    bidNtceDate: '2024-01-19',
    bidClseDate: '2024-02-28',
    asignBdgtAmt: '800000000',
    presmptPrce: '720000000',
    elctrnBidYn: 'Y',
    intrntnlBidYn: 'N',
    cmmnCntrctYn: 'N',
    cntrctCnclsSttusNm: '계약체결대기',
    cntrctCnclsMthdNm: '일반입찰',
    bidwinrDcsnMthdNm: '최저가결정',
    rgnLmtYn: 'N',
    indstrytyLmtYn: 'N',
    bidNtceUrl: 'https://www.g2b.go.kr:8101/ep/main/main.do',
    internalStatus: '확정',
    priority: 'medium',
    similarity: 78,
  },
]

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: '일반공고', label: '일반공고' },
  { value: '긴급공고', label: '긴급공고' },
  { value: '정정공고', label: '정정공고' },
  { value: '재공고', label: '재공고' },
  { value: '취소', label: '취소' },
]

const businessTypeOptions = [
  { value: 'all', label: '전체' },
  { value: '공사', label: '공사' },
  { value: '용역', label: '용역' },
  { value: '물품', label: '물품' },
  { value: '연구', label: '연구' },
]

const internalStatusOptions = [
  { value: 'all', label: '전체' },
  { value: '미검토', label: '미검토' },
  { value: '검토중', label: '검토중' },
  { value: '참여예정', label: '참여예정' },
  { value: '확정', label: '확정' },
  { value: '거절', label: '거절' },
]

function BidList() {
  const [bids, setBids] = useState(mockBids)
  const [filteredBids, setFilteredBids] = useState(mockBids)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    businessType: 'all',
    internalStatus: 'all',
    dateRange: 'all',
    budgetRange: 'all',
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedBids, setSelectedBids] = useState([])

  // 검색 및 필터링
  useEffect(() => {
    let filtered = [...bids]

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(bid =>
        bid.bidNtceNm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.ntceInsttNm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.bsnsDivNm.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 상태 필터링
    if (filters.status !== 'all') {
      filtered = filtered.filter(bid => bid.bidNtceSttusNm === filters.status)
    }

    // 업무구분 필터링
    if (filters.businessType !== 'all') {
      filtered = filtered.filter(bid => bid.bsnsDivNm === filters.businessType)
    }

    // 내부상태 필터링
    if (filters.internalStatus !== 'all') {
      filtered = filtered.filter(bid => bid.internalStatus === filters.internalStatus)
    }

    setFilteredBids(filtered)
    setCurrentPage(1)
  }, [bids, searchQuery, filters])

  // 정렬
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sorted = [...filteredBids].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1
      } else {
        return a[key] < b[key] ? 1 : -1
      }
    })
    setFilteredBids(sorted)
  }

  // 페이징
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBids = filteredBids.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBids.length / itemsPerPage)

  // 선택된 공고 관리
  const handleSelectBid = (bidId) => {
    setSelectedBids(prev =>
      prev.includes(bidId)
        ? prev.filter(id => id !== bidId)
        : [...prev, bidId]
    )
  }

  const handleSelectAll = () => {
    if (selectedBids.length === currentBids.length) {
      setSelectedBids([])
    } else {
      setSelectedBids(currentBids.map(bid => bid.id))
    }
  }

  // 포맷팅 함수들
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      '일반공고': { color: 'bg-blue-100 text-blue-800', icon: DocumentTextIcon },
      '긴급공고': { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
      '정정공고': { color: 'bg-yellow-100 text-yellow-800', icon: DocumentDuplicateIcon },
      '재공고': { color: 'bg-purple-100 text-purple-800', icon: DocumentDuplicateIcon },
      '취소': { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon },
    }

    const config = statusConfig[status] || statusConfig['일반공고']
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    )
  }

  const getInternalStatusBadge = (status) => {
    const statusConfig = {
      '미검토': { color: 'bg-gray-100 text-gray-800' },
      '검토중': { color: 'bg-blue-100 text-blue-800' },
      '참여예정': { color: 'bg-green-100 text-green-800' },
      '확정': { color: 'bg-purple-100 text-purple-800' },
      '거절': { color: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status] || statusConfig['미검토']

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {status}
      </span>
    )
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
      case 'high':
        return <ClockIcon className="w-4 h-4 text-orange-500" />
      case 'medium':
        return <CheckCircleIcon className="w-4 h-4 text-blue-500" />
      case 'low':
        return <CheckCircleIcon className="w-4 h-4 text-gray-400" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">공고 리스트</h1>
          <p className="text-gray-600">전체 {filteredBids.length}건의 공고</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Excel 내보내기
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            신규 공고 추가
          </button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 검색 */}
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="공고명, 기관명, 업무구분으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 상태 필터 */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* 업무구분 필터 */}
          <div>
            <select
              value={filters.businessType}
              onChange={(e) => setFilters(prev => ({ ...prev, businessType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {businessTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 고급 필터 */}
        <div className="mt-4">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>고급 필터</span>
            {showAdvancedFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>

          {showAdvancedFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내부 상태</label>
                <select
                  value={filters.internalStatus}
                  onChange={(e) => setFilters(prev => ({ ...prev, internalStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {internalStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기간</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체</option>
                  <option value="today">오늘</option>
                  <option value="week">이번 주</option>
                  <option value="month">이번 달</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예산 범위</label>
                <select
                  value={filters.budgetRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, budgetRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체</option>
                  <option value="under1b">10억 미만</option>
                  <option value="1b-5b">10억~50억</option>
                  <option value="5b-10b">50억~100억</option>
                  <option value="over10b">100억 이상</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 테이블 툴바 */}
      {selectedBids.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedBids.length}건 선택됨
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                일괄 알림 설정
              </button>
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                일괄 내보내기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공고 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBids.length === currentBids.length && currentBids.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  우선순위
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('bidNtceNo')}
                >
                  공고번호
                  {sortConfig.key === 'bidNtceNo' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('bidNtceNm')}
                >
                  공고명
                  {sortConfig.key === 'bidNtceNm' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  공고기관
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  업무구분
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('bidClseDate')}
                >
                  마감일
                  {sortConfig.key === 'bidClseDate' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('asignBdgtAmt')}
                >
                  예산
                  {sortConfig.key === 'asignBdgtAmt' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  내부상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유사도
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedBids.includes(bid.id)}
                      onChange={() => handleSelectBid(bid.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityIcon(bid.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bid.bidNtceNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{bid.bidNtceNm}</div>
                    <div className="text-sm text-gray-500">{bid.dmndInsttNm}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bid.ntceInsttNm}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bid.bsnsDivNm}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(bid.bidNtceSttusNm)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(bid.bidClseDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(bid.asignBdgtAmt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getInternalStatusBadge(bid.internalStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${bid.similarity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{bid.similarity}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <BellIcon className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              다음
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                {' '}~{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredBids.length)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{filteredBids.length}</span>
                {' '}결과
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  다음
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BidList
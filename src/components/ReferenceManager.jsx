import React, { useState, useEffect } from 'react'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

// Mock 데이터
const mockReferences = [
  {
    id: 1,
    title: '스마트시티 플랫폼 구축 사업',
    institution: '서울특별시',
    year: '2023',
    amount: '15000000000',
    status: '성공',
    category: '용역',
    description: 'AI 기반 스마트시티 플랫폼 구축 및 운영',
    technologies: ['AI/ML', 'IoT', '클라우드', '빅데이터'],
    teamSize: 15,
    duration: '18개월',
    similarity: 92,
    documents: [
      { name: '제안서.pdf', type: 'pdf' },
      { name: '계약서.pdf', type: 'pdf' },
      { name: '최종보고서.pdf', type: 'pdf' },
    ],
  },
  {
    id: 2,
    title: 'AI 기반 교통관리 시스템',
    institution: '부산광역시',
    year: '2022',
    amount: '8000000000',
    status: '성공',
    category: '용역',
    description: '실시간 교통 데이터 분석 및 신호 제어 시스템',
    technologies: ['AI/ML', '실시간처리', '센서네트워크'],
    teamSize: 8,
    duration: '12개월',
    similarity: 88,
    documents: [
      { name: '기술제안서.pdf', type: 'pdf' },
      { name: '사용자매뉴얼.pdf', type: 'pdf' },
    ],
  },
  {
    id: 3,
    title: 'IoT 센서 네트워크 구축',
    institution: '대구광역시',
    year: '2023',
    amount: '12000000000',
    status: '진행중',
    category: '공사',
    description: '도시 전역 IoT 센서 인프라 구축',
    technologies: ['IoT', '센서네트워크', '데이터수집'],
    teamSize: 12,
    duration: '24개월',
    similarity: 85,
    documents: [
      { name: '사업계획서.pdf', type: 'pdf' },
      { name: '설계도면.dwg', type: 'dwg' },
    ],
  },
  {
    id: 4,
    title: '블록체인 기반 디지털 자산 관리',
    institution: '금융위원회',
    year: '2022',
    amount: '5000000000',
    status: '실패',
    category: '용역',
    description: '블록체인 기술을 활용한 디지털 자산 관리 시스템',
    technologies: ['블록체인', '스마트컨트랙트', '암호화'],
    teamSize: 6,
    duration: '9개월',
    similarity: 45,
    documents: [
      { name: '기술검토보고서.pdf', type: 'pdf' },
    ],
  },
  {
    id: 5,
    title: '클라우드 인프라 구축',
    institution: '조달청',
    year: '2023',
    amount: '25000000000',
    status: '성공',
    category: '용역',
    description: '정부 클라우드 인프라 구축 및 마이그레이션',
    technologies: ['클라우드', '가상화', '보안', '백업'],
    teamSize: 20,
    duration: '30개월',
    similarity: 78,
    documents: [
      { name: '인프라설계서.pdf', type: 'pdf' },
      { name: '보안가이드.pdf', type: 'pdf' },
      { name: '운영매뉴얼.pdf', type: 'pdf' },
    ],
  },
]

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: '성공', label: '성공' },
  { value: '진행중', label: '진행중' },
  { value: '실패', label: '실패' },
]

const categoryOptions = [
  { value: 'all', label: '전체' },
  { value: '공사', label: '공사' },
  { value: '용역', label: '용역' },
  { value: '물품', label: '물품' },
  { value: '연구', label: '연구' },
]

const yearOptions = [
  { value: 'all', label: '전체' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
]

function ReferenceManager() {
  const [references, setReferences] = useState(mockReferences)
  const [filteredReferences, setFilteredReferences] = useState(mockReferences)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    year: 'all',
    amountRange: 'all',
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedReferences, setSelectedReferences] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)

  // 검색 및 필터링
  useEffect(() => {
    let filtered = [...references]

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(ref =>
        ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 상태 필터링
    if (filters.status !== 'all') {
      filtered = filtered.filter(ref => ref.status === filters.status)
    }

    // 카테고리 필터링
    if (filters.category !== 'all') {
      filtered = filtered.filter(ref => ref.category === filters.category)
    }

    // 연도 필터링
    if (filters.year !== 'all') {
      filtered = filtered.filter(ref => ref.year === filters.year)
    }

    setFilteredReferences(filtered)
    setCurrentPage(1)
  }, [references, searchQuery, filters])

  // 정렬
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sorted = [...filteredReferences].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1
      } else {
        return a[key] < b[key] ? 1 : -1
      }
    })
    setFilteredReferences(sorted)
  }

  // 페이징
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentReferences = filteredReferences.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReferences.length / itemsPerPage)

  // 선택된 레퍼런스 관리
  const handleSelectReference = (refId) => {
    setSelectedReferences(prev =>
      prev.includes(refId)
        ? prev.filter(id => id !== refId)
        : [...prev, refId]
    )
  }

  const handleSelectAll = () => {
    if (selectedReferences.length === currentReferences.length) {
      setSelectedReferences([])
    } else {
      setSelectedReferences(currentReferences.map(ref => ref.id))
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      '성공': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      '진행중': { color: 'bg-blue-100 text-blue-800', icon: ChartBarIcon },
      '실패': { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
    }

    const config = statusConfig[status] || statusConfig['진행중']
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    )
  }

  // 통계 계산
  const calculateStats = () => {
    const total = references.length
    const success = references.filter(ref => ref.status === '성공').length
    const inProgress = references.filter(ref => ref.status === '진행중').length
    const failed = references.filter(ref => ref.status === '실패').length
    const totalAmount = references.reduce((sum, ref) => sum + parseInt(ref.amount), 0)

    return {
      total,
      success,
      inProgress,
      failed,
      totalAmount,
      successRate: total > 0 ? Math.round((success / total) * 100) : 0,
    }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">레퍼런스 관리</h1>
          <p className="text-gray-600">내부 참여 이력 및 성과 관리</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            레퍼런스 추가
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Excel 내보내기
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 레퍼런스</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">성공률</p>
              <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              성공: {stats.success}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">진행중</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">실패</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <XCircleIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 사업금액</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-purple-500" />
          </div>
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
                placeholder="레퍼런스명, 기관명, 설명으로 검색..."
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

          {/* 카테고리 필터 */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map(option => (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">연도</label>
                <select
                  value={filters.year}
                  onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {yearOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사업금액 범위</label>
                <select
                  value={filters.amountRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, amountRange: e.target.value }))}
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
      {selectedReferences.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedReferences.length}건 선택됨
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                일괄 편집
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                일괄 삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 레퍼런스 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReferences.length === currentReferences.length && currentReferences.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  레퍼런스명
                  {sortConfig.key === 'title' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기관
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('year')}
                >
                  연도
                  {sortConfig.key === 'year' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  사업금액
                  {sortConfig.key === 'amount' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기술스택
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReferences.map((ref) => (
                <tr key={ref.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedReferences.includes(ref.id)}
                      onChange={() => handleSelectReference(ref.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ref.title}</div>
                    <div className="text-sm text-gray-500">{ref.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ref.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ref.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(ref.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ref.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(ref.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {ref.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tech}
                        </span>
                      ))}
                      {ref.technologies.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{ref.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-4 h-4" />
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
                  {Math.min(currentPage * itemsPerPage, filteredReferences.length)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{filteredReferences.length}</span>
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

export default ReferenceManager
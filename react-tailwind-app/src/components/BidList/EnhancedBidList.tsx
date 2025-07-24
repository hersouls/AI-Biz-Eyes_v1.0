import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
  Plus,
  RefreshCw
} from 'lucide-react';
import { AdvancedCard, AdvancedButton, AdvancedInput, AdvancedTable, AdvancedModal } from '../ui';
import { useBidList } from '../../hooks/useG2BApi';
import { BidInfo } from '../../services/g2bApiService';

// 조달청 API 데이터를 기존 UI에 맞게 변환하는 함수
const transformBidData = (bid: BidInfo) => {
  // 예산 정보 파싱 및 포맷팅
  const budget = bid.presmptPrce ? `${parseInt(bid.presmptPrce).toLocaleString()}원` : '미정';
  
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };
  
  // 마감일까지 남은 일수 계산
  const getDaysUntilDeadline = (dateString: string) => {
    if (!dateString) return 0;
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // 상태 판단 (마감일 기준)
  const getStatus = (dateString: string) => {
    const daysLeft = getDaysUntilDeadline(dateString);
    if (daysLeft < 0) return '마감';
    if (daysLeft <= 3) return '마감임박';
    return '접수중';
  };
  
  // 우선순위 판단 (예산 기준)
  const getPriority = (price: string) => {
    if (!price) return 'low';
    const numPrice = parseInt(price);
    if (numPrice >= 1000000000) return 'high'; // 10억 이상
    if (numPrice >= 100000000) return 'medium'; // 1억 이상
    return 'low';
  };
  
  // 카테고리 추정 (공고명 기준)
  const getCategory = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('it') || lowerTitle.includes('소프트웨어') || lowerTitle.includes('시스템')) return 'IT/소프트웨어';
    if (lowerTitle.includes('제조') || lowerTitle.includes('공장') || lowerTitle.includes('설비')) return '제조업';
    if (lowerTitle.includes('바이오') || lowerTitle.includes('의료') || lowerTitle.includes('헬스')) return '바이오/헬스케어';
    if (lowerTitle.includes('에너지') || lowerTitle.includes('환경') || lowerTitle.includes('친환경')) return '에너지/환경';
    return '기타';
  };

  return {
    id: bid.bidNtceNo,
    title: bid.bidNtceNm,
    organization: bid.dminsttNm,
    budget: budget,
    deadline: formatDate(bid.opengDt),
    location: '전국', // 조달청 API에는 지역 정보가 없으므로 기본값
    status: getStatus(bid.opengDt),
    participants: Math.floor(Math.random() * 50) + 10, // Mock 데이터 (실제로는 API에서 제공하지 않음)
    category: getCategory(bid.bidNtceNm),
    priority: getPriority(bid.presmptPrce),
    originalData: bid // 원본 데이터 보존
  };
};

const statusColors: Record<string, string> = {
  '접수중': 'bg-green-100 text-green-800',
  '마감임박': 'bg-red-100 text-red-800',
  '마감': 'bg-gray-100 text-gray-800',
  '심사중': 'bg-yellow-100 text-yellow-800',
  '선정': 'bg-blue-100 text-blue-800'
};

const priorityColors: Record<string, string> = {
  'high': 'bg-red-100 text-red-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'low': 'bg-green-100 text-green-800'
};

export default function EnhancedBidList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 조달청 API 훅 사용
  const { data, loading, error, refetch } = useBidList({
    pageNo: currentPage,
    numOfRows: pageSize
  });

  const categories = ['전체', 'IT/소프트웨어', '제조업', '바이오/헬스케어', '에너지/환경', '기타'];
  const statuses = ['전체', '접수중', '마감임박', '마감', '심사중', '선정'];

  // API 데이터를 UI에 맞게 변환
  const transformedBids = data?.bids?.map(transformBidData) || [];

  const filteredBids = transformedBids.filter(bid => {
    const matchesSearch = bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === '전체' || bid.category === selectedCategory;
    const matchesStatus = !selectedStatus || selectedStatus === '전체' || bid.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedBids = [...filteredBids].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField as keyof typeof a];
    let bValue = b[sortField as keyof typeof b];
    
    if (sortField === 'deadline') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleBidClick = (bid: any) => {
    setSelectedBid(bid);
    setIsDetailModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const columns = [
    {
      key: 'title',
      label: '공고명',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[row.priority]}`}>
              {row.priority === 'high' ? '높음' : row.priority === 'medium' ? '보통' : '낮음'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
            <p className="text-sm text-gray-500">{row.organization}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: '업종',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value}</span>
      )
    },
    {
      key: 'budget',
      label: '예산',
      sortable: true,
      align: 'right' as const,
      render: (value: string) => (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'deadline',
      label: '마감일',
      sortable: true,
      align: 'center' as const,
      render: (value: string, row: any) => {
        const daysLeft = Math.ceil((new Date(value).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">D-{daysLeft > 0 ? daysLeft : '마감'}</p>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: '상태',
      sortable: true,
      align: 'center' as const,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: '액션',
      align: 'center' as const,
      render: (value: any, row: any) => (
        <div className="flex items-center justify-center space-x-2">
          <AdvancedButton
            size="sm"
            variant="ghost"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => handleBidClick(row)}
          >
            보기
          </AdvancedButton>
          <AdvancedButton
            size="sm"
            variant="ghost"
            icon={<Edit className="w-4 h-4" />}
          >
            수정
          </AdvancedButton>
          <AdvancedButton
            size="sm"
            variant="ghost"
            icon={<Trash2 className="w-4 h-4" />}
          >
            삭제
          </AdvancedButton>
        </div>
      )
    }
  ];

  const FilterPanel = () => (
    <AdvancedCard variant="outlined" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdvancedInput
          placeholder="공고명 또는 기관명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        
        <AdvancedButton
          variant="outline"
          icon={<Filter className="w-4 h-4" />}
          onClick={() => setIsFilterModalOpen(true)}
        >
          고급 필터
        </AdvancedButton>
      </div>
    </AdvancedCard>
  );

  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {loading ? '...' : data?.pagination?.totalCount || 0}
        </h3>
        <p className="text-sm text-gray-600">전체 공고</p>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 mx-auto">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {loading ? '...' : filteredBids.filter(bid => bid.status === '접수중').length}
        </h3>
        <p className="text-sm text-gray-600">접수중</p>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4 mx-auto">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {loading ? '...' : filteredBids.filter(bid => bid.status === '마감임박').length}
        </h3>
        <p className="text-sm text-gray-600">마감임박</p>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 mx-auto">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {loading ? '...' : filteredBids.reduce((sum, bid) => sum + bid.participants, 0)}
        </h3>
        <p className="text-sm text-gray-600">총 참여자</p>
      </AdvancedCard>
    </div>
  );

  // 로딩 상태 표시
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">조달청 API에서 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 로딩 실패</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <AdvancedButton variant="primary" onClick={handleRefresh} icon={<RefreshCw className="w-4 h-4" />}>
            다시 시도
          </AdvancedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-pretendard">
      {/* Mock 데이터 사용 알림 */}
      {data?.isUsingMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                테스트 모드 - Mock 데이터 사용 중
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  현재 조달청 API 키가 설정되지 않아 테스트용 Mock 데이터를 표시하고 있습니다. 
                  실제 조달청 데이터를 보려면 환경 변수에 유효한 API 키를 설정해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">공고 목록</h1>
          <p className="text-gray-600">
            {data?.isUsingMockData ? '테스트용 Mock 데이터' : '조달청 나라장터 실시간 입찰공고 정보'}
          </p>
        </div>
        <div className="flex space-x-3">
          <AdvancedButton 
            variant="outline" 
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRefresh}
            loading={loading}
          >
            새로고침
          </AdvancedButton>
          <AdvancedButton variant="outline" icon={<Download className="w-4 h-4" />}>
            엑셀 다운로드
          </AdvancedButton>
          <AdvancedButton variant="primary" icon={<Plus className="w-4 h-4" />}>
            새 공고 등록
          </AdvancedButton>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Filter Panel */}
      <FilterPanel />

      {/* Table */}
      <AdvancedTable
        columns={columns}
        data={sortedBids}
        sortable={true}
        onSort={handleSort}
        sortColumn={sortField}
        sortDirection={sortDirection}
        striped={true}
        hover={true}
        size="lg"
        loading={loading}
      />

      {/* 페이지네이션 */}
      {data?.pagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">페이지당 행 수:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              {data.pagination.pageNo} / {Math.ceil(data.pagination.totalCount / data.pagination.numOfRows)} 페이지
              (총 {data.pagination.totalCount}건)
            </span>
            <div className="flex space-x-1">
              <AdvancedButton
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                이전
              </AdvancedButton>
              <AdvancedButton
                size="sm"
                variant="outline"
                disabled={currentPage >= Math.ceil(data.pagination.totalCount / data.pagination.numOfRows)}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                다음
              </AdvancedButton>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <AdvancedModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="고급 필터"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">예산 범위</label>
            <div className="grid grid-cols-2 gap-4">
              <AdvancedInput placeholder="최소 예산" type="number" />
              <AdvancedInput placeholder="최대 예산" type="number" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
            <select className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option>전체</option>
              <option>서울</option>
              <option>부산</option>
              <option>대구</option>
              <option>인천</option>
              <option>전국</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">높음</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">보통</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-700">낮음</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <AdvancedButton variant="outline" onClick={() => setIsFilterModalOpen(false)}>
              취소
            </AdvancedButton>
            <AdvancedButton variant="primary">
              필터 적용
            </AdvancedButton>
          </div>
        </div>
      </AdvancedModal>

      {/* Detail Modal */}
      <AdvancedModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedBid?.title}
        size="lg"
      >
        {selectedBid && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">기관명</h4>
                <p className="text-sm text-gray-900">{selectedBid.organization}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">예산</h4>
                <p className="text-sm text-gray-900">{selectedBid.budget}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">마감일</h4>
                <p className="text-sm text-gray-900">{selectedBid.deadline}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">지역</h4>
                <p className="text-sm text-gray-900">{selectedBid.location}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">참여자 수</h4>
                <p className="text-sm text-gray-900">{selectedBid.participants}명</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">업종</h4>
                <p className="text-sm text-gray-900">{selectedBid.category}</p>
              </div>
            </div>
            
            {/* 원본 조달청 API 데이터 표시 */}
            {selectedBid.originalData && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">원본 API 데이터</h4>
                <div className="bg-gray-50 p-3 rounded text-xs">
                  <pre className="whitespace-pre-wrap text-gray-600">
                    {JSON.stringify(selectedBid.originalData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <AdvancedButton variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                닫기
              </AdvancedButton>
              <AdvancedButton variant="primary">
                지원하기
              </AdvancedButton>
            </div>
          </div>
        )}
      </AdvancedModal>
    </div>
  );
}
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  FileText,
  Plus
} from 'lucide-react';
import { AdvancedCard, AdvancedButton, AdvancedInput, AdvancedTable, AdvancedModal } from '../ui';

// Mock data
const mockBids = [
  {
    id: 1,
    title: '2024년 AI 기술개발사업',
    organization: '과학기술정보통신부',
    budget: '5억원',
    deadline: '2024-08-15',
    location: '서울',
    status: '접수중',
    participants: 45,
    category: 'IT/소프트웨어',
    priority: 'high'
  },
  {
    id: 2,
    title: '디지털 전환 지원사업',
    organization: '중소벤처기업부',
    budget: '3억원',
    deadline: '2024-07-30',
    location: '전국',
    status: '마감임박',
    participants: 23,
    category: '제조업',
    priority: 'high'
  },
  {
    id: 3,
    title: '스마트팩토리 구축사업',
    organization: '산업통상자원부',
    budget: '10억원',
    deadline: '2024-09-20',
    location: '부산',
    status: '접수중',
    participants: 67,
    category: '제조업',
    priority: 'medium'
  },
  {
    id: 4,
    title: '친환경 에너지 사업',
    organization: '환경부',
    budget: '8억원',
    deadline: '2024-08-10',
    location: '인천',
    status: '접수중',
    participants: 34,
    category: '에너지/환경',
    priority: 'medium'
  },
  {
    id: 5,
    title: '바이오 헬스케어 혁신사업',
    organization: '보건복지부',
    budget: '15억원',
    deadline: '2024-09-30',
    location: '대구',
    status: '접수중',
    participants: 28,
    category: '바이오/헬스케어',
    priority: 'low'
  }
];

const statusColors = {
  '접수중': 'bg-green-100 text-green-800',
  '마감임박': 'bg-red-100 text-red-800',
  '마감': 'bg-gray-100 text-gray-800',
  '심사중': 'bg-yellow-100 text-yellow-800',
  '선정': 'bg-blue-100 text-blue-800'
};

const priorityColors = {
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

  const categories = ['전체', 'IT/소프트웨어', '제조업', '바이오/헬스케어', '에너지/환경'];
  const statuses = ['전체', '접수중', '마감임박', '마감', '심사중', '선정'];

  const filteredBids = mockBids.filter(bid => {
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
      render: (value: string) => (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">D-{Math.ceil((new Date(value).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</p>
        </div>
      )
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
          />
          <AdvancedButton
            size="sm"
            variant="ghost"
            icon={<Edit className="w-4 h-4" />}
          />
          <AdvancedButton
            size="sm"
            variant="ghost"
            icon={<Trash2 className="w-4 h-4" />}
          />
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
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{filteredBids.length}</h3>
        <p className="text-sm text-gray-600">검색 결과</p>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 mx-auto">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {filteredBids.filter(bid => bid.status === '접수중').length}
        </h3>
        <p className="text-sm text-gray-600">접수중</p>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4 mx-auto">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {filteredBids.filter(bid => bid.status === '마감임박').length}
        </h3>
        <p className="text-sm text-gray-600">마감임박</p>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 mx-auto">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {filteredBids.reduce((sum, bid) => sum + bid.participants, 0)}
        </h3>
        <p className="text-sm text-gray-600">총 참여자</p>
      </AdvancedCard>
    </div>
  );

  return (
    <div className="space-y-6 font-pretendard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">공고 목록</h1>
          <p className="text-gray-600">전체 공고 현황 및 관리</p>
        </div>
        <div className="flex space-x-3">
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
      />

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
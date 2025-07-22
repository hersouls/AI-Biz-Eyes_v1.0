import React, { useState, useEffect } from 'react';
import { ReferenceData, ReferenceFilters } from '../../types/reference';
import { getReferences, getMockReferences } from '../../services/referenceService';
import { formatAmount } from '../../utils/formatters';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import Badge from '../Badge';
import Table from '../Table';

interface ReferenceListProps {
  onAddNew?: () => void;
  onEdit?: (reference: ReferenceData) => void;
  onDelete?: (id: number) => void;
  onView?: (reference: ReferenceData) => void;
}

const ReferenceList: React.FC<ReferenceListProps> = ({
  onAddNew,
  onEdit,
  onDelete,
  onView
}) => {
  const [references, setReferences] = useState<ReferenceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReferenceFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    const fetchReferences = async () => {
      setLoading(true);
      try {
        // 실제 API 호출 (개발 중에는 Mock 데이터 사용)
        const response = await getReferences(filters, pagination.page, pagination.limit);
        setReferences(response.data.references);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching references:', error);
        // Mock 데이터로 폴백
        const mockData = getMockReferences();
        setReferences(mockData);
        setPagination({
          page: 1,
          limit: 20,
          total: mockData.length,
          totalPages: Math.ceil(mockData.length / 20)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, [filters, pagination.page]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key: keyof ReferenceFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: 'success' | 'danger' | 'primary', text: string }> = {
      success: { color: 'success', text: '성공' },
      failure: { color: 'danger', text: '실패' },
      ongoing: { color: 'primary', text: '진행중' }
    };
    const config = statusConfig[status];
    return <Badge variant={config?.color || 'default'}>{config?.text || status}</Badge>;
  };

  const getScoreBadge = (score: string | undefined) => {
    const scoreConfig: { [key: string]: { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'; text: string } } = {
      'A': { color: 'success', text: 'A등급' },
      'B': { color: 'info', text: 'B등급' },
      'C': { color: 'warning', text: 'C등급' },
      'D': { color: 'danger', text: 'D등급' }
    };
    const config = scoreConfig[score || ''];
    return <Badge variant={config?.color || 'gray'}>{config?.text || score || '평가 없음'}</Badge>;
  };

  const tableColumns = [
    {
      key: 'projectName',
      header: '사업명',
      render: (value: string, record: ReferenceData) => (
        <div className="text-left">
          <div className="font-medium text-gray-900">{value}</div>
          {record.bidNtceNo && (
            <div className="text-sm text-gray-500">공고번호: {record.bidNtceNo}</div>
          )}
        </div>
      )
    },
    {
      key: 'projectType',
      header: '사업유형',
      render: (value: string) => <span className="text-gray-700">{value}</span>
    },
    {
      key: 'organization',
      header: '참여기관',
      render: (value: string) => <span className="text-gray-700">{value}</span>
    },
    {
      key: 'participationYear',
      header: '참여연도',
      render: (value: number) => <span className="text-gray-700">{value}</span>
    },
    {
      key: 'contractAmount',
      header: '계약금액',
      render: (value: number | undefined) => (
        <span className="font-medium text-gray-900">{formatAmount(value)}</span>
      )
    },
    {
      key: 'status',
      header: '성과상태',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'score',
      header: '평가등급',
      render: (value: string | undefined) => getScoreBadge(value)
    },
    {
      key: 'actions',
      header: '액션',
      render: (_: any, record: ReferenceData) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView?.(record)}
          >
            상세
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit?.(record)}
          >
            수정
          </Button>
          <Button
            size="sm"
            variant="outline"

            onClick={() => onDelete?.(record.id)}
          >
            삭제
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">레퍼런스 관리</h1>
          <p className="text-gray-600">조직의 사업 경험과 성과를 관리합니다</p>
        </div>
        <Button onClick={onAddNew}>
          + 새 레퍼런스 등록
        </Button>
      </div>

      {/* 필터 */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="사업명 검색"
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select
            placeholder="사업유형"
            value={filters.type || ''}
            onChange={(value: string | number) => handleFilterChange('type', value as string)}
            options={[
              { value: '용역', label: '용역' },
              { value: '개발', label: '개발' },
              { value: '공사', label: '공사' },
              { value: '물품', label: '물품' }
            ]}
          />
          <Select
            placeholder="성과상태"
            value={filters.status || ''}
            onChange={(value: string | number) => handleFilterChange('status', value as any)}
            options={[
              { value: 'success', label: '성공' },
              { value: 'failure', label: '실패' },
              { value: 'ongoing', label: '진행중' }
            ]}
          />
          <Select
            placeholder="참여연도"
            value={filters.year?.toString() || ''}
            onChange={(value: string | number) => handleFilterChange('year', parseInt(value as string) || undefined)}
            options={[
              { value: '2024', label: '2024년' },
              { value: '2023', label: '2023년' },
              { value: '2022', label: '2022년' },
              { value: '2021', label: '2021년' }
            ]}
          />
        </div>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{references.length}</div>
            <div className="text-sm text-gray-600">전체 레퍼런스</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {references.filter(r => r.status === 'success').length}
            </div>
            <div className="text-sm text-gray-600">성공 사례</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {references.filter(r => r.status === 'ongoing').length}
            </div>
            <div className="text-sm text-gray-600">진행중</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {formatAmount(references.reduce((sum, r) => sum + (r.contractAmount ?? 0), 0))}
            </div>
            <div className="text-sm text-gray-600">총 계약금액</div>
          </div>
        </Card>
      </div>

      {/* 테이블 */}
      <Card>
        <Table
          columns={tableColumns}
          data={references}
          loading={loading}
          pagination={pagination}
          onPageChange={(page: number) => setPagination(prev => ({ ...prev, page }))}
        />
      </Card>
    </div>
  );
};

export default ReferenceList;
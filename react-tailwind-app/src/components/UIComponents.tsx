import React, { useState } from 'react';
import Button from './Button';
import Card, { CardHeader, CardContent, CardFooter } from './Card';
import Table, { TableHeader } from './Table';
import Badge from './Badge';
import Input from './Input';
import Select from './Select';
import BadgeComponent from './Badge';

// Sample data for table
const sampleData = [
  {
    id: '1',
    bidNtceNo: '2024001',
    bidNtceNm: '스마트공장 구축 사업',
    ntceInsttNm: '조달청',
    bsnsDivNm: '용역',
    bidNtceSttusNm: '일반공고',
    asignBdgtAmt: '234,594,800',
    bidClseDate: '2024-02-15',
    status: '진행중'
  },
  {
    id: '2',
    bidNtceNo: '2024002',
    bidNtceNm: 'AI 플랫폼 개발',
    ntceInsttNm: '과학기술정보통신부',
    bsnsDivNm: '용역',
    bidNtceSttusNm: '긴급공고',
    asignBdgtAmt: '156,789,000',
    bidClseDate: '2024-02-10',
    status: '마감임박'
  },
  {
    id: '3',
    bidNtceNo: '2024003',
    bidNtceNm: '클라우드 인프라 구축',
    ntceInsttNm: '정보통신산업진흥원',
    bsnsDivNm: '공사',
    bidNtceSttusNm: '일반공고',
    asignBdgtAmt: '456,123,000',
    bidClseDate: '2024-02-20',
    status: '신규'
  }
];

const columns = [
  {
    key: 'bidNtceNo',
    header: '공고번호',
    width: '120px'
  },
  {
    key: 'bidNtceNm',
    header: '공고명',
    render: (value: string) => (
      <span className="font-medium text-primary hover:text-primary-700 cursor-pointer">
        {value}
      </span>
    )
  },
  {
    key: 'ntceInsttNm',
    header: '공고기관',
    width: '150px'
  },
  {
    key: 'bsnsDivNm',
    header: '업무구분',
    width: '100px',
    align: 'center' as const
  },
  {
    key: 'bidNtceSttusNm',
    header: '상태',
    width: '120px',
    align: 'center' as const,
    render: (value: string) => (
      <Badge 
        variant={value === '긴급공고' ? 'danger' : 'info'}
        size="sm"
      >
        {value}
      </Badge>
    )
  },
  {
    key: 'asignBdgtAmt',
    header: '예산금액',
    width: '140px',
    align: 'right' as const,
    render: (value: string) => (
      <span className="font-medium">
        {value}원
      </span>
    )
  },
  {
    key: 'bidClseDate',
    header: '마감일',
    width: '120px',
    align: 'center' as const
  },
  {
    key: 'status',
    header: '내부상태',
    width: '100px',
    align: 'center' as const,
    render: (value: string) => {
      const variantMap = {
        '신규': 'primary',
        '진행중': 'info',
        '마감임박': 'warning',
        '완료': 'success'
      } as const;
      
      return (
        <Badge 
          variant={variantMap[value as keyof typeof variantMap] || 'default'}
          size="sm"
        >
          {value}
        </Badge>
      );
    }
  }
];

const UIComponents: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const selectOptions = [
    { value: '', label: '선택해주세요' },
    { value: '공사', label: '공사' },
    { value: '용역', label: '용역' },
    { value: '물품', label: '물품' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-heading1 text-gray-900 mb-2">AI Biz Eyes 공모사업 자동화 관리 시스템</h1>
          <p className="text-body2 text-gray-600">UI 컴포넌트 라이브러리</p>
        </div>

        {/* Buttons Section */}
        <Card>
          <CardHeader 
            title="버튼 컴포넌트" 
            subtitle="다양한 스타일과 크기의 버튼들"
          />
          <CardContent>
            <div className="space-y-6">
              {/* Button Variants */}
              <div>
                <h4 className="text-subtitle2 text-gray-900 mb-3">버튼 스타일</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h4 className="text-subtitle2 text-gray-900 mb-3">버튼 크기</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* Button States */}
              <div>
                <h4 className="text-subtitle2 text-gray-900 mb-3">버튼 상태</h4>
                <div className="flex flex-wrap gap-3">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button loading>Loading</Button>
                </div>
              </div>

              {/* Button with Icons */}
              <div>
                <h4 className="text-subtitle2 text-gray-900 mb-3">아이콘 버튼</h4>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }
                  >
                    추가
                  </Button>
                  <Button 
                    variant="outline"
                    rightIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    }
                  >
                    뒤로가기
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader 
            title="배지 컴포넌트" 
            subtitle="상태와 카테고리를 표시하는 배지들"
          />
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-subtitle2 text-gray-900 mb-3">배지 스타일</h4>
                <div className="flex flex-wrap gap-2">
                  <BadgeComponent variant="primary">Primary</BadgeComponent>
                  <BadgeComponent variant="secondary">Secondary</BadgeComponent>
                  <BadgeComponent variant="success">Success</BadgeComponent>
                  <BadgeComponent variant="warning">Warning</BadgeComponent>
                  <BadgeComponent variant="danger">Danger</BadgeComponent>
                  <BadgeComponent variant="info">Info</BadgeComponent>
                  <BadgeComponent variant="default">Default</BadgeComponent>
                </div>
              </div>

              <div>
                <h4 className="text-subtitle2 text-gray-900 mb-3">배지 크기</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <BadgeComponent variant="primary" size="sm">Small</BadgeComponent>
                  <BadgeComponent variant="primary" size="md">Medium</BadgeComponent>
                  <BadgeComponent variant="primary" size="lg">Large</BadgeComponent>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Components Section */}
        <Card>
          <CardHeader 
            title="폼 컴포넌트" 
            subtitle="입력 필드와 선택 컴포넌트들"
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Fields */}
              <div className="space-y-4">
                <h4 className="text-subtitle2 text-gray-900">입력 필드</h4>
                <Input
                  label="공고명"
                  placeholder="공고명을 입력하세요"
                  value={inputValue}
                  onChange={setInputValue}
                  required
                />
                <Input
                  label="검색"
                  placeholder="키워드를 입력하세요"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
                <Input
                  label="에러 상태"
                  placeholder="에러가 있는 입력 필드"
                  error="이 필드는 필수입니다."
                />
              </div>

              {/* Select Fields */}
              <div className="space-y-4">
                <h4 className="text-subtitle2 text-gray-900">선택 필드</h4>
                <Select
                  label="업무구분"
                  options={selectOptions}
                  value={selectValue}
                  onChange={(value: string | number) => setSelectValue(value as string)}
                  required
                />
                <Select
                  label="상태 필터"
                  options={[
                    { value: '', label: '전체' },
                    { value: '일반공고', label: '일반공고' },
                    { value: '긴급공고', label: '긴급공고' },
                    { value: '정정공고', label: '정정공고' }
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card>
          <CardHeader 
            title="테이블 컴포넌트" 
            subtitle="공고 목록을 표시하는 테이블"
            action={
              <Button size="sm" variant="outline">
                내보내기
              </Button>
            }
          />
          <CardContent>
            <Table
              data={sampleData}
              columns={columns}
              selectable
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              rowKey="id"
              hover
              striped
            />
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <span className="text-body3 text-gray-600">
                총 {sampleData.length}건의 데이터
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">이전</Button>
                <span className="text-body3 text-gray-600">1 / 1</span>
                <Button size="sm" variant="outline">다음</Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">156</div>
                <div className="text-body3 text-gray-600">전체 공고</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">23</div>
                <div className="text-body3 text-gray-600">진행중</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">8</div>
                <div className="text-body3 text-gray-600">마감임박</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-state-red mb-1">3</div>
                <div className="text-body3 text-gray-600">긴급공고</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UIComponents;
import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  Settings, 
  Download, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react';
import { 
  AdvancedCard, 
  AdvancedButton, 
  AdvancedInput, 
  AdvancedTable, 
  AdvancedModal, 
  AdvancedBadge, 
  AdvancedSelect 
} from '../ui';

export default function UIComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const tableData = [
    { id: 1, name: 'AI 기술개발사업', status: '진행중', budget: '5억원', deadline: '2024-08-15' },
    { id: 2, name: '디지털 전환 지원사업', status: '마감임박', budget: '3억원', deadline: '2024-07-30' },
    { id: 3, name: '스마트팩토리 구축사업', status: '접수중', budget: '10억원', deadline: '2024-09-20' },
  ];

  const tableColumns = [
    { key: 'name', label: '사업명', sortable: true },
    { key: 'status', label: '상태', sortable: true, render: (value: string) => (
      <AdvancedBadge 
        variant={value === '진행중' ? 'success' : value === '마감임박' ? 'danger' : 'info'}
        size="sm"
      >
        {value}
      </AdvancedBadge>
    )},
    { key: 'budget', label: '예산', sortable: true },
    { key: 'deadline', label: '마감일', sortable: true },
  ];

  const selectOptions = [
    { value: 'it', label: 'IT/소프트웨어' },
    { value: 'manufacturing', label: '제조업' },
    { value: 'bio', label: '바이오/헬스케어' },
    { value: 'energy', label: '에너지/환경' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-pretendard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Tailwind Plus UI Blocks 데모
          </h1>
          <p className="text-xl text-gray-600">
            AI Biz Eyes 프로젝트에 적용된 고급 UI 컴포넌트들
          </p>
        </div>

        {/* AdvancedCard Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📦 AdvancedCard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdvancedCard variant="default" hover>
              <h3 className="text-lg font-semibold mb-2">기본 카드</h3>
              <p className="text-gray-600">기본 스타일의 카드 컴포넌트입니다.</p>
            </AdvancedCard>

            <AdvancedCard variant="elevated" hover>
              <h3 className="text-lg font-semibold mb-2">Elevated 카드</h3>
              <p className="text-gray-600">그림자가 있는 카드 컴포넌트입니다.</p>
            </AdvancedCard>

            <AdvancedCard variant="outlined" hover>
              <h3 className="text-lg font-semibold mb-2">Outlined 카드</h3>
              <p className="text-gray-600">테두리가 강조된 카드 컴포넌트입니다.</p>
            </AdvancedCard>

            <AdvancedCard variant="filled" hover>
              <h3 className="text-lg font-semibold mb-2">Filled 카드</h3>
              <p className="text-gray-600">배경색이 있는 카드 컴포넌트입니다.</p>
            </AdvancedCard>
          </div>
        </section>

        {/* AdvancedButton Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔘 AdvancedButton</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Variant 스타일</h3>
              <div className="flex flex-wrap gap-3">
                <AdvancedButton variant="primary">Primary</AdvancedButton>
                <AdvancedButton variant="secondary">Secondary</AdvancedButton>
                <AdvancedButton variant="success">Success</AdvancedButton>
                <AdvancedButton variant="warning">Warning</AdvancedButton>
                <AdvancedButton variant="danger">Danger</AdvancedButton>
                <AdvancedButton variant="ghost">Ghost</AdvancedButton>
                <AdvancedButton variant="outline">Outline</AdvancedButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">아이콘 버튼</h3>
              <div className="flex flex-wrap gap-3">
                <AdvancedButton variant="primary" icon={<Heart className="w-4 h-4" />}>
                  좋아요
                </AdvancedButton>
                <AdvancedButton variant="outline" icon={<Download className="w-4 h-4" />} iconPosition="right">
                  다운로드
                </AdvancedButton>
                <AdvancedButton variant="ghost" icon={<Settings className="w-4 h-4" />}>
                  설정
                </AdvancedButton>
              </div>
            </div>
          </div>
        </section>

        {/* AdvancedInput Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 AdvancedInput</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">기본 입력</h3>
              <div className="space-y-4">
                <AdvancedInput
                  label="이름"
                  placeholder="이름을 입력하세요"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <AdvancedInput
                  label="이메일"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  leftIcon={<Search className="w-4 h-4" />}
                />
                <AdvancedInput
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  error="비밀번호는 8자 이상이어야 합니다."
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Variant 스타일</h3>
              <div className="space-y-4">
                <AdvancedInput
                  placeholder="기본 스타일"
                  variant="default"
                />
                <AdvancedInput
                  placeholder="Filled 스타일"
                  variant="filled"
                />
                <AdvancedInput
                  placeholder="Outlined 스타일"
                  variant="outlined"
                />
              </div>
            </div>
          </div>
        </section>

        {/* AdvancedBadge Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🏷️ AdvancedBadge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Variant 스타일</h3>
              <div className="flex flex-wrap gap-3">
                <AdvancedBadge variant="primary">Primary</AdvancedBadge>
                <AdvancedBadge variant="secondary">Secondary</AdvancedBadge>
                <AdvancedBadge variant="success">Success</AdvancedBadge>
                <AdvancedBadge variant="warning">Warning</AdvancedBadge>
                <AdvancedBadge variant="danger">Danger</AdvancedBadge>
                <AdvancedBadge variant="info">Info</AdvancedBadge>
                <AdvancedBadge variant="light">Light</AdvancedBadge>
                <AdvancedBadge variant="dark">Dark</AdvancedBadge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">옵션</h3>
              <div className="flex flex-wrap gap-3">
                <AdvancedBadge dot>점 표시</AdvancedBadge>
                <AdvancedBadge rounded>둥근 모서리</AdvancedBadge>
                <AdvancedBadge removable onRemove={() => alert('제거됨')}>
                  제거 가능
                </AdvancedBadge>
              </div>
            </div>
          </div>
        </section>

        {/* AdvancedSelect Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 AdvancedSelect</h2>
          <div className="max-w-md">
            <AdvancedSelect
              label="업종 선택"
              options={selectOptions}
              value={selectValue}
              onChange={setSelectValue}
              placeholder="업종을 선택하세요"
            />
          </div>
        </section>

        {/* AdvancedTable Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 AdvancedTable</h2>
          <AdvancedTable
            columns={tableColumns}
            data={tableData}
            sortable={true}
            striped={true}
            hover={true}
          />
        </section>

        {/* AdvancedModal Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🪟 AdvancedModal</h2>
          <div className="flex gap-4">
            <AdvancedButton 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
            >
              모달 열기
            </AdvancedButton>
          </div>

          <AdvancedModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Tailwind Plus UI Blocks 데모"
            size="lg"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                이 모달은 Tailwind Plus 스타일의 고급 UI 컴포넌트들을 보여줍니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">주요 특징:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 일관된 디자인 시스템</li>
                  <li>• 접근성 고려</li>
                  <li>• 반응형 디자인</li>
                  <li>• TypeScript 지원</li>
                  <li>• 커스터마이징 가능</li>
                </ul>
              </div>
              <div className="flex justify-end space-x-3">
                <AdvancedButton variant="outline" onClick={() => setIsModalOpen(false)}>
                  닫기
                </AdvancedButton>
                <AdvancedButton variant="primary">
                  확인
                </AdvancedButton>
              </div>
            </div>
          </AdvancedModal>
        </section>

        {/* Integration Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 통합 예시</h2>
          <AdvancedCard variant="elevated" header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">공고 등록 폼</h3>
              <AdvancedBadge variant="success">새로운</AdvancedBadge>
            </div>
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdvancedInput
                label="공고명"
                placeholder="공고명을 입력하세요"
                required
              />
              <AdvancedSelect
                label="업종"
                options={selectOptions}
                placeholder="업종을 선택하세요"
              />
              <AdvancedInput
                label="예산"
                placeholder="예산을 입력하세요"
                type="number"
              />
              <AdvancedInput
                label="마감일"
                type="date"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <AdvancedButton variant="outline">취소</AdvancedButton>
              <AdvancedButton variant="primary" icon={<Plus className="w-4 h-4" />}>
                등록
              </AdvancedButton>
            </div>
          </AdvancedCard>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            🎉 Tailwind Plus UI Blocks가 성공적으로 적용되었습니다!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            AI Biz Eyes 프로젝트의 완성도가 크게 향상되었습니다.
          </p>
        </footer>
      </div>
    </div>
  );
}
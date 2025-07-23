import React, { useState } from 'react';
import { ReferenceData, ReferenceRequest, ReferenceStats as ReferenceStatsType } from '../../types/reference';
import { createReference, updateReference, deleteReference, getReferenceStats, getMockReferenceStats } from '../../services/referenceService';
import ReferenceList from './ReferenceList';
import ReferenceForm from './ReferenceForm';
import ReferenceDetail from './ReferenceDetail';
import ReferenceStats from './ReferenceStats';

type ViewMode = 'list' | 'form' | 'detail' | 'stats';

const ReferenceManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedReference, setSelectedReference] = useState<ReferenceData | null>(null);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<ReferenceStatsType>(getMockReferenceStats());

  const handleAddNew = () => {
    setSelectedReference(null);
    setViewMode('form');
  };

  const handleEdit = (reference: ReferenceData) => {
    setSelectedReference(reference);
    setViewMode('form');
  };

  const handleView = (reference: ReferenceData) => {
    setSelectedReference(reference);
    setViewMode('detail');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 레퍼런스를 삭제하시겠습니까?')) {
      setLoading(true);
      try {
        await deleteReference(id);
        alert('레퍼런스가 삭제되었습니다.');
        setViewMode('list');
      } catch (error) {
        console.error('Error deleting reference:', error);
        alert('삭제 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async (data: ReferenceRequest) => {
    setLoading(true);
    try {
      if (selectedReference) {
        await updateReference(selectedReference.id, data);
        alert('레퍼런스가 수정되었습니다.');
      } else {
        await createReference(data);
        alert('레퍼런스가 등록되었습니다.');
      }
      setViewMode('list');
    } catch (error) {
      console.error('Error submitting reference:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    setViewMode('list');
  };

  const handleDetailBack = () => {
    setViewMode('list');
  };

  const handleDetailEdit = () => {
    setViewMode('form');
  };

  const handleDetailDelete = () => {
    if (selectedReference) {
      handleDelete(selectedReference.id);
    }
  };

  const handleShowStats = async () => {
    setLoading(true);
    try {
      const statsData = await getReferenceStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock 데이터로 폴백
      setStats(getMockReferenceStats());
    } finally {
      setLoading(false);
      setViewMode('stats');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
  };

  // 네비게이션 헤더
  const NavigationHeader = () => (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBackToList}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← 레퍼런스 관리
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">
          {viewMode === 'form' && (selectedReference ? '레퍼런스 수정' : '새 레퍼런스 등록')}
          {viewMode === 'detail' && '레퍼런스 상세'}
          {viewMode === 'stats' && '레퍼런스 통계'}
        </span>
      </div>
    </div>
  );

  // 뷰 모드별 렌더링
  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">레퍼런스 관리</h1>
                <p className="text-gray-600">조직의 사업 경험과 성과를 관리합니다</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleShowStats}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  통계 보기
                </button>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  + 새 레퍼런스 등록
                </button>
              </div>
            </div>
            <ReferenceList
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </div>
        );

      case 'form':
        return (
          <div>
            <NavigationHeader />
            <ReferenceForm
              reference={selectedReference || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              loading={loading}
            />
          </div>
        );

      case 'detail':
        return selectedReference ? (
          <div>
            <NavigationHeader />
            <ReferenceDetail
              reference={selectedReference}
              onEdit={handleDetailEdit}
              onDelete={handleDetailDelete}
              onBack={handleDetailBack}
            />
          </div>
        ) : (
          <div>레퍼런스를 찾을 수 없습니다.</div>
        );

      case 'stats':
        return (
          <div>
            <NavigationHeader />
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">레퍼런스 통계</h1>
              <p className="text-gray-600">레퍼런스 성과와 현황을 분석합니다</p>
            </div>
            <ReferenceStats stats={stats} />
          </div>
        );

      default:
        return <div>잘못된 뷰 모드입니다.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default ReferenceManager;
import React, { useState } from 'react';
import G2BApiStatus from '../G2BApiStatus';
import BidList from '../BidList';
import BidSearch from '../BidSearch';

type TabType = 'status' | 'list' | 'search';

const G2BPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('status');

  const tabs = [
    { id: 'status', name: 'API 상태', icon: '🔍' },
    { id: 'list', name: '입찰공고 목록', icon: '📋' },
    { id: 'search', name: '키워드 검색', icon: '🔎' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'status':
        return <G2BApiStatus />;
      case 'list':
        return <BidList />;
      case 'search':
        return <BidSearch />;
      default:
        return <G2BApiStatus />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-3xl">🏛️</div>
            <h1 className="text-3xl font-bold text-gray-900">조달청 나라장터 API</h1>
          </div>
          <p className="text-gray-600">
            조달청 나라장터 API를 통해 실시간 입찰공고 정보를 확인하고 검색할 수 있습니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>

        {/* 정보 카드 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">📊</div>
              <h3 className="text-lg font-semibold text-gray-900">실시간 데이터</h3>
            </div>
            <p className="text-gray-600 text-sm">
              조달청 나라장터에서 제공하는 최신 입찰공고 정보를 실시간으로 확인할 수 있습니다.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900">다양한 검색</h3>
            </div>
            <p className="text-gray-600 text-sm">
              키워드, 기관명, 날짜 범위 등 다양한 조건으로 입찰공고를 검색할 수 있습니다.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900">빠른 응답</h3>
            </div>
            <p className="text-gray-600 text-sm">
              최적화된 API 연동으로 빠른 응답 속도를 제공하여 효율적인 업무를 지원합니다.
            </p>
          </div>
        </div>

        {/* 사용법 가이드 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 사용법 가이드</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. API 상태 확인</h4>
              <p className="text-sm text-gray-600 mb-4">
                조달청 API 연결 상태와 설정 정보를 확인합니다. API 키가 올바르게 설정되어 있는지 확인하세요.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">2. 입찰공고 목록 조회</h4>
              <p className="text-sm text-gray-600 mb-4">
                최신 입찰공고 목록을 페이지네이션과 함께 확인할 수 있습니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. 키워드 검색</h4>
              <p className="text-sm text-gray-600 mb-4">
                관심 있는 키워드로 입찰공고를 검색하여 관련 공고만 필터링할 수 있습니다.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">4. 데이터 활용</h4>
              <p className="text-sm text-gray-600">
                조회된 입찰공고 정보를 바탕으로 사업 기회를 발굴하고 전략을 수립하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default G2BPage;
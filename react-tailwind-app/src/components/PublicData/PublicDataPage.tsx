import React, { useState } from 'react';
import PublicDataList from '../PublicDataList';
import PublicDataStats from '../PublicDataStats';
import MockApiStatus from './MockApiStatus';

const PublicDataPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'stats' | 'status'>('list');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            공공데이터포털
          </h1>
          <p className="text-gray-600">
            정부에서 제공하는 다양한 공공데이터를 검색하고 다운로드할 수 있습니다.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('list')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                데이터 목록
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                통계 정보
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'status'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                API 상태
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'list' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <PublicDataList 
                  title="공공데이터 목록" 
                  showFilters={true} 
                  limit={20} 
                />
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <PublicDataStats 
                  title="데이터 통계" 
                  showDetails={false} 
                />
                
                {/* Quick Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    공공데이터포털 정보
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs mr-2">
                        ℹ️
                      </span>
                      <span>정부에서 제공하는 공개 데이터</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs mr-2">
                        ✅
                      </span>
                      <span>무료로 다운로드 가능</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs mr-2">
                        📊
                      </span>
                      <span>다양한 형식 지원 (JSON, CSV, XML)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs mr-2">
                        🔄
                      </span>
                      <span>실시간 업데이트</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    주요 카테고리
                  </h3>
                  <div className="space-y-2">
                    {[
                      'IT/소프트웨어',
                      '도시/교통',
                      '경제/금융',
                      '과학기술',
                      '환경/에너지',
                      '교육/문화',
                      '의료/복지'
                    ].map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{category}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {Math.floor(Math.random() * 50) + 10}건
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PublicDataStats 
                title="상세 통계" 
                showDetails={true} 
              />
              
              {/* Additional Stats */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    데이터 형식별 분포
                  </h3>
                  <div className="space-y-3">
                    {[
                      { format: 'JSON', count: 85, percentage: 38.6 },
                      { format: 'CSV', count: 65, percentage: 29.5 },
                      { format: 'XML', count: 45, percentage: 20.5 },
                      { format: 'XLSX', count: 25, percentage: 11.4 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-700">{item.format}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-800">{item.count}건</div>
                          <div className="text-xs text-gray-500">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    월별 데이터 증가 추이
                  </h3>
                  <div className="space-y-3">
                    {[
                      { month: '1월', count: 15, growth: '+12.5%' },
                      { month: '2월', count: 18, growth: '+20.0%' },
                      { month: '3월', count: 22, growth: '+22.2%' },
                      { month: '4월', count: 25, growth: '+13.6%' },
                      { month: '5월', count: 28, growth: '+12.0%' },
                      { month: '6월', count: 32, growth: '+14.3%' },
                      { month: '7월', count: 35, growth: '+9.4%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{item.month}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-800">{item.count}건</div>
                          <div className="text-xs text-green-600">{item.growth}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="max-w-4xl mx-auto">
              <MockApiStatus />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicDataPage;
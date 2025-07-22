import React from 'react';
import KPICards from './KPICards';
import ChartsSection from './ChartsSection';
import RecentActivity from './RecentActivity';
import CalendarTimeline from './CalendarTimeline';
import { 
  Cog6ToothIcon, 
  ArrowPathIcon,
  DocumentArrowDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            B2G 공모사업 자동화 대시보드
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            실시간 공고 현황 및 참여 관리 통합 플랫폼
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
            대시보드 설정
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            리포트 다운로드
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-[#119891] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0d7a73] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#119891]"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            데이터 새로고침
          </button>
        </div>
      </div>

      {/* Quick Stats - KPI Cards */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">전체 현황 요약</h2>
          <p className="text-sm text-gray-600 mt-1">
            실시간 공고 통계 및 주요 지표
          </p>
        </div>
        <KPICards />
      </section>

      {/* Charts and Analytics */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">트렌드 & 인사이트</h2>
          <p className="text-sm text-gray-600 mt-1">
            공고 분석, 트렌드 및 시각화 데이터
          </p>
        </div>
        <ChartsSection />
      </section>

      {/* Recent Activity and Notifications */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">최근 활동 & 추천</h2>
          <p className="text-sm text-gray-600 mt-1">
            최근 공고, 알림 및 AI 기반 추천 사업
          </p>
        </div>
        <RecentActivity />
      </section>

      {/* Calendar and Timeline */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">일정 관리</h2>
          <p className="text-sm text-gray-600 mt-1">
            공고 마감일, 설명회 및 중요 일정
          </p>
        </div>
        <CalendarTimeline />
      </section>

      {/* Quick Actions Panel */}
      <section>
        <div className="bg-gradient-to-r from-[#031B4B] to-[#119891] rounded-lg shadow-lg p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">빠른 액션</h3>
              <p className="text-sm text-blue-100 mt-1">
                자주 사용하는 기능에 빠르게 접근하세요
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-wrap gap-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#031B4B] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                공고 등록
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-[#031B4B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                레퍼런스 추가
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-[#031B4B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                알림 설정
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-[#031B4B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                리포트 생성
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">시스템 상태</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">나라장터 API</p>
                <p className="text-xs text-gray-500">정상 운영 중</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">데이터 수집</p>
                <p className="text-xs text-gray-500">5분 전 업데이트</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">알림 서비스</p>
                <p className="text-xs text-gray-500">일부 지연 중</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
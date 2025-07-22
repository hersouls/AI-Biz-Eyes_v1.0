import React, { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  BellIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
} from '@heroicons/react/24/outline'
import { Calendar, BarChart3, PieChart, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react'

// Mock 데이터
const mockKPIData = {
  totalBids: 1247,
  inProgress: 89,
  closed: 1158,
  urgent: 23,
  missed: 12,
  duplicate: 8,
  participating: 45,
  reviewing: 23,
  rejected: 12,
  confirmed: 10,
  todayNew: 15,
  weekNew: 67,
}

const mockChartData = {
  bidTypes: [
    { name: '공사', value: 45, color: '#3B82F6' },
    { name: '용역', value: 30, color: '#10B981' },
    { name: '물품', value: 15, color: '#F59E0B' },
    { name: '연구', value: 10, color: '#8B5CF6' },
  ],
  institutions: [
    { name: '조달청', value: 35, color: '#EF4444' },
    { name: '과학기술정보통신부', value: 25, color: '#06B6D4' },
    { name: '산업통상자원부', value: 20, color: '#84CC16' },
    { name: '기타', value: 20, color: '#F97316' },
  ],
  weeklyTrend: [
    { week: '1주', count: 45 },
    { week: '2주', count: 52 },
    { week: '3주', count: 38 },
    { week: '4주', count: 67 },
    { week: '5주', count: 58 },
    { week: '6주', count: 73 },
    { week: '7주', count: 61 },
  ],
}

const mockTimelineData = [
  {
    id: 1,
    title: 'AI 기반 스마트시티 구축 사업',
    institution: '과학기술정보통신부',
    deadline: '2024-02-15',
    type: 'urgent',
    budget: '2,500,000,000',
  },
  {
    id: 2,
    title: '클라우드 인프라 구축 용역',
    institution: '조달청',
    deadline: '2024-02-18',
    type: 'normal',
    budget: '1,800,000,000',
  },
  {
    id: 3,
    title: '데이터센터 보안시스템 구축',
    institution: '산업통상자원부',
    deadline: '2024-02-20',
    type: 'urgent',
    budget: '3,200,000,000',
  },
]

const mockRecommendations = [
  {
    id: 1,
    title: 'AI 기반 스마트시티 구축 사업',
    institution: '과학기술정보통신부',
    similarity: 95,
    successRate: 87,
    reason: '유사 레퍼런스 3건 보유',
    budget: '2,500,000,000',
  },
  {
    id: 2,
    title: '클라우드 인프라 구축 용역',
    institution: '조달청',
    similarity: 88,
    successRate: 76,
    reason: '기술 스택 매칭도 높음',
    budget: '1,800,000,000',
  },
  {
    id: 3,
    title: '데이터센터 보안시스템 구축',
    institution: '산업통상자원부',
    similarity: 82,
    successRate: 71,
    reason: '담당자 경험 우수',
    budget: '3,200,000,000',
  },
]

const mockAlerts = [
  {
    id: 1,
    type: 'urgent',
    message: '긴급공고: AI 기반 스마트시티 구축 사업 마감 3일 전',
    time: '10분 전',
  },
  {
    id: 2,
    type: 'deadline',
    message: '클라우드 인프라 구축 용역 마감 5일 전',
    time: '1시간 전',
  },
  {
    id: 3,
    type: 'duplicate',
    message: '중복 공고 감지: 데이터센터 보안시스템 구축',
    time: '2시간 전',
  },
  {
    id: 4,
    type: 'new',
    message: '신규 공고 15건 수집 완료',
    time: '3시간 전',
  },
]

function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      case 'deadline':
        return <ClockIcon className="w-5 h-5 text-orange-500" />
      case 'duplicate':
        return <XCircleIcon className="w-5 h-5 text-yellow-500" />
      case 'new':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">전체 공고 현황 및 실시간 모니터링</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">오늘</option>
            <option value="week">이번 주</option>
            <option value="month">이번 달</option>
          </select>
        </div>
      </div>

      {/* KPI 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 공고</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(mockKPIData.totalBids)}</p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-4 flex space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              진행중: {mockKPIData.inProgress}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              마감: {mockKPIData.closed}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">긴급 공고</p>
              <p className="text-2xl font-bold text-red-600">{mockKPIData.urgent}</p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-4 flex space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              누락: {mockKPIData.missed}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              중복: {mockKPIData.duplicate}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">참여 현황</p>
              <p className="text-2xl font-bold text-green-600">{mockKPIData.participating}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-4 flex space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              검토중: {mockKPIData.reviewing}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              확정: {mockKPIData.confirmed}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">신규 공고</p>
              <p className="text-2xl font-bold text-purple-600">{mockKPIData.todayNew}</p>
            </div>
            <TrendingUpIcon className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              이번 주: {mockKPIData.weekNew}건
            </span>
          </div>
        </div>
      </div>

      {/* 차트 및 통계 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 공고 유형별 분포 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">공고 유형별 분포</h3>
          <div className="space-y-3">
            {mockChartData.bidTypes.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 기관별 분포 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">기관별 분포</h3>
          <div className="space-y-3">
            {mockChartData.institutions.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 공고 타임라인 및 추천 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 공고 타임라인 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">마감 임박 공고</h3>
          <div className="space-y-4">
            {mockTimelineData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    {item.type === 'urgent' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        긴급
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.institution}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      마감: {item.deadline}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.budget)}
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  상세보기
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI 추천 공고 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI 추천 공고</h3>
          <div className="space-y-4">
            {mockRecommendations.map((item) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 text-sm mb-2">{item.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{item.institution}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">유사도</span>
                  <span className="text-sm font-semibold text-blue-600">{item.similarity}%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">성공률</span>
                  <span className="text-sm font-semibold text-green-600">{item.successRate}%</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{item.reason}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900">
                    {formatCurrency(item.budget)}
                  </span>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                    참여판단
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 알림 센터 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">실시간 알림</h3>
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-800">
                확인
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
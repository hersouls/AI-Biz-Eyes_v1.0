import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  FileText,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Settings,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { AdvancedCard, AdvancedButton, AdvancedModal } from '../ui';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const trendData = [
  { month: '1월', 공고수: 45, 참여수: 32, 성공률: 71 },
  { month: '2월', 공고수: 52, 참여수: 38, 성공률: 73 },
  { month: '3월', 공고수: 48, 참여수: 41, 성공률: 85 },
  { month: '4월', 공고수: 61, 참여수: 47, 성공률: 77 },
  { month: '5월', 공고수: 55, 참여수: 43, 성공률: 78 },
  { month: '6월', 공고수: 67, 참여수: 52, 성공률: 78 },
];

const categoryData = [
  { name: 'IT/소프트웨어', value: 35, color: '#3B82F6' },
  { name: '제조업', value: 25, color: '#10B981' },
  { name: '바이오/헬스케어', value: 20, color: '#F59E0B' },
  { name: '에너지/환경', value: 15, color: '#EF4444' },
  { name: '기타', value: 5, color: '#8B5CF6' },
];

const recentActivities = [
  { id: 1, type: 'success', title: '2024년 AI 기술개발사업 선정', time: '2시간 전', status: '선정' },
  { id: 2, type: 'warning', title: '디지털 전환 지원사업 마감 임박', time: '4시간 전', status: '마감임박' },
  { id: 3, type: 'info', title: '스마트팩토리 구축사업 접수 완료', time: '6시간 전', status: '접수완료' },
  { id: 4, type: 'success', title: '친환경 에너지 사업 2차 심사 통과', time: '1일 전', status: '심사통과' },
];

export default function EnhancedDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const KPIStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">1,247</h3>
        <p className="text-sm text-gray-600 mb-2">총 공고 수</p>
        <div className="flex items-center justify-center text-green-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          +12.5%
        </div>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 mx-auto">
          <Award className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">89</h3>
        <p className="text-sm text-gray-600 mb-2">선정 사업</p>
        <div className="flex items-center justify-center text-green-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          +8.2%
        </div>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 mx-auto">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">156</h3>
        <p className="text-sm text-gray-600 mb-2">진행 중</p>
        <div className="flex items-center justify-center text-blue-600 text-sm">
          <Activity className="w-4 h-4 mr-1" />
          진행중
        </div>
      </AdvancedCard>

      <AdvancedCard variant="elevated" hover className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4 mx-auto">
          <Clock className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">23</h3>
        <p className="text-sm text-gray-600 mb-2">마감 임박</p>
        <div className="flex items-center justify-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          긴급
        </div>
      </AdvancedCard>
    </div>
  );

  const TrendChart = () => (
    <AdvancedCard variant="elevated" header={
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">월별 트렌드</h3>
        <div className="flex space-x-2">
          <AdvancedButton size="sm" variant="ghost">공고수</AdvancedButton>
          <AdvancedButton size="sm" variant="ghost">참여수</AdvancedButton>
          <AdvancedButton size="sm" variant="ghost">성공률</AdvancedButton>
        </div>
      </div>
    }>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="공고수" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="참여수" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="성공률" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AdvancedCard>
  );

  const CategoryChart = () => (
    <AdvancedCard variant="elevated" header={
      <h3 className="text-lg font-semibold text-gray-900">업종별 분포</h3>
    }>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {categoryData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600">{item.name}</span>
            <span className="ml-auto text-sm font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </AdvancedCard>
  );

  const RecentActivityList = () => (
    <AdvancedCard variant="elevated" header={
      <h3 className="text-lg font-semibold text-gray-900">최근 활동</h3>
    }>
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              activity.type === 'success' ? 'bg-green-100' :
              activity.type === 'warning' ? 'bg-yellow-100' :
              'bg-blue-100'
            }`}>
              {activity.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : activity.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              ) : (
                <Clock className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              activity.status === '선정' ? 'bg-green-100 text-green-800' :
              activity.status === '마감임박' ? 'bg-red-100 text-red-800' :
              activity.status === '접수완료' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </AdvancedCard>
  );

  const QuickActions = () => (
    <AdvancedCard variant="filled" className="bg-gradient-to-r from-primary to-secondary text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2">빠른 액션</h3>
          <p className="text-white/80">자주 사용하는 기능에 빠르게 접근하세요</p>
        </div>
        <div className="flex space-x-3">
          <AdvancedButton variant="ghost" size="lg" className="text-white border-white/20 hover:bg-white/10">
            <Plus className="w-5 h-5 mr-2" />
            새 공고 등록
          </AdvancedButton>
          <AdvancedButton variant="ghost" size="lg" className="text-white border-white/20 hover:bg-white/10">
            <Search className="w-5 h-5 mr-2" />
            공고 검색
          </AdvancedButton>
          <AdvancedButton variant="ghost" size="lg" className="text-white border-white/20 hover:bg-white/10">
            <Filter className="w-5 h-5 mr-2" />
            필터 설정
          </AdvancedButton>
        </div>
      </div>
    </AdvancedCard>
  );

  return (
    <div className="space-y-8 font-pretendard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Biz Eyes 대시보드</h1>
          <p className="text-gray-600">실시간 공고 현황 및 참여 관리 통합 플랫폼</p>
        </div>
        <div className="flex space-x-3">
          <AdvancedButton variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
            새로고침
          </AdvancedButton>
          <AdvancedButton variant="outline" icon={<Download className="w-4 h-4" />}>
            리포트
          </AdvancedButton>
          <AdvancedButton variant="primary" icon={<Settings className="w-4 h-4" />}>
            설정
          </AdvancedButton>
        </div>
      </div>

      {/* KPI Stats */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">전체 현황 요약</h2>
          <p className="text-gray-600">실시간 공고 통계 및 주요 지표</p>
        </div>
        <KPIStats />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrendChart />
        <CategoryChart />
      </section>

      {/* Recent Activity and Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentActivityList />
        </div>
        <div>
          <QuickActions />
        </div>
      </section>

      {/* Modal Example */}
      <AdvancedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="새 공고 등록"
        size="lg"
      >
        <div className="space-y-4">
          <p>새로운 공고를 등록하는 모달 예시입니다.</p>
          <div className="flex justify-end space-x-3">
            <AdvancedButton variant="outline" onClick={() => setIsModalOpen(false)}>
              취소
            </AdvancedButton>
            <AdvancedButton variant="primary">
              등록
            </AdvancedButton>
          </div>
        </div>
      </AdvancedModal>
    </div>
  );
}
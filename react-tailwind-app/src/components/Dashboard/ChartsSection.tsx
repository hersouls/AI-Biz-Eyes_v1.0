import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

// Sample data for charts
const bidTypeData = [
  { name: '공사', value: 45, count: 234 },
  { name: '용역', value: 30, count: 156 },
  { name: '물품', value: 15, count: 78 },
  { name: '연구', value: 10, count: 52 }
];

const monthlyTrendData = [
  { month: '1월', 신규공고: 120, 참여공고: 45, 수주공고: 12 },
  { month: '2월', 신규공고: 135, 참여공고: 52, 수주공고: 15 },
  { month: '3월', 신규공고: 148, 참여공고: 58, 수주공고: 18 },
  { month: '4월', 신규공고: 162, 참여공고: 63, 수주공고: 21 },
  { month: '5월', 신규공고: 178, 참여공고: 71, 수주공고: 24 },
  { month: '6월', 신규공고: 195, 참여공고: 78, 수주공고: 28 }
];

const institutionData = [
  { name: '조달청', 공고수: 45 },
  { name: '국토교통부', 공고수: 38 },
  { name: '과학기술정보통신부', 공고수: 32 },
  { name: '산업통상자원부', 공고수: 28 },
  { name: '교육부', 공고수: 25 },
  { name: '기타', 공고수: 67 }
];

const statusData = [
  { name: '검토중', value: 35, color: '#3B82F6' },
  { name: '참여결정', value: 25, color: '#10B981' },
  { name: '제안서작성', value: 20, color: '#F59E0B' },
  { name: '제출완료', value: 15, color: '#8B5CF6' },
  { name: '대기', value: 5, color: '#EF4444' }
];

// const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 공고 유형별 분포 Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">공고 유형별 분포</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bidTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'value' ? `${value}%` : `${value}건`,
                name === 'value' ? '비율' : '건수'
              ]}
            />
            <Bar dataKey="count" fill="#3B82F6" name="공고수" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 참여 상태별 Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">참여 상태별 현황</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, '비율']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 월별 트렌드 Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 공고 트렌드</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="신규공고" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="참여공고" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="수주공고" 
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 기관별 공고 현황 */}
      <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 기관별 공고 현황</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={institutionData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="공고수" fill="#119891" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
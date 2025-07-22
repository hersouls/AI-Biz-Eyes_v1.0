import React, { useState } from 'react';
import { 
  ArrowDownTrayIcon, 
  DocumentArrowDownIcon, 
  CogIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  format: 'excel' | 'csv' | 'json';
  icon: React.ComponentType<any>;
}

const exportOptions: ExportOption[] = [
  {
    id: 'work-history',
    name: '업무 이력',
    description: '내가 처리한 공고, 알림, 레퍼런스 내역',
    format: 'excel',
    icon: DocumentArrowDownIcon
  },
  {
    id: 'activity-log',
    name: '활동 로그',
    description: '최근 액션, 로그인 이력, 성과 요약',
    format: 'csv',
    icon: CalendarIcon
  },
  {
    id: 'personal-settings',
    name: '개인화 설정',
    description: '알림 설정, 대시보드 구성, 환경설정',
    format: 'json',
    icon: CogIcon
  },
  {
    id: 'performance-report',
    name: '성과 리포트',
    description: '참여사업, 수주금액, KPI 통계',
    format: 'excel',
    icon: CheckCircleIcon
  }
];

export const ExportSection: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    {
      id: 1,
      name: '업무 이력',
      date: '2024-01-15',
      status: 'completed',
      format: 'excel'
    },
    {
      id: 2,
      name: '활동 로그',
      date: '2024-01-10',
      status: 'completed',
      format: 'csv'
    }
  ]);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleExport = async () => {
    if (selectedOptions.length === 0) {
      alert('내보낼 항목을 선택해주세요.');
      return;
    }

    setIsExporting(true);
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      setIsExporting(false);
      alert('내보내기가 완료되었습니다.');
      
      // 내보내기 이력에 추가
      const newExport = {
        id: Date.now(),
        name: selectedOptions.join(', '),
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        format: 'excel'
      };
      setExportHistory(prev => [newExport, ...prev]);
      setSelectedOptions([]);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 내보내기</h2>
        <p className="text-gray-600">
          내 업무 이력, 활동 로그, 개인화 설정 등을 다양한 형식으로 내보낼 수 있습니다.
        </p>
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">내보낼 항목 선택</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedOptions.includes(option.id);
            
            return (
              <div
                key={option.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleOptionToggle(option.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{option.name}</h4>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleOptionToggle(option.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {option.format.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">기간 설정 (선택사항)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작일
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료일
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={selectedOptions.length === 0 || isExporting}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedOptions.length === 0 || isExporting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
          {isExporting ? '내보내는 중...' : '선택한 항목 내보내기'}
        </button>
      </div>

      {/* Export History */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">내보내기 이력</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {exportHistory.map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(item.status)}
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.date} • {item.format.toUpperCase()}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                다시 다운로드
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Report } from '../../types/notification';
import Card from '../Card';
import Button from '../Button';
import { BarChart3, X } from 'lucide-react';

interface ReportDetailProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportDetail: React.FC<ReportDetailProps> = ({
  report,
  isOpen,
  onClose
}) => {
  if (!isOpen || !report) return null;

  const handleDownload = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      const { NotificationService } = await import('../../services/notificationService');
      const blob = await NotificationService.downloadReport(report.id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${report.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('리포트 다운로드 실패:', error);
      alert('리포트 다운로드에 실패했습니다.');
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'daily':
        return '일간';
      case 'weekly':
        return '주간';
      case 'monthly':
        return '월간';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">리포트 상세</h2>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {getReportTypeLabel(report.type)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </div>

        {/* 리포트 정보 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700">리포트 유형</label>
                  <p className="text-gray-900">{getReportTypeLabel(report.type)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">생성일시</label>
                  <p className="text-gray-900">{formatDate(report.generatedAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">기간</label>
                  <p className="text-gray-900">
                    {formatDate(report.period.startDate)} ~ {formatDate(report.period.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* 요약 통계 */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">요약 통계</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {report.summary.newBids}
                </div>
                <div className="text-sm text-gray-600">신규 공고</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {report.summary.deadlineBids}
                </div>
                <div className="text-sm text-gray-600">마감 공고</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {report.summary.missingBids}
                </div>
                <div className="text-sm text-gray-600">누락 공고</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {report.summary.duplicateBids}
                </div>
                <div className="text-sm text-gray-600">중복 공고</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {report.summary.successRate}%
                </div>
                <div className="text-sm text-gray-600">성공률</div>
              </div>
            </div>
          </Card>

          {/* 차트 데이터 */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">차트 데이터</h3>
            
            {/* 공고 유형 분포 */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">공고 유형 분포</h4>
              <div className="space-y-2">
                {report.charts.bidTypeDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{item.type}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count}건</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 상태 분포 */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">상태 분포</h4>
              <div className="space-y-2">
                {report.charts.statusDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{item.status}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count}건</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 주간 트렌드 */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">주간 트렌드</h4>
              <div className="space-y-2">
                {report.charts.weeklyTrend.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{formatDate(item.date)}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count}건</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 다운로드 옵션 */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">다운로드</h3>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleDownload('pdf')}
                variant="outline"
              >
                PDF 다운로드
              </Button>
              <Button
                onClick={() => handleDownload('excel')}
                variant="outline"
              >
                Excel 다운로드
              </Button>
              <Button
                onClick={() => handleDownload('csv')}
                variant="outline"
              >
                CSV 다운로드
              </Button>
            </div>
          </Card>

          {/* 닫기 버튼 */}
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
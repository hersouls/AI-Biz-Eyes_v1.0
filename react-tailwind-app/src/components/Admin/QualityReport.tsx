import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { QualityReport as QualityReportType } from '../../types/admin';
import AdminLayout from './AdminLayout';
import Badge from '../Badge';
import Card from '../Card';
import Select from '../Select';
import Button from '../Button';

const QualityReport: React.FC = () => {
  const [report, setReport] = useState<QualityReportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('week');
  const [generatedAt, setGeneratedAt] = useState<string>('');

  useEffect(() => {
    loadQualityReport();
  }, [period]);

  const loadQualityReport = async () => {
    try {
      setLoading(true);
      const response = await adminService.getQualityReport(period);
      if (response.data) {
        setReport(response.data.report);
        setGeneratedAt(response.data.generatedAt);
      }
      setError(null);
    } catch (err) {
      setError('품질 리포트를 불러오는데 실패했습니다.');
      console.error('Failed to load quality report:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'blue', text: '낮음', icon: InformationCircleIcon },
      medium: { color: 'yellow', text: '보통', icon: ExclamationTriangleIcon },
      high: { color: 'orange', text: '높음', icon: ExclamationTriangleIcon },
      critical: { color: 'red', text: '위험', icon: XCircleIcon }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low;
    const Icon = config.icon;
    return (
      <Badge variant={config.color as any} className="flex items-center">
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'red', text: '열림', icon: ExclamationTriangleIcon },
      in_progress: { color: 'yellow', text: '진행중', icon: ClockIcon },
      resolved: { color: 'green', text: '해결됨', icon: CheckCircleIcon },
      closed: { color: 'gray', text: '닫힘', icon: CheckCircleIcon }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    const Icon = config.icon;
    return (
      <Badge variant={config.color as any} className="flex items-center">
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const handleExport = () => {
    // 실제 구현에서는 PDF나 Excel로 내보내기
    const reportData = {
      period: report?.period,
      summary: report?.summary,
      categories: report?.categories,
      recommendations: report?.recommendations,
      generatedAt
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quality-report-${period}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600">
          <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!report) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-600">
          <p>품질 리포트 데이터가 없습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">품질 리포트</h1>
            <p className="text-gray-600">시스템 품질 분석 및 개선 권장사항</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={period}
              onChange={setPeriod}
              options={[
                { value: 'day', label: '일간' },
                { value: 'week', label: '주간' },
                { value: 'month', label: '월간' }
              ]}
            />
            <Button onClick={handleExport} className="flex items-center">
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              내보내기
            </Button>
          </div>
        </div>

        {/* 리포트 정보 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600">리포트 기간</p>
              <p className="font-medium text-blue-900">
                {new Date(report.period.start).toLocaleDateString('ko-KR')} ~ {new Date(report.period.end).toLocaleDateString('ko-KR')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">생성 시간</p>
              <p className="font-medium text-blue-900">
                {new Date(generatedAt).toLocaleString('ko-KR')}
              </p>
            </div>
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 이슈</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(report.summary.totalIssues)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">위험 이슈</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(report.summary.criticalIssues)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">해결된 이슈</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(report.summary.resolvedIssues)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">미해결 이슈</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(report.summary.openIssues)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 트렌드 차트 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">일간 트렌드</h2>
            </div>
            <div className="space-y-3">
              {report.trends.daily.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{day.date}</p>
                    <p className="text-xs text-gray-500">이슈: {day.issues}, 해결: {day.resolved}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">{day.issues}</span>
                    <ArrowTrendingDownIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">{day.resolved}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">주간 트렌드</h2>
            </div>
            <div className="space-y-3">
              {report.trends.weekly.map((week, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{week.week}</p>
                    <p className="text-xs text-gray-500">이슈: {week.issues}, 해결: {week.resolved}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">{week.issues}</span>
                    <ArrowTrendingDownIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">{week.resolved}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 카테고리별 분포 */}
        <Card>
          <div className="flex items-center mb-4">
            <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">카테고리별 이슈 분포</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {report.categories.map((category, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{category.count}</p>
                <p className="text-sm text-gray-600">{category.category}</p>
                <p className="text-xs text-gray-500">{category.percentage}%</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 개선 권장사항 */}
        <Card>
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">개선 권장사항</h2>
          </div>
          <div className="space-y-4">
            {report.recommendations.map((recommendation) => (
              <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{recommendation.title}</h3>
                  <div className="flex space-x-2">
                    {getPriorityBadge(recommendation.priority)}
                    {getStatusBadge(recommendation.status)}
                  </div>
                </div>
                <p className="text-gray-600">{recommendation.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default QualityReport;
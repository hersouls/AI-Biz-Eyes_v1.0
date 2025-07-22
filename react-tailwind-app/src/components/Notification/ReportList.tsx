import React, { useState, useEffect } from 'react';
import { Report } from '../../types/notification';
import { NotificationService } from '../../services/notificationService';
import { Card } from '../Card';
import { Button } from '../Button';
import { Select } from '../Select';
import { Input } from '../Input';

interface ReportListProps {
  onReportClick?: (report: Report) => void;
}

export const ReportList: React.FC<ReportListProps> = ({ onReportClick }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // 리포트 생성 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: 'daily' as 'daily' | 'weekly' | 'monthly',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadReports();
  }, [selectedType, pagination.page]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getReports(
        selectedType || undefined,
        pagination.page,
        pagination.limit
      );
      setReports(response.reports);
      setPagination(response.pagination);
    } catch (error) {
      console.error('리포트 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    if (!createForm.startDate || !createForm.endDate) {
      alert('시작일과 종료일을 입력해주세요.');
      return;
    }

    try {
      setCreating(true);
      await NotificationService.generateReport(
        createForm.type,
        createForm.startDate,
        createForm.endDate
      );
      setShowCreateModal(false);
      setCreateForm({
        type: 'daily',
        startDate: '',
        endDate: ''
      });
      loadReports();
    } catch (error) {
      console.error('리포트 생성 실패:', error);
      alert('리포트 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      const blob = await NotificationService.downloadReport(reportId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.${format}`;
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
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">리포트</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          새 리포트 생성
        </Button>
      </div>

      {/* 필터 */}
      <Card>
        <div className="flex items-center space-x-4">
          <Select
            label="리포트 유형"
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: '', label: '전체' },
              { value: 'daily', label: '일간' },
              { value: 'weekly', label: '주간' },
              { value: 'monthly', label: '월간' }
            ]}
          />
          <div className="flex items-end">
            <Button onClick={loadReports} variant="outline">
              필터 적용
            </Button>
          </div>
        </div>
      </Card>

      {/* 리포트 목록 */}
      <Card>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">리포트를 불러오는 중...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">리포트가 없습니다.</p>
            </div>
          ) : (
            <>
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {getReportTypeLabel(report.type)}
                        </span>
                      </div>

                      {/* 요약 통계 */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {report.summary.newBids}
                          </div>
                          <div className="text-sm text-gray-600">신규 공고</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {report.summary.deadlineBids}
                          </div>
                          <div className="text-sm text-gray-600">마감 공고</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {report.summary.missingBids}
                          </div>
                          <div className="text-sm text-gray-600">누락 공고</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {report.summary.duplicateBids}
                          </div>
                          <div className="text-sm text-gray-600">중복 공고</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {report.summary.successRate}%
                          </div>
                          <div className="text-sm text-gray-600">성공률</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>
                          <span>기간: {formatDate(report.period.startDate)} ~ {formatDate(report.period.endDate)}</span>
                          <span className="mx-2">•</span>
                          <span>생성일: {formatDate(report.generatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReportClick?.(report)}
                      >
                        상세보기
                      </Button>
                      
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(report.id, 'pdf')}
                        >
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(report.id, 'excel')}
                        >
                          Excel
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(report.id, 'csv')}
                        >
                          CSV
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 페이지네이션 */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    {pagination.total}개 중 {(pagination.page - 1) * pagination.limit + 1}-
                    {Math.min(pagination.page * pagination.limit, pagination.total)}개
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      이전
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      다음
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* 리포트 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">새 리포트 생성</h3>
            
            <div className="space-y-4">
              <Select
                label="리포트 유형"
                value={createForm.type}
                onChange={(value) => setCreateForm(prev => ({ ...prev, type: value as any }))}
                options={[
                  { value: 'daily', label: '일간' },
                  { value: 'weekly', label: '주간' },
                  { value: 'monthly', label: '월간' }
                ]}
              />
              
              <Input
                label="시작일"
                type="date"
                value={createForm.startDate}
                onChange={(e) => setCreateForm(prev => ({ ...prev, startDate: e.target.value }))}
              />
              
              <Input
                label="종료일"
                type="date"
                value={createForm.endDate}
                onChange={(e) => setCreateForm(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            
            <div className="flex space-x-2 mt-6">
              <Button
                onClick={handleCreateReport}
                disabled={creating}
                className="flex-1"
              >
                {creating ? '생성 중...' : '생성'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
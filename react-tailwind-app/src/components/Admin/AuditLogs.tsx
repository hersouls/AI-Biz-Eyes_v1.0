import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  UserIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { AuditLog } from '../../types/admin';
import AdminLayout from './AdminLayout';
import Badge from '../Badge';
import Table from '../Table';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    severity: '',
    category: '',
    userId: '',
    startDate: '',
    endDate: '',
    action: '',
    resource: ''
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, [pagination.page, filters]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await adminService.getAuditLogs({
        ...params,
        userId: params.userId ? parseInt(params.userId) : undefined
      });
      if (response.data) {
        setLogs(response.data.logs);
        setPagination(response.data.pagination);
      }
      setError(null);
    } catch (err) {
      setError('감사 로그를 불러오는데 실패했습니다.');
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { color: 'blue', text: '낮음', icon: ExclamationTriangleIcon },
      medium: { color: 'yellow', text: '보통', icon: ExclamationTriangleIcon },
      high: { color: 'orange', text: '높음', icon: ShieldExclamationIcon },
      critical: { color: 'red', text: '위험', icon: XCircleIcon }
    };
    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.low;
    const Icon = config.icon;
    return (
      <Badge variant={config.color as any} className="flex items-center">
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      user_activity: { color: 'blue', text: '사용자 활동' },
      data_access: { color: 'green', text: '데이터 접근' },
      system_change: { color: 'purple', text: '시스템 변경' },
      security_event: { color: 'red', text: '보안 이벤트' }
    };
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.user_activity;
    return <Badge variant={config.color as any}>{config.text}</Badge>;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const openDetailModal = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedLog(null);
    setShowDetailModal(false);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await adminService.exportAuditLogs({
        format: 'csv',
        startDate: filters.startDate,
        endDate: filters.endDate,
        severity: filters.severity,
        category: filters.category
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('감사 로그 내보내기에 실패했습니다.');
      console.error('Failed to export audit logs:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: String(value) }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      severity: '',
      category: '',
      userId: '',
      startDate: '',
      endDate: '',
      action: '',
      resource: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const columns = [
    {
      key: 'timestamp',
      header: '시간',
      render: (log: AuditLog) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Date(log.timestamp).toLocaleDateString('ko-KR')}
          </div>
          <div className="text-gray-500">
            {new Date(log.timestamp).toLocaleTimeString('ko-KR')}
          </div>
        </div>
      )
    },
    {
      key: 'userName',
      header: '사용자',
      render: (log: AuditLog) => (
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900">
            {log.userName || '시스템'}
          </span>
        </div>
      )
    },
    {
      key: 'action',
      header: '액션',
      render: (log: AuditLog) => (
        <span className="text-sm font-medium text-gray-900">
          {truncateText(log.action, 30)}
        </span>
      )
    },
    {
      key: 'resource',
      header: '리소스',
      render: (log: AuditLog) => (
        <span className="text-sm text-gray-600">
          {log.resource}
        </span>
      )
    },
    {
      key: 'severity',
      header: '심각도',
      render: (log: AuditLog) => getSeverityBadge(log.severity)
    },
    {
      key: 'category',
      header: '카테고리',
      render: (log: AuditLog) => getCategoryBadge(log.category)
    },
    {
      key: 'ipAddress',
      header: 'IP 주소',
      render: (log: AuditLog) => (
        <span className="text-sm text-gray-600 font-mono">
          {log.ipAddress || '-'}
        </span>
      )
    },
    {
      key: 'actions',
      header: '액션',
      render: (log: AuditLog) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openDetailModal(log)}
          className="text-blue-600 hover:text-blue-800"
        >
          <EyeIcon className="h-4 w-4 mr-1" />
          상세
        </Button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">감사 로그 관리</h1>
            <p className="text-gray-600">시스템 활동 및 보안 이벤트 추적</p>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            {exporting ? '내보내는 중...' : '내보내기'}
          </Button>
        </div>

        {/* 필터 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">필터</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="심각도"
              value={filters.severity}
              onChange={(value) => handleFilterChange('severity', value)}
              options={[
                { value: '', label: '전체' },
                { value: 'low', label: '낮음' },
                { value: 'medium', label: '보통' },
                { value: 'high', label: '높음' },
                { value: 'critical', label: '위험' }
              ]}
            />
            <Select
              label="카테고리"
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              options={[
                { value: '', label: '전체' },
                { value: 'user_activity', label: '사용자 활동' },
                { value: 'data_access', label: '데이터 접근' },
                { value: 'system_change', label: '시스템 변경' },
                { value: 'security_event', label: '보안 이벤트' }
              ]}
            />
            <Input
              label="사용자 ID"
              type="number"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              placeholder="사용자 ID 입력"
            />
            <Input
              label="액션"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              placeholder="액션 검색"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="시작일"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <Input
              label="종료일"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={clearFilters}>
              필터 초기화
            </Button>
            <Button onClick={loadAuditLogs}>
              검색
            </Button>
          </div>
        </div>

        {/* 로그 테이블 */}
        <div className="bg-white rounded-lg shadow">
          <Table
            columns={columns}
            data={logs}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            emptyMessage="감사 로그가 없습니다."
          />
        </div>

        {/* 상세 모달 */}
        {showDetailModal && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">감사 로그 상세</h3>
                <Button variant="ghost" onClick={closeDetailModal}>
                  <XCircleIcon className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">로그 ID</label>
                    <p className="text-sm text-gray-900">{selectedLog.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">시간</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedLog.timestamp).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">사용자</label>
                    <p className="text-sm text-gray-900">{selectedLog.userName || '시스템'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">IP 주소</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.ipAddress || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">액션</label>
                    <p className="text-sm text-gray-900">{selectedLog.action}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">리소스</label>
                    <p className="text-sm text-gray-900">{selectedLog.resource}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">심각도</label>
                    <div className="mt-1">{getSeverityBadge(selectedLog.severity)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">카테고리</label>
                    <div className="mt-1">{getCategoryBadge(selectedLog.category)}</div>
                  </div>
                </div>
                
                {selectedLog.resourceId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">리소스 ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.resourceId}</p>
                  </div>
                )}
                
                {selectedLog.sessionId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">세션 ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.sessionId}</p>
                  </div>
                )}
                
                {selectedLog.requestId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">요청 ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.requestId}</p>
                  </div>
                )}
                
                {selectedLog.userAgent && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">사용자 에이전트</label>
                    <p className="text-sm text-gray-900 font-mono break-all">{selectedLog.userAgent}</p>
                  </div>
                )}
                
                {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">상세 정보</label>
                    <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={closeDetailModal}>
                  닫기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AuditLogs;
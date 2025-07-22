import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ServerIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { QualityMetrics } from '../../types/admin';
import AdminLayout from './AdminLayout';
import Badge from '../Badge';
import Card from '../Card';

const QualityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadQualityMetrics();
    const interval = setInterval(loadQualityMetrics, 30000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const loadQualityMetrics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getQualityMetrics();
      if (response.data) {
        setMetrics(response.data.metrics);
        setLastUpdated(response.data.lastUpdated);
      }
      setError(null);
    } catch (err) {
      setError('품질 메트릭을 불러오는데 실패했습니다.');
      console.error('Failed to load quality metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = (value: number, threshold: number) => {
    if (value >= threshold) return 'good';
    if (value >= threshold * 0.8) return 'warning';
    return 'critical';
  };

  const getUptimeStatus = (uptime: number) => {
    if (uptime >= 99.9) return 'good';
    if (uptime >= 99.0) return 'warning';
    return 'critical';
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
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

  if (!metrics) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-600">
          <p>품질 메트릭 데이터가 없습니다.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">품질 관리 대시보드</h1>
            <p className="text-gray-600">시스템 품질 지표 모니터링</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">마지막 업데이트</p>
            <p className="text-sm font-medium">
              {new Date(lastUpdated).toLocaleString('ko-KR')}
            </p>
          </div>
        </div>

        {/* 시스템 건강도 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ServerIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">시스템 가동률</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.systemHealth.uptime}%
                </p>
                <Badge 
                  variant={getUptimeStatus(metrics.systemHealth.uptime) === 'good' ? 'success' : 
                          getUptimeStatus(metrics.systemHealth.uptime) === 'warning' ? 'warning' : 'danger'}
                  className="mt-1"
                >
                  {getUptimeStatus(metrics.systemHealth.uptime) === 'good' ? '정상' :
                   getUptimeStatus(metrics.systemHealth.uptime) === 'warning' ? '주의' : '위험'}
                </Badge>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 응답시간</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.systemHealth.responseTime}ms
                </p>
                <Badge 
                  variant={getHealthStatus(metrics.systemHealth.responseTime, 500) === 'good' ? 'success' : 
                          getHealthStatus(metrics.systemHealth.responseTime, 500) === 'warning' ? 'warning' : 'danger'}
                  className="mt-1"
                >
                  {getHealthStatus(metrics.systemHealth.responseTime, 500) === 'good' ? '빠름' :
                   getHealthStatus(metrics.systemHealth.responseTime, 500) === 'warning' ? '보통' : '느림'}
                </Badge>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">오류율</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.systemHealth.errorRate}%
                </p>
                <Badge 
                  variant={getHealthStatus(100 - metrics.systemHealth.errorRate, 95) === 'good' ? 'success' : 
                          getHealthStatus(100 - metrics.systemHealth.errorRate, 95) === 'warning' ? 'warning' : 'danger'}
                  className="mt-1"
                >
                  {getHealthStatus(100 - metrics.systemHealth.errorRate, 95) === 'good' ? '낮음' :
                   getHealthStatus(100 - metrics.systemHealth.errorRate, 95) === 'warning' ? '보통' : '높음'}
                </Badge>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">성공률</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.systemHealth.successRate}%
                </p>
                <Badge 
                  variant={getHealthStatus(metrics.systemHealth.successRate, 95) === 'good' ? 'success' : 
                          getHealthStatus(metrics.systemHealth.successRate, 95) === 'warning' ? 'warning' : 'danger'}
                  className="mt-1"
                >
                  {getHealthStatus(metrics.systemHealth.successRate, 95) === 'good' ? '우수' :
                   getHealthStatus(metrics.systemHealth.successRate, 95) === 'warning' ? '보통' : '낮음'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* 데이터 품질 */}
        <Card>
          <div className="flex items-center mb-4">
                            <ServerIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">데이터 품질</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(metrics.dataQuality.totalRecords)}
              </p>
              <p className="text-sm text-gray-600">전체 레코드</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(metrics.dataQuality.validRecords)}
              </p>
              <p className="text-sm text-gray-600">유효 레코드</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {formatNumber(metrics.dataQuality.duplicateRecords)}
              </p>
              <p className="text-sm text-gray-600">중복 레코드</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {metrics.dataQuality.missingDataRate}%
              </p>
              <p className="text-sm text-gray-600">누락 데이터율</p>
            </div>
          </div>
        </Card>

        {/* API 성능 */}
        <Card>
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">API 성능</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(metrics.apiPerformance.totalCalls)}
              </p>
              <p className="text-sm text-gray-600">총 호출 수</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(metrics.apiPerformance.successCalls)}
              </p>
              <p className="text-sm text-gray-600">성공 호출</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {formatNumber(metrics.apiPerformance.failedCalls)}
              </p>
              <p className="text-sm text-gray-600">실패 호출</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {metrics.apiPerformance.averageResponseTime}ms
              </p>
              <p className="text-sm text-gray-600">평균 응답시간</p>
            </div>
          </div>
        </Card>

        {/* 사용자 활동 */}
        <Card>
          <div className="flex items-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">사용자 활동</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(metrics.userActivity.activeUsers)}
              </p>
              <p className="text-sm text-gray-600">활성 사용자</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(metrics.userActivity.totalSessions)}
              </p>
              <p className="text-sm text-gray-600">총 세션</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatDuration(metrics.userActivity.averageSessionDuration)}
              </p>
              <p className="text-sm text-gray-600">평균 세션 시간</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {formatNumber(metrics.userActivity.pageViews)}
              </p>
              <p className="text-sm text-gray-600">페이지 뷰</p>
            </div>
          </div>
        </Card>

        {/* 보안 메트릭 */}
        <Card>
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">보안 메트릭</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {formatNumber(metrics.securityMetrics.failedLogins)}
              </p>
              <p className="text-sm text-gray-600">실패 로그인</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {formatNumber(metrics.securityMetrics.suspiciousActivities)}
              </p>
              <p className="text-sm text-gray-600">의심스러운 활동</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {formatNumber(metrics.securityMetrics.blockedRequests)}
              </p>
              <p className="text-sm text-gray-600">차단된 요청</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {new Date(metrics.securityMetrics.lastSecurityScan).toLocaleDateString('ko-KR')}
              </p>
              <p className="text-sm text-gray-600">마지막 보안 스캔</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default QualityDashboard;
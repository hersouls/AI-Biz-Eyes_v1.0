import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  CloudArrowUpIcon, 
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { BackupInfo } from '../../types/admin';
import { adminService } from '../../services/adminService';
import Button from '../Button';
import Badge from '../Badge';
import Card from '../Card';

const BackupManagement: React.FC = () => {
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [deletingBackup, setDeletingBackup] = useState<BackupInfo | null>(null);
  const [downloadingBackup, setDownloadingBackup] = useState<number | null>(null);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBackups();
      setBackups(response.data || []);
      setError(null);
    } catch (err) {
      setError('백업 목록을 불러오는데 실패했습니다.');
      console.error('Failed to load backups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setCreatingBackup(true);
      const response = await adminService.createBackup();
      setBackups(prev => [response.data!, ...prev]);
      setError(null);
    } catch (err) {
      setError('백업 생성에 실패했습니다.');
      console.error('Failed to create backup:', err);
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDownloadBackup = async (backupId: number) => {
    try {
      setDownloadingBackup(backupId);
      const blob = await adminService.downloadBackup(backupId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backupId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('백업 다운로드에 실패했습니다.');
      console.error('Failed to download backup:', err);
    } finally {
      setDownloadingBackup(null);
    }
  };

  const handleDeleteBackup = async () => {
    if (!deletingBackup) return;
    
    try {
      // Mock delete - in real implementation, call API
      setBackups(prev => prev.filter(backup => backup.id !== deletingBackup.id));
      setDeletingBackup(null);
    } catch (err) {
      setError('백업 삭제에 실패했습니다.');
      console.error('Failed to delete backup:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'in_progress': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'danger';
      case 'in_progress': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'failed': return '실패';
      case 'in_progress': return '진행중';
      default: return '알 수 없음';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'auto': return '자동';
      case 'manual': return '수동';
      default: return type;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">백업 관리</h1>
          <p className="text-gray-600">시스템 데이터 백업을 관리합니다.</p>
        </div>
        <Button
          onClick={handleCreateBackup}
          disabled={creatingBackup}
          className="flex items-center space-x-2"
        >
          {creatingBackup ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
          <span>{creatingBackup ? '백업 생성 중...' : '새 백업 생성'}</span>
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Backup Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">전체 백업</p>
              <p className="text-2xl font-semibold text-gray-900">{backups.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">성공</p>
              <p className="text-2xl font-semibold text-gray-900">
                {backups.filter(b => b.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">실패</p>
              <p className="text-2xl font-semibold text-gray-900">
                {backups.filter(b => b.status === 'failed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">진행중</p>
              <p className="text-2xl font-semibold text-gray-900">
                {backups.filter(b => b.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Backups List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">백업 목록</h2>
        
        {backups.length === 0 ? (
          <Card className="p-8 text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">백업이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">
              첫 번째 백업을 생성해보세요.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {backups.map((backup) => (
              <Card key={backup.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(backup.status)}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {backup.filename}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(backup.size)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(backup.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={getStatusColor(backup.status) as any}
                      className="text-xs"
                    >
                      {getStatusText(backup.status)}
                    </Badge>
                    
                    <Badge variant="secondary" className="text-xs">
                      {getTypeText(backup.type)}
                    </Badge>

                    <div className="flex items-center space-x-2">
                      {backup.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBackup(backup.id)}
                          disabled={downloadingBackup === backup.id}
                        >
                          {downloadingBackup === backup.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          ) : (
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingBackup(backup)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingBackup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center space-x-3 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-medium text-gray-900">백업 삭제</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                "{deletingBackup.filename}" 백업을 삭제하시겠습니까?
                <br />
                이 작업은 되돌릴 수 없습니다.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setDeletingBackup(null)}
                >
                  취소
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteBackup}
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManagement;
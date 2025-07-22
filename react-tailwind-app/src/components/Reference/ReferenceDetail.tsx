import React from 'react';
import { ReferenceData } from '../../types/reference';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface ReferenceDetailProps {
  reference: ReferenceData;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

const ReferenceDetail: React.FC<ReferenceDetailProps> = ({
  reference,
  onEdit,
  onDelete,
  onBack
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { color: 'green', text: '성공' },
      failure: { color: 'red', text: '실패' },
      ongoing: { color: 'blue', text: '진행중' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const getScoreBadge = (score: string) => {
    const scoreConfig = {
      'A+': { color: 'green', text: 'A+' },
      'A': { color: 'green', text: 'A' },
      'B': { color: 'yellow', text: 'B' },
      'C': { color: 'orange', text: 'C' },
      'D': { color: 'red', text: 'D' }
    };
    const config = scoreConfig[score as keyof typeof scoreConfig];
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">레퍼런스 상세</h1>
          <p className="text-gray-600">레퍼런스 정보를 확인합니다</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack}>
            목록으로
          </Button>
          <Button variant="outline" onClick={onEdit}>
            수정
          </Button>
          <Button color="red" variant="outline" onClick={onDelete}>
            삭제
          </Button>
        </div>
      </div>

      {/* 기본 정보 */}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">기본 정보</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">사업명</label>
            <p className="text-gray-900 font-medium">{reference.projectName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">사업유형</label>
            <p className="text-gray-900">{reference.projectType}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">참여기관</label>
            <p className="text-gray-900">{reference.organization}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">참여연도</label>
            <p className="text-gray-900">{reference.participationYear}년</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">계약금액</label>
            <p className="text-gray-900 font-medium">{formatAmount(reference.contractAmount)}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">성과상태</label>
            <div className="mt-1">{getStatusBadge(reference.status)}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">평가등급</label>
            <div className="mt-1">{getScoreBadge(reference.score)}</div>
          </div>
          
          {reference.bidNtceNo && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">연계 공고번호</label>
              <p className="text-gray-900">{reference.bidNtceNo}</p>
            </div>
          )}
        </div>
      </Card>

      {/* 사업 설명 */}
      {reference.description && (
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">사업 설명</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700 whitespace-pre-wrap">{reference.description}</p>
          </div>
        </Card>
      )}

      {/* 첨부파일 */}
      {reference.files && reference.files.length > 0 && (
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">첨부파일</h2>
          </div>
          <div className="space-y-3">
            {reference.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadFile(file)}
                >
                  다운로드
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 메타 정보 */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">메타 정보</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">등록일시</label>
            <p className="text-gray-900">{formatDate(reference.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">수정일시</label>
            <p className="text-gray-900">{formatDate(reference.updatedAt)}</p>
          </div>
        </div>
      </Card>

      {/* 유사 공고 매칭 */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">유사 공고 매칭</h2>
          <p className="text-sm text-gray-600">이 레퍼런스와 유사한 공고들을 확인할 수 있습니다</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-blue-700">
              AI 기반 유사 공고 매칭 기능을 통해 관련 공고를 자동으로 찾아드립니다
            </span>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" color="blue">
            유사 공고 찾기
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReferenceDetail;
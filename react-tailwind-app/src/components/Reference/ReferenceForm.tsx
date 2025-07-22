import React, { useState, useEffect } from 'react';
import { ReferenceData, ReferenceRequest, ReferenceFile } from '../../types/reference';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';

interface ReferenceFormProps {
  reference?: ReferenceData;
  onSubmit: (data: ReferenceRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ReferenceForm: React.FC<ReferenceFormProps> = ({
  reference,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<ReferenceRequest>({
    projectName: '',
    projectType: '',
    bidNtceNo: '',
    organization: '',
    participationYear: new Date().getFullYear(),
    contractAmount: 0,
    status: 'success',
    score: 'A',
    description: '',
    files: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (reference) {
      setFormData({
        projectName: reference.projectName,
        projectType: reference.projectType,
        bidNtceNo: reference.bidNtceNo || '',
        organization: reference.organization,
        participationYear: reference.participationYear,
        contractAmount: reference.contractAmount,
        status: reference.status,
        score: reference.score,
        description: reference.description || '',
        files: reference.files || []
      });
    }
  }, [reference]);

  const handleInputChange = (field: keyof ReferenceRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = '사업명을 입력해주세요';
    }

    if (!formData.projectType.trim()) {
      newErrors.projectType = '사업유형을 선택해주세요';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = '참여기관을 입력해주세요';
    }

    if (!formData.participationYear || formData.participationYear < 2000) {
      newErrors.participationYear = '유효한 참여연도를 입력해주세요';
    }

    if (!formData.contractAmount || formData.contractAmount <= 0) {
      newErrors.contractAmount = '유효한 계약금액을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: ReferenceFile[] = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type
      }));
      setFormData(prev => ({ ...prev, files: [...(prev.files || []), ...newFiles] }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files?.filter((_, i) => i !== index) || []
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {reference ? '레퍼런스 수정' : '새 레퍼런스 등록'}
          </h2>
          <p className="text-gray-600">
            {reference ? '레퍼런스 정보를 수정합니다' : '새로운 레퍼런스를 등록합니다'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업명 *
              </label>
              <Input
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="사업명을 입력하세요"
                error={errors.projectName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업유형 *
              </label>
              <Select
                value={formData.projectType}
                onChange={(value) => handleInputChange('projectType', value)}
                options={[
                  { value: '용역', label: '용역' },
                  { value: '개발', label: '개발' },
                  { value: '공사', label: '공사' },
                  { value: '물품', label: '물품' },
                  { value: '연구', label: '연구' },
                  { value: '컨설팅', label: '컨설팅' }
                ]}
                error={errors.projectType}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공고번호
              </label>
              <Input
                value={formData.bidNtceNo}
                onChange={(e) => handleInputChange('bidNtceNo', e.target.value)}
                placeholder="연계 공고번호 (선택사항)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참여기관 *
              </label>
              <Input
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder="참여기관명을 입력하세요"
                error={errors.organization}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참여연도 *
              </label>
              <Input
                type="number"
                value={formData.participationYear}
                onChange={(e) => handleInputChange('participationYear', parseInt(e.target.value))}
                placeholder="참여연도를 입력하세요"
                min="2000"
                max={new Date().getFullYear() + 1}
                error={errors.participationYear}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계약금액 *
              </label>
              <Input
                type="number"
                value={formData.contractAmount}
                onChange={(e) => handleInputChange('contractAmount', parseInt(e.target.value))}
                placeholder="계약금액을 입력하세요"
                min="0"
                error={errors.contractAmount}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성과상태 *
              </label>
              <Select
                value={formData.status}
                onChange={(value) => handleInputChange('status', value as any)}
                options={[
                  { value: 'success', label: '성공' },
                  { value: 'failure', label: '실패' },
                  { value: 'ongoing', label: '진행중' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평가등급 *
              </label>
              <Select
                value={formData.score}
                onChange={(value) => handleInputChange('score', value as any)}
                options={[
                  { value: 'A+', label: 'A+' },
                  { value: 'A', label: 'A' },
                  { value: 'B', label: 'B' },
                  { value: 'C', label: 'C' },
                  { value: 'D', label: 'D' }
                ]}
              />
            </div>
          </div>

          {/* 사업 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사업 설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="사업에 대한 상세 설명을 입력하세요"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 첨부파일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              첨부파일
            </label>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              {formData.files && formData.files.length > 0 && (
                <div className="space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        color="red"
                        onClick={() => removeFile(index)}
                      >
                        삭제
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              type="submit"
              color="blue"
              loading={loading}
            >
              {reference ? '수정' : '등록'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReferenceForm;
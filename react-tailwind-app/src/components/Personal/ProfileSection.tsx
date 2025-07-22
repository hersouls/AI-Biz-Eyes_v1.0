import React, { useState, useEffect } from 'react';
import { UserIcon, EnvelopeIcon, BuildingOfficeIcon, PhoneIcon, UserGroupIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { PersonalService } from '../../services/personalService';
import { UserProfile, ProfileUpdateRequest, PasswordChangeRequest } from '../../types/personal';
import { Button } from '../Button';
import { Input } from '../Input';
import { Badge } from '../Badge';

export const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState<ProfileUpdateRequest>({});
  const [passwordData, setPasswordData] = useState<PasswordChangeRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await PersonalService.getUserProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          organization: response.data.organization,
          phone: response.data.phone,
          department: response.data.department,
          position: response.data.position
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '프로필 정보를 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await PersonalService.updateProfile(formData);
      if (response.success && response.data) {
        setProfile(response.data);
        setIsEditing(false);
        setMessage({ type: 'success', text: '프로필이 성공적으로 업데이트되었습니다.' });
      } else {
        setMessage({ type: 'error', text: response.message || '프로필 업데이트에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '프로필 업데이트에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }

    try {
      setIsSaving(true);
      const response = await PersonalService.changePassword(passwordData);
      if (response.success) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다.' });
      } else {
        setMessage({ type: 'error', text: response.message || '비밀번호 변경에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '비밀번호 변경에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '관리자';
      case 'user': return '사용자';
      case 'guest': return '게스트';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'user': return 'blue';
      case 'guest': return 'gray';
      default: return 'gray';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500">프로필 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">내 정보</h2>
          <p className="mt-1 text-gray-600">개인 정보를 확인하고 수정할 수 있습니다.</p>
        </div>
        <div className="flex space-x-3">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="primary">
              정보 수정
            </Button>
          )}
          <Button 
            onClick={() => setIsChangingPassword(!isChangingPassword)} 
            variant="secondary"
          >
            비밀번호 변경
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">이름</label>
                {isEditing ? (
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="이름을 입력하세요"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">이메일</label>
                <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">소속</label>
                {isEditing ? (
                  <Input
                    value={formData.organization || ''}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="소속을 입력하세요"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile.organization}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <UserGroupIcon className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">부서</label>
                {isEditing ? (
                  <Input
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="부서를 입력하세요"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile.department || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <BriefcaseIcon className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">직책</label>
                {isEditing ? (
                  <Input
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="직책을 입력하세요"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile.position || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <PhoneIcon className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">연락처</label>
                {isEditing ? (
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="연락처를 입력하세요"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile.phone || '-'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">계정 정보</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">권한</label>
              <div className="mt-1">
                <Badge variant={getRoleColor(profile.role)}>
                  {getRoleLabel(profile.role)}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">계정 상태</label>
              <div className="mt-1">
                <Badge variant={profile.isActive ? 'green' : 'red'}>
                  {profile.isActive ? '활성' : '비활성'}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">최근 로그인</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString('ko-KR') : '-'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">가입일</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      {isChangingPassword && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">비밀번호 변경</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="현재 비밀번호"
            />
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="새 비밀번호"
            />
            <Input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="새 비밀번호 확인"
            />
          </div>
          <div className="mt-4 flex space-x-3">
            <Button onClick={handleChangePassword} variant="primary" disabled={isSaving}>
              {isSaving ? '변경 중...' : '비밀번호 변경'}
            </Button>
            <Button onClick={() => setIsChangingPassword(false)} variant="secondary">
              취소
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex space-x-3 pt-6 border-t">
          <Button onClick={handleSaveProfile} variant="primary" disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="secondary">
            취소
          </Button>
        </div>
      )}
    </div>
  );
};
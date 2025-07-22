import React from 'react';

// 날짜 포맷팅
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

// 시간 포맷팅
export const formatTime = (timeString: string): string => {
  if (!timeString) return '-';
  
  try {
    // HH:MM 형식으로 변환
    const time = timeString.replace(/(\d{2})(\d{2})/, '$1:$2');
    return time;
  } catch (error) {
    return timeString;
  }
};

// 날짜와 시간 포맷팅
export const formatDateTime = (dateString: string, timeString?: string): string => {
  const date = formatDate(dateString);
  const time = timeString ? formatTime(timeString) : '';
  
  return time ? `${date} ${time}` : date;
};

// 금액 포맷팅 (원 단위)
export const formatCurrency = (amount: string | number): string => {
  if (!amount || amount === '0') return '-';
  
  const numAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  
  if (isNaN(numAmount)) return '-';
  
  // 만원 단위로 변환
  const manWon = numAmount / 10000;
  
  if (manWon >= 10000) {
    // 억 단위
    const billion = Math.floor(manWon / 10000);
    const million = manWon % 10000;
    return million > 0 ? `${billion}억 ${million.toLocaleString()}만원` : `${billion}억원`;
  } else {
    // 만원 단위
    return `${manWon.toLocaleString()}만원`;
  }
};

// 상태 배지 컴포넌트
export const getStatusBadge = (status: string) => {
  const statusConfig = {
    '일반공고': {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: '일반'
    },
    '긴급공고': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: '긴급'
    },
    '정정공고': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: '정정'
    },
    '재공고': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: '재공고'
    },
    '취소공고': {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      label: '취소'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: status
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// 업무구분 배지 컴포넌트
export const getBusinessTypeBadge = (businessType: string) => {
  const typeConfig = {
    '공사': {
      bg: 'bg-blue-100',
      text: 'text-blue-800'
    },
    '용역': {
      bg: 'bg-green-100',
      text: 'text-green-800'
    },
    '물품': {
      bg: 'bg-purple-100',
      text: 'text-purple-800'
    },
    '기타': {
      bg: 'bg-gray-100',
      text: 'text-gray-800'
    }
  };

  const config = typeConfig[businessType as keyof typeof typeConfig] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {businessType}
    </span>
  );
};

// 긴급 여부 배지
export const getUrgentBadge = (isUrgent: boolean) => {
  if (!isUrgent) return null;
  
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
      긴급
    </span>
  );
};

// 마감임박 배지
export const getDeadlineNearBadge = (isDeadlineNear: boolean) => {
  if (!isDeadlineNear) return null;
  
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
      마감임박
    </span>
  );
};

// 신규 배지
export const getNewBadge = (isNew: boolean) => {
  if (!isNew) return null;
  
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      신규
    </span>
  );
};

// 참여 상태 배지
export const getParticipationStatusBadge = (status?: string) => {
  if (!status) return null;
  
  const statusConfig = {
    '참여예정': {
      bg: 'bg-blue-100',
      text: 'text-blue-800'
    },
    '참여중': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800'
    },
    '참여완료': {
      bg: 'bg-green-100',
      text: 'text-green-800'
    },
    '참여취소': {
      bg: 'bg-red-100',
      text: 'text-red-800'
    },
    '검토중': {
      bg: 'bg-purple-100',
      text: 'text-purple-800'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
};

// AI 추천 점수 표시
export const getRecommendationScore = (score?: number) => {
  if (!score) return null;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <span className={`text-sm font-medium ${getScoreColor(score)}`}>
      {score}점
    </span>
  );
};

// 텍스트 길이 제한
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 숫자 포맷팅 (천 단위 구분자)
export const formatNumber = (num: number | string): string => {
  const number = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(number)) return '-';
  return number.toLocaleString();
};

// 파일 크기 포맷팅
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 상대 시간 표시
export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
  return `${Math.floor(diffInSeconds / 31536000)}년 전`;
};
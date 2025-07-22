// 금액 포맷팅 (원 단위)
export const formatAmount = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) {
    return '금액 미정';
  }
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

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
  const statusConfig: { [key: string]: { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'; text: string } } = {
    '일반공고': { color: 'gray', text: '일반' },
    '긴급공고': { color: 'danger', text: '긴급' },
    '정정공고': { color: 'warning', text: '정정' },
    '재공고': { color: 'info', text: '재공고' },
    '취소공고': { color: 'gray', text: '취소' },
    'success': { color: 'success', text: '성공' },
    'failure': { color: 'danger', text: '실패' },
    'ongoing': { color: 'info', text: '진행중' },
    'in_progress': { color: 'warning', text: '진행중' }
  };
  
  const config = statusConfig[status] || { color: 'gray', text: status };
  return { color: config.color, text: config.text };
};

// 업무구분 배지 컴포넌트
export const getBusinessTypeBadge = (businessType: string) => {
  const typeConfig: { [key: string]: { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'; text: string } } = {
    '공사': { color: 'info', text: '공사' },
    '용역': { color: 'success', text: '용역' },
    '물품': { color: 'primary', text: '물품' },
    '기타': { color: 'gray', text: '기타' }
  };
  
  const config = typeConfig[businessType] || { color: 'gray', text: businessType };
  return { color: config.color, text: config.text };
};

// 긴급 여부 배지
export const getUrgentBadge = (isUrgent: boolean) => {
  if (!isUrgent) return null;
  return { color: 'danger' as const, text: '긴급' };
};

// 마감임박 배지
export const getDeadlineNearBadge = (deadline: string) => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 3 && diffDays > 0) {
    return { color: 'warning' as const, text: '마감임박' };
  }
  return null;
};

// 신규 배지
export const getNewBadge = (createdAt: string) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffTime = now.getTime() - createdDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) {
    return { color: 'success' as const, text: '신규' };
  }
  return null;
};

// 참여 상태 배지
export const getParticipationStatusBadge = (status?: string) => {
  if (!status) return null;
  
  const statusConfig: { [key: string]: { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'; text: string } } = {
    '참여예정': { color: 'info', text: '참여예정' },
    '참여중': { color: 'warning', text: '참여중' },
    '참여완료': { color: 'success', text: '참여완료' },
    '참여취소': { color: 'danger', text: '참여취소' },
    '검토중': { color: 'primary', text: '검토중' }
  };
  
  const config = statusConfig[status] || { color: 'gray', text: status };
  return { color: config.color, text: config.text };
};

// AI 추천 점수 표시
export const getRecommendationScore = (score?: number) => {
  if (!score) return null;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  return { color: getScoreColor(score) as 'success' | 'warning' | 'danger', text: `${score}점` };
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
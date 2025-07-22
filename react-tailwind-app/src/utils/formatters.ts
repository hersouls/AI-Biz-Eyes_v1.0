/**
 * 금액을 한국어 형식으로 포맷팅하는 함수
 * @param amount - 포맷팅할 금액 (number | undefined)
 * @returns 포맷팅된 금액 문자열 또는 '금액 미정'
 */
export const formatAmount = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) {
    return '금액 미정';
  }
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

/**
 * 안전한 금액 포맷팅 함수 (기본값 제공)
 * @param amount - 포맷팅할 금액 (number | undefined)
 * @param defaultValue - 기본값 (기본값: 0)
 * @returns 포맷팅된 금액 문자열
 */
export const formatAmountWithDefault = (amount: number | undefined, defaultValue: number = 0): string => {
  const safeAmount = amount ?? defaultValue;
  return new Intl.NumberFormat('ko-KR').format(safeAmount) + '원';
};

/**
 * 조건부 금액 표시 함수
 * @param amount - 표시할 금액 (number | undefined)
 * @param formatter - 포맷팅 함수 (기본값: formatAmount)
 * @returns 포맷팅된 금액 또는 null
 */
export const formatAmountConditional = (
  amount: number | undefined, 
  formatter: (amount: number | undefined) => string = formatAmount
): string | null => {
  if (amount === undefined || amount === null) {
    return null;
  }
  return formatter(amount);
};

// 기존 함수들 (backward compatibility)
export const formatCurrency = formatAmount;

/**
 * 날짜를 한국어 형식으로 포맷팅하는 함수
 * @param dateString - 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 날짜와 시간을 한국어 형식으로 포맷팅하는 함수
 * @param dateString - 날짜 문자열
 * @param timeString - 시간 문자열 (선택사항)
 * @returns 포맷팅된 날짜와 시간 문자열
 */
export const formatDateTime = (dateString: string, timeString?: string): string => {
  const date = new Date(dateString);
  if (timeString) {
    // 시간 문자열이 제공된 경우 날짜에 시간을 추가
    const [hours, minutes] = timeString.split(':').map(Number);
    date.setHours(hours || 0, minutes || 0);
  }
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 상태에 따른 배지 컴포넌트 생성 함수
 * @param status - 상태 문자열
 * @returns 배지 컴포넌트
 */
export const getStatusBadge = (status: string) => {
  const statusConfig: { [key: string]: { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'; text: string } } = {
    '일반공고': { color: 'info', text: '일반' },
    '긴급공고': { color: 'danger', text: '긴급' },
    '정정공고': { color: 'warning', text: '정정' },
    '재공고': { color: 'primary', text: '재공고' },
    '취소공고': { color: 'gray', text: '취소' },
    'success': { color: 'success', text: '성공' },
    'failure': { color: 'danger', text: '실패' },
    'ongoing': { color: 'info', text: '진행중' },
    'in_progress': { color: 'warning', text: '진행중' }
  };
  const config = statusConfig[status];
  return { color: config?.color || 'gray', text: config?.text || status };
};

/**
 * 사업유형에 따른 배지 컴포넌트 생성 함수
 * @param businessType - 사업유형 문자열
 * @returns 배지 컴포넌트
 */
export const getBusinessTypeBadge = (businessType: string) => {
  const typeConfig: { [key: string]: { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'; text: string } } = {
    '용역': { color: 'info', text: '용역' },
    '개발': { color: 'success', text: '개발' },
    '공사': { color: 'warning', text: '공사' },
    '물품': { color: 'primary', text: '물품' }
  };
  const config = typeConfig[businessType];
  return { color: config?.color || 'gray', text: config?.text || businessType };
};

/**
 * 긴급 배지 컴포넌트 생성 함수
 * @param isUrgent - 긴급 여부
 * @returns 배지 컴포넌트
 */
export const getUrgentBadge = (isUrgent: boolean) => {
  return isUrgent ? { color: 'danger' as const, text: '긴급' } : null;
};

/**
 * 마감임박 배지 컴포넌트 생성 함수
 * @param deadline - 마감일
 * @returns 배지 컴포넌트
 */
export const getDeadlineNearBadge = (deadline: string) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 3 && diffDays >= 0) {
    return { color: 'warning' as const, text: '마감임박' };
  }
  return null;
};

/**
 * 신규 배지 컴포넌트 생성 함수
 * @param createdAt - 생성일
 * @returns 배지 컴포넌트
 */
export const getNewBadge = (createdAt: string) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffDays = Math.ceil((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) {
    return { color: 'success' as const, text: '신규' };
  }
  return null;
};

/**
 * 참여상태 배지 컴포넌트 생성 함수
 * @param status - 참여상태
 * @returns 배지 컴포넌트
 */
export const getParticipationStatusBadge = (status: string | undefined) => {
  const statusConfig: { [key: string]: { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'; text: string } } = {
    '참여예정': { color: 'info', text: '참여예정' },
    '참여중': { color: 'warning', text: '참여중' },
    '참여완료': { color: 'success', text: '참여완료' },
    '검토중': { color: 'primary', text: '검토중' },
    'participating': { color: 'success', text: '참여중' },
    'interested': { color: 'info', text: '관심' },
    'not_interested': { color: 'gray', text: '관심없음' }
  };
  const config = statusConfig[status || ''];
  return { color: config?.color || 'gray', text: config?.text || status || '미정' };
};

/**
 * 텍스트 자르기 함수
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns 자른 텍스트
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 숫자 포맷팅 함수
 * @param num - 포맷팅할 숫자
 * @returns 포맷팅된 문자열
 */
export const formatNumber = (num: number | string): string => {
  const number = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(number)) return '0';
  return number.toLocaleString();
};

/**
 * 파일 크기 포맷팅 함수
 * @param bytes - 바이트 크기
 * @returns 포맷팅된 파일 크기
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 상대적 시간 표시 함수
 * @param dateString - 날짜 문자열
 * @returns 상대적 시간 문자열
 */
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
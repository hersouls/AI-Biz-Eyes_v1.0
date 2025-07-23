// 로그아웃 기능을 위한 유틸리티 함수들

export const logout = () => {
  // 로컬 스토리지에서 사용자 정보 삭제
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  
  // 세션 스토리지도 정리
  sessionStorage.clear();
  
  // 현재 페이지를 로그인 페이지로 리다이렉트
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      return null;
    }
  }
  return null;
};
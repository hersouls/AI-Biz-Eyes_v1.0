/*
 * TODO: 프론트엔드 인증 유틸리티 함수들은 나중에 구현 예정
 * 현재는 블록처리된 상태입니다.
 */

// ===== 블록처리된 인증 유틸리티 함수들 =====
// TODO: 나중에 구현할 예정

/*
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
*/

// 임시로 더미 함수들
export const logout = () => {
  // 더미 로그아웃 - 아무것도 하지 않음
  console.log('로그아웃 기능은 현재 구현되지 않았습니다.');
};

export const isAuthenticated = (): boolean => {
  // 더미 인증 상태 - 항상 true 반환
  return true;
};

export const getCurrentUser = () => {
  // 더미 사용자 정보 반환
  return {
    id: 1,
    email: 'dummy@example.com',
    name: '더미 사용자',
    role: 'user'
  };
};
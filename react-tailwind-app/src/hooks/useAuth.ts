/*
 * TODO: 인증 훅은 나중에 구현 예정
 * 현재는 블록처리된 상태입니다.
 */

import { useState } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  organization?: string;
  role: 'admin' | 'user' | 'guest';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== 블록처리된 인증 훅 =====
// TODO: 나중에 구현할 예정

/*
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰이 있으면 사용자 정보를 가져옴
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      } else {
        // 토큰이 유효하지 않으면 제거
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchUserInfo
  };
};
*/

// 임시로 더미 인증 훅
export const useAuth = () => {
  const [user, setUser] = useState<User | null>({
    id: 1,
    email: 'dummy@example.com',
    name: '더미 사용자',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [loading] = useState(false);

  const fetchUserInfo = async () => {
    // 더미 사용자 정보 반환
    return;
  };

  const login = async (email: string, password: string) => {
    // 더미 로그인 성공
    return { success: true };
  };

  const logout = () => {
    // 더미 로그아웃
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchUserInfo
  };
};
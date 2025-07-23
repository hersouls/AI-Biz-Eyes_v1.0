/*
 * TODO: ProtectedRoute 컴포넌트는 나중에 구현 예정
 * 현재는 블록처리된 상태입니다.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ===== 블록처리된 ProtectedRoute =====
// TODO: 나중에 구현할 예정

/*
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
*/

// 임시로 더미 ProtectedRoute - 모든 요청을 통과시킴
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};
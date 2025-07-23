/*
 * TODO: 인증 유틸리티 함수들은 나중에 구현 예정
 * 현재는 블록처리된 상태입니다.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface JWTPayload {
  id: number;
  email: string;
  role?: string;
}

// ===== 블록처리된 인증 유틸리티 함수들 =====
// TODO: 나중에 구현할 예정

/*
export const generateToken = (payload: JWTPayload): string => {
  return (jwt.sign as any)(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return (jwt.sign as any)(payload, JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return (jwt.verify as any)(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const extractTokenFromHeader = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
*/

// 테스트용 더미 구현 (실제 구현 전까지 사용)
export const generateToken = (payload: JWTPayload): string => {
  // 실제 구현에서는 JWT 토큰을 생성하지만, 테스트를 위해 더미 구현 사용
  return `dummy-token-${payload.id}-${payload.email}-${payload.role || 'user'}`;
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return `dummy-refresh-token-${payload.id}-${payload.email}`;
};

export const verifyToken = (token: string): JWTPayload => {
  // 실제 구현에서는 JWT 토큰을 검증하지만, 테스트를 위해 더미 구현 사용
  if (token.includes('dummy-token')) {
    const parts = token.split('-');
    return { 
      id: parseInt(parts[2]), 
      email: parts[3], 
      role: parts[4] || 'user' 
    };
  }
  // 잘못된 토큰인 경우 에러를 발생시킴
  throw new Error('Invalid token');
};

export const hashPassword = async (password: string): Promise<string> => {
  // 실제 구현에서는 bcrypt를 사용하지만, 테스트를 위해 더미 구현 사용
  return `hashed-${password}`;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  // 실제 구현에서는 bcrypt.compare를 사용하지만, 테스트를 위해 더미 구현 사용
  return hashedPassword === `hashed-${password}`;
};

export const extractTokenFromHeader = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
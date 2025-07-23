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

// 임시로 더미 함수들
export const generateToken = (payload: JWTPayload): string => {
  return 'dummy-token';
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return 'dummy-refresh-token';
};

export const verifyToken = (token: string): JWTPayload => {
  return { id: 1, email: 'dummy@example.com', role: 'user' };
};

export const hashPassword = async (password: string): Promise<string> => {
  return 'dummy-hashed-password';
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return true;
};

export const extractTokenFromHeader = (authHeader: string): string | null => {
  return 'dummy-token';
};
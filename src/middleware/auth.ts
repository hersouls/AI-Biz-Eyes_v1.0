/*
 * TODO: 인증 미들웨어는 나중에 구현 예정
 * 현재는 블록처리된 상태입니다.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';
import { createErrorResponse } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

// ===== 활성화된 인증 미들웨어 =====

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader || '');

  if (!token) {
    const errorResponse = createErrorResponse(
      'AUTH_TOKEN_MISSING',
      '인증 토큰이 필요합니다.'
    );
    res.status(401).json(errorResponse);
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const errorResponse = createErrorResponse(
      'AUTH_TOKEN_INVALID',
      '유효하지 않은 토큰입니다.'
    );
    res.status(401).json(errorResponse);
    return;
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // 임시로 모든 요청을 통과시킴
    next();
  };
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // 임시로 모든 요청을 통과시킴
  next();
};
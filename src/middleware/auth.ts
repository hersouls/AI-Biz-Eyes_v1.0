import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';
import { createErrorResponse } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader || '');

  if (!token) {
    const errorResponse = createErrorResponse(
      'AUTH_TOKEN_MISSING',
      '인증 토큰이 필요합니다.'
    );
    return res.status(401).json(errorResponse);
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
    return res.status(401).json(errorResponse);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      const errorResponse = createErrorResponse(
        'AUTH_REQUIRED',
        '인증이 필요합니다.'
      );
      return res.status(401).json(errorResponse);
    }

    if (!roles.includes(req.user.role)) {
      const errorResponse = createErrorResponse(
        'AUTH_INSUFFICIENT_PERMISSIONS',
        '권한이 부족합니다.'
      );
      return res.status(403).json(errorResponse);
    }

    next();
  };
};
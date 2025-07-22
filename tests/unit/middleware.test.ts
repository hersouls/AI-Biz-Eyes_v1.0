import { Request, Response, NextFunction } from 'express';
import { authenticateToken, requireRole, requireAdmin } from '../../src/middleware/auth';
import { generateToken } from '../../src/utils/auth';

// Mock Express objects
const createMockRequest = (headers: any = {}, user?: any) => ({
  headers,
  user
} as any);

const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = () => jest.fn() as any;

describe('Auth Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
  });

  describe('authenticateToken', () => {
    it('should call next() when valid token is provided', () => {
      const token = generateToken({ id: 1, email: 'test@example.com' });
      mockReq.headers.authorization = `Bearer ${token}`;

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.id).toBe(1);
      expect(mockReq.user.email).toBe('test@example.com');
    });

    it('should return 401 when no token is provided', () => {
      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'AUTH_TOKEN_MISSING',
            message: '인증 토큰이 필요합니다.'
          }
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when invalid token is provided', () => {
      mockReq.headers.authorization = 'Bearer invalid.token.here';

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'AUTH_TOKEN_INVALID',
            message: '유효하지 않은 토큰입니다.'
          }
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token format is invalid', () => {
      mockReq.headers.authorization = 'InvalidFormat token';

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'AUTH_TOKEN_MISSING',
            message: '인증 토큰이 필요합니다.'
          }
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should call next() when user has required role', () => {
      const token = generateToken({ id: 1, email: 'test@example.com', role: 'admin' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      // First authenticate
      authenticateToken(mockReq, mockRes, mockNext);
      
      // Reset mocks
      mockRes.status.mockClear();
      mockRes.json.mockClear();
      mockNext.mockClear();

      // Then check role
      const adminMiddleware = requireRole(['admin']);
      adminMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', () => {
      const adminMiddleware = requireRole(['admin']);
      adminMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message: '인증이 필요합니다.'
          }
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user does not have required role', () => {
      const token = generateToken({ id: 1, email: 'test@example.com', role: 'user' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      // First authenticate
      authenticateToken(mockReq, mockRes, mockNext);
      
      // Reset mocks
      mockRes.status.mockClear();
      mockRes.json.mockClear();
      mockNext.mockClear();

      // Then check role
      const adminMiddleware = requireRole(['admin']);
      adminMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'AUTH_INSUFFICIENT_PERMISSIONS',
            message: '권한이 부족합니다.'
          }
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow access when user has one of multiple required roles', () => {
      const token = generateToken({ id: 1, email: 'test@example.com', role: 'moderator' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      // First authenticate
      authenticateToken(mockReq, mockRes, mockNext);
      
      // Reset mocks
      mockRes.status.mockClear();
      mockRes.json.mockClear();
      mockNext.mockClear();

      // Then check role
      const roleMiddleware = requireRole(['admin', 'moderator']);
      roleMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('should call next() when user is admin', () => {
      const token = generateToken({ id: 1, email: 'test@example.com', role: 'admin' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      // First authenticate
      authenticateToken(mockReq, mockRes, mockNext);
      
      // Reset mocks
      mockRes.status.mockClear();
      mockRes.json.mockClear();
      mockNext.mockClear();

      // Then check admin
      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user is not admin', () => {
      const token = generateToken({ id: 1, email: 'test@example.com', role: 'user' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      // First authenticate
      authenticateToken(mockReq, mockRes, mockNext);
      
      // Reset mocks
      mockRes.status.mockClear();
      mockRes.json.mockClear();
      mockNext.mockClear();

      // Then check admin
      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'AUTH_INSUFFICIENT_PERMISSIONS',
            message: '권한이 부족합니다.'
          }
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
/*
 * TODO: 로그인/로그아웃 기능은 나중에 구현 예정
 * 현재는 블록처리된 상태입니다.
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { generateToken, generateRefreshToken, hashPassword, comparePassword } from '../utils/auth';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { mockUsers } from '../data/mockData';
import { LoginRequest, RefreshTokenRequest } from '../types';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 로그인
router.post('/login', [
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const { email, password }: LoginRequest = req.body;

    // Mock 사용자에서 이메일로 사용자 찾기
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      const errorResponse = createErrorResponse(
        'AUTH_INVALID_CREDENTIALS',
        '이메일 또는 비밀번호가 올바르지 않습니다.'
      );
      return res.status(401).json(errorResponse);
    }

    // Mock 환경에서는 비밀번호를 'password123'으로 고정
    if (password !== 'password123') {
      const errorResponse = createErrorResponse(
        'AUTH_INVALID_CREDENTIALS',
        '이메일 또는 비밀번호가 올바르지 않습니다.'
      );
      return res.status(401).json(errorResponse);
    }

    // 토큰 생성
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });
    const refreshToken = generateRefreshToken({ 
      id: user.id, 
      email: user.email 
    });

    const response = createSuccessResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organization: user.organization,
        role: user.role
      },
      token,
      refreshToken
    }, '로그인에 성공했습니다.');

    return res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

// 로그아웃
router.post('/logout', (req: Request, res: Response) => {
  try {
    const response = createSuccessResponse(null, '로그아웃되었습니다.');
    return res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

// 토큰 갱신
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('리프레시 토큰이 필요합니다.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const { refreshToken }: RefreshTokenRequest = req.body;

    // Mock 환경에서는 간단한 토큰 검증
    if (!refreshToken || refreshToken === 'invalid_token') {
      const errorResponse = createErrorResponse(
        'AUTH_TOKEN_INVALID',
        '유효하지 않은 리프레시 토큰입니다.'
      );
      return res.status(401).json(errorResponse);
    }

    // 새로운 토큰 생성
    const newToken = generateToken({ id: 1, email: 'user@example.com', role: 'user' });
    const newRefreshToken = generateRefreshToken({ id: 1, email: 'user@example.com' });

    const response = createSuccessResponse({
      token: newToken,
      refreshToken: newRefreshToken
    }, '토큰이 갱신되었습니다.');

    return res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

// 내 정보 조회 (인증 필요)
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  try {
    // Mock 사용자 정보 반환
    const user = mockUsers[1]; // user@example.com

    const response = createSuccessResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      organization: user.organization,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    });

    return res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

export default router;
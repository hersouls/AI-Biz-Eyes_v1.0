import { Router, Request, Response } from 'express';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { mockUsers } from '../data/mockData';

const router = Router();

// 개인 프로필 조회
router.get('/profile', (req: Request, res: Response) => {
  try {
    // Mock 사용자 정보 반환 (첫 번째 사용자)
    const user = mockUsers[0];

    const profile = {
      id: user.id,
      email: user.email,
      name: user.name,
      organization: user.organization,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '010-1234-5678',
      department: 'IT 개발팀',
      position: '시니어 개발자',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
      experience: '8년',
      education: '컴퓨터공학 학사',
      certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        language: 'ko',
        timezone: 'Asia/Seoul'
      }
    };

    const response = createSuccessResponse(profile, '프로필을 성공적으로 조회했습니다.');
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
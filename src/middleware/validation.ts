import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// 공통 검증 결과 처리 미들웨어
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '입력값이 올바르지 않습니다.',
        details: errors.array()
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// 알림 설정 검증
export const validateNotificationConfig = [
  body('type')
    .isIn(['new_bid', 'urgent', 'deadline', 'achievement'])
    .withMessage('유효하지 않은 알림 타입입니다. 허용값: new_bid, urgent, deadline, achievement'),
  
  body('channel')
    .isIn(['web', 'email', 'push'])
    .withMessage('유효하지 않은 채널입니다. 허용값: web, email, push'),
  
  body('frequency')
    .isIn(['immediate', 'daily', 'weekly'])
    .withMessage('유효하지 않은 빈도입니다. 허용값: immediate, daily, weekly'),
  
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('수신자는 최소 1개 이상의 배열이어야 합니다'),
  
  body('recipients.*')
    .isEmail()
    .withMessage('유효하지 않은 이메일 주소입니다'),
  
  body('isActive')
    .isBoolean()
    .withMessage('isActive는 boolean 값이어야 합니다'),
  
  handleValidationErrors
];

// 리포트 설정 검증
export const validateReportConfig = [
  body('type')
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('유효하지 않은 리포트 타입입니다. 허용값: daily, weekly, monthly'),
  
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('수신자는 최소 1개 이상의 배열이어야 합니다'),
  
  body('recipients.*')
    .isEmail()
    .withMessage('유효하지 않은 이메일 주소입니다'),
  
  body('isActive')
    .isBoolean()
    .withMessage('isActive는 boolean 값이어야 합니다'),
  
  body('schedule')
    .isString()
    .notEmpty()
    .withMessage('스케줄은 비어있지 않은 문자열이어야 합니다'),
  
  handleValidationErrors
];

// 시스템 설정 검증
export const validateSystemConfig = [
  body('key')
    .isString()
    .notEmpty()
    .withMessage('키는 비어있지 않은 문자열이어야 합니다'),
  
  body('value')
    .isString()
    .withMessage('값은 문자열이어야 합니다'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('설명은 문자열이어야 합니다'),
  
  body('category')
    .isIn(['api', 'security', 'notification', 'system'])
    .withMessage('유효하지 않은 카테고리입니다. 허용값: api, security, notification, system'),
  
  body('isEncrypted')
    .isBoolean()
    .withMessage('isEncrypted는 boolean 값이어야 합니다'),
  
  handleValidationErrors
];

// 사용자 생성 검증
export const validateUserCreate = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('비밀번호는 영문 대소문자와 숫자를 포함해야 합니다'),
  
  body('name')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('이름은 2-50자 사이의 문자열이어야 합니다'),
  
  body('organization')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('기관명은 100자 이하의 문자열이어야 합니다'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user', 'guest'])
    .withMessage('유효하지 않은 역할입니다. 허용값: admin, user, guest'),
  
  handleValidationErrors
];

// 사용자 수정 검증
export const validateUserUpdate = [
  body('name')
    .optional()
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('이름은 2-50자 사이의 문자열이어야 합니다'),
  
  body('organization')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('기관명은 100자 이하의 문자열이어야 합니다'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user', 'guest'])
    .withMessage('유효하지 않은 역할입니다. 허용값: admin, user, guest'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive는 boolean 값이어야 합니다'),
  
  handleValidationErrors
];

// ID 파라미터 검증
export const validateIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID는 1 이상의 정수여야 합니다'),
  
  handleValidationErrors
];

// 페이지네이션 쿼리 검증
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('페이지는 1 이상의 정수여야 합니다'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('제한은 1-100 사이의 정수여야 합니다'),
  
  handleValidationErrors
];

// 검색 쿼리 검증
export const validateSearchQuery = [
  query('search')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('검색어는 100자 이하의 문자열이어야 합니다'),
  
  handleValidationErrors
];

// 날짜 범위 검증
export const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('시작일은 ISO 8601 형식이어야 합니다 (YYYY-MM-DD)'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('종료일은 ISO 8601 형식이어야 합니다 (YYYY-MM-DD)'),
  
  handleValidationErrors
];
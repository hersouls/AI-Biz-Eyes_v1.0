export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    
    // 에러 이름을 클래스명으로 설정
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // 스택 트레이스 캡처 (AppError 생성자는 제외)
    Error.captureStackTrace(this, this.constructor);
  }
}

// 유효성 검증 에러
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 422, 'VALIDATION_ERROR', true, details);
  }
}

// 인증 에러 (401)
export class AuthenticationError extends AppError {
  constructor(message: string = '인증이 필요합니다.') {
    super(message, 401, 'AUTHENTICATION_ERROR', true);
  }
}

// 권한 에러 (403)
export class AuthorizationError extends AppError {
  constructor(message: string = '권한이 없습니다.') {
    super(message, 403, 'AUTHORIZATION_ERROR', true);
  }
}

// 리소스 없음 에러 (404)
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource}을(를) 찾을 수 없습니다.`, 404, 'RESOURCE_NOT_FOUND', true);
  }
}

// 충돌 에러 (409)
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR', true);
  }
}

// 외부 서비스 에러 (503)
export class ExternalAPIError extends AppError {
  constructor(service: string, originalError?: any) {
    super(
      `외부 서비스(${service})와 통신 중 오류가 발생했습니다.`,
      503,
      'EXTERNAL_API_ERROR',
      false,  // isOperational = false (시스템 에러)
      { service, originalError }
    );
  }
}

// 비즈니스 로직 에러
export class BusinessLogicError extends AppError {
  constructor(message: string, code: string = 'BUSINESS_LOGIC_ERROR') {
    super(message, 400, code, true);
  }
}

// 토큰 관련 에러
export class TokenError extends AppError {
  constructor(type: 'expired' | 'invalid' | 'missing') {
    const messages = {
      expired: '토큰이 만료되었습니다.',
      invalid: '유효하지 않은 토큰입니다.',
      missing: '토큰이 필요합니다.'
    };
    const codes = {
      expired: 'AUTH_TOKEN_EXPIRED',
      invalid: 'AUTH_TOKEN_INVALID',
      missing: 'AUTH_TOKEN_MISSING'
    };
    super(messages[type], 401, codes[type], true);
  }
}
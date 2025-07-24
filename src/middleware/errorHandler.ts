import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { createErrorResponse } from '../utils/response';
import { logError } from '../utils/logger';

// 에러 타입 정의
interface ErrorWithCode extends Error {
  code?: string;
  errno?: number;
  syscall?: string;
  statusCode?: number;
  status?: number;
}

export const errorHandler = (
  err: Error | AppError | ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 이미 응답이 전송된 경우
  if (res.headersSent) {
    return next(err);
  }

  // 로깅
  logError(err, req);

  // 1. AppError 인스턴스 처리
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      createErrorResponse(err.code, err.message, err.details)
    );
  }

  const error = err as ErrorWithCode;

  // 2. MongoDB 에러 처리
  if (error.name === 'MongoError' || error.code === '11000') {
    return res.status(409).json(
      createErrorResponse('DUPLICATE_ERROR', '이미 존재하는 데이터입니다.')
    );
  }

  if (error.name === 'CastError') {
    return res.status(400).json(
      createErrorResponse('INVALID_ID', '잘못된 ID 형식입니다.')
    );
  }

  // 3. JWT 에러 처리
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json(
      createErrorResponse('AUTH_TOKEN_INVALID', '유효하지 않은 토큰입니다.')
    );
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json(
      createErrorResponse('AUTH_TOKEN_EXPIRED', '토큰이 만료되었습니다.')
    );
  }

  // 4. 네트워크 에러 처리
  if (error.code === 'ENOTFOUND') {
    return res.status(503).json(
      createErrorResponse('NETWORK_ERROR', '외부 서비스에 연결할 수 없습니다.')
    );
  }

  if (error.code === 'ETIMEDOUT') {
    return res.status(504).json(
      createErrorResponse('TIMEOUT_ERROR', '요청 시간이 초과되었습니다.')
    );
  }

  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json(
      createErrorResponse('CONNECTION_REFUSED', '연결이 거부되었습니다.')
    );
  }

  // 5. Express-Validator 에러
  if (error.message && error.message.includes('validation')) {
    return res.status(422).json(
      createErrorResponse('VALIDATION_ERROR', '입력값이 올바르지 않습니다.')
    );
  }

  // 6. Multer 파일 업로드 에러
  if (error.name === 'MulterError') {
    const multerMessages: { [key: string]: string } = {
      'LIMIT_FILE_SIZE': '파일 크기가 너무 큽니다.',
      'LIMIT_FILE_COUNT': '파일 개수가 초과되었습니다.',
      'LIMIT_UNEXPECTED_FILE': '예상치 못한 필드입니다.',
      'LIMIT_PART_COUNT': '파트 수가 너무 많습니다.',
      'LIMIT_FIELD_KEY': '필드 이름이 너무 깁니다.',
      'LIMIT_FIELD_VALUE': '필드 값이 너무 깁니다.',
      'LIMIT_FIELD_COUNT': '필드가 너무 많습니다.',
      'MISSING_FIELD_NAME': '필드 이름이 누락되었습니다.'
    };
    
    return res.status(400).json(
      createErrorResponse(
        'FILE_UPLOAD_ERROR',
        multerMessages[error.code as string] || '파일 업로드 오류가 발생했습니다.'
      )
    );
  }

  // 7. API 키 관련 에러
  if (error.message && error.message.toUpperCase().includes('API_KEY')) {
    return res.status(401).json(
      createErrorResponse('AUTH_API_KEY_INVALID', 'API 키가 유효하지 않습니다.')
    );
  }

  // 8. 기본 500 에러
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statusCode = error.statusCode || error.status || 500;
  
  return res.status(statusCode).json(
    createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      isDevelopment ? error.message : '서버 오류가 발생했습니다.',
      isDevelopment ? { 
        stack: err.stack,
        originalError: error
      } : undefined
    )
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  const message = `요청하신 경로(${req.method} ${req.url})를 찾을 수 없습니다.`;
  
  // 로깅
  console.warn('404 Not Found:', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  return res.status(404).json(
    createErrorResponse('ROUTE_NOT_FOUND', message, {
      method: req.method,
      path: req.url
    })
  );
};
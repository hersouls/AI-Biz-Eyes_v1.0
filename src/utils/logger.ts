import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { Request } from 'express';

// 로그 레벨 정의
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 개발/운영 환경별 로그 레벨
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// 로그 색상 정의
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// 로그 포맷 정의
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// 파일 로그 포맷 (색상 없음)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.uncolorize(),
  winston.format.json(),
);

// 로그 디렉토리
const logDir = path.join(process.cwd(), 'logs');

// Transport 설정
const transports = [
  // 콘솔 출력
  new winston.transports.Console({
    format,
  }),
  
  // 에러 로그 파일
  new DailyRotateFile({
    level: 'error',
    filename: path.join(logDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
  }),
  
  // 전체 로그 파일
  new DailyRotateFile({
    filename: path.join(logDir, 'all-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
  }),
];

// Logger 인스턴스 생성
export const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

// 구조화된 로깅을 위한 헬퍼 함수
export const logError = (error: Error, req?: Request) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...(req && {
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
        ip: req.ip,
      },
    }),
  });
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};
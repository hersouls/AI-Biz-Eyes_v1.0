import { Request, Response, NextFunction } from 'express';

/**
 * 비동기 라우트 핸들러를 감싸서 에러를 자동으로 처리
 * try-catch 블록을 매번 작성할 필요 없음
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 타입 안전성을 위한 제네릭 버전
export function asyncHandlerTyped<T extends Function>(fn: T): T {
  return ((req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }) as any as T;
}
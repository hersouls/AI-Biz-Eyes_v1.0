import { NotificationConfig, ReportConfig, SystemConfig, User } from './index';

declare global {
  namespace Express {
    interface Request {
      // 검증된 데이터를 저장할 수 있는 속성들
      validatedNotificationConfig?: Partial<NotificationConfig>;
      validatedReportConfig?: Partial<ReportConfig>;
      validatedSystemConfig?: Partial<SystemConfig>;
      validatedUser?: Partial<User>;
      
      // 인증된 사용자 정보
      user?: User;
      
      // 파일 업로드 정보
      files?: Express.Multer.File[];
      file?: Express.Multer.File;
    }
  }
}

// 타입 안전한 Request 타입들
export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface TypedRequestParams<T> extends Express.Request {
  params: T;
}

export interface TypedRequestQuery<T> extends Express.Request {
  query: T;
}

export interface TypedRequest<TBody = any, TParams = any, TQuery = any> extends Express.Request {
  body: TBody;
  params: TParams;
  query: TQuery;
}
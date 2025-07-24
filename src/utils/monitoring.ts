import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Express } from 'express';

export const initializeSentry = (app: Express) => {
  // 운영 환경에서만 활성화
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });

  // RequestHandler는 모든 라우트 전에
  app.use(Sentry.Handlers.requestHandler());
  
  // TracingHandler는 requestHandler 다음에
  app.use(Sentry.Handlers.tracingHandler());
};

export const sentryErrorHandler = Sentry.Handlers.errorHandler();
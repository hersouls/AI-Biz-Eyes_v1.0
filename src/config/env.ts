interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  JWT_SECRET: string;
  REFRESH_SECRET: string;
  DATABASE_URL?: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

function validateEnvironment(): EnvironmentConfig {
  const requiredEnvVars = [
    'JWT_SECRET',
    'REFRESH_SECRET'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    NODE_ENV: (process.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) || 'development',
    PORT: parseInt(process.env.PORT || '3002', 10),
    JWT_SECRET: process.env.JWT_SECRET!,
    REFRESH_SECRET: process.env.REFRESH_SECRET!,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
  };
}

export const config = validateEnvironment();
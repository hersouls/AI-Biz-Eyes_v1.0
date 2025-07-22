import { ApiResponse, ErrorResponse, ApiError } from '../types';

export const createSuccessResponse = (data: any, message?: string) => {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
};

export const createErrorResponse = (code: string, message: string, details?: any) => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    },
    timestamp: new Date().toISOString()
  };
};

export const createPaginatedResponse = (
  data: any[],
  total: number,
  page: number,
  limit: number,
  message?: string
) => {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    message,
    timestamp: new Date().toISOString()
  };
};
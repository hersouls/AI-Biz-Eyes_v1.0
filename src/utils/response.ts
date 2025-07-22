import { ApiResponse, ApiErrorResponse, PaginatedResponse } from '../types';

export const createSuccessResponse = <T>(data: T, message = 'Success'): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

export const createErrorResponse = (
  code: string, 
  message: string, 
  details?: Record<string, unknown>
): ApiErrorResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      details
    },
    timestamp: new Date().toISOString()
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
): PaginatedResponse<T> => {
  return {
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    timestamp: new Date().toISOString()
  };
};
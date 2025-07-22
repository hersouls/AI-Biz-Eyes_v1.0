import { ApiResponse, ErrorResponse, ApiError } from '../types';

export const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
};

export const createErrorResponse = (
  code: string,
  message: string,
  details?: any
): ErrorResponse => {
  const error: ApiError = {
    code,
    message,
    details
  };

  return {
    success: false,
    error,
    timestamp: new Date().toISOString()
  };
};

export const createPaginationResponse = <T>(
  items: T[],
  page: number,
  limit: number,
  total: number
) => {
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
import {
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse
} from '../../src/utils/response';

describe('Response Utils', () => {
  describe('createSuccessResponse', () => {
    it('should create a success response with data', () => {
      const data = { id: 1, name: 'Test' };
      const response = createSuccessResponse(data);
      
      expect(response).toMatchObject({
        success: true,
        data: { id: 1, name: 'Test' },
        timestamp: expect.any(String)
      });
    });

    it('should create a success response with data and message', () => {
      const data = { id: 1, name: 'Test' };
      const message = 'Operation successful';
      const response = createSuccessResponse(data, message);
      
      expect(response).toMatchObject({
        success: true,
        data: { id: 1, name: 'Test' },
        message: 'Operation successful',
        timestamp: expect.any(String)
      });
    });

    it('should include valid timestamp', () => {
      const response = createSuccessResponse({});
      const timestamp = new Date(response.timestamp);
      
      expect(timestamp.getTime()).toBeGreaterThan(0);
      expect(isNaN(timestamp.getTime())).toBe(false);
    });
  });

  describe('createErrorResponse', () => {
    it('should create an error response with code and message', () => {
      const code = 'VALIDATION_ERROR';
      const message = 'Invalid input data';
      const response = createErrorResponse(code, message);
      
      expect(response).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data'
        },
        timestamp: expect.any(String)
      });
    });

    it('should create an error response with details', () => {
      const code = 'VALIDATION_ERROR';
      const message = 'Invalid input data';
      const details = { field: 'email', issue: 'Invalid format' };
      const response = createErrorResponse(code, message, details);
      
      expect(response).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: { field: 'email', issue: 'Invalid format' }
        },
        timestamp: expect.any(String)
      });
    });

    it('should not include details when not provided', () => {
      const response = createErrorResponse('ERROR', 'Test error');
      
      expect(response.error).not.toHaveProperty('details');
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create a paginated response with correct structure', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const total = 10;
      const page = 1;
      const limit = 3;
      const response = createPaginatedResponse(data, total, page, limit);
      
      expect(response).toMatchObject({
        success: true,
        data: [{ id: 1 }, { id: 2 }, { id: 3 }],
        pagination: {
          total: 10,
          page: 1,
          limit: 3,
          totalPages: 4
        },
        timestamp: expect.any(String)
      });
    });

    it('should calculate totalPages correctly', () => {
      const response1 = createPaginatedResponse([], 10, 1, 3);
      expect(response1.pagination.totalPages).toBe(4);

      const response2 = createPaginatedResponse([], 9, 1, 3);
      expect(response2.pagination.totalPages).toBe(3);

      const response3 = createPaginatedResponse([], 0, 1, 3);
      expect(response3.pagination.totalPages).toBe(0);
    });

    it('should include message when provided', () => {
      const message = 'Data retrieved successfully';
      const response = createPaginatedResponse([], 0, 1, 10, message);
      
      expect(response.message).toBe('Data retrieved successfully');
    });

    it('should handle edge cases', () => {
      // Empty data
      const emptyResponse = createPaginatedResponse([], 0, 1, 10);
      expect(emptyResponse.data).toEqual([]);
      expect(emptyResponse.pagination.total).toBe(0);

      // Single page
      const singlePageResponse = createPaginatedResponse([{ id: 1 }], 1, 1, 10);
      expect(singlePageResponse.pagination.totalPages).toBe(1);
    });
  });
});
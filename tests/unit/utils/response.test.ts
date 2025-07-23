import {
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse
} from '../../../src/utils/response';

describe('Response Utils', () => {
  describe('createSuccessResponse', () => {
    it('should create a success response with data', () => {
      const testData = { id: 1, name: 'Test' };
      const response = createSuccessResponse(testData);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(testData);
      expect(response.timestamp).toBeDefined();
      expect(new Date(response.timestamp)).toBeInstanceOf(Date);
    });

    it('should create a success response with custom message', () => {
      const testData = { id: 1, name: 'Test' };
      const customMessage = 'Operation completed successfully';
      const response = createSuccessResponse(testData, customMessage);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(testData);
      expect(response.message).toBe(customMessage);
    });

    it('should create a success response without message', () => {
      const testData = { id: 1, name: 'Test' };
      const response = createSuccessResponse(testData);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(testData);
      expect(response.message).toBeUndefined();
    });
  });

  describe('createErrorResponse', () => {
    it('should create an error response with code and message', () => {
      const errorCode = 'VALIDATION_ERROR';
      const errorMessage = 'Invalid input data';
      const response = createErrorResponse(errorCode, errorMessage);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe(errorCode);
      expect(response.error.message).toBe(errorMessage);
      expect(response.timestamp).toBeDefined();
    });

    it('should create an error response with additional details', () => {
      const errorCode = 'VALIDATION_ERROR';
      const errorMessage = 'Invalid input data';
      const details = { field: 'email', value: 'invalid-email' };
      const response = createErrorResponse(errorCode, errorMessage, details);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe(errorCode);
      expect(response.error.message).toBe(errorMessage);
      expect(response.error.details).toEqual(details);
    });

    it('should create an error response without details', () => {
      const errorCode = 'NOT_FOUND';
      const errorMessage = 'Resource not found';
      const response = createErrorResponse(errorCode, errorMessage);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe(errorCode);
      expect(response.error.message).toBe(errorMessage);
      expect(response.error.details).toBeUndefined();
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create a paginated response with correct pagination info', () => {
      const data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      const total = 10;
      const page = 1;
      const limit = 5;
      const response = createPaginatedResponse(data, total, page, limit);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.pagination.total).toBe(total);
      expect(response.pagination.page).toBe(page);
      expect(response.pagination.limit).toBe(limit);
      expect(response.pagination.totalPages).toBe(2); // Math.ceil(10/5) = 2
    });

    it('should calculate total pages correctly for different scenarios', () => {
      // Scenario 1: Exact division
      const response1 = createPaginatedResponse([], 10, 1, 5);
      expect(response1.pagination.totalPages).toBe(2);

      // Scenario 2: Remainder division
      const response2 = createPaginatedResponse([], 11, 1, 5);
      expect(response2.pagination.totalPages).toBe(3);

      // Scenario 3: Empty data
      const response3 = createPaginatedResponse([], 0, 1, 5);
      expect(response3.pagination.totalPages).toBe(0);
    });

    it('should include custom message in paginated response', () => {
      const data = [{ id: 1, name: 'Item 1' }];
      const customMessage = 'Data retrieved successfully';
      const response = createPaginatedResponse(data, 1, 1, 5, customMessage);

      expect(response.success).toBe(true);
      expect(response.message).toBe(customMessage);
    });
  });
});
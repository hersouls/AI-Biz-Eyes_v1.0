import { Request, Response, NextFunction } from 'express';

// Mock the entire upload module to avoid multer issues
jest.mock('../../../src/middleware/upload', () => ({
  handleUploadError: jest.requireActual('../../../src/middleware/upload').handleUploadError,
}));

import { handleUploadError } from '../../../src/middleware/upload';

describe('Upload Middleware', () => {
  const mockRequest = (file?: any, user?: any): any => ({
    user,
    file,
  });

  const mockResponse = (): Response => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleUploadError', () => {
    it('should handle upload error and return error response', () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('File upload failed');
      
      handleUploadError(error, req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'File upload failed'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() when no error is present', () => {
      const req = mockRequest();
      const res = mockResponse();
      
      handleUploadError(null, req, res, mockNext);
      
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle multer error with specific message', () => {
      const req = mockRequest();
      const res = mockResponse();
      const multerError = new Error('File too large');
      multerError.name = 'MulterError';
      
      handleUploadError(multerError, req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'File too large'
      });
    });

    it('should handle generic error without specific name', () => {
      const req = mockRequest();
      const res = mockResponse();
      const genericError = new Error('Unknown upload error');
      
      handleUploadError(genericError, req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unknown upload error'
      });
    });
  });
});
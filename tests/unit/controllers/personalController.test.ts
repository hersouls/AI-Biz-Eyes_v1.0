import { Request, Response } from 'express';
import { PersonalController } from '../../../src/controllers/personalController';
import { mockUsers } from '../../../src/data/mockData';

// Extend Request interface for testing
interface TestRequest extends Request {
  user?: any;
}

// Mock fs and path
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('PersonalController', () => {
  let mockRequest: Partial<TestRequest>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {
      user: { id: 1, email: 'test@example.com' },
      body: {},
      file: undefined,
      params: {},
    };
    
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      const user = mockUsers.find(u => u.id === 1);
      
      await PersonalController.getProfile(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: user
      });
    });

    it('should return 404 when user does not exist', async () => {
      mockRequest.user = { id: 999, email: 'nonexistent@example.com' };
      
      await PersonalController.getProfile(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    });

    it('should handle missing user and use default id', async () => {
      mockRequest.user = undefined;
      
      await PersonalController.getProfile(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ id: 1 })
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        organization: 'Updated Org'
      };
      mockRequest.body = updateData;
      
      await PersonalController.updateProfile(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining(updateData),
        message: '프로필이 성공적으로 업데이트되었습니다.'
      });
    });

    it('should return 404 when user does not exist', async () => {
      mockRequest.user = { id: 999, email: 'nonexistent@example.com' };
      mockRequest.body = { name: 'Test' };
      
      await PersonalController.updateProfile(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    });

    it('should update only provided fields', async () => {
      const originalUser = mockUsers.find(u => u.id === 1);
      mockRequest.body = { name: 'New Name' };
      
      await PersonalController.updateProfile(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          name: 'New Name',
          email: originalUser?.email,
          organization: originalUser?.organization
        }),
        message: '프로필이 성공적으로 업데이트되었습니다.'
      });
    });
  });

  describe('uploadAvatar', () => {
    it('should return 400 when no file is uploaded', async () => {
      mockRequest.file = undefined;
      
      await PersonalController.uploadAvatar(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: '업로드할 파일이 없습니다.'
      });
    });

    it('should return 404 when user does not exist', async () => {
      mockRequest.user = { id: 999, email: 'nonexistent@example.com' };
      mockRequest.file = { filename: 'test.jpg' } as any;
      
      await PersonalController.uploadAvatar(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    });

    it('should handle avatar upload successfully', async () => {
      mockRequest.file = { filename: 'avatar_1_1234567890.jpg' } as any;
      
      await PersonalController.uploadAvatar(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          avatar: '/uploads/avatars/avatar_1_1234567890.jpg'
        }),
        message: '아바타가 성공적으로 업로드되었습니다.'
      });
    });
  });

  describe('deleteAvatar', () => {
    it('should delete avatar successfully', async () => {
      // First set an avatar
      const userIndex = mockUsers.findIndex(u => u.id === 1);
      if (userIndex !== -1) {
        mockUsers[userIndex].avatar = '/uploads/avatars/test.jpg';
      }
      
      await PersonalController.deleteAvatar(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          avatar: undefined
        }),
        message: '아바타가 성공적으로 삭제되었습니다.'
      });
    });

    it('should return 404 when user does not exist', async () => {
      mockRequest.user = { id: 999, email: 'nonexistent@example.com' };
      
      await PersonalController.deleteAvatar(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    });
  });

  describe('getNotificationSettings', () => {
    it('should return notification settings', async () => {
      await PersonalController.getNotificationSettings(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          emailNotifications: expect.any(Boolean),
          pushNotifications: expect.any(Boolean),
          dailyReport: expect.any(Boolean),
          newBidNotifications: expect.any(Boolean)
        })
      });
    });
  });

  describe('getActivityHistory', () => {
    it('should return activity history with pagination', async () => {
      mockRequest.query = { page: '1', limit: '10' };
      
      await PersonalController.getActivityHistory(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          activities: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              type: expect.any(String),
              description: expect.any(String),
              createdAt: expect.any(String)
            })
          ]),
          pagination: expect.objectContaining({
            total: expect.any(Number),
            page: expect.any(Number),
            limit: expect.any(Number),
            pages: expect.any(Number)
          })
        })
      });
    });

    it('should handle activity detail request', async () => {
      mockRequest.params = { id: '1' };
      
      await PersonalController.getActivityDetail(mockRequest as TestRequest, mockResponse as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: expect.any(Number),
          type: expect.any(String),
          description: expect.any(String),
          bid: expect.any(Object)
        })
      });
    });
  });
});
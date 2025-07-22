import { Request, Response } from 'express';
import { PersonalController } from '../../src/controllers/personalController';

// Mock Express objects
const createMockRequest = (body: any = {}, user?: any, params: any = {}, query: any = {}) => ({
  body,
  user,
  params,
  query
} as any);

const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('PersonalController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
  });

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      mockReq.user = { id: 1 };

      await PersonalController.getProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 1
          })
        })
      );
    });

    it('should return 404 when user does not exist', async () => {
      mockReq.user = { id: 999999 };

      await PersonalController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '사용자를 찾을 수 없습니다.'
        })
      );
    });

    it('should use default user id when no user in request', async () => {
      await PersonalController.getProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 1
          })
        })
      );
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      mockReq.user = { id: 1 };
      mockReq.body = {
        name: 'Updated Name',
        email: 'updated@example.com',
        organization: 'Updated Org'
      };

      await PersonalController.updateProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            name: 'Updated Name',
            email: 'updated@example.com',
            organization: 'Updated Org'
          }),
          message: '프로필이 성공적으로 업데이트되었습니다.'
        })
      );
    });

    it('should return 404 when user does not exist', async () => {
      mockReq.user = { id: 999999 };
      mockReq.body = { name: 'Updated Name' };

      await PersonalController.updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '사용자를 찾을 수 없습니다.'
        })
      );
    });

    it('should preserve existing values when fields are not provided', async () => {
      mockReq.user = { id: 1 };
      mockReq.body = { name: 'Updated Name' };

      await PersonalController.updateProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            name: 'Updated Name',
            email: expect.any(String), // Should preserve original email
            organization: expect.any(String) // Should preserve original organization
          })
        })
      );
    });
  });

  describe('getNotificationSettings', () => {
    it('should return notification settings', async () => {
      mockReq.user = { id: 1 };

      await PersonalController.getNotificationSettings(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            userId: 1,
            emailNotifications: true,
            webNotifications: true,
            pushNotifications: false,
            newBidNotifications: true,
            urgentNotifications: true,
            deadlineNotifications: true,
            performanceNotifications: true,
            dailyReport: false,
            weeklyReport: true,
            monthlyReport: true
          })
        })
      );
    });

    it('should use default user id when no user in request', async () => {
      await PersonalController.getNotificationSettings(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            userId: 1
          })
        })
      );
    });
  });

  describe('updateNotificationSettings', () => {
    it('should update notification settings successfully', async () => {
      mockReq.user = { id: 1 };
      mockReq.body = {
        emailNotifications: false,
        pushNotifications: true,
        dailyReport: true
      };

      await PersonalController.updateNotificationSettings(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            emailNotifications: false,
            pushNotifications: true,
            dailyReport: true
          }),
          message: '알림 설정이 성공적으로 저장되었습니다.'
        })
      );
    });

    it('should preserve existing settings when fields are not provided', async () => {
      mockReq.user = { id: 1 };
      mockReq.body = { emailNotifications: false };

      await PersonalController.updateNotificationSettings(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            emailNotifications: false,
            userId: 1
          })
        })
      );
    });
  });

  describe('getActivityHistory', () => {
    it('should return activity history with pagination', async () => {
      mockReq.user = { id: 1 };
      mockReq.query = { page: '1', limit: '10' };

      await PersonalController.getActivityHistory(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            activities: expect.any(Array),
            pagination: expect.objectContaining({
              total: expect.any(Number),
              page: 1,
              limit: 10,
              pages: expect.any(Number)
            })
          })
        })
      );
    });

    it('should use default pagination when query params are not provided', async () => {
      mockReq.user = { id: 1 };

      await PersonalController.getActivityHistory(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            pagination: expect.objectContaining({
              page: 1,
              limit: 20
            })
          })
        })
      );
    });
  });

  describe('getActivityDetail', () => {
    it('should return activity detail when activity exists', async () => {
      mockReq.user = { id: 1 };
      mockReq.params = { id: '1' };

      await PersonalController.getActivityDetail(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 1
          })
        })
      );
    });

    it('should return activity detail for any valid id', async () => {
      mockReq.user = { id: 1 };
      mockReq.params = { id: '999999' };

      await PersonalController.getActivityDetail(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 999999
          })
        })
      );
    });
  });
});
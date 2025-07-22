import request from 'supertest';
import express from 'express';
import { generateToken } from '../../src/utils/auth';
import personalRoutes from '../../src/routes/personal';

const app = express();
app.use(express.json());
app.use('/api/personal', personalRoutes);

describe('Personal API Integration Tests', () => {
  let authToken: string;
  let adminToken: string;

  beforeAll(() => {
    authToken = generateToken({ id: 1, email: 'user@example.com', role: 'user' });
    adminToken = generateToken({ id: 2, email: 'admin@example.com', role: 'admin' });
  });

  describe('GET /api/personal/profile', () => {
    it('should return user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/personal/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: 1
        })
      });
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/personal/profile')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'AUTH_TOKEN_MISSING'
        })
      });
    });

    it('should return 401 when invalid token provided', async () => {
      const response = await request(app)
        .get('/api/personal/profile')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'AUTH_TOKEN_INVALID'
        })
      });
    });
  });

  describe('PUT /api/personal/profile', () => {
    it('should update profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        organization: 'Updated Organization'
      };

      const response = await request(app)
        .put('/api/personal/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining(updateData),
        message: '프로필이 성공적으로 업데이트되었습니다.'
      });
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put('/api/personal/profile')
        .send({ name: 'Test' })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'AUTH_TOKEN_MISSING'
        })
      });
    });

    it('should preserve existing values when partial update', async () => {
      const updateData = { name: 'Partial Update' };

      const response = await request(app)
        .put('/api/personal/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          name: 'Partial Update',
          email: expect.any(String),
          organization: expect.any(String)
        })
      });
    });
  });

  describe('GET /api/personal/notifications/settings', () => {
    it('should return notification settings', async () => {
      const response = await request(app)
        .get('/api/personal/notifications/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          userId: 1,
          emailNotifications: expect.any(Boolean),
          webNotifications: expect.any(Boolean),
          pushNotifications: expect.any(Boolean)
        })
      });
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/personal/notifications/settings')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'AUTH_TOKEN_MISSING'
        })
      });
    });
  });

  describe('PUT /api/personal/notifications/settings', () => {
    it('should update notification settings', async () => {
      const settings = {
        emailNotifications: false,
        pushNotifications: true,
        dailyReport: true
      };

      const response = await request(app)
        .put('/api/personal/notifications/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(settings)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining(settings),
        message: '알림 설정이 성공적으로 저장되었습니다.'
      });
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put('/api/personal/notifications/settings')
        .send({ emailNotifications: false })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'AUTH_TOKEN_MISSING'
        })
      });
    });
  });

  describe('GET /api/personal/activity', () => {
    it('should return activity history with pagination', async () => {
      const response = await request(app)
        .get('/api/personal/activity')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
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
      });
    });

    it('should use default pagination when query params not provided', async () => {
      const response = await request(app)
        .get('/api/personal/activity')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          pagination: expect.objectContaining({
            page: 1,
            limit: 20
          })
        })
      });
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/personal/activity')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'AUTH_TOKEN_MISSING'
        })
      });
    });
  });

  describe('GET /api/personal/activity/:activityId', () => {
    it('should return activity detail when activity exists', async () => {
      const response = await request(app)
        .get('/api/personal/activity/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: 1
        })
      });
    });

    it('should return activity detail for any valid id', async () => {
      const response = await request(app)
        .get('/api/personal/activity/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: 999999
        })
      });
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/personal/activity/1')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'AUTH_TOKEN_MISSING'
        })
      });
    });
  });

  describe('POST /api/personal/export', () => {
    it('should create export request', async () => {
      const exportData = {
        format: 'excel',
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31'
        },
        dataTypes: ['activity', 'notifications']
      };

      const response = await request(app)
        .post('/api/personal/export')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exportData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: expect.any(Number),
          status: 'processing'
        }),
        message: '데이터 내보내기가 시작되었습니다.'
      });
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/personal/export')
        .send({ format: 'excel' })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'AUTH_TOKEN_MISSING'
        })
      });
    });
  });
});
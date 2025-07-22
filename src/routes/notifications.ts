import express from 'express';
import { Pool } from 'pg';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// PostgreSQL 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/b2g_db',
});

// 알림 목록 조회
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      priority,
      startDate,
      endDate,
      assignedTo
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    let whereConditions = ['1=1'];
    let params: any[] = [];
    let paramIndex = 1;

    if (type) {
      whereConditions.push(`type = $${paramIndex++}`);
      params.push(type);
    }

    if (status) {
      whereConditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (priority) {
      whereConditions.push(`priority = $${paramIndex++}`);
      params.push(priority);
    }

    if (startDate) {
      whereConditions.push(`created_at >= $${paramIndex++}`);
      params.push(startDate);
    }

    if (endDate) {
      whereConditions.push(`created_at <= $${paramIndex++}`);
      params.push(endDate);
    }

    if (assignedTo) {
      whereConditions.push(`assigned_to = $${paramIndex++}`);
      params.push(assignedTo);
    }

    // 전체 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM notifications 
      WHERE ${whereConditions.join(' AND ')}
    `;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // 알림 목록 조회
    const query = `
      SELECT * FROM notifications 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        notifications: result.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '알림 목록을 불러오는데 실패했습니다.'
    });
  }
});

// 알림 상태 변경
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const query = `
      UPDATE notifications 
      SET status = $1, read_at = CASE WHEN $1 = 'read' THEN NOW() ELSE read_at END, updated_at = NOW()
      WHERE id = $2 
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '알림을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: '알림 상태가 변경되었습니다.'
    });
  } catch (error) {
    console.error('알림 상태 변경 실패:', error);
    res.status(500).json({
      success: false,
      message: '알림 상태 변경에 실패했습니다.'
    });
  }
});

// 알림 일괄 처리
router.put('/bulk', authenticateToken, async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '처리할 알림을 선택해주세요.'
      });
    }

    const query = `
      UPDATE notifications 
      SET status = $1, read_at = CASE WHEN $1 = 'read' THEN NOW() ELSE read_at END, updated_at = NOW()
      WHERE id = ANY($2)
    `;
    
    await pool.query(query, [status, ids]);

    res.json({
      success: true,
      message: `${ids.length}개의 알림이 처리되었습니다.`
    });
  } catch (error) {
    console.error('알림 일괄 처리 실패:', error);
    res.status(500).json({
      success: false,
      message: '알림 일괄 처리에 실패했습니다.'
    });
  }
});

// 알림 통계 조회
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread,
        COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high,
        COUNT(CASE WHEN priority = 'normal' THEN 1 END) as normal,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low
      FROM notifications
    `;
    
    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('알림 통계 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '알림 통계를 불러오는데 실패했습니다.'
    });
  }
});

// 알림 설정 조회
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    
    const query = `
      SELECT settings FROM user_notification_settings 
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);

    const defaultSettings = {
      emailNotifications: {
        enabled: true,
        types: ['urgent', 'deadline'],
        frequency: 'immediate'
      },
      webNotifications: {
        enabled: true,
        types: ['urgent', 'deadline', 'missing', 'duplicate']
      },
      pushNotifications: {
        enabled: false
      }
    };

    res.json({
      success: true,
      data: {
        settings: result.rows[0]?.settings || defaultSettings
      }
    });
  } catch (error) {
    console.error('알림 설정 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '알림 설정을 불러오는데 실패했습니다.'
    });
  }
});

// 알림 설정 저장
router.post('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { settings } = req.body;

    const query = `
      INSERT INTO user_notification_settings (user_id, settings, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET settings = $2, updated_at = NOW()
    `;
    
    await pool.query(query, [userId, JSON.stringify(settings)]);

    res.json({
      success: true,
      data: { settings },
      message: '알림 설정이 저장되었습니다.'
    });
  } catch (error) {
    console.error('알림 설정 저장 실패:', error);
    res.status(500).json({
      success: false,
      message: '알림 설정 저장에 실패했습니다.'
    });
  }
});

export default router;
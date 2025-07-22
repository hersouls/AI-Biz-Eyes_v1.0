import { Request, Response } from 'express';
import { BidStatistics, SystemStatistics, ApiResponse } from '../types';
import { pool } from '../database/connection';

export class StatisticsController {
  // 공고 통계 조회
  static async getBidStatistics(req: Request, res: Response) {
    try {
      const { period, startDate, endDate } = req.query;
      
      let dateFilter = '';
      let params: any[] = [];
      
      if (startDate && endDate) {
        dateFilter = 'WHERE bidNtceDate BETWEEN ? AND ?';
        params = [startDate, endDate];
      } else if (period) {
        const now = new Date();
        let start: Date;
        
        switch (period) {
          case 'today':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            start = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            start = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        
        dateFilter = 'WHERE bidNtceDate >= ?';
        params = [start.toISOString().split('T')[0]];
      }

      // 전체 통계
      const [totalResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM bids ${dateFilter}`,
        params
      );
      const totalBids = (totalResult as any)[0].total;

      // 신규 공고 (오늘)
      const [newResult] = await pool.execute(
        `SELECT COUNT(*) as count FROM bids WHERE DATE(bidNtceDate) = CURDATE()`
      );
      const newBids = (newResult as any)[0].count;

      // 긴급 공고
      const [urgentResult] = await pool.execute(
        `SELECT COUNT(*) as count FROM bids WHERE bidNtceSttusNm LIKE '%긴급%' ${dateFilter}`,
        params
      );
      const urgentBids = (urgentResult as any)[0].count;

      // 마감 임박 공고 (3일 이내)
      const [deadlineResult] = await pool.execute(
        `SELECT COUNT(*) as count FROM bids WHERE bidClseDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY) ${dateFilter}`,
        params
      );
      const deadlineBids = (deadlineResult as any)[0].count;

      // 사업유형별 통계
      const [typeResult] = await pool.execute(
        `SELECT 
          SUM(CASE WHEN bsnsDivNm LIKE '%공사%' THEN 1 ELSE 0 END) as construction,
          SUM(CASE WHEN bsnsDivNm LIKE '%용역%' THEN 1 ELSE 0 END) as service,
          SUM(CASE WHEN bsnsDivNm LIKE '%물품%' THEN 1 ELSE 0 END) as goods
        FROM bids ${dateFilter}`,
        params
      );
      const byType = (typeResult as any)[0];

      // 상태별 통계
      const [statusResult] = await pool.execute(
        `SELECT 
          SUM(CASE WHEN bidNtceSttusNm NOT LIKE '%긴급%' AND bidNtceSttusNm NOT LIKE '%정정%' THEN 1 ELSE 0 END) as normal,
          SUM(CASE WHEN bidNtceSttusNm LIKE '%긴급%' THEN 1 ELSE 0 END) as urgent,
          SUM(CASE WHEN bidNtceSttusNm LIKE '%정정%' THEN 1 ELSE 0 END) as correction
        FROM bids ${dateFilter}`,
        params
      );
      const byStatus = (statusResult as any)[0];

      // 기관별 통계
      const [institutionResult] = await pool.execute(
        `SELECT ntceInsttNm, COUNT(*) as count 
         FROM bids ${dateFilter}
         GROUP BY ntceInsttNm 
         ORDER BY count DESC 
         LIMIT 10`,
        params
      );
      const byInstitution: Record<string, number> = {};
      (institutionResult as any[]).forEach((row: any) => {
        byInstitution[row.ntceInsttNm] = row.count;
      });

      // 예산 범위별 통계
      const [budgetResult] = await pool.execute(
        `SELECT 
          SUM(CASE WHEN asignBdgtAmt < 100000000 THEN 1 ELSE 0 END) as under100M,
          SUM(CASE WHEN asignBdgtAmt >= 100000000 AND asignBdgtAmt < 500000000 THEN 1 ELSE 0 END) as '100M-500M',
          SUM(CASE WHEN asignBdgtAmt >= 500000000 AND asignBdgtAmt < 1000000000 THEN 1 ELSE 0 END) as '500M-1B',
          SUM(CASE WHEN asignBdgtAmt >= 1000000000 THEN 1 ELSE 0 END) as over1B
        FROM bids ${dateFilter}`,
        params
      );
      const budgetRange = (budgetResult as any)[0];

      const statistics: BidStatistics = {
        totalBids,
        newBids,
        urgentBids,
        deadlineBids,
        byType,
        byStatus,
        byInstitution,
        budgetRange
      };

      const response: ApiResponse<BidStatistics> = {
        success: true,
        data: statistics,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching bid statistics:', error);
      res.status(500).json({
        success: false,
        message: '통계 조회 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      });
    }
  }

  // 레퍼런스 통계 조회
  static async getReferenceStatistics(req: Request, res: Response) {
    try {
      const { period, startDate, endDate } = req.query;
      
      let dateFilter = '';
      let params: any[] = [];
      
      if (startDate && endDate) {
        dateFilter = 'WHERE participationYear BETWEEN ? AND ?';
        params = [startDate, endDate];
      } else if (period) {
        const now = new Date();
        let start: number;
        
        switch (period) {
          case 'year':
            start = now.getFullYear() - 1;
            break;
          case '3years':
            start = now.getFullYear() - 3;
            break;
          case '5years':
            start = now.getFullYear() - 5;
            break;
          default:
            start = now.getFullYear() - 1;
        }
        
        dateFilter = 'WHERE participationYear >= ?';
        params = [start];
      }

      // 전체 통계
      const [totalResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM references ${dateFilter}`,
        params
      );
      const totalReferences = (totalResult as any)[0].total;

      // 성공률 통계
      const [successResult] = await pool.execute(
        `SELECT 
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success,
          SUM(CASE WHEN status = 'failure' THEN 1 ELSE 0 END) as failure,
          SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) as ongoing
        FROM references ${dateFilter}`,
        params
      );
      const successStats = (successResult as any)[0];

      // 연도별 통계
      const [yearlyResult] = await pool.execute(
        `SELECT 
          participationYear,
          COUNT(*) as count,
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success,
          SUM(contractAmount) as totalAmount
        FROM references ${dateFilter}
        GROUP BY participationYear
        ORDER BY participationYear DESC`,
        params
      );

      // 사업유형별 통계
      const [typeResult] = await pool.execute(
        `SELECT 
          projectType,
          COUNT(*) as count,
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success,
          SUM(contractAmount) as totalAmount
        FROM references ${dateFilter}
        GROUP BY projectType
        ORDER BY count DESC`,
        params
      );

      // 기관별 통계
      const [orgResult] = await pool.execute(
        `SELECT 
          organization,
          COUNT(*) as count,
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success,
          SUM(contractAmount) as totalAmount
        FROM references ${dateFilter}
        GROUP BY organization
        ORDER BY count DESC
        LIMIT 10`,
        params
      );

      const statistics = {
        totalReferences,
        successRate: totalReferences > 0 ? (successStats.success / totalReferences * 100).toFixed(1) : 0,
        successStats,
        yearlyStats: yearlyResult,
        typeStats: typeResult,
        organizationStats: orgResult
      };

      const response: ApiResponse<any> = {
        success: true,
        data: statistics,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching reference statistics:', error);
      res.status(500).json({
        success: false,
        message: '레퍼런스 통계 조회 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      });
    }
  }

  // 알림 통계 조회
  static async getNotificationStatistics(req: Request, res: Response) {
    try {
      const { period, startDate, endDate } = req.query;
      
      let dateFilter = '';
      let params: any[] = [];
      
      if (startDate && endDate) {
        dateFilter = 'WHERE createdAt BETWEEN ? AND ?';
        params = [startDate, endDate];
      } else if (period) {
        const now = new Date();
        let start: Date;
        
        switch (period) {
          case 'today':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            start = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        
        dateFilter = 'WHERE createdAt >= ?';
        params = [start.toISOString()];
      }

      // 전체 통계
      const [totalResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM notifications ${dateFilter}`,
        params
      );
      const totalNotifications = (totalResult as any)[0].total;

      // 유형별 통계
      const [typeResult] = await pool.execute(
        `SELECT 
          type,
          COUNT(*) as count,
          SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread
        FROM notifications ${dateFilter}
        GROUP BY type`,
        params
      );

      // 상태별 통계
      const [statusResult] = await pool.execute(
        `SELECT 
          status,
          COUNT(*) as count
        FROM notifications ${dateFilter}
        GROUP BY status`,
        params
      );

      // 우선순위별 통계
      const [priorityResult] = await pool.execute(
        `SELECT 
          priority,
          COUNT(*) as count
        FROM notifications ${dateFilter}
        GROUP BY priority`,
        params
      );

      // 일별 발생 추이
      const [dailyResult] = await pool.execute(
        `SELECT 
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM notifications ${dateFilter}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
        LIMIT 30`,
        params
      );

      const statistics = {
        totalNotifications,
        typeStats: typeResult,
        statusStats: statusResult,
        priorityStats: priorityResult,
        dailyTrend: dailyResult
      };

      const response: ApiResponse<any> = {
        success: true,
        data: statistics,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching notification statistics:', error);
      res.status(500).json({
        success: false,
        message: '알림 통계 조회 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      });
    }
  }

  // 시스템 통계 조회 (관리자용)
  static async getSystemStatistics(req: Request, res: Response) {
    try {
      // 사용자 통계
      const [userResult] = await pool.execute(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN createdAt >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 ELSE 0 END) as newThisMonth
        FROM users`
      );
      const users = (userResult as any)[0];

      // 공고 통계
      const [bidResult] = await pool.execute(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN DATE(bidNtceDate) = CURDATE() THEN 1 ELSE 0 END) as newToday
        FROM bids`
      );
      const bids = (bidResult as any)[0];

      // 알림 통계
      const [notificationResult] = await pool.execute(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread,
          SUM(CASE WHEN type = 'urgent' THEN 1 ELSE 0 END) as urgent
        FROM notifications`
      );
      const notifications = (notificationResult as any)[0];

      // 시스템 정보 (가상 데이터)
      const system = {
        uptime: '99.9%',
        lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        diskUsage: '65%',
        memoryUsage: '45%'
      };

      const statistics: SystemStatistics = {
        users,
        bids: {
          ...bids,
          syncSuccess: 98.5 // 가상 데이터
        },
        notifications,
        system
      };

      const response: ApiResponse<SystemStatistics> = {
        success: true,
        data: statistics,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching system statistics:', error);
      res.status(500).json({
        success: false,
        message: '시스템 통계 조회 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      });
    }
  }
}
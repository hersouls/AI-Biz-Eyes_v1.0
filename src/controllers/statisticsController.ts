import { Request, Response } from 'express';
import { BidStatistics, SystemStatistics, ApiResponse } from '../types';
import { mockBidStatistics, mockSystemStatistics, initialMockReferences } from '../data/mockData';

export class StatisticsController {
  // 공고 통계 조회
  static async getBidStatistics(req: Request, res: Response) {
    try {
      const { period, startDate, endDate } = req.query;
      
      // Mock 데이터 반환
      const statistics: BidStatistics = mockBidStatistics;

      const response: ApiResponse<BidStatistics> = {
        success: true,
        data: statistics,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      console.error('Error fetching bid statistics:', error);
      return res.status(500).json({
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
      
      // 실제 Mock 데이터에서 통계 계산
      const totalReferences = initialMockReferences.length;
      const successCount = initialMockReferences.filter(ref => ref.status === 'success').length;
      const failureCount = initialMockReferences.filter(ref => ref.status === 'failure').length;
      const ongoingCount = initialMockReferences.filter(ref => ref.status === 'ongoing').length;
      const successRate = totalReferences > 0 ? (successCount / totalReferences) * 100 : 0;

      // 사업유형별 통계 계산
      const typeStats = [
        { projectType: '공사', count: initialMockReferences.filter(ref => ref.projectType === '공사').length, success: initialMockReferences.filter(ref => ref.projectType === '공사' && ref.status === 'success').length, totalAmount: initialMockReferences.filter(ref => ref.projectType === '공사').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
        { projectType: '용역', count: initialMockReferences.filter(ref => ref.projectType === '용역').length, success: initialMockReferences.filter(ref => ref.projectType === '용역' && ref.status === 'success').length, totalAmount: initialMockReferences.filter(ref => ref.projectType === '용역').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
        { projectType: '물품', count: initialMockReferences.filter(ref => ref.projectType === '물품').length, success: initialMockReferences.filter(ref => ref.projectType === '물품' && ref.status === 'success').length, totalAmount: initialMockReferences.filter(ref => ref.projectType === '물품').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
        { projectType: 'IT', count: initialMockReferences.filter(ref => ref.projectType === 'IT').length, success: initialMockReferences.filter(ref => ref.projectType === 'IT' && ref.status === 'success').length, totalAmount: initialMockReferences.filter(ref => ref.projectType === 'IT').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
        { projectType: 'CT', count: initialMockReferences.filter(ref => ref.projectType === 'CT').length, success: initialMockReferences.filter(ref => ref.projectType === 'CT' && ref.status === 'success').length, totalAmount: initialMockReferences.filter(ref => ref.projectType === 'CT').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) },
        { projectType: 'AI', count: initialMockReferences.filter(ref => ref.projectType === 'AI').length, success: initialMockReferences.filter(ref => ref.projectType === 'AI' && ref.status === 'success').length, totalAmount: initialMockReferences.filter(ref => ref.projectType === 'AI').reduce((sum, ref) => sum + (ref.contractAmount || 0), 0) }
      ];

      // 연도별 통계 계산
      const yearlyStats: Array<{
        participationYear: number;
        count: number;
        success: number;
        totalAmount: number;
      }> = [];
      const years = [...new Set(initialMockReferences.map(ref => ref.participationYear))].filter((year): year is number => year !== undefined).sort((a, b) => b - a);
      years.forEach(year => {
        const yearRefs = initialMockReferences.filter(ref => ref.participationYear === year);
        yearlyStats.push({
          participationYear: year,
          count: yearRefs.length,
          success: yearRefs.filter(ref => ref.status === 'success').length,
          totalAmount: yearRefs.reduce((sum, ref) => sum + (ref.contractAmount || 0), 0)
        });
      });

      // 기관별 통계 계산
      const organizationStats: Array<{
        organization: string;
        count: number;
        success: number;
        totalAmount: number;
      }> = [];
      const organizations = [...new Set(initialMockReferences.map(ref => ref.organization))].filter((org): org is string => org !== undefined);
      organizations.forEach(org => {
        const orgRefs = initialMockReferences.filter(ref => ref.organization === org);
        organizationStats.push({
          organization: org,
          count: orgRefs.length,
          success: orgRefs.filter(ref => ref.status === 'success').length,
          totalAmount: orgRefs.reduce((sum, ref) => sum + (ref.contractAmount || 0), 0)
        });
      });

      const statistics = {
        totalReferences,
        successRate: Math.round(successRate * 10) / 10,
        successStats: {
          success: successCount,
          failure: failureCount,
          ongoing: ongoingCount
        },
        yearlyStats,
        typeStats,
        organizationStats
      };

      const response: ApiResponse<any> = {
        success: true,
        data: statistics,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      console.error('Error fetching reference statistics:', error);
      return res.status(500).json({
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
      
      // Mock 알림 통계 데이터
      const statistics = {
        totalNotifications: 250,
        typeStats: [
          { type: 'urgent', count: 45, unread: 5 },
          { type: 'deadline', count: 60, unread: 8 },
          { type: 'new', count: 80, unread: 12 },
          { type: 'missing', count: 35, unread: 3 },
          { type: 'duplicate', count: 30, unread: 2 }
        ],
        statusStats: [
          { status: 'unread', count: 30 },
          { status: 'read', count: 180 },
          { status: 'important', count: 25 },
          { status: 'completed', count: 15 }
        ],
        priorityStats: [
          { priority: 'high', count: 45 },
          { priority: 'medium', count: 120 },
          { priority: 'low', count: 85 }
        ],
        dailyTrend: [
          { date: '2024-07-22', count: 12 },
          { date: '2024-07-21', count: 15 },
          { date: '2024-07-20', count: 8 },
          { date: '2024-07-19', count: 20 },
          { date: '2024-07-18', count: 18 }
        ]
      };

      const response: ApiResponse<any> = {
        success: true,
        data: statistics,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      console.error('Error fetching notification statistics:', error);
      return res.status(500).json({
        success: false,
        message: '알림 통계 조회 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      });
    }
  }

  // 시스템 통계 조회 (관리자용)
  static async getSystemStatistics(req: Request, res: Response) {
    try {
      // Mock 시스템 통계 데이터
      const statistics: SystemStatistics = mockSystemStatistics;

      const response: ApiResponse<SystemStatistics> = {
        success: true,
        data: statistics,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      console.error('Error fetching system statistics:', error);
      return res.status(500).json({
        success: false,
        message: '시스템 통계 조회 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      });
    }
  }
}
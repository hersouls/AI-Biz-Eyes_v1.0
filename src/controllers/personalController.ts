import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ai_biz_eyes_db',
});

export class PersonalController {
  // 프로필 관리
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          organization: true,
          role: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '사용자를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '프로필 조회 중 오류가 발생했습니다.'
      });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { name, email, organization } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          organization,
          updatedAt: new Date()
        },
        select: {
          id: true,
          name: true,
          email: true,
          organization: true,
          role: true,
          lastLogin: true,
          updatedAt: true
        }
      });

      res.json({
        success: true,
        data: updatedUser,
        message: '프로필이 성공적으로 업데이트되었습니다.'
      });
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      res.status(500).json({
        success: false,
        message: '프로필 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 알림 설정
  static async getNotificationSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const settings = await prisma.userNotificationSettings.findUnique({
        where: { userId }
      });

      if (!settings) {
        // 기본 설정 생성
        const defaultSettings = await prisma.userNotificationSettings.create({
          data: {
            userId,
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
          }
        });

        return res.json({
          success: true,
          data: defaultSettings
        });
      }

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('알림 설정 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '알림 설정 조회 중 오류가 발생했습니다.'
      });
    }
  }

  static async updateNotificationSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const settings = req.body;

      const updatedSettings = await prisma.userNotificationSettings.upsert({
        where: { userId },
        update: settings,
        create: {
          userId,
          ...settings
        }
      });

      res.json({
        success: true,
        data: updatedSettings,
        message: '알림 설정이 성공적으로 저장되었습니다.'
      });
    } catch (error) {
      console.error('알림 설정 업데이트 오류:', error);
      res.status(500).json({
        success: false,
        message: '알림 설정 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 리포트 설정
  static async getReportSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const settings = await prisma.userReportSettings.findUnique({
        where: { userId }
      });

      if (!settings) {
        // 기본 설정 생성
        const defaultSettings = await prisma.userReportSettings.create({
          data: {
            userId,
            dailyReport: false,
            weeklyReport: true,
            monthlyReport: true,
            performanceReport: true,
            activityReport: true,
            format: 'excel'
          }
        });

        return res.json({
          success: true,
          data: defaultSettings
        });
      }

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('리포트 설정 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '리포트 설정 조회 중 오류가 발생했습니다.'
      });
    }
  }

  static async updateReportSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const settings = req.body;

      const updatedSettings = await prisma.userReportSettings.upsert({
        where: { userId },
        update: settings,
        create: {
          userId,
          ...settings
        }
      });

      res.json({
        success: true,
        data: updatedSettings,
        message: '리포트 설정이 성공적으로 저장되었습니다.'
      });
    } catch (error) {
      console.error('리포트 설정 업데이트 오류:', error);
      res.status(500).json({
        success: false,
        message: '리포트 설정 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 대시보드 설정
  static async getDashboardSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const settings = await prisma.userDashboardSettings.findUnique({
        where: { userId },
        include: {
          widgets: {
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!settings) {
        // 기본 위젯 설정 생성
        const defaultWidgets = [
          { type: 'overview', order: 1, isVisible: true },
          { type: 'trend', order: 2, isVisible: true },
          { type: 'calendar', order: 3, isVisible: true },
          { type: 'recommendations', order: 4, isVisible: true },
          { type: 'notifications', order: 5, isVisible: true },
          { type: 'references', order: 6, isVisible: true },
          { type: 'reports', order: 7, isVisible: false }
        ];

        const defaultSettings = await prisma.userDashboardSettings.create({
          data: {
            userId,
            defaultFilters: {},
            widgets: {
              create: defaultWidgets.map((widget, index) => ({
                type: widget.type,
                order: widget.order,
                isVisible: widget.isVisible
              }))
            }
          },
          include: {
            widgets: {
              orderBy: { order: 'asc' }
            }
          }
        });

        return res.json({
          success: true,
          data: defaultSettings
        });
      }

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('대시보드 설정 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '대시보드 설정 조회 중 오류가 발생했습니다.'
      });
    }
  }

  static async updateDashboardSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { widgets, defaultFilters } = req.body;

      // 위젯 순서 업데이트
      if (widgets) {
        for (const widget of widgets) {
          await prisma.dashboardWidget.update({
            where: { id: widget.id },
            data: {
              order: widget.order,
              isVisible: widget.isVisible
            }
          });
        }
      }

      const updatedSettings = await prisma.userDashboardSettings.update({
        where: { userId },
        data: {
          defaultFilters: defaultFilters || {}
        },
        include: {
          widgets: {
            orderBy: { order: 'asc' }
          }
        }
      });

      res.json({
        success: true,
        data: updatedSettings,
        message: '대시보드 설정이 성공적으로 저장되었습니다.'
      });
    } catch (error) {
      console.error('대시보드 설정 업데이트 오류:', error);
      res.status(500).json({
        success: false,
        message: '대시보드 설정 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 환경설정
  static async getPersonalSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const settings = await prisma.userPersonalSettings.findUnique({
        where: { userId }
      });

      if (!settings) {
        // 기본 설정 생성
        const defaultSettings = await prisma.userPersonalSettings.create({
          data: {
            userId,
            timezone: 'Asia/Seoul',
            language: 'ko',
            theme: 'light',
            autoRefresh: false,
            desktopNotifications: true,
            mobileOptimization: true
          }
        });

        return res.json({
          success: true,
          data: defaultSettings
        });
      }

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('환경설정 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '환경설정 조회 중 오류가 발생했습니다.'
      });
    }
  }

  static async updatePersonalSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const settings = req.body;

      const updatedSettings = await prisma.userPersonalSettings.upsert({
        where: { userId },
        update: settings,
        create: {
          userId,
          ...settings
        }
      });

      res.json({
        success: true,
        data: updatedSettings,
        message: '환경설정이 성공적으로 저장되었습니다.'
      });
    } catch (error) {
      console.error('환경설정 업데이트 오류:', error);
      res.status(500).json({
        success: false,
        message: '환경설정 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 활동 내역
  static async getActivityHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 20 } = req.query;

      const activities = await prisma.userActivity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          bid: {
            select: {
              id: true,
              title: true,
              organization: true
            }
          }
        }
      });

      const total = await prisma.userActivity.count({
        where: { userId }
      });

      res.json({
        success: true,
        data: {
          activities,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('활동 내역 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '활동 내역 조회 중 오류가 발생했습니다.'
      });
    }
  }

  static async getActivityDetail(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const activity = await prisma.userActivity.findFirst({
        where: {
          id,
          userId
        },
        include: {
          bid: true
        }
      });

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: '활동 내역을 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: activity
      });
    } catch (error) {
      console.error('활동 내역 상세 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '활동 내역 상세 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // 데이터 내보내기
  static async exportData(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { types, dateRange } = req.body;

      // 실제 구현에서는 데이터를 수집하고 파일을 생성
      const exportRecord = await prisma.dataExport.create({
        data: {
          userId,
          types: types,
          dateRange: dateRange,
          status: 'processing',
          filePath: null
        }
      });

      // 비동기로 데이터 내보내기 처리
      setTimeout(async () => {
        await prisma.dataExport.update({
          where: { id: exportRecord.id },
          data: {
            status: 'completed',
            filePath: `/exports/${exportRecord.id}.xlsx`
          }
        });
      }, 2000);

      res.json({
        success: true,
        data: exportRecord,
        message: '데이터 내보내기가 시작되었습니다.'
      });
    } catch (error) {
      console.error('데이터 내보내기 오류:', error);
      res.status(500).json({
        success: false,
        message: '데이터 내보내기 중 오류가 발생했습니다.'
      });
    }
  }

  static async getExportHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 10 } = req.query;

      const exports = await prisma.dataExport.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      });

      const total = await prisma.dataExport.count({
        where: { userId }
      });

      res.json({
        success: true,
        data: {
          exports,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('내보내기 이력 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '내보내기 이력 조회 중 오류가 발생했습니다.'
      });
    }
  }

  static async downloadExport(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const exportRecord = await prisma.dataExport.findFirst({
        where: {
          id,
          userId,
          status: 'completed'
        }
      });

      if (!exportRecord) {
        return res.status(404).json({
          success: false,
          message: '내보내기 파일을 찾을 수 없습니다.'
        });
      }

      // 실제 구현에서는 파일을 스트리밍으로 전송
      res.json({
        success: true,
        data: {
          downloadUrl: `/api/personal/export/${id}/file`
        }
      });
    } catch (error) {
      console.error('내보내기 다운로드 오류:', error);
      res.status(500).json({
        success: false,
        message: '내보내기 다운로드 중 오류가 발생했습니다.'
      });
    }
  }

  // 보안 설정
  static async getSecuritySettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          twoFactorEnabled: true,
          lastPasswordChange: true,
          loginAttempts: true,
          lockedUntil: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '사용자를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('보안 설정 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '보안 설정 조회 중 오류가 발생했습니다.'
      });
    }
  }

  static async updatePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { currentPassword, newPassword } = req.body;

      // 실제 구현에서는 비밀번호 검증 및 해싱
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '사용자를 찾을 수 없습니다.'
        });
      }

      // 비밀번호 변경 로직 (실제로는 해싱 필요)
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: newPassword, // 실제로는 해싱된 비밀번호
          lastPasswordChange: new Date()
        }
      });

      res.json({
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다.'
      });
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      res.status(500).json({
        success: false,
        message: '비밀번호 변경 중 오류가 발생했습니다.'
      });
    }
  }

  static async updateTwoFactor(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { enabled } = req.body;

      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: enabled
        }
      });

      res.json({
        success: true,
        message: `2차 인증이 ${enabled ? '활성화' : '비활성화'}되었습니다.`
      });
    } catch (error) {
      console.error('2차 인증 설정 오류:', error);
      res.status(500).json({
        success: false,
        message: '2차 인증 설정 중 오류가 발생했습니다.'
      });
    }
  }
}
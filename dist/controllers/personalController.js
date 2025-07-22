"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalController = void 0;
const mockData_1 = require("../data/mockData");
class PersonalController {
    static async getProfile(req, res) {
        try {
            const userId = req.user?.id || 1;
            const user = mockData_1.mockUsers.find(u => u.id === userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: '사용자를 찾을 수 없습니다.'
                });
            }
            return res.json({
                success: true,
                data: user
            });
        }
        catch (error) {
            console.error('프로필 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '프로필 조회 중 오류가 발생했습니다.'
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.id || 1;
            const { name, email, organization } = req.body;
            const userIndex = mockData_1.mockUsers.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: '사용자를 찾을 수 없습니다.'
                });
            }
            mockData_1.mockUsers[userIndex] = {
                ...mockData_1.mockUsers[userIndex],
                name: name || mockData_1.mockUsers[userIndex].name,
                email: email || mockData_1.mockUsers[userIndex].email,
                organization: organization || mockData_1.mockUsers[userIndex].organization,
                updatedAt: new Date().toISOString()
            };
            return res.json({
                success: true,
                data: mockData_1.mockUsers[userIndex],
                message: '프로필이 성공적으로 업데이트되었습니다.'
            });
        }
        catch (error) {
            console.error('프로필 업데이트 오류:', error);
            return res.status(500).json({
                success: false,
                message: '프로필 업데이트 중 오류가 발생했습니다.'
            });
        }
    }
    static async getNotificationSettings(req, res) {
        try {
            const userId = req.user?.id || 1;
            const settings = {
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
            };
            return res.json({
                success: true,
                data: settings
            });
        }
        catch (error) {
            console.error('알림 설정 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '알림 설정 조회 중 오류가 발생했습니다.'
            });
        }
    }
    static async updateNotificationSettings(req, res) {
        try {
            const userId = req.user?.id || 1;
            const settings = req.body;
            const updatedSettings = {
                userId,
                ...settings
            };
            return res.json({
                success: true,
                data: updatedSettings,
                message: '알림 설정이 성공적으로 저장되었습니다.'
            });
        }
        catch (error) {
            console.error('알림 설정 업데이트 오류:', error);
            return res.status(500).json({
                success: false,
                message: '알림 설정 업데이트 중 오류가 발생했습니다.'
            });
        }
    }
    static async getReportSettings(req, res) {
        try {
            const userId = req.user?.id || 1;
            const settings = {
                userId,
                dailyReport: false,
                weeklyReport: true,
                monthlyReport: true,
                performanceReport: true,
                activityReport: true,
                format: 'excel'
            };
            return res.json({
                success: true,
                data: settings
            });
        }
        catch (error) {
            console.error('리포트 설정 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '리포트 설정 조회 중 오류가 발생했습니다.'
            });
        }
    }
    static async updateReportSettings(req, res) {
        try {
            const userId = req.user?.id || 1;
            const settings = req.body;
            const updatedSettings = {
                userId,
                ...settings
            };
            return res.json({
                success: true,
                data: updatedSettings,
                message: '리포트 설정이 성공적으로 저장되었습니다.'
            });
        }
        catch (error) {
            console.error('리포트 설정 업데이트 오류:', error);
            return res.status(500).json({
                success: false,
                message: '리포트 설정 업데이트 중 오류가 발생했습니다.'
            });
        }
    }
    static async getDashboardSettings(req, res) {
        try {
            const userId = req.user?.id || 1;
            const widgets = [
                { id: 1, type: 'overview', order: 1, isVisible: true },
                { id: 2, type: 'trend', order: 2, isVisible: true },
                { id: 3, type: 'calendar', order: 3, isVisible: true },
                { id: 4, type: 'recommendations', order: 4, isVisible: true },
                { id: 5, type: 'notifications', order: 5, isVisible: true },
                { id: 6, type: 'references', order: 6, isVisible: true },
                { id: 7, type: 'reports', order: 7, isVisible: false }
            ];
            const settings = {
                userId,
                defaultFilters: {},
                widgets
            };
            return res.json({
                success: true,
                data: settings
            });
        }
        catch (error) {
            console.error('대시보드 설정 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '대시보드 설정 조회 중 오류가 발생했습니다.'
            });
        }
    }
    static async updateDashboardSettings(req, res) {
        try {
            const userId = req.user?.id || 1;
            const { widgets, defaultFilters } = req.body;
            const updatedSettings = {
                userId,
                defaultFilters: defaultFilters || {},
                widgets: widgets || []
            };
            return res.json({
                success: true,
                data: updatedSettings,
                message: '대시보드 설정이 성공적으로 저장되었습니다.'
            });
        }
        catch (error) {
            console.error('대시보드 설정 업데이트 오류:', error);
            return res.status(500).json({
                success: false,
                message: '대시보드 설정 업데이트 중 오류가 발생했습니다.'
            });
        }
    }
    static async getPersonalSettings(req, res) {
        try {
            const userId = req.user?.id || 1;
            const settings = {
                userId,
                timezone: 'Asia/Seoul',
                language: 'ko',
                theme: 'light',
                autoRefresh: false,
                desktopNotifications: true,
                mobileOptimization: true
            };
            return res.json({
                success: true,
                data: settings
            });
        }
        catch (error) {
            console.error('환경설정 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '환경설정 조회 중 오류가 발생했습니다.'
            });
        }
    }
    static async updatePersonalSettings(req, res) {
        try {
            const userId = req.user?.id || 1;
            const settings = req.body;
            const updatedSettings = {
                userId,
                ...settings
            };
            return res.json({
                success: true,
                data: updatedSettings,
                message: '환경설정이 성공적으로 저장되었습니다.'
            });
        }
        catch (error) {
            console.error('환경설정 업데이트 오류:', error);
            return res.status(500).json({
                success: false,
                message: '환경설정 업데이트 중 오류가 발생했습니다.'
            });
        }
    }
    static async getActivityHistory(req, res) {
        try {
            const userId = req.user?.id || 1;
            const { page = 1, limit = 20 } = req.query;
            const activities = [
                {
                    id: 1,
                    userId,
                    type: 'bid_view',
                    description: '공고 상세 조회',
                    bidId: 1,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    userId,
                    type: 'reference_create',
                    description: '레퍼런스 등록',
                    bidId: 2,
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            const total = activities.length;
            return res.json({
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
        }
        catch (error) {
            console.error('활동 내역 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '활동 내역 조회 중 오류가 발생했습니다.'
            });
        }
    }
    static async getActivityDetail(req, res) {
        try {
            const userId = req.user?.id || 1;
            const { id } = req.params;
            const activity = {
                id: Number(id),
                userId,
                type: 'bid_view',
                description: '공고 상세 조회',
                bidId: 1,
                createdAt: new Date().toISOString(),
                bid: {
                    id: 1,
                    title: '테스트 공고',
                    organization: '조달청'
                }
            };
            return res.json({
                success: true,
                data: activity
            });
        }
        catch (error) {
            console.error('활동 내역 상세 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '활동 내역 상세 조회 중 오류가 발생했습니다.'
            });
        }
    }
    static async exportData(req, res) {
        try {
            const userId = req.user?.id || 1;
            const { types, dateRange } = req.body;
            const exportRecord = {
                id: Date.now(),
                userId,
                types: types,
                dateRange: dateRange,
                status: 'processing',
                filePath: null,
                createdAt: new Date().toISOString()
            };
            setTimeout(() => {
                console.log('데이터 내보내기 완료:', exportRecord.id);
            }, 2000);
            return res.json({
                success: true,
                data: exportRecord,
                message: '데이터 내보내기가 시작되었습니다.'
            });
        }
        catch (error) {
            console.error('데이터 내보내기 오류:', error);
            return res.status(500).json({
                success: false,
                message: '데이터 내보내기 중 오류가 발생했습니다.'
            });
        }
    }
    static async getExportHistory(req, res) {
        try {
            const userId = req.user?.id || 1;
            const { page = 1, limit = 10 } = req.query;
            const exports = [
                {
                    id: 1,
                    userId,
                    types: ['bids', 'references'],
                    dateRange: { start: '2024-01-01', end: '2024-07-22' },
                    status: 'completed',
                    filePath: '/exports/1.xlsx',
                    createdAt: new Date().toISOString()
                }
            ];
            const total = exports.length;
            return res.json({
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
        }
        catch (error) {
            console.error('내보내기 이력 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '내보내기 이력 조회 중 오류가 발생했습니다.'
            });
        }
    }
    static async downloadExport(req, res) {
        try {
            const userId = req.user?.id || 1;
            const { id } = req.params;
            const exportRecord = {
                id: Number(id),
                userId,
                status: 'completed',
                filePath: `/exports/${id}.xlsx`
            };
            return res.json({
                success: true,
                data: {
                    downloadUrl: `/api/personal/export/${id}/file`
                }
            });
        }
        catch (error) {
            console.error('내보내기 다운로드 오류:', error);
            return res.status(500).json({
                success: false,
                message: '내보내기 다운로드 중 오류가 발생했습니다.'
            });
        }
    }
    static async getSecuritySettings(req, res) {
        try {
            const userId = req.user?.id || 1;
            const user = mockData_1.mockUsers.find(u => u.id === userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: '사용자를 찾을 수 없습니다.'
                });
            }
            const securitySettings = {
                id: user.id,
                email: user.email,
                twoFactorEnabled: false,
                lastPasswordChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                loginAttempts: 0,
                lockedUntil: null
            };
            return res.json({
                success: true,
                data: securitySettings
            });
        }
        catch (error) {
            console.error('보안 설정 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '보안 설정 조회 중 오류가 발생했습니다.'
            });
        }
    }
    static async updatePassword(req, res) {
        try {
            const userId = req.user?.id || 1;
            const { currentPassword, newPassword } = req.body;
            const user = mockData_1.mockUsers.find(u => u.id === userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: '사용자를 찾을 수 없습니다.'
                });
            }
            return res.json({
                success: true,
                message: '비밀번호가 성공적으로 변경되었습니다.'
            });
        }
        catch (error) {
            console.error('비밀번호 변경 오류:', error);
            return res.status(500).json({
                success: false,
                message: '비밀번호 변경 중 오류가 발생했습니다.'
            });
        }
    }
    static async updateTwoFactor(req, res) {
        try {
            const userId = req.user?.id || 1;
            const { enabled } = req.body;
            return res.json({
                success: true,
                message: `2차 인증이 ${enabled ? '활성화' : '비활성화'}되었습니다.`
            });
        }
        catch (error) {
            console.error('2차 인증 설정 오류:', error);
            return res.status(500).json({
                success: false,
                message: '2차 인증 설정 중 오류가 발생했습니다.'
            });
        }
    }
}
exports.PersonalController = PersonalController;
//# sourceMappingURL=personalController.js.map
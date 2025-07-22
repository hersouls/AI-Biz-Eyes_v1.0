"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAuditLogs = exports.updateAuditSettings = exports.getAuditSettings = exports.getQualityReport = exports.getAuditLogs = exports.getQualityMetrics = exports.exportData = exports.downloadBackup = exports.createBackup = exports.getBackups = exports.updateSystemConfig = exports.getSystemConfigs = exports.updateReportConfig = exports.getReportConfigs = exports.updateNotificationConfig = exports.getNotificationConfigs = exports.getSystemStatistics = exports.retryFailedFetch = exports.getFetchLogs = exports.getSystemLogs = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const mockData_1 = require("../data/mockData");
const getUsers = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json((0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() }));
        }
        const { page = 1, limit = 20, search, role, isActive, organization } = req.query;
        let filteredUsers = [...mockData_1.mockUsers];
        if (search) {
            filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().includes(String(search).toLowerCase()) ||
                user.email.toLowerCase().includes(String(search).toLowerCase()));
        }
        if (role) {
            filteredUsers = filteredUsers.filter(user => user.role === role);
        }
        if (isActive !== undefined) {
            filteredUsers = filteredUsers.filter(user => user.isActive === (isActive === 'true'));
        }
        if (organization) {
            filteredUsers = filteredUsers.filter(user => user.organization === organization);
        }
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        return res.json((0, response_1.createSuccessResponse)({
            users: paginatedUsers,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: filteredUsers.length,
                totalPages: Math.ceil(filteredUsers.length / Number(limit))
            }
        }));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json((0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() }));
        }
        const userData = req.body;
        const existingUser = mockData_1.mockUsers.find(user => user.email === userData.email);
        if (existingUser) {
            return res.status(422).json((0, response_1.createErrorResponse)('VALIDATION_DUPLICATE_EMAIL', '이미 존재하는 이메일입니다.'));
        }
        const newUser = {
            id: mockData_1.mockUsers.length + 1,
            email: userData.email,
            name: userData.name,
            organization: userData.organization,
            role: userData.role || 'user',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return res.status(201).json((0, response_1.createSuccessResponse)({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            createdAt: newUser.createdAt
        }, '사용자가 등록되었습니다.'));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json((0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() }));
        }
        const userId = Number(req.params.id);
        const updateData = req.body;
        const userIndex = mockData_1.mockUsers.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json((0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '사용자를 찾을 수 없습니다.'));
        }
        const updatedUser = {
            ...mockData_1.mockUsers[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        return res.json((0, response_1.createSuccessResponse)({
            id: updatedUser.id,
            updatedAt: updatedUser.updatedAt
        }, '사용자 정보가 수정되었습니다.'));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const userIndex = mockData_1.mockUsers.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json((0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '사용자를 찾을 수 없습니다.'));
        }
        mockData_1.mockUsers.splice(userIndex, 1);
        return res.json((0, response_1.createSuccessResponse)(null, '사용자가 삭제되었습니다.'));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.deleteUser = deleteUser;
const getSystemLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, level, category, userId, startDate, endDate } = req.query;
        let filteredLogs = [...mockData_1.initialMockSystemLogs];
        if (level) {
            filteredLogs = filteredLogs.filter(log => log.level === level);
        }
        if (category) {
            filteredLogs = filteredLogs.filter(log => log.category === category);
        }
        if (userId) {
            filteredLogs = filteredLogs.filter(log => log.userId === Number(userId));
        }
        if (startDate) {
            filteredLogs = filteredLogs.filter(log => log.createdAt >= String(startDate));
        }
        if (endDate) {
            filteredLogs = filteredLogs.filter(log => log.createdAt <= String(endDate));
        }
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
        return res.json((0, response_1.createSuccessResponse)({
            logs: paginatedLogs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: filteredLogs.length,
                totalPages: Math.ceil(filteredLogs.length / Number(limit))
            }
        }));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.getSystemLogs = getSystemLogs;
const getFetchLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, status, startDate, endDate } = req.query;
        let filteredLogs = [...mockData_1.mockFetchLogs];
        if (status) {
            filteredLogs = filteredLogs.filter(log => log.status === status);
        }
        if (startDate) {
            filteredLogs = filteredLogs.filter(log => log.requestedAt >= String(startDate));
        }
        if (endDate) {
            filteredLogs = filteredLogs.filter(log => log.requestedAt <= String(endDate));
        }
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
        return res.json((0, response_1.createSuccessResponse)({
            logs: paginatedLogs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: filteredLogs.length,
                totalPages: Math.ceil(filteredLogs.length / Number(limit))
            }
        }));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.getFetchLogs = getFetchLogs;
const retryFailedFetch = async (req, res) => {
    try {
        const logId = Number(req.params.id);
        const logIndex = mockData_1.mockFetchLogs.findIndex(log => log.id === logId);
        if (logIndex === -1) {
            return res.status(404).json((0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '수집 이력을 찾을 수 없습니다.'));
        }
        mockData_1.mockFetchLogs[logIndex].status = 'pending';
        mockData_1.mockFetchLogs[logIndex].requestedAt = new Date().toISOString();
        return res.json((0, response_1.createSuccessResponse)(null, '재시도가 시작되었습니다.'));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.retryFailedFetch = retryFailedFetch;
const getSystemStatistics = async (req, res) => {
    try {
        const { period } = req.query;
        return res.json((0, response_1.createSuccessResponse)(mockData_1.mockSystemStatistics));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.getSystemStatistics = getSystemStatistics;
const getNotificationConfigs = async (req, res) => {
    try {
        return res.json((0, response_1.createSuccessResponse)(mockData_1.mockNotificationConfigs));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.getNotificationConfigs = getNotificationConfigs;
const updateNotificationConfig = async (req, res) => {
    try {
        const configId = Number(req.params.id);
        const updateData = req.body;
        if (configId === 0) {
            const newConfig = {
                id: mockData_1.mockNotificationConfigs.length + 1,
                type: updateData.type,
                channel: updateData.channel,
                frequency: updateData.frequency,
                recipients: updateData.recipients,
                isActive: updateData.isActive,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            mockData_1.mockNotificationConfigs.push(newConfig);
            return res.status(201).json((0, response_1.createSuccessResponse)(newConfig, '알림 설정이 생성되었습니다.'));
        }
        else {
            const configIndex = mockData_1.mockNotificationConfigs.findIndex(config => config.id === configId);
            if (configIndex === -1) {
                return res.status(404).json((0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '알림 설정을 찾을 수 없습니다.'));
            }
            mockData_1.mockNotificationConfigs[configIndex] = {
                ...mockData_1.mockNotificationConfigs[configIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            return res.json((0, response_1.createSuccessResponse)(mockData_1.mockNotificationConfigs[configIndex], '알림 설정이 수정되었습니다.'));
        }
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.updateNotificationConfig = updateNotificationConfig;
const getReportConfigs = async (req, res) => {
    try {
        return res.json((0, response_1.createSuccessResponse)(mockData_1.mockReportConfigs));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.getReportConfigs = getReportConfigs;
const updateReportConfig = async (req, res) => {
    try {
        const configId = Number(req.params.id);
        const updateData = req.body;
        const configIndex = mockData_1.mockReportConfigs.findIndex(config => config.id === configId);
        if (configIndex === -1) {
            return res.status(404).json((0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '리포트 설정을 찾을 수 없습니다.'));
        }
        mockData_1.mockReportConfigs[configIndex] = {
            ...mockData_1.mockReportConfigs[configIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        return res.json((0, response_1.createSuccessResponse)(mockData_1.mockReportConfigs[configIndex], '리포트 설정이 수정되었습니다.'));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.updateReportConfig = updateReportConfig;
const getSystemConfigs = async (req, res) => {
    try {
        return res.json((0, response_1.createSuccessResponse)(mockData_1.mockSystemConfigs));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.getSystemConfigs = getSystemConfigs;
const updateSystemConfig = async (req, res) => {
    try {
        const configId = Number(req.params.id);
        const updateData = req.body;
        const configIndex = mockData_1.mockSystemConfigs.findIndex(config => config.id === configId);
        if (configIndex === -1) {
            return res.status(404).json((0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '시스템 설정을 찾을 수 없습니다.'));
        }
        mockData_1.mockSystemConfigs[configIndex] = {
            ...mockData_1.mockSystemConfigs[configIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        return res.json((0, response_1.createSuccessResponse)(mockData_1.mockSystemConfigs[configIndex], '시스템 설정이 수정되었습니다.'));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.updateSystemConfig = updateSystemConfig;
const getBackups = async (req, res) => {
    try {
        return res.json((0, response_1.createSuccessResponse)(mockData_1.mockBackups));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.getBackups = getBackups;
const createBackup = async (req, res) => {
    try {
        const newBackup = {
            id: mockData_1.mockBackups.length + 1,
            filename: `backup_${new Date().toISOString().split('T')[0]}.zip`,
            size: Math.floor(Math.random() * 1000000) + 100000,
            type: 'manual',
            status: 'completed',
            createdAt: new Date().toISOString(),
            downloadUrl: `/admin/backups/${mockData_1.mockBackups.length + 1}/download`
        };
        mockData_1.mockBackups.push(newBackup);
        return res.status(201).json((0, response_1.createSuccessResponse)(newBackup, '백업이 생성되었습니다.'));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.createBackup = createBackup;
const downloadBackup = async (req, res) => {
    try {
        const backupId = Number(req.params.id);
        const backup = mockData_1.mockBackups.find(b => b.id === backupId);
        if (!backup) {
            return res.status(404).json((0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '백업 파일을 찾을 수 없습니다.'));
        }
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${backup.filename}"`);
        return res.send(Buffer.from('Mock backup file content'));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.'));
    }
};
exports.downloadBackup = downloadBackup;
const exportData = async (req, res) => {
    try {
        const { format = 'json', type = 'all' } = req.query;
        const exportData = {
            users: mockData_1.mockUsers,
            systemLogs: mockData_1.initialMockSystemLogs,
            fetchLogs: mockData_1.mockFetchLogs,
            timestamp: new Date().toISOString()
        };
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
            return res.send('CSV data would be here');
        }
        else {
            return res.json((0, response_1.createSuccessResponse)(exportData));
        }
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '데이터 내보내기에 실패했습니다.'));
    }
};
exports.exportData = exportData;
const getQualityMetrics = async (req, res) => {
    try {
        const metrics = {
            systemHealth: {
                uptime: 99.8,
                responseTime: 245,
                errorRate: 0.2,
                successRate: 99.8
            },
            dataQuality: {
                totalRecords: 15420,
                validRecords: 15380,
                duplicateRecords: 25,
                missingDataRate: 0.1
            },
            apiPerformance: {
                totalCalls: 12500,
                successCalls: 12450,
                failedCalls: 50,
                averageResponseTime: 180
            },
            userActivity: {
                activeUsers: 45,
                totalSessions: 120,
                averageSessionDuration: 1800,
                pageViews: 850
            },
            securityMetrics: {
                failedLogins: 12,
                suspiciousActivities: 3,
                blockedRequests: 8,
                lastSecurityScan: new Date().toISOString()
            }
        };
        return res.json((0, response_1.createSuccessResponse)({
            metrics,
            lastUpdated: new Date().toISOString()
        }));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '품질 메트릭을 불러오는데 실패했습니다.'));
    }
};
exports.getQualityMetrics = getQualityMetrics;
const getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, severity, category, userId, startDate, endDate, action, resource } = req.query;
        const mockAuditLogs = [
            {
                id: 1,
                userId: 1,
                userName: '관리자',
                action: 'LOGIN',
                resource: 'AUTH',
                details: { ipAddress: '192.168.1.100' },
                ipAddress: '192.168.1.100',
                userAgent: 'Mozilla/5.0...',
                severity: 'low',
                category: 'user_activity',
                timestamp: new Date().toISOString(),
                sessionId: 'sess_123',
                requestId: 'req_456'
            },
            {
                id: 2,
                userId: 2,
                userName: '사용자1',
                action: 'DATA_ACCESS',
                resource: 'BIDS',
                resourceId: 'bid_123',
                details: { recordCount: 50 },
                ipAddress: '192.168.1.101',
                userAgent: 'Mozilla/5.0...',
                severity: 'medium',
                category: 'data_access',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                sessionId: 'sess_124',
                requestId: 'req_457'
            },
            {
                id: 3,
                userId: 1,
                userName: '관리자',
                action: 'SYSTEM_CONFIG_CHANGE',
                resource: 'SYSTEM',
                details: { configKey: 'api_timeout', oldValue: '30', newValue: '60' },
                ipAddress: '192.168.1.100',
                userAgent: 'Mozilla/5.0...',
                severity: 'high',
                category: 'system_change',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                sessionId: 'sess_123',
                requestId: 'req_458'
            }
        ];
        let filteredLogs = [...mockAuditLogs];
        if (severity) {
            filteredLogs = filteredLogs.filter(log => log.severity === severity);
        }
        if (category) {
            filteredLogs = filteredLogs.filter(log => log.category === category);
        }
        if (userId) {
            filteredLogs = filteredLogs.filter(log => log.userId === Number(userId));
        }
        if (action) {
            filteredLogs = filteredLogs.filter(log => log.action.includes(String(action)));
        }
        if (resource) {
            filteredLogs = filteredLogs.filter(log => log.resource.includes(String(resource)));
        }
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
        return res.json((0, response_1.createSuccessResponse)({
            logs: paginatedLogs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: filteredLogs.length,
                totalPages: Math.ceil(filteredLogs.length / Number(limit))
            }
        }));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '감사 로그를 불러오는데 실패했습니다.'));
    }
};
exports.getAuditLogs = getAuditLogs;
const getQualityReport = async (req, res) => {
    try {
        const { period = 'week' } = req.query;
        const report = {
            period: {
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                end: new Date().toISOString()
            },
            summary: {
                totalIssues: 15,
                criticalIssues: 2,
                resolvedIssues: 12,
                openIssues: 3
            },
            trends: {
                daily: [
                    { date: '2024-01-01', issues: 2, resolved: 1 },
                    { date: '2024-01-02', issues: 3, resolved: 2 },
                    { date: '2024-01-03', issues: 1, resolved: 3 },
                    { date: '2024-01-04', issues: 4, resolved: 2 },
                    { date: '2024-01-05', issues: 2, resolved: 3 },
                    { date: '2024-01-06', issues: 1, resolved: 1 },
                    { date: '2024-01-07', issues: 2, resolved: 0 }
                ],
                weekly: [
                    { week: '2024-W01', issues: 15, resolved: 12 },
                    { week: '2024-W02', issues: 12, resolved: 15 },
                    { week: '2024-W03', issues: 18, resolved: 14 }
                ]
            },
            categories: [
                { category: '데이터 품질', count: 8, percentage: 53.3 },
                { category: '시스템 성능', count: 4, percentage: 26.7 },
                { category: '보안 이슈', count: 2, percentage: 13.3 },
                { category: '사용자 경험', count: 1, percentage: 6.7 }
            ],
            recommendations: [
                {
                    id: 1,
                    title: '데이터 중복 검증 강화',
                    description: '중복 데이터 발생률이 증가하고 있습니다. 데이터 검증 로직을 강화해야 합니다.',
                    priority: 'high',
                    status: 'open'
                },
                {
                    id: 2,
                    title: 'API 응답 시간 최적화',
                    description: '일부 API 응답 시간이 임계값을 초과하고 있습니다. 성능 최적화가 필요합니다.',
                    priority: 'medium',
                    status: 'in_progress'
                }
            ]
        };
        return res.json((0, response_1.createSuccessResponse)({
            report,
            generatedAt: new Date().toISOString()
        }));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '품질 리포트를 생성하는데 실패했습니다.'));
    }
};
exports.getQualityReport = getQualityReport;
const getAuditSettings = async (req, res) => {
    try {
        const settings = {
            id: 1,
            enabled: true,
            retentionDays: 90,
            logLevel: 'all',
            categories: ['user_activity', 'data_access', 'system_change', 'security_event'],
            excludedUsers: [],
            excludedActions: ['HEARTBEAT', 'HEALTH_CHECK'],
            realTimeAlerts: true,
            alertThresholds: {
                failedLogins: 5,
                suspiciousActivities: 3,
                dataAccess: 100
            },
            exportSettings: {
                format: 'json',
                includeDetails: true,
                compression: false
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return res.json((0, response_1.createSuccessResponse)(settings));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '감사 설정을 불러오는데 실패했습니다.'));
    }
};
exports.getAuditSettings = getAuditSettings;
const updateAuditSettings = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json((0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() }));
        }
        const updateData = req.body;
        const updatedSettings = {
            ...updateData,
            id: 1,
            updatedAt: new Date().toISOString()
        };
        return res.json((0, response_1.createSuccessResponse)(updatedSettings));
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '감사 설정을 업데이트하는데 실패했습니다.'));
    }
};
exports.updateAuditSettings = updateAuditSettings;
const exportAuditLogs = async (req, res) => {
    try {
        const { format = 'json', startDate, endDate, severity, category } = req.query;
        const exportData = {
            logs: [
                {
                    id: 1,
                    userId: 1,
                    userName: '관리자',
                    action: 'LOGIN',
                    resource: 'AUTH',
                    severity: 'low',
                    category: 'user_activity',
                    timestamp: new Date().toISOString()
                }
            ],
            exportInfo: {
                format,
                exportedAt: new Date().toISOString(),
                totalRecords: 1
            }
        };
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
            return res.send('CSV audit logs would be here');
        }
        else {
            return res.json((0, response_1.createSuccessResponse)(exportData));
        }
    }
    catch (error) {
        return res.status(500).json((0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '감사 로그 내보내기에 실패했습니다.'));
    }
};
exports.exportAuditLogs = exportAuditLogs;
//# sourceMappingURL=adminController.js.map
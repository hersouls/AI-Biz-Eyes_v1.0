"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testIntegrationSystem = exports.getIntegrationStats = exports.createFieldMapping = exports.getFieldMappings = exports.getIntegrationLogs = exports.deleteIntegrationSystem = exports.updateIntegrationSystem = exports.createIntegrationSystem = exports.getIntegrationSystem = exports.getIntegrationSystems = void 0;
let integrationSystems = [
    {
        id: '1',
        name: '나라장터 입찰공고정보서비스',
        type: 'OpenAPI',
        status: 'active',
        apiKey: 'w8uFE%2BfALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM%2FqByWrt9gZ406%2FITajbX1Q8%2FESHI1LDOADaTMcg%3D%3D',
        url: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
        syncInterval: '5분',
        lastSyncAt: new Date('2024-01-15T10:30:00Z'),
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-15T10:30:00Z')
    },
    {
        id: '2',
        name: 'Google Sheets',
        type: 'GoogleSheets',
        status: 'active',
        apiKey: 'google-sheets-key-456',
        url: 'https://sheets.googleapis.com/v4/spreadsheets',
        syncInterval: '1시간',
        lastSyncAt: new Date('2024-01-15T09:00:00Z'),
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-15T09:00:00Z')
    },
    {
        id: '3',
        name: 'ERP 시스템',
        type: 'ERP',
        status: 'inactive',
        url: 'https://erp.company.com/api',
        syncInterval: '수동',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-10T15:20:00Z')
    }
];
let integrationLogs = [
    {
        id: '1',
        systemId: '1',
        type: 'success',
        message: '나라장터 입찰공고정보서비스 데이터 수집 성공',
        dataCount: 150,
        duration: 2500,
        createdAt: new Date('2024-01-15T10:30:00Z')
    },
    {
        id: '2',
        systemId: '1',
        type: 'error',
        message: 'API 키 만료로 인한 인증 실패',
        errorCode: 'AUTH_001',
        duration: 500,
        createdAt: new Date('2024-01-15T09:30:00Z')
    },
    {
        id: '3',
        systemId: '2',
        type: 'success',
        message: 'Google Sheets 데이터 동기화 완료',
        dataCount: 75,
        duration: 1800,
        createdAt: new Date('2024-01-15T09:00:00Z')
    }
];
let fieldMappings = [
    {
        id: '1',
        systemId: '1',
        internalField: 'bidNtceNo',
        externalField: 'bidNtceNo',
        description: '공고번호',
        isRequired: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
    },
    {
        id: '2',
        systemId: '1',
        internalField: 'bidNtceNm',
        externalField: 'bidNtceNm',
        description: '공고명',
        isRequired: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
    }
];
const calculateStats = () => {
    const totalSystems = integrationSystems.length;
    const activeSystems = integrationSystems.filter(sys => sys.status === 'active').length;
    const errorSystems = integrationSystems.filter(sys => sys.status === 'error').length;
    const totalLogs = integrationLogs.length;
    const successLogs = integrationLogs.filter(log => log.type === 'success').length;
    const successRate = totalLogs > 0 ? Math.round((successLogs / totalLogs) * 100) : 0;
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last24HoursLogs = integrationLogs.filter(log => log.createdAt > last24Hours).length;
    return {
        totalSystems,
        activeSystems,
        errorSystems,
        totalLogs,
        successRate,
        last24HoursLogs
    };
};
const getIntegrationSystems = (req, res) => {
    try {
        res.json({
            success: true,
            data: integrationSystems,
            message: '연동 시스템 목록을 성공적으로 조회했습니다.'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '연동 시스템 목록 조회 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getIntegrationSystems = getIntegrationSystems;
const getIntegrationSystem = (req, res) => {
    try {
        const { id } = req.params;
        const system = integrationSystems.find(sys => sys.id === id);
        if (!system) {
            return res.status(404).json({
                success: false,
                message: '해당 연동 시스템을 찾을 수 없습니다.'
            });
        }
        return res.json({
            success: true,
            data: system,
            message: '연동 시스템 정보를 성공적으로 조회했습니다.'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '연동 시스템 조회 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getIntegrationSystem = getIntegrationSystem;
const createIntegrationSystem = (req, res) => {
    try {
        const data = req.body;
        const newSystem = {
            id: Date.now().toString(),
            name: data.name,
            type: data.type,
            status: 'inactive',
            apiKey: data.apiKey,
            url: data.url,
            syncInterval: data.syncInterval,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        integrationSystems.push(newSystem);
        res.status(201).json({
            success: true,
            data: newSystem,
            message: '연동 시스템이 성공적으로 생성되었습니다.'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '연동 시스템 생성 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createIntegrationSystem = createIntegrationSystem;
const updateIntegrationSystem = (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const systemIndex = integrationSystems.findIndex(sys => sys.id === id);
        if (systemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '해당 연동 시스템을 찾을 수 없습니다.'
            });
        }
        integrationSystems[systemIndex] = {
            ...integrationSystems[systemIndex],
            ...data,
            updatedAt: new Date()
        };
        return res.json({
            success: true,
            data: integrationSystems[systemIndex],
            message: '연동 시스템이 성공적으로 수정되었습니다.'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '연동 시스템 수정 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateIntegrationSystem = updateIntegrationSystem;
const deleteIntegrationSystem = (req, res) => {
    try {
        const { id } = req.params;
        const systemIndex = integrationSystems.findIndex(sys => sys.id === id);
        if (systemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '해당 연동 시스템을 찾을 수 없습니다.'
            });
        }
        integrationSystems.splice(systemIndex, 1);
        return res.json({
            success: true,
            message: '연동 시스템이 성공적으로 삭제되었습니다.'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '연동 시스템 삭제 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteIntegrationSystem = deleteIntegrationSystem;
const getIntegrationLogs = (req, res) => {
    try {
        const { systemId, type, limit = '50', page = '1' } = req.query;
        let filteredLogs = [...integrationLogs];
        if (systemId) {
            filteredLogs = filteredLogs.filter(log => log.systemId === systemId);
        }
        if (type) {
            filteredLogs = filteredLogs.filter(log => log.type === type);
        }
        filteredLogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
        res.json({
            success: true,
            data: {
                logs: paginatedLogs,
                pagination: {
                    total: filteredLogs.length,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(filteredLogs.length / limitNum)
                }
            },
            message: '연동 로그 목록을 성공적으로 조회했습니다.'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '연동 로그 조회 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getIntegrationLogs = getIntegrationLogs;
const getFieldMappings = (req, res) => {
    try {
        const { systemId } = req.query;
        let filteredMappings = [...fieldMappings];
        if (systemId) {
            filteredMappings = filteredMappings.filter(mapping => mapping.systemId === systemId);
        }
        res.json({
            success: true,
            data: filteredMappings,
            message: '필드 매핑 목록을 성공적으로 조회했습니다.'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '필드 매핑 조회 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getFieldMappings = getFieldMappings;
const createFieldMapping = (req, res) => {
    try {
        const data = req.body;
        const newMapping = {
            id: Date.now().toString(),
            systemId: data.systemId,
            internalField: data.internalField,
            externalField: data.externalField,
            description: data.description,
            isRequired: data.isRequired,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        fieldMappings.push(newMapping);
        res.status(201).json({
            success: true,
            data: newMapping,
            message: '필드 매핑이 성공적으로 생성되었습니다.'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '필드 매핑 생성 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createFieldMapping = createFieldMapping;
const getIntegrationStats = (req, res) => {
    try {
        const stats = calculateStats();
        res.json({
            success: true,
            data: stats,
            message: '연동 통계를 성공적으로 조회했습니다.'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '연동 통계 조회 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getIntegrationStats = getIntegrationStats;
const testIntegrationSystem = (req, res) => {
    try {
        const { id } = req.params;
        const system = integrationSystems.find(sys => sys.id === id);
        if (!system) {
            return res.status(404).json({
                success: false,
                message: '해당 연동 시스템을 찾을 수 없습니다.'
            });
        }
        const testResult = {
            success: true,
            message: `${system.name} 연동 테스트가 성공했습니다.`,
            duration: Math.floor(Math.random() * 3000) + 500,
            dataCount: Math.floor(Math.random() * 100) + 10
        };
        const testLog = {
            id: Date.now().toString(),
            systemId: id,
            type: 'success',
            message: `${system.name} 연동 테스트 성공`,
            dataCount: testResult.dataCount,
            duration: testResult.duration,
            createdAt: new Date()
        };
        integrationLogs.unshift(testLog);
        return res.json({
            success: true,
            data: testResult,
            message: '연동 테스트가 성공적으로 완료되었습니다.'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '연동 테스트 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.testIntegrationSystem = testIntegrationSystem;
//# sourceMappingURL=integrationController.js.map
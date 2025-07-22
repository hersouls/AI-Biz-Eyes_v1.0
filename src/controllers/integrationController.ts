import { Request, Response } from 'express';
import { IntegrationSystem, IntegrationLog, FieldMapping, IntegrationConfig, CreateIntegrationRequest, UpdateIntegrationRequest, CreateFieldMappingRequest, IntegrationStats } from '../types/integration';

// 임시 데이터 (실제로는 데이터베이스에서 가져옴)
let integrationSystems: IntegrationSystem[] = [
  {
    id: '1',
    name: '나라장터 OpenAPI',
    type: 'OpenAPI',
    status: 'active',
    apiKey: 'sample-api-key-123',
    url: 'https://openapi.g2b.go.kr/openapi/service/rest/CntrctInfoService',
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

let integrationLogs: IntegrationLog[] = [
  {
    id: '1',
    systemId: '1',
    type: 'success',
    message: '나라장터 API 데이터 수집 성공',
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

let fieldMappings: FieldMapping[] = [
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

// 통계 계산 함수
const calculateStats = (): IntegrationStats => {
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

// 연동 시스템 목록 조회
export const getIntegrationSystems = (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: integrationSystems,
      message: '연동 시스템 목록을 성공적으로 조회했습니다.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '연동 시스템 목록 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 연동 시스템 상세 조회
export const getIntegrationSystem = (req: Request, res: Response) => {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '연동 시스템 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 연동 시스템 생성
export const createIntegrationSystem = (req: Request, res: Response) => {
  try {
    const data: CreateIntegrationRequest = req.body;
    
    const newSystem: IntegrationSystem = {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '연동 시스템 생성 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 연동 시스템 수정
export const updateIntegrationSystem = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: UpdateIntegrationRequest = req.body;
    
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '연동 시스템 수정 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 연동 시스템 삭제
export const deleteIntegrationSystem = (req: Request, res: Response) => {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '연동 시스템 삭제 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 연동 로그 목록 조회
export const getIntegrationLogs = (req: Request, res: Response) => {
  try {
    const { systemId, type, limit = '50', page = '1' } = req.query;
    
    let filteredLogs = [...integrationLogs];
    
    if (systemId) {
      filteredLogs = filteredLogs.filter(log => log.systemId === systemId);
    }
    
    if (type) {
      filteredLogs = filteredLogs.filter(log => log.type === type);
    }
    
    // 최신순 정렬
    filteredLogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // 페이지네이션
    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '연동 로그 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 필드 매핑 목록 조회
export const getFieldMappings = (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '필드 매핑 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 필드 매핑 생성
export const createFieldMapping = (req: Request, res: Response) => {
  try {
    const data: CreateFieldMappingRequest = req.body;
    
    const newMapping: FieldMapping = {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '필드 매핑 생성 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 연동 통계 조회
export const getIntegrationStats = (req: Request, res: Response) => {
  try {
    const stats = calculateStats();
    
    res.json({
      success: true,
      data: stats,
      message: '연동 통계를 성공적으로 조회했습니다.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '연동 통계 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 연동 시스템 테스트
export const testIntegrationSystem = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const system = integrationSystems.find(sys => sys.id === id);
    if (!system) {
      return res.status(404).json({
        success: false,
        message: '해당 연동 시스템을 찾을 수 없습니다.'
      });
    }
    
    // 실제로는 여기서 실제 API 호출을 수행
    // 임시로 성공 응답을 시뮬레이션
    const testResult = {
      success: true,
      message: `${system.name} 연동 테스트가 성공했습니다.`,
      duration: Math.floor(Math.random() * 3000) + 500,
      dataCount: Math.floor(Math.random() * 100) + 10
    };
    
    // 테스트 로그 추가
    const testLog: IntegrationLog = {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '연동 테스트 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
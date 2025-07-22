export interface IntegrationSystem {
  id: string;
  name: string;
  type: 'OpenAPI' | 'Excel' | 'ERP' | 'Groupware' | 'Messenger' | 'GoogleSheets';
  status: 'active' | 'inactive' | 'error';
  apiKey?: string;
  url?: string;
  syncInterval: string; // '5분', '1시간', '수동' 등
  lastSyncAt?: Date;
  lastErrorAt?: Date;
  errorCode?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationLog {
  id: string;
  systemId: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  errorCode?: string;
  dataCount?: number;
  duration?: number; // milliseconds
  createdAt: Date;
}

export interface FieldMapping {
  id: string;
  systemId: string;
  internalField: string;
  externalField: string;
  description?: string;
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationConfig {
  id: string;
  systemId: string;
  key: string;
  value: string;
  description?: string;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIntegrationRequest {
  name: string;
  type: IntegrationSystem['type'];
  apiKey?: string;
  url?: string;
  syncInterval: string;
}

export interface UpdateIntegrationRequest {
  name?: string;
  status?: IntegrationSystem['status'];
  apiKey?: string;
  url?: string;
  syncInterval?: string;
}

export interface CreateFieldMappingRequest {
  systemId: string;
  internalField: string;
  externalField: string;
  description?: string;
  isRequired: boolean;
}

export interface IntegrationStats {
  totalSystems: number;
  activeSystems: number;
  errorSystems: number;
  totalLogs: number;
  successRate: number;
  last24HoursLogs: number;
}
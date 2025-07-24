import { NotificationConfig, ReportConfig, SystemConfig } from './index';

// 타입 가드 함수들
export const isValidNotificationType = (type: any): type is NotificationConfig['type'] => {
  return ['new_bid', 'urgent', 'deadline', 'achievement'].includes(type);
};

export const isValidChannel = (channel: any): channel is NotificationConfig['channel'] => {
  return ['web', 'email', 'push'].includes(channel);
};

export const isValidFrequency = (frequency: any): frequency is NotificationConfig['frequency'] => {
  return ['immediate', 'daily', 'weekly'].includes(frequency);
};

export const isValidReportType = (type: any): type is ReportConfig['type'] => {
  return ['daily', 'weekly', 'monthly'].includes(type);
};

export const isValidSystemConfigCategory = (category: any): category is SystemConfig['category'] => {
  return ['api', 'security', 'notification', 'system'].includes(category);
};

// 안전한 팩토리 함수들
export const createNotificationConfig = (data: Partial<NotificationConfig>): NotificationConfig => {
  return {
    id: data.id ?? 0,
    type: isValidNotificationType(data.type) ? data.type : 'new_bid',
    channel: isValidChannel(data.channel) ? data.channel : 'web',
    frequency: isValidFrequency(data.frequency) ? data.frequency : 'immediate',
    recipients: Array.isArray(data.recipients) ? data.recipients : [],
    isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString()
  };
};

export const createReportConfig = (data: Partial<ReportConfig>): ReportConfig => {
  return {
    id: data.id ?? 0,
    type: isValidReportType(data.type) ? data.type : 'daily',
    recipients: Array.isArray(data.recipients) ? data.recipients : [],
    isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
    schedule: typeof data.schedule === 'string' ? data.schedule : '0 9 * * *', // 기본값: 매일 오전 9시
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString()
  };
};

export const createSystemConfig = (data: Partial<SystemConfig>): SystemConfig => {
  return {
    id: data.id ?? 0,
    key: typeof data.key === 'string' ? data.key : '',
    value: typeof data.value === 'string' ? data.value : '',
    description: typeof data.description === 'string' ? data.description : undefined,
    category: isValidSystemConfigCategory(data.category) ? data.category : 'system',
    isEncrypted: typeof data.isEncrypted === 'boolean' ? data.isEncrypted : false,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString()
  };
};

// DTO 클래스들
export class CreateNotificationConfigDto {
  type!: 'new_bid' | 'urgent' | 'deadline' | 'achievement';
  channel!: 'web' | 'email' | 'push';
  frequency!: 'immediate' | 'daily' | 'weekly';
  recipients!: string[];
  isActive!: boolean;
}

export class UpdateNotificationConfigDto extends CreateNotificationConfigDto {
  id?: number;
}

export class CreateReportConfigDto {
  type!: 'daily' | 'weekly' | 'monthly';
  recipients!: string[];
  isActive!: boolean;
  schedule!: string;
}

export class UpdateReportConfigDto extends CreateReportConfigDto {
  id?: number;
}

export class CreateSystemConfigDto {
  key!: string;
  value!: string;
  description?: string;
  category!: 'api' | 'security' | 'notification' | 'system';
  isEncrypted!: boolean;
}

export class UpdateSystemConfigDto extends CreateSystemConfigDto {
  id?: number;
}
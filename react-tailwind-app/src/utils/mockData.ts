import { 
  User, 
  SystemLog, 
  FetchLog, 
  NotificationConfig, 
  ReportConfig, 
  SystemConfig, 
  BackupInfo,
  SystemStatistics 
} from '../types/admin';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    name: '관리자',
    organization: '테크컴퍼니',
    role: 'admin',
    isActive: true,
    lastLogin: '2024-07-22T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    email: 'user1@example.com',
    name: '홍길동',
    organization: '테크컴퍼니',
    role: 'user',
    isActive: true,
    lastLogin: '2024-07-21T15:20:00Z',
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 3,
    email: 'user2@example.com',
    name: '김철수',
    organization: '개발팀',
    role: 'user',
    isActive: false,
    lastLogin: '2024-07-15T09:10:00Z',
    createdAt: '2024-03-10T00:00:00Z'
  }
];

// Mock System Logs
export const mockSystemLogs: SystemLog[] = [
  {
    id: 1,
    level: 'info',
    category: 'user_activity',
    message: '사용자 로그인',
    details: { userId: 1, ipAddress: '192.168.1.100' },
    userId: 1,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2024-07-22T10:30:00Z'
  },
  {
    id: 2,
    level: 'warning',
    category: 'api_call',
    message: 'API 호출 실패',
    details: { endpoint: '/api/bids', statusCode: 500 },
    userId: 2,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    createdAt: '2024-07-22T09:15:00Z'
  },
  {
    id: 3,
    level: 'error',
    category: 'system',
    message: '데이터베이스 연결 오류',
    details: { error: 'Connection timeout' },
    createdAt: '2024-07-22T08:45:00Z'
  }
];

// Mock Fetch Logs
export const mockFetchLogs: FetchLog[] = [
  {
    id: 1,
    bidNtceNo: '2024001',
    requestedAt: '2024-07-22T10:00:00Z',
    resultCode: '00',
    status: 'success',
    responseTime: 1200,
    dataCount: 45
  },
  {
    id: 2,
    bidNtceNo: '2024002',
    requestedAt: '2024-07-22T09:30:00Z',
    resultCode: '03',
    status: 'failed',
    errorMessage: '데이터가 없습니다',
    responseTime: 800
  },
  {
    id: 3,
    bidNtceNo: '2024003',
    requestedAt: '2024-07-22T09:00:00Z',
    resultCode: '00',
    status: 'success',
    responseTime: 950,
    dataCount: 23
  }
];

// Mock Notification Configs
export const mockNotificationConfigs: NotificationConfig[] = [
  {
    id: 1,
    type: 'new_bid',
    channel: 'web',
    frequency: 'immediate',
    recipients: ['admin@example.com', 'user1@example.com'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    type: 'urgent',
    channel: 'email',
    frequency: 'immediate',
    recipients: ['admin@example.com'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    type: 'deadline',
    channel: 'push',
    frequency: 'daily',
    recipients: ['user1@example.com', 'user2@example.com'],
    isActive: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Report Configs
export const mockReportConfigs: ReportConfig[] = [
  {
    id: 1,
    type: 'daily',
    recipients: ['admin@example.com'],
    isActive: true,
    schedule: '0 9 * * *',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    type: 'weekly',
    recipients: ['admin@example.com', 'user1@example.com'],
    isActive: true,
    schedule: '0 9 * * 1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    type: 'monthly',
    recipients: ['admin@example.com'],
    isActive: false,
    schedule: '0 9 1 * *',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Mock System Configs
export const mockSystemConfigs: SystemConfig[] = [
  {
    id: 1,
    key: 'api.base_url',
    value: 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService',
    description: '나라장터 입찰공고정보서비스 API 기본 URL',
    category: 'api',
    isEncrypted: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    key: 'api.api_key',
    value: 'w8uFE%2BfALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM%2FqByWrt9gZ406%2FITajbX1Q8%2FESHI1LDOADaTMcg%3D%3D',
    description: '나라장터 입찰공고정보서비스 API 키 (인코딩)',
    category: 'api',
    isEncrypted: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    key: 'security.session_timeout',
    value: '3600',
    description: '세션 타임아웃 (초)',
    category: 'security',
    isEncrypted: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    key: 'notification.email_smtp',
    value: 'smtp.gmail.com',
    description: '이메일 SMTP 서버',
    category: 'notification',
    isEncrypted: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    key: 'system.backup_interval',
    value: '86400',
    description: '자동 백업 간격 (초)',
    category: 'system',
    isEncrypted: false,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Backup Info
export const mockBackups: BackupInfo[] = [
  {
    id: 1,
    filename: 'backup-2024-07-22-10-00-00.zip',
    size: 52428800, // 50MB
    type: 'auto',
    status: 'completed',
    createdAt: '2024-07-22T10:00:00Z',
    downloadUrl: '/api/admin/backups/1/download'
  },
  {
    id: 2,
    filename: 'backup-2024-07-21-10-00-00.zip',
    size: 52428800, // 50MB
    type: 'auto',
    status: 'completed',
    createdAt: '2024-07-21T10:00:00Z',
    downloadUrl: '/api/admin/backups/2/download'
  },
  {
    id: 3,
    filename: 'manual-backup-2024-07-20-15-30-00.zip',
    size: 52428800, // 50MB
    type: 'manual',
    status: 'completed',
    createdAt: '2024-07-20T15:30:00Z',
    downloadUrl: '/api/admin/backups/3/download'
  },
  {
    id: 4,
    filename: 'backup-2024-07-19-10-00-00.zip',
    size: 0,
    type: 'auto',
    status: 'failed',
    createdAt: '2024-07-19T10:00:00Z'
  }
];

// Mock System Statistics
export const mockSystemStatistics: SystemStatistics = {
  users: {
    total: 15,
    active: 12,
    newThisMonth: 3
  },
  bids: {
    total: 1250,
    newToday: 45,
    syncSuccess: 98.5
  },
  notifications: {
    total: 250,
    unread: 15,
    urgent: 5
  },
  system: {
    uptime: '99.9%',
    lastBackup: '2024-07-22T02:00:00Z',
    diskUsage: '65%',
    memoryUsage: '45%'
  }
};
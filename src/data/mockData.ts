import { faker } from '@faker-js/faker';
import { 
  User, 
  Bid, 
  BidDetail, 
  Reference, 
  Notification,
  SystemLog,
  BidStatistics,
  SystemStatistics
} from '../types';

// Mock 사용자 데이터
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    name: '관리자',
    organization: '테크컴퍼니',
    role: 'admin',
    isActive: true,
    lastLogin: '2024-07-22T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:30:00Z'
  },
  {
    id: 2,
    email: 'user@example.com',
    name: '홍길동',
    organization: '테크컴퍼니',
    role: 'user',
    isActive: true,
    lastLogin: '2024-07-22T09:15:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-07-22T09:15:00Z'
  },
  {
    id: 3,
    email: 'manager@example.com',
    name: '김매니저',
    organization: '테크컴퍼니',
    role: 'user',
    isActive: true,
    lastLogin: '2024-07-21T16:45:00Z',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-07-21T16:45:00Z'
  }
];

// Mock 공고 데이터 생성 함수
export const generateMockBids = (count: number): Bid[] => {
  const bids: Bid[] = [];
  const institutions = ['조달청', '한국산업기술진흥원', '중소기업진흥공단', '정보통신산업진흥원'];
  const types = ['공사', '용역', '물품'];
  const statuses = ['일반공고', '긴급공고', '정정공고'];

  for (let i = 1; i <= count; i++) {
    const bid: Bid = {
      id: i,
      bidNtceNo: `2024${String(i).padStart(5, '0')}`,
      bidNtceNm: faker.commerce.productName() + ' 구축 사업',
      ntceInsttNm: faker.helpers.arrayElement(institutions),
      dmndInsttNm: faker.helpers.arrayElement(institutions),
      bsnsDivNm: faker.helpers.arrayElement(types),
      bidNtceSttusNm: faker.helpers.arrayElement(statuses),
      asignBdgtAmt: faker.number.int({ min: 10000000, max: 1000000000 }),
      presmptPrce: faker.number.int({ min: 9000000, max: 900000000 }),
      bidNtceDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      bidClseDate: faker.date.future({ years: 1 }).toISOString().split('T')[0],
      bidNtceUrl: faker.internet.url(),
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString()
    };
    bids.push(bid);
  }
  return bids;
};

// Mock 공고 상세 데이터 생성 함수
export const generateMockBidDetails = (count: number): BidDetail[] => {
  const bidDetails: BidDetail[] = [];
  const bids = generateMockBids(count);

  bids.forEach((bid, index) => {
    const detail: BidDetail = {
      ...bid,
      bidNtceBgn: '10:00',
      bidClseTm: '18:00',
      opengDate: faker.date.future({ years: 1 }).toISOString().split('T')[0],
      opengTm: '14:00',
      opengPlce: '조달청 본관',
      elctrnBidYn: 'Y',
      intrntnlBidYn: 'N',
      cmmnCntrctYn: 'N',
      rgnLmtYn: 'Y',
      prtcptPsblRgnNm: '서울특별시',
      indstrytyLmtYn: 'Y',
      bidprcPsblIndstrytyNm: '정보처리서비스업',
      presnatnOprtnYn: 'Y',
      presnatnOprtnDate: faker.date.future({ years: 1 }).toISOString().split('T')[0],
      presnatnOprtnTm: '14:00',
      presnatnOprtnPlce: '조달청 세미나실',
      ntceInsttOfclDeptNm: '조달정책과',
      ntceInsttOfclNm: faker.person.fullName(),
      ntceInsttOfclTel: faker.phone.number(),
      ntceInsttOfclEmailAdrs: faker.internet.email(),
      dmndInsttOfclDeptNm: '사업기획팀',
      dmndInsttOfclNm: faker.person.fullName(),
      dmndInsttOfclTel: faker.phone.number(),
      dmndInsttOfclEmailAdrs: faker.internet.email()
    };
    bidDetails.push(detail);
  });

  return bidDetails;
};

// Mock 레퍼런스 데이터 생성 함수
export const generateMockReferences = (count: number): Reference[] => {
  const references: Reference[] = [];
  const organizations = ['한국산업기술진흥원', '중소기업진흥공단', '정보통신산업진흥원'];
  const types = ['공사', '용역', '물품'];
  const statuses = ['success', 'failure', 'ongoing'] as const;
  const scores = ['A', 'B', 'C', 'D'];

  for (let i = 1; i <= count; i++) {
    const reference: Reference = {
      id: i,
      projectName: faker.commerce.productName() + ' 구축 사업',
      projectType: faker.helpers.arrayElement(types),
      bidNtceNo: `2023${String(i).padStart(5, '0')}`,
      organization: faker.helpers.arrayElement(organizations),
      participationYear: faker.number.int({ min: 2020, max: 2024 }),
      contractAmount: faker.number.int({ min: 10000000, max: 1000000000 }),
      status: faker.helpers.arrayElement(statuses),
      score: faker.helpers.arrayElement(scores),
      description: faker.lorem.paragraph(),
      files: [
        {
          name: '사업완료보고서.pdf',
          url: faker.internet.url(),
          size: faker.number.int({ min: 1000000, max: 10000000 })
        }
      ],
      createdBy: faker.number.int({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 365 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString()
    };
    references.push(reference);
  }
  return references;
};

// IT 사업유형 레퍼런스 데이터 생성 함수
export const generateITReferences = (count: number): Reference[] => {
  const references: Reference[] = [];
  const organizations = ['한국산업기술진흥원', '중소기업진흥공단', '정보통신산업진흥원', '한국정보산업연합회'];
  const itProjectTypes = ['시스템 구축', '소프트웨어 개발', '인프라 구축', '클라우드 마이그레이션', '보안 시스템'];
  const statuses = ['success', 'failure', 'ongoing'] as const;
  const scores = ['A', 'B', 'C', 'D'];

  for (let i = 1; i <= count; i++) {
    const reference: Reference = {
      id: 1000 + i, // IT 레퍼런스는 1000번대 ID 사용
      projectName: faker.helpers.arrayElement([
        '전자정부 시스템 구축',
        '기업 ERP 시스템 개발',
        '클라우드 인프라 구축',
        '보안 솔루션 도입',
        '데이터베이스 마이그레이션',
        '웹 애플리케이션 개발',
        '모바일 앱 개발',
        'API 서버 구축',
        '모니터링 시스템 구축',
        '백업 시스템 구축'
      ]),
      projectType: 'IT',
      bidNtceNo: `IT2023${String(i).padStart(4, '0')}`,
      organization: faker.helpers.arrayElement(organizations),
      participationYear: faker.number.int({ min: 2020, max: 2024 }),
      contractAmount: faker.number.int({ min: 50000000, max: 500000000 }),
      status: faker.helpers.arrayElement(statuses),
      score: faker.helpers.arrayElement(scores),
      description: faker.lorem.paragraph(3),
      files: [
        {
          name: 'IT사업완료보고서.pdf',
          url: faker.internet.url(),
          size: faker.number.int({ min: 2000000, max: 15000000 })
        },
        {
          name: '기술문서.zip',
          url: faker.internet.url(),
          size: faker.number.int({ min: 1000000, max: 5000000 })
        }
      ],
      createdBy: faker.number.int({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 365 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString()
    };
    references.push(reference);
  }
  return references;
};

// CT 사업유형 레퍼런스 데이터 생성 함수
export const generateCTReferences = (count: number): Reference[] => {
  const references: Reference[] = [];
  const organizations = ['한국산업기술진흥원', '중소기업진흥공단', '정보통신산업진흥원', '한국통신산업협회'];
  const ctProjectTypes = ['통신망 구축', '네트워크 인프라', '5G 기반 서비스', 'IoT 플랫폼', '통신장비 설치'];
  const statuses = ['success', 'failure', 'ongoing'] as const;
  const scores = ['A', 'B', 'C', 'D'];

  for (let i = 1; i <= count; i++) {
    const reference: Reference = {
      id: 2000 + i, // CT 레퍼런스는 2000번대 ID 사용
      projectName: faker.helpers.arrayElement([
        '5G 네트워크 구축 사업',
        '광통신망 설치 공사',
        'IoT 센서 네트워크 구축',
        '통신장비 교체 사업',
        '네트워크 보안 시스템 구축',
        '데이터센터 네트워크 구축',
        '무선통신 시스템 구축',
        '통신선로 설치 공사',
        '네트워크 모니터링 시스템',
        '통신인프라 현대화 사업'
      ]),
      projectType: 'CT',
      bidNtceNo: `CT2023${String(i).padStart(4, '0')}`,
      organization: faker.helpers.arrayElement(organizations),
      participationYear: faker.number.int({ min: 2020, max: 2024 }),
      contractAmount: faker.number.int({ min: 100000000, max: 1000000000 }),
      status: faker.helpers.arrayElement(statuses),
      score: faker.helpers.arrayElement(scores),
      description: faker.lorem.paragraph(3),
      files: [
        {
          name: 'CT사업완료보고서.pdf',
          url: faker.internet.url(),
          size: faker.number.int({ min: 3000000, max: 20000000 })
        },
        {
          name: '통신장비명세서.pdf',
          url: faker.internet.url(),
          size: faker.number.int({ min: 1000000, max: 8000000 })
        }
      ],
      createdBy: faker.number.int({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 365 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString()
    };
    references.push(reference);
  }
  return references;
};

// AI 사업유형 레퍼런스 데이터 생성 함수
export const generateAIReferences = (count: number): Reference[] => {
  const references: Reference[] = [];
  const organizations = ['한국산업기술진흥원', '중소기업진흥공단', '정보통신산업진흥원', '한국인공지능협회'];
  const aiProjectTypes = ['AI 모델 개발', '머신러닝 시스템', '딥러닝 솔루션', 'AI 플랫폼 구축', '데이터 분석 시스템'];
  const statuses = ['success', 'failure', 'ongoing'] as const;
  const scores = ['A', 'B', 'C', 'D'];

  for (let i = 1; i <= count; i++) {
    const reference: Reference = {
      id: 3000 + i, // AI 레퍼런스는 3000번대 ID 사용
      projectName: faker.helpers.arrayElement([
        'AI 기반 예측 모델 개발',
        '머신러닝 데이터 분석 시스템',
        '딥러닝 이미지 인식 시스템',
        'AI 챗봇 개발',
        '자연어 처리 시스템 구축',
        'AI 기반 추천 시스템',
        '컴퓨터 비전 시스템 개발',
        'AI 플랫폼 구축',
        '데이터 마이닝 시스템',
        'AI 기반 의사결정 시스템'
      ]),
      projectType: 'AI',
      bidNtceNo: `AI2023${String(i).padStart(4, '0')}`,
      organization: faker.helpers.arrayElement(organizations),
      participationYear: faker.number.int({ min: 2020, max: 2024 }),
      contractAmount: faker.number.int({ min: 30000000, max: 300000000 }),
      status: faker.helpers.arrayElement(statuses),
      score: faker.helpers.arrayElement(scores),
      description: faker.lorem.paragraph(3),
      files: [
        {
          name: 'AI사업완료보고서.pdf',
          url: faker.internet.url(),
          size: faker.number.int({ min: 2500000, max: 18000000 })
        },
        {
          name: 'AI모델성능평가서.pdf',
          url: faker.internet.url(),
          size: faker.number.int({ min: 1500000, max: 10000000 })
        }
      ],
      createdBy: faker.number.int({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 365 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString()
    };
    references.push(reference);
  }
  return references;
};

// Mock 알림 데이터 생성 함수
export const generateMockNotifications = (count: number): Notification[] => {
  const notifications: Notification[] = [];
  const types = ['urgent', 'deadline', 'missing', 'duplicate', 'new'] as const;
  const statuses = ['unread', 'read', 'important', 'completed'] as const;
  const priorities = ['low', 'medium', 'high'] as const;

  for (let i = 1; i <= count; i++) {
    const notification: Notification = {
      id: i,
      type: faker.helpers.arrayElement(types),
      bidNtceNo: `2024${String(i).padStart(5, '0')}`,
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(statuses),
      priority: faker.helpers.arrayElement(priorities),
      assignedTo: faker.number.int({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString()
    };
    notifications.push(notification);
  }
  return notifications;
};

// Mock 시스템 로그 데이터 생성 함수
export const generateMockSystemLogs = (count: number): SystemLog[] => {
  const logs: SystemLog[] = [];
  const levels = ['info', 'warn', 'error'] as const;
  const categories = ['user_activity', 'system', 'api', 'database'] as const;

  for (let i = 1; i <= count; i++) {
    const log: SystemLog = {
      id: i,
      level: faker.helpers.arrayElement(levels),
      category: faker.helpers.arrayElement(categories),
      message: faker.lorem.sentence(),
      details: {
        userId: faker.number.int({ min: 1, max: 3 }),
        ipAddress: faker.internet.ip()
      },
      userId: faker.number.int({ min: 1, max: 3 }),
      ipAddress: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      createdAt: faker.date.recent({ days: 30 }).toISOString()
    };
    logs.push(log);
  }
  return logs;
};

// Mock 공고 통계 데이터
export const mockBidStatistics: BidStatistics = {
  totalBids: 1250,
  newBids: 45,
  urgentBids: 12,
  deadlineBids: 8,
  byType: {
    construction: 450,
    service: 600,
    goods: 200
  },
  byStatus: {
    normal: 1000,
    urgent: 150,
    correction: 100
  },
  byInstitution: {
    '조달청': 300,
    '한국산업기술진흥원': 200,
    '중소기업진흥공단': 150,
    '정보통신산업진흥원': 100
  },
  budgetRange: {
    under100M: 400,
    '100M-500M': 500,
    '500M-1B': 250,
    over1B: 100
  }
};

// Mock 시스템 통계 데이터
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

// 초기 Mock 데이터
export const initialMockBids = generateMockBids(150);
export const initialMockBidDetails = generateMockBidDetails(150);
export const initialMockReferences = [
  ...generateMockReferences(50),
  ...generateITReferences(10),
  ...generateCTReferences(10),
  ...generateAIReferences(10)
];
export const initialMockNotifications = generateMockNotifications(25);
export const initialMockSystemLogs = generateMockSystemLogs(100);

// Mock 공고 수집 이력 데이터
export const mockFetchLogs = [
  {
    id: 1,
    bidNtceNo: '202400001',
    requestedAt: '2024-07-22T09:00:00Z',
    resultCode: '00',
    status: 'success' as const,
    responseTime: 1200,
    dataCount: 150
  },
  {
    id: 2,
    bidNtceNo: '202400002',
    requestedAt: '2024-07-22T09:15:00Z',
    resultCode: '03',
    status: 'failed' as const,
    errorMessage: '데이터가 없습니다.',
    responseTime: 800,
    dataCount: 0
  },
  {
    id: 3,
    requestedAt: '2024-07-22T09:30:00Z',
    resultCode: '00',
    status: 'success' as const,
    responseTime: 950,
    dataCount: 200
  },
  {
    id: 4,
    bidNtceNo: '202400003',
    requestedAt: '2024-07-22T10:00:00Z',
    resultCode: '01',
    status: 'failed' as const,
    errorMessage: '인증키 오류',
    responseTime: 500,
    dataCount: 0
  },
  {
    id: 5,
    requestedAt: '2024-07-22T10:15:00Z',
    resultCode: '00',
    status: 'pending' as const,
    responseTime: null,
    dataCount: null
  }
];

// Mock 알림 설정 데이터
export const mockNotificationConfigs = [
  {
    id: 1,
    type: 'new_bid' as const,
    channel: 'web' as const,
    frequency: 'immediate' as const,
    recipients: ['admin@example.com', 'user@example.com'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  },
  {
    id: 2,
    type: 'urgent' as const,
    channel: 'email' as const,
    frequency: 'immediate' as const,
    recipients: ['admin@example.com', 'manager@example.com'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  },
  {
    id: 3,
    type: 'deadline' as const,
    channel: 'push' as const,
    frequency: 'daily' as const,
    recipients: ['user@example.com'],
    isActive: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  }
];

// Mock 리포트 설정 데이터
export const mockReportConfigs = [
  {
    id: 1,
    type: 'daily' as const,
    recipients: ['admin@example.com'],
    isActive: true,
    schedule: '0 9 * * *',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  },
  {
    id: 2,
    type: 'weekly' as const,
    recipients: ['admin@example.com', 'manager@example.com'],
    isActive: true,
    schedule: '0 9 * * 1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  },
  {
    id: 3,
    type: 'monthly' as const,
    recipients: ['admin@example.com'],
    isActive: false,
    schedule: '0 9 1 * *',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  }
];

// Mock 시스템 설정 데이터
export const mockSystemConfigs = [
  {
    id: 1,
    key: 'api_key',
    value: 'encrypted_api_key_here',
    description: '나라장터 OpenAPI 인증키',
    category: 'api' as const,
    isEncrypted: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  },
  {
    id: 2,
    key: 'backup_schedule',
    value: '0 2 * * *',
    description: '자동 백업 스케줄 (매일 새벽 2시)',
    category: 'system' as const,
    isEncrypted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  },
  {
    id: 3,
    key: 'notification_retention_days',
    value: '30',
    description: '알림 보관 기간 (일)',
    category: 'notification' as const,
    isEncrypted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  },
  {
    id: 4,
    key: 'max_login_attempts',
    value: '5',
    description: '최대 로그인 시도 횟수',
    category: 'security' as const,
    isEncrypted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z'
  }
];

// Mock 백업 데이터
export const mockBackups = [
  {
    id: 1,
    filename: 'backup_2024-07-22.zip',
    size: 524288000,
    type: 'auto' as const,
    status: 'completed' as const,
    createdAt: '2024-07-22T02:00:00Z',
    downloadUrl: '/admin/backups/1/download'
  },
  {
    id: 2,
    filename: 'backup_2024-07-21.zip',
    size: 512000000,
    type: 'auto' as const,
    status: 'completed' as const,
    createdAt: '2024-07-21T02:00:00Z',
    downloadUrl: '/admin/backups/2/download'
  },
  {
    id: 3,
    filename: 'backup_2024-07-20.zip',
    size: 498000000,
    type: 'manual' as const,
    status: 'completed' as const,
    createdAt: '2024-07-20T15:30:00Z',
    downloadUrl: '/admin/backups/3/download'
  },
  {
    id: 4,
    filename: 'backup_2024-07-19.zip',
    size: 0,
    type: 'auto' as const,
    status: 'failed' as const,
    createdAt: '2024-07-19T02:00:00Z',
    downloadUrl: null
  }
];
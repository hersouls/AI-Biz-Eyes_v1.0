import { faker } from '@faker-js/faker/locale/ko';
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
export const initialMockReferences = generateMockReferences(50);
export const initialMockNotifications = generateMockNotifications(25);
export const initialMockSystemLogs = generateMockSystemLogs(100);
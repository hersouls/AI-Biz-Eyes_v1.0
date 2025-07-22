import { User, Bid, BidDetail, Reference, Notification, SystemLog, BidStatistics, SystemStatistics } from '../types';
export declare const mockUsers: User[];
export declare const generateMockBids: (count: number) => Bid[];
export declare const generateMockBidDetails: (count: number) => BidDetail[];
export declare const generateMockReferences: (count: number) => Reference[];
export declare const generateMockNotifications: (count: number) => Notification[];
export declare const generateMockSystemLogs: (count: number) => SystemLog[];
export declare const mockBidStatistics: BidStatistics;
export declare const mockSystemStatistics: SystemStatistics;
export declare const initialMockBids: Bid[];
export declare const initialMockBidDetails: BidDetail[];
export declare const initialMockReferences: Reference[];
export declare const initialMockNotifications: Notification[];
export declare const initialMockSystemLogs: SystemLog[];
export declare const mockFetchLogs: ({
    id: number;
    bidNtceNo: string;
    requestedAt: string;
    resultCode: string;
    status: "success";
    responseTime: number;
    dataCount: number;
    errorMessage?: undefined;
} | {
    id: number;
    bidNtceNo: string;
    requestedAt: string;
    resultCode: string;
    status: "failed";
    errorMessage: string;
    responseTime: number;
    dataCount: number;
} | {
    id: number;
    requestedAt: string;
    resultCode: string;
    status: "success";
    responseTime: number;
    dataCount: number;
    bidNtceNo?: undefined;
    errorMessage?: undefined;
} | {
    id: number;
    requestedAt: string;
    resultCode: string;
    status: "pending";
    responseTime: null;
    dataCount: null;
    bidNtceNo?: undefined;
    errorMessage?: undefined;
})[];
export declare const mockNotificationConfigs: ({
    id: number;
    type: "new_bid";
    channel: "web";
    frequency: "immediate";
    recipients: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
} | {
    id: number;
    type: "urgent";
    channel: "email";
    frequency: "immediate";
    recipients: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
} | {
    id: number;
    type: "deadline";
    channel: "push";
    frequency: "daily";
    recipients: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
})[];
export declare const mockReportConfigs: ({
    id: number;
    type: "daily";
    recipients: string[];
    isActive: boolean;
    schedule: string;
    createdAt: string;
    updatedAt: string;
} | {
    id: number;
    type: "weekly";
    recipients: string[];
    isActive: boolean;
    schedule: string;
    createdAt: string;
    updatedAt: string;
} | {
    id: number;
    type: "monthly";
    recipients: string[];
    isActive: boolean;
    schedule: string;
    createdAt: string;
    updatedAt: string;
})[];
export declare const mockSystemConfigs: ({
    id: number;
    key: string;
    value: string;
    description: string;
    category: "api";
    isEncrypted: boolean;
    createdAt: string;
    updatedAt: string;
} | {
    id: number;
    key: string;
    value: string;
    description: string;
    category: "system";
    isEncrypted: boolean;
    createdAt: string;
    updatedAt: string;
} | {
    id: number;
    key: string;
    value: string;
    description: string;
    category: "notification";
    isEncrypted: boolean;
    createdAt: string;
    updatedAt: string;
} | {
    id: number;
    key: string;
    value: string;
    description: string;
    category: "security";
    isEncrypted: boolean;
    createdAt: string;
    updatedAt: string;
})[];
export declare const mockBackups: ({
    id: number;
    filename: string;
    size: number;
    type: "auto";
    status: "completed";
    createdAt: string;
    downloadUrl: string;
} | {
    id: number;
    filename: string;
    size: number;
    type: "manual";
    status: "completed";
    createdAt: string;
    downloadUrl: string;
} | {
    id: number;
    filename: string;
    size: number;
    type: "auto";
    status: "failed";
    createdAt: string;
    downloadUrl: null;
})[];
//# sourceMappingURL=mockData.d.ts.map
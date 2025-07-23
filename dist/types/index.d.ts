export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    timestamp: string;
}
export interface ApiError {
    code: string;
    message: string;
    details?: any;
}
export interface ErrorResponse {
    success: false;
    error: ApiError;
    timestamp: string;
}
export interface User {
    id: number;
    email: string;
    name: string;
    organization?: string;
    role: 'admin' | 'user' | 'guest';
    isActive: boolean;
    avatar?: string;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
}
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface RefreshTokenResponse {
    token: string;
    refreshToken: string;
}
export interface Bid {
    id: number;
    bidNtceNo: string;
    bidNtceNm: string;
    ntceInsttNm?: string;
    dmndInsttNm?: string;
    bsnsDivNm?: string;
    bidNtceSttusNm?: string;
    asignBdgtAmt?: number;
    presmptPrce?: number;
    bidNtceDate?: string;
    bidClseDate?: string;
    bidNtceUrl?: string;
    createdAt: string;
    updatedAt: string;
}
export interface BidDetail extends Bid {
    bidNtceBgn?: string;
    bidClseTm?: string;
    opengDate?: string;
    opengTm?: string;
    opengPlce?: string;
    elctrnBidYn?: string;
    intrntnlBidYn?: string;
    cmmnCntrctYn?: string;
    rgnLmtYn?: string;
    prtcptPsblRgnNm?: string;
    indstrytyLmtYn?: string;
    bidprcPsblIndstrytyNm?: string;
    presnatnOprtnYn?: string;
    presnatnOprtnDate?: string;
    presnatnOprtnTm?: string;
    presnatnOprtnPlce?: string;
    ntceInsttOfclDeptNm?: string;
    ntceInsttOfclNm?: string;
    ntceInsttOfclTel?: string;
    ntceInsttOfclEmailAdrs?: string;
    dmndInsttOfclDeptNm?: string;
    dmndInsttOfclNm?: string;
    dmndInsttOfclTel?: string;
    dmndInsttOfclEmailAdrs?: string;
}
export interface BidQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
    minBudget?: number;
    maxBudget?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface BidPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface BidListResponse {
    bids: Bid[];
    pagination: BidPagination;
}
export interface BidSyncRequest {
    startDate: string;
    endDate: string;
    force?: boolean;
}
export interface BidSyncResponse {
    totalProcessed: number;
    newBids: number;
    updatedBids: number;
    errors: number;
    executionTime: number;
}
export interface BidStatistics {
    totalBids: number;
    newBids: number;
    urgentBids: number;
    deadlineBids: number;
    byType: {
        construction: number;
        service: number;
        goods: number;
    };
    byStatus: {
        normal: number;
        urgent: number;
        correction: number;
    };
    byInstitution: Record<string, number>;
    budgetRange: {
        under100M: number;
        '100M-500M': number;
        '500M-1B': number;
        over1B: number;
    };
}
export interface Reference {
    id: number;
    projectName: string;
    projectType?: string;
    bidNtceNo?: string;
    organization?: string;
    participationYear?: number;
    contractAmount?: number;
    status?: 'success' | 'failure' | 'ongoing';
    score?: string;
    description?: string;
    files?: FileInfo[];
    createdBy: number;
    createdAt: string;
    updatedAt: string;
}
export interface FileInfo {
    name: string;
    url: string;
    size: number;
}
export interface ReferenceQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    year?: number;
    organization?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface ReferenceListResponse {
    references: Reference[];
    pagination: BidPagination;
}
export interface ReferenceCreateRequest {
    projectName: string;
    projectType?: string;
    bidNtceNo?: string;
    organization?: string;
    participationYear?: number;
    contractAmount?: number;
    status?: 'success' | 'failure' | 'ongoing';
    score?: string;
    description?: string;
    files?: FileInfo[];
}
export interface ReferenceUpdateRequest {
    projectName?: string;
    projectType?: string;
    bidNtceNo?: string;
    organization?: string;
    participationYear?: number;
    contractAmount?: number;
    status?: 'success' | 'failure' | 'ongoing';
    score?: string;
    description?: string;
    files?: FileInfo[];
}
export interface ReferenceMatchQuery {
    bidNtceNo: string;
    limit?: number;
}
export interface ReferenceMatch {
    referenceId: number;
    projectName: string;
    similarityScore: number;
    matchReason: string;
    contractAmount?: number;
    status?: string;
}
export interface ReferenceMatchResponse {
    targetBid: {
        bidNtceNo: string;
        bidNtceNm: string;
    };
    matches: ReferenceMatch[];
}
export interface Notification {
    id: number;
    type: 'urgent' | 'deadline' | 'missing' | 'duplicate' | 'new';
    bidNtceNo?: string;
    title: string;
    message?: string;
    status: 'unread' | 'read' | 'important' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    assignedTo?: number;
    createdAt: string;
    updatedAt: string;
}
export interface NotificationQueryParams {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
}
export interface NotificationListResponse {
    notifications: Notification[];
    pagination: BidPagination;
}
export interface NotificationUpdateRequest {
    status: 'read' | 'important' | 'completed';
}
export interface NotificationSettings {
    emailNotifications: {
        enabled: boolean;
        types: string[];
        frequency: 'immediate' | 'daily' | 'weekly';
    };
    webNotifications: {
        enabled: boolean;
        types: string[];
    };
    pushNotifications: {
        enabled: boolean;
    };
}
export interface FileUploadResponse {
    id: number;
    name: string;
    url: string;
    size: number;
    mimeType: string;
    category: string;
    uploadedAt: string;
}
export interface Webhook {
    id: number;
    url: string;
    events: string[];
    isActive: boolean;
    lastTriggered?: string;
    createdAt: string;
}
export interface WebhookCreateRequest {
    url: string;
    events: string[];
    secret?: string;
}
export interface UserCreateRequest {
    email: string;
    password: string;
    name: string;
    organization?: string;
    role?: 'admin' | 'user' | 'guest';
}
export interface UserUpdateRequest {
    name?: string;
    organization?: string;
    role?: 'admin' | 'user' | 'guest';
    isActive?: boolean;
}
export interface SystemLog {
    id: number;
    level: 'info' | 'warn' | 'error';
    category: string;
    message: string;
    details?: any;
    userId?: number;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}
export interface SystemStatistics {
    users: {
        total: number;
        active: number;
        newThisMonth: number;
    };
    bids: {
        total: number;
        newToday: number;
        syncSuccess: number;
    };
    notifications: {
        total: number;
        unread: number;
        urgent: number;
    };
    system: {
        uptime: string;
        lastBackup?: string;
        diskUsage: string;
        memoryUsage: string;
    };
}
export interface FetchLog {
    id: number;
    bidNtceNo?: string;
    requestedAt: string;
    resultCode: string;
    status: 'success' | 'failed' | 'pending';
    errorMessage?: string;
    responseTime?: number;
    dataCount?: number;
}
export interface NotificationConfig {
    id: number;
    type: 'new_bid' | 'urgent' | 'deadline' | 'achievement';
    channel: 'web' | 'email' | 'push';
    frequency: 'immediate' | 'daily' | 'weekly';
    recipients: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}
export interface ReportConfig {
    id: number;
    type: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    isActive: boolean;
    schedule: string;
    createdAt: string;
    updatedAt?: string;
}
export interface SystemConfig {
    id: number;
    key: string;
    value: string;
    description?: string;
    category: 'api' | 'security' | 'notification' | 'system';
    isEncrypted: boolean;
    createdAt: string;
    updatedAt?: string;
}
export interface BackupInfo {
    id: number;
    filename: string;
    size: number;
    type: 'auto' | 'manual';
    status: 'completed' | 'failed' | 'in_progress';
    createdAt: string;
    downloadUrl?: string;
}
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface AdminApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
export interface UsersResponse {
    users: User[];
    pagination: PaginationInfo;
}
export interface LogsResponse {
    logs: SystemLog[];
    pagination: PaginationInfo;
}
export interface FetchLogsResponse {
    logs: FetchLog[];
    pagination: PaginationInfo;
}
//# sourceMappingURL=index.d.ts.map
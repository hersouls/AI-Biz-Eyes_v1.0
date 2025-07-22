export declare const createSuccessResponse: (data: any, message?: string) => {
    success: boolean;
    data: any;
    message: string | undefined;
    timestamp: string;
};
export declare const createErrorResponse: (code: string, message: string, details?: any) => {
    success: boolean;
    error: any;
    timestamp: string;
};
export declare const createPaginatedResponse: (data: any[], total: number, page: number, limit: number, message?: string) => {
    success: boolean;
    data: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    message: string | undefined;
    timestamp: string;
};
//# sourceMappingURL=response.d.ts.map
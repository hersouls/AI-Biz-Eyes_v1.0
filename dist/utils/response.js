"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginatedResponse = exports.createErrorResponse = exports.createSuccessResponse = void 0;
const createSuccessResponse = (data, message) => {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
    };
};
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (code, message, details) => {
    return {
        success: false,
        error: {
            code,
            message,
            ...(details && { details })
        },
        timestamp: new Date().toISOString()
    };
};
exports.createErrorResponse = createErrorResponse;
const createPaginatedResponse = (data, total, page, limit, message) => {
    return {
        success: true,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        },
        message,
        timestamp: new Date().toISOString()
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
//# sourceMappingURL=response.js.map
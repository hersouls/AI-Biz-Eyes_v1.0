"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (0, auth_1.extractTokenFromHeader)(authHeader || '');
    if (!token) {
        const errorResponse = (0, response_1.createErrorResponse)('AUTH_TOKEN_MISSING', '인증 토큰이 필요합니다.');
        res.status(401).json(errorResponse);
        return;
    }
    try {
        const decoded = (0, auth_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('AUTH_TOKEN_INVALID', '유효하지 않은 토큰입니다.');
        res.status(401).json(errorResponse);
        return;
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        next();
    };
};
exports.requireRole = requireRole;
const requireAdmin = (req, res, next) => {
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.js.map
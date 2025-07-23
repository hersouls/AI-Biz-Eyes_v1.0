"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
const authenticateToken = (req, res, next) => {
    next();
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
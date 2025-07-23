"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.comparePassword = exports.hashPassword = exports.verifyToken = exports.generateRefreshToken = exports.generateToken = void 0;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const generateToken = (payload) => {
    return `dummy-token-${payload.id}-${payload.email}-${payload.role || 'user'}`;
};
exports.generateToken = generateToken;
const generateRefreshToken = (payload) => {
    return `dummy-refresh-token-${payload.id}-${payload.email}`;
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    if (token.includes('dummy-token')) {
        const parts = token.split('-');
        return {
            id: parseInt(parts[2]),
            email: parts[3],
            role: parts[4] || 'user'
        };
    }
    return { id: 1, email: 'dummy@example.com', role: 'user' };
};
exports.verifyToken = verifyToken;
const hashPassword = async (password) => {
    return `hashed-${password}`;
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashedPassword) => {
    return hashedPassword === `hashed-${password}`;
};
exports.comparePassword = comparePassword;
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
};
exports.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=auth.js.map
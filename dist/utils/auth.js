"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.comparePassword = exports.hashPassword = exports.verifyToken = exports.generateRefreshToken = exports.generateToken = void 0;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const generateToken = (payload) => {
    return 'dummy-token';
};
exports.generateToken = generateToken;
const generateRefreshToken = (payload) => {
    return 'dummy-refresh-token';
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    return { id: 1, email: 'dummy@example.com', role: 'user' };
};
exports.verifyToken = verifyToken;
const hashPassword = async (password) => {
    return 'dummy-hashed-password';
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashedPassword) => {
    return true;
};
exports.comparePassword = comparePassword;
const extractTokenFromHeader = (authHeader) => {
    return 'dummy-token';
};
exports.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=auth.js.map
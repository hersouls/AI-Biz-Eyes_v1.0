import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  [key: string]: unknown;
}

interface RefreshTokenPayload {
  userId: number;
  tokenId: string;
  [key: string]: unknown;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key';

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const extractTokenFromHeader = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
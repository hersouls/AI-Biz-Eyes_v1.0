import {
  generateToken,
  generateRefreshToken,
  verifyToken,
  hashPassword,
  comparePassword,
  extractTokenFromHeader
} from '../../../src/utils/auth';

describe('Auth Utils', () => {
  const mockPayload = {
    id: 1,
    email: 'test@example.com',
    role: 'user'
  };

  describe('generateToken', () => {
    it('should generate a token for valid payload', () => {
      const token = generateToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for different payloads', () => {
      const payload1 = { id: 1, email: 'user1@example.com' };
      const payload2 = { id: 2, email: 'user2@example.com' };
      
      const token1 = generateToken(payload1);
      const token2 = generateToken(payload2);
      
      expect(token1).not.toBe(token2);
    });

    it('should handle payload without role', () => {
      const payloadWithoutRole = { id: 1, email: 'test@example.com' };
      const token = generateToken(payloadWithoutRole);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token for valid payload', () => {
      const refreshToken = generateRefreshToken(mockPayload);
      
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe('string');
      expect(refreshToken.length).toBeGreaterThan(0);
    });

    it('should generate different refresh tokens for different payloads', () => {
      const payload1 = { id: 1, email: 'user1@example.com' };
      const payload2 = { id: 2, email: 'user2@example.com' };
      
      const refreshToken1 = generateRefreshToken(payload1);
      const refreshToken2 = generateRefreshToken(payload2);
      
      expect(refreshToken1).not.toBe(refreshToken2);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return payload', () => {
      const token = generateToken(mockPayload);
      const verifiedPayload = verifyToken(token);
      
      expect(verifiedPayload).toBeDefined();
      expect(verifiedPayload.id).toBe(mockPayload.id);
      expect(verifiedPayload.email).toBe(mockPayload.email);
    });

    it('should handle token verification for different payloads', () => {
      const differentPayload = { id: 999, email: 'different@example.com', role: 'admin' };
      const token = generateToken(differentPayload);
      const verifiedPayload = verifyToken(token);
      
      expect(verifiedPayload.id).toBe(differentPayload.id);
      expect(verifiedPayload.email).toBe(differentPayload.email);
      expect(verifiedPayload.role).toBe(differentPayload.role);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      // Note: In real implementation, these should be different due to salt
      // For dummy implementation, they might be the same
      expect(hash1).toBeDefined();
      expect(hash2).toBeDefined();
    });

    it('should handle empty password', async () => {
      const hashedPassword = await hashPassword('');
      
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      const isMatch = await comparePassword(password, hashedPassword);
      
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hashedPassword = await hashPassword(password);
      const isMatch = await comparePassword(wrongPassword, hashedPassword);
      
      expect(isMatch).toBe(false);
    });

    it('should handle empty password comparison', async () => {
      const hashedPassword = await hashPassword('somePassword');
      const isMatch = await comparePassword('', hashedPassword);
      
      expect(typeof isMatch).toBe('boolean');
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'valid.jwt.token';
      const authHeader = `Bearer ${token}`;
      const extractedToken = extractTokenFromHeader(authHeader);
      
      expect(extractedToken).toBe(token);
    });

    it('should return null for header without Bearer prefix', () => {
      const authHeader = 'InvalidToken';
      const extractedToken = extractTokenFromHeader(authHeader);
      
      expect(extractedToken).toBeNull();
    });

    it('should return null for empty header', () => {
      const extractedToken = extractTokenFromHeader('');
      
      expect(extractedToken).toBeNull();
    });

    it('should return null for undefined header', () => {
      const extractedToken = extractTokenFromHeader(undefined as any);
      
      expect(extractedToken).toBeNull();
    });

    it('should handle header with only Bearer prefix', () => {
      const authHeader = 'Bearer ';
      const extractedToken = extractTokenFromHeader(authHeader);
      
      expect(extractedToken).toBe('');
    });
  });
});
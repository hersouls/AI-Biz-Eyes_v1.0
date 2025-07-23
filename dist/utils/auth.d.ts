interface JWTPayload {
    id: number;
    email: string;
    role?: string;
}
export declare const generateToken: (payload: JWTPayload) => string;
export declare const generateRefreshToken: (payload: JWTPayload) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const extractTokenFromHeader: (authHeader: string) => string | null;
export {};
//# sourceMappingURL=auth.d.ts.map
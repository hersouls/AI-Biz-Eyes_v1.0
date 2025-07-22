export declare const generateToken: (payload: any) => string;
export declare const generateRefreshToken: (payload: any) => string;
export declare const verifyToken: (token: string) => any;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const extractTokenFromHeader: (authHeader: string) => string | null;
//# sourceMappingURL=auth.d.ts.map
import { Request, Response } from 'express';
export declare const checkG2BApiStatus: (req: Request, res: Response) => Promise<void>;
export declare const getBidList: (req: Request, res: Response) => Promise<void>;
export declare const getBidDetail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const searchBidsByKeyword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBidsByInstitution: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBidsByDateRange: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getContractList: (req: Request, res: Response) => Promise<void>;
export declare const getContractDetail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=g2bController.d.ts.map
import { Request, Response } from 'express';
export declare const getIntegrationSystems: (req: Request, res: Response) => void;
export declare const getIntegrationSystem: (req: Request, res: Response) => Response<any, Record<string, any>>;
export declare const createIntegrationSystem: (req: Request, res: Response) => void;
export declare const updateIntegrationSystem: (req: Request, res: Response) => Response<any, Record<string, any>>;
export declare const deleteIntegrationSystem: (req: Request, res: Response) => Response<any, Record<string, any>>;
export declare const getIntegrationLogs: (req: Request, res: Response) => void;
export declare const getFieldMappings: (req: Request, res: Response) => void;
export declare const createFieldMapping: (req: Request, res: Response) => void;
export declare const getIntegrationStats: (req: Request, res: Response) => void;
export declare const testIntegrationSystem: (req: Request, res: Response) => Response<any, Record<string, any>>;
//# sourceMappingURL=integrationController.d.ts.map
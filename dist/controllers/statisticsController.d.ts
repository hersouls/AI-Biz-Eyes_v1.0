import { Request, Response } from 'express';
export declare class StatisticsController {
    static getDashboardStatistics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getBidStatistics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getReferenceStatistics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getNotificationStatistics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getSystemStatistics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=statisticsController.d.ts.map
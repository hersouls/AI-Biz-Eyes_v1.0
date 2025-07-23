import { Request, Response } from 'express';
export declare class PersonalController {
    static getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static uploadAvatar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteAvatar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getNotificationSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateNotificationSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getReportSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateReportSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getDashboardSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateDashboardSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPersonalSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updatePersonalSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getActivityHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getActivityDetail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static exportData(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getExportHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static downloadExport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getSecuritySettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updatePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateTwoFactor(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=personalController.d.ts.map
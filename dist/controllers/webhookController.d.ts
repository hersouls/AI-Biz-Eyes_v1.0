import { Request, Response } from 'express';
export declare class WebhookController {
    private webhookService;
    private g2bApiKey;
    private g2bApiEndpoint;
    constructor();
    testWebhook(req: Request, res: Response): Promise<void>;
    private createMockBidData;
    private createMockPreNoticeData;
    private createMockContractData;
    sendBidNoticeData(req: Request, res: Response): Promise<void>;
    sendPreNoticeData(req: Request, res: Response): Promise<void>;
    sendContractData(req: Request, res: Response): Promise<void>;
    sendAllData(req: Request, res: Response): Promise<void>;
}
export default WebhookController;
//# sourceMappingURL=webhookController.d.ts.map
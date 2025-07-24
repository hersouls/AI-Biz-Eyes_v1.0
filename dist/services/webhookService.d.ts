export declare class WebhookService {
    private webhookUrl;
    private apiKey;
    constructor();
    sendG2BData(data: any, metadata?: any): Promise<boolean>;
    sendBidNoticeData(bidData: any): Promise<boolean>;
    sendPreNoticeData(preNoticeData: any): Promise<boolean>;
    sendContractData(contractData: any): Promise<boolean>;
    testConnection(): Promise<boolean>;
}
export default WebhookService;
//# sourceMappingURL=webhookService.d.ts.map
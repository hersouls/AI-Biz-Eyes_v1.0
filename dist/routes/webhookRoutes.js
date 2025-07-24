"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhookController_1 = __importDefault(require("../controllers/webhookController"));
const router = (0, express_1.Router)();
const webhookController = new webhookController_1.default();
router.get('/test', webhookController.testWebhook.bind(webhookController));
router.post('/bid-notice', webhookController.sendBidNoticeData.bind(webhookController));
router.post('/pre-notice', webhookController.sendPreNoticeData.bind(webhookController));
router.post('/contract', webhookController.sendContractData.bind(webhookController));
router.post('/all', webhookController.sendAllData.bind(webhookController));
exports.default = router;
//# sourceMappingURL=webhookRoutes.js.map
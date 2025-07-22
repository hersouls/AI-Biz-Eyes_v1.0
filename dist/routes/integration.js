"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const integrationController_1 = require("../controllers/integrationController");
const router = express_1.default.Router();
router.get('/stats', integrationController_1.getIntegrationStats);
router.get('/systems', integrationController_1.getIntegrationSystems);
router.get('/systems/:id', integrationController_1.getIntegrationSystem);
router.post('/systems', integrationController_1.createIntegrationSystem);
router.put('/systems/:id', integrationController_1.updateIntegrationSystem);
router.delete('/systems/:id', integrationController_1.deleteIntegrationSystem);
router.post('/systems/:id/test', integrationController_1.testIntegrationSystem);
router.get('/logs', integrationController_1.getIntegrationLogs);
router.get('/mappings', integrationController_1.getFieldMappings);
router.post('/mappings', integrationController_1.createFieldMapping);
exports.default = router;
//# sourceMappingURL=integration.js.map
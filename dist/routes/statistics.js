"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statisticsController_1 = require("../controllers/statisticsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateToken, statisticsController_1.StatisticsController.getDashboardStatistics);
router.get('/bids', auth_1.authenticateToken, statisticsController_1.StatisticsController.getBidStatistics);
router.get('/references', auth_1.authenticateToken, statisticsController_1.StatisticsController.getReferenceStatistics);
router.get('/notifications', auth_1.authenticateToken, statisticsController_1.StatisticsController.getNotificationStatistics);
router.get('/system', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), statisticsController_1.StatisticsController.getSystemStatistics);
exports.default = router;
//# sourceMappingURL=statistics.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateToken, dashboardController_1.DashboardController.getDashboardData);
router.get('/charts', auth_1.authenticateToken, dashboardController_1.DashboardController.getChartData);
router.get('/summary', auth_1.authenticateToken, dashboardController_1.DashboardController.getSummaryData);
exports.default = router;
//# sourceMappingURL=dashboard.js.map
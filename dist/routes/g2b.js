"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const g2bController_1 = require("../controllers/g2bController");
const router = express_1.default.Router();
router.get('/status', g2bController_1.checkG2BApiStatus);
router.get('/bids', g2bController_1.getBidList);
router.get('/bids/:bidNtceNo', g2bController_1.getBidDetail);
router.get('/bids/search/:keyword', g2bController_1.searchBidsByKeyword);
router.get('/bids/institution/:institutionName', g2bController_1.getBidsByInstitution);
router.get('/bids/date-range/:fromDate/:toDate', g2bController_1.getBidsByDateRange);
router.get('/contracts', g2bController_1.getContractList);
router.get('/contracts/:cntrctNo', g2bController_1.getContractDetail);
exports.default = router;
//# sourceMappingURL=g2b.js.map
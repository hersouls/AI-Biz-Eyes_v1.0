"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const mockData_1 = require("../data/mockData");
const router = (0, express_1.Router)();
router.get('/', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상이어야 합니다.'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('페이지당 항목 수는 1-100 사이여야 합니다.'),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['asc', 'desc']).withMessage('정렬 순서는 asc 또는 desc여야 합니다.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const { page = 1, limit = 20, search, status, type, institution, startDate, endDate, minBudget, maxBudget, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        let filteredBids = [...mockData_1.initialMockBids];
        if (search) {
            filteredBids = filteredBids.filter(bid => bid.bidNtceNm.toLowerCase().includes(search.toLowerCase()) ||
                (bid.ntceInsttNm && bid.ntceInsttNm.toLowerCase().includes(search.toLowerCase())));
        }
        if (status) {
            filteredBids = filteredBids.filter(bid => bid.bidNtceSttusNm === status);
        }
        if (type) {
            filteredBids = filteredBids.filter(bid => bid.bsnsDivNm === type);
        }
        if (institution) {
            filteredBids = filteredBids.filter(bid => bid.ntceInsttNm === institution || bid.dmndInsttNm === institution);
        }
        if (startDate) {
            filteredBids = filteredBids.filter(bid => bid.bidNtceDate && bid.bidNtceDate >= startDate);
        }
        if (endDate) {
            filteredBids = filteredBids.filter(bid => bid.bidNtceDate && bid.bidNtceDate <= endDate);
        }
        if (minBudget) {
            filteredBids = filteredBids.filter(bid => bid.asignBdgtAmt && bid.asignBdgtAmt >= minBudget);
        }
        if (maxBudget) {
            filteredBids = filteredBids.filter(bid => bid.asignBdgtAmt && bid.asignBdgtAmt <= maxBudget);
        }
        filteredBids.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            else {
                return aValue < bValue ? 1 : -1;
            }
        });
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedBids = filteredBids.slice(startIndex, endIndex);
        const response = (0, response_1.createSuccessResponse)({
            bids: paginatedBids,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: filteredBids.length,
                totalPages: Math.ceil(filteredBids.length / Number(limit))
            }
        });
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.get('/statistics', [
    (0, express_validator_1.query)('period').optional().isIn(['today', 'week', 'month', 'year']).withMessage('기간은 today, week, month, year 중 하나여야 합니다.'),
    (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('시작일은 유효한 날짜 형식이어야 합니다.'),
    (0, express_validator_1.query)('endDate').optional().isISO8601().withMessage('종료일은 유효한 날짜 형식이어야 합니다.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const { period, startDate, endDate } = req.query;
        const response = (0, response_1.createSuccessResponse)(mockData_1.mockBidStatistics);
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.post('/sync', [
    (0, express_validator_1.body)('startDate').isISO8601().withMessage('시작일은 유효한 날짜 형식이어야 합니다.'),
    (0, express_validator_1.body)('endDate').isISO8601().withMessage('종료일은 유효한 날짜 형식이어야 합니다.'),
    (0, express_validator_1.body)('force').optional().isBoolean().withMessage('force는 boolean 값이어야 합니다.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const { startDate, endDate, force = false } = req.body;
        const syncResult = {
            totalProcessed: 150,
            newBids: 25,
            updatedBids: 10,
            errors: 0,
            executionTime: 45.2
        };
        const response = (0, response_1.createSuccessResponse)(syncResult, '공고 동기화가 완료되었습니다.');
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('유효한 공고 ID를 입력해주세요.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const bidId = Number(req.params.id);
        const bidDetail = mockData_1.initialMockBidDetails.find(bid => bid.id === bidId);
        if (!bidDetail) {
            const errorResponse = (0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '공고를 찾을 수 없습니다.');
            return res.status(404).json(errorResponse);
        }
        const response = (0, response_1.createSuccessResponse)(bidDetail);
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
exports.default = router;
//# sourceMappingURL=bids.js.map
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
        const { page = 1, limit = 20, search, type, status, year, organization, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        let filteredReferences = [...mockData_1.initialMockReferences];
        if (search) {
            filteredReferences = filteredReferences.filter(ref => ref.projectName.toLowerCase().includes(search.toLowerCase()));
        }
        if (type) {
            filteredReferences = filteredReferences.filter(ref => ref.projectType === type);
        }
        if (status) {
            filteredReferences = filteredReferences.filter(ref => ref.status === status);
        }
        if (year) {
            filteredReferences = filteredReferences.filter(ref => ref.participationYear === year);
        }
        if (organization) {
            filteredReferences = filteredReferences.filter(ref => ref.organization === organization);
        }
        filteredReferences.sort((a, b) => {
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
        const paginatedReferences = filteredReferences.slice(startIndex, endIndex);
        const response = (0, response_1.createSuccessResponse)({
            references: paginatedReferences,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: filteredReferences.length,
                totalPages: Math.ceil(filteredReferences.length / Number(limit))
            }
        });
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.post('/', [
    (0, express_validator_1.body)('projectName').notEmpty().withMessage('사업명은 필수입니다.'),
    (0, express_validator_1.body)('projectType').optional().isString().withMessage('사업유형은 문자열이어야 합니다.'),
    (0, express_validator_1.body)('contractAmount').optional().isNumeric().withMessage('계약금액은 숫자여야 합니다.'),
    (0, express_validator_1.body)('status').optional().isIn(['success', 'failure', 'ongoing']).withMessage('상태는 success, failure, ongoing 중 하나여야 합니다.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const referenceData = req.body;
        const newReference = {
            id: mockData_1.initialMockReferences.length + 1,
            ...referenceData,
            createdBy: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const response = (0, response_1.createSuccessResponse)({
            id: newReference.id,
            projectName: newReference.projectName,
            createdAt: newReference.createdAt
        }, '레퍼런스가 등록되었습니다.');
        return res.status(201).json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('유효한 레퍼런스 ID를 입력해주세요.'),
    (0, express_validator_1.body)('status').optional().isIn(['success', 'failure', 'ongoing']).withMessage('상태는 success, failure, ongoing 중 하나여야 합니다.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const referenceId = Number(req.params.id);
        const updateData = req.body;
        const referenceIndex = mockData_1.initialMockReferences.findIndex(ref => ref.id === referenceId);
        if (referenceIndex === -1) {
            const errorResponse = (0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '레퍼런스를 찾을 수 없습니다.');
            return res.status(404).json(errorResponse);
        }
        const updatedReference = {
            ...mockData_1.initialMockReferences[referenceIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        const response = (0, response_1.createSuccessResponse)({
            id: updatedReference.id,
            updatedAt: updatedReference.updatedAt
        }, '레퍼런스가 수정되었습니다.');
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.delete('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('유효한 레퍼런스 ID를 입력해주세요.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const referenceId = Number(req.params.id);
        const referenceIndex = mockData_1.initialMockReferences.findIndex(ref => ref.id === referenceId);
        if (referenceIndex === -1) {
            const errorResponse = (0, response_1.createErrorResponse)('RESOURCE_NOT_FOUND', '레퍼런스를 찾을 수 없습니다.');
            return res.status(404).json(errorResponse);
        }
        const response = (0, response_1.createSuccessResponse)(null, '레퍼런스가 삭제되었습니다.');
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
router.get('/match', [
    (0, express_validator_1.query)('bidNtceNo').notEmpty().withMessage('공고번호는 필수입니다.'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 20 }).withMessage('매칭 결과 수는 1-20 사이여야 합니다.')
], (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorResponse = (0, response_1.createErrorResponse)('VALIDATION_ERROR', '입력값이 올바르지 않습니다.', { errors: errors.array() });
            return res.status(422).json(errorResponse);
        }
        const bidNtceNo = req.query.bidNtceNo;
        const limit = req.query.limit ? Number(req.query.limit) : 5;
        const matches = [
            {
                referenceId: 1,
                projectName: '스마트공장 구축 사업',
                similarityScore: 0.95,
                matchReason: '사업명 유사도 높음',
                contractAmount: 500000000,
                status: 'success'
            },
            {
                referenceId: 2,
                projectName: '제조업 디지털화 사업',
                similarityScore: 0.78,
                matchReason: '업종 및 예산 범위 유사',
                contractAmount: 450000000,
                status: 'success'
            },
            {
                referenceId: 3,
                projectName: '공장 자동화 시스템 구축',
                similarityScore: 0.65,
                matchReason: '기술 분야 유사',
                contractAmount: 350000000,
                status: 'ongoing'
            }
        ].slice(0, Number(limit));
        const response = (0, response_1.createSuccessResponse)({
            targetBid: {
                bidNtceNo,
                bidNtceNm: '스마트공장 구축 사업'
            },
            matches
        });
        return res.json(response);
    }
    catch (error) {
        const errorResponse = (0, response_1.createErrorResponse)('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.');
        return res.status(500).json(errorResponse);
    }
});
exports.default = router;
//# sourceMappingURL=references.js.map
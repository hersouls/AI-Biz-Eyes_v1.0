import { Router, Request, Response } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '../utils/response';
import { 
  initialMockBids, 
  initialMockBidDetails, 
  mockBidStatistics,
  generateMockBids 
} from '../data/mockData';
import { BidQueryParams, BidSyncRequest } from '../types';

const router = Router();

// 공고 목록 조회
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상이어야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('페이지당 항목 수는 1-100 사이여야 합니다.'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('정렬 순서는 asc 또는 desc여야 합니다.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const {
      page = 1,
      limit = 20,
      search,
      status,
      type,
      institution,
      startDate,
      endDate,
      minBudget,
      maxBudget,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    }: BidQueryParams = req.query;

    let filteredBids = [...initialMockBids];

    // 검색 필터링
    if (search) {
      filteredBids = filteredBids.filter(bid => 
        bid.bidNtceNm.toLowerCase().includes(search.toLowerCase()) ||
        (bid.ntceInsttNm && bid.ntceInsttNm.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // 상태 필터링
    if (status) {
      filteredBids = filteredBids.filter(bid => bid.bidNtceSttusNm === status);
    }

    // 타입 필터링
    if (type) {
      filteredBids = filteredBids.filter(bid => bid.bsnsDivNm === type);
    }

    // 기관 필터링
    if (institution) {
      filteredBids = filteredBids.filter(bid => 
        bid.ntceInsttNm === institution || bid.dmndInsttNm === institution
      );
    }

    // 날짜 필터링
    if (startDate) {
      filteredBids = filteredBids.filter(bid => bid.bidNtceDate && bid.bidNtceDate >= startDate);
    }
    if (endDate) {
      filteredBids = filteredBids.filter(bid => bid.bidNtceDate && bid.bidNtceDate <= endDate);
    }

    // 예산 필터링
    if (minBudget) {
      filteredBids = filteredBids.filter(bid => bid.asignBdgtAmt && bid.asignBdgtAmt >= minBudget);
    }
    if (maxBudget) {
      filteredBids = filteredBids.filter(bid => bid.asignBdgtAmt && bid.asignBdgtAmt <= maxBudget);
    }

    // 정렬
    filteredBids.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // 페이지네이션
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedBids = filteredBids.slice(startIndex, endIndex);

    const response = createSuccessResponse({
      bids: paginatedBids,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredBids.length,
        totalPages: Math.ceil(filteredBids.length / Number(limit))
      }
    });

    return res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

// 공고 상세 조회
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('유효한 공고 ID를 입력해주세요.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const bidId = Number(req.params.id);
    const bidDetail = initialMockBidDetails.find(bid => bid.id === bidId);

    if (!bidDetail) {
      const errorResponse = createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '공고를 찾을 수 없습니다.'
      );
      return res.status(404).json(errorResponse);
    }

    const response = createSuccessResponse(bidDetail);
    return res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

// 공고 동기화
router.post('/sync', [
  body('startDate').isISO8601().withMessage('시작일은 유효한 날짜 형식이어야 합니다.'),
  body('endDate').isISO8601().withMessage('종료일은 유효한 날짜 형식이어야 합니다.'),
  body('force').optional().isBoolean().withMessage('force는 boolean 값이어야 합니다.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const { startDate, endDate, force = false }: BidSyncRequest = req.body;

    // Mock 동기화 결과
    const syncResult = {
      totalProcessed: 150,
      newBids: 25,
      updatedBids: 10,
      errors: 0,
      executionTime: 45.2
    };

    const response = createSuccessResponse(syncResult, '공고 동기화가 완료되었습니다.');
    return res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

// 공고 통계
router.get('/statistics', [
  query('period').optional().isIn(['today', 'week', 'month', 'year']).withMessage('기간은 today, week, month, year 중 하나여야 합니다.'),
  query('startDate').optional().isISO8601().withMessage('시작일은 유효한 날짜 형식이어야 합니다.'),
  query('endDate').optional().isISO8601().withMessage('종료일은 유효한 날짜 형식이어야 합니다.')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorResponse = createErrorResponse(
        'VALIDATION_ERROR',
        '입력값이 올바르지 않습니다.',
        { errors: errors.array() }
      );
      return res.status(422).json(errorResponse);
    }

    const { period, startDate, endDate } = req.query;

    // Mock 통계 데이터 반환
    const response = createSuccessResponse(mockBidStatistics);
    return res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

export default router;
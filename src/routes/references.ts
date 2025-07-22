import { Router, Request, Response } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { 
  initialMockReferences, 
  generateMockReferences 
} from '../data/mockData';
import { 
  ReferenceQueryParams, 
  ReferenceCreateRequest, 
  ReferenceUpdateRequest,
  ReferenceMatchQuery 
} from '../types';

const router = Router();

// 레퍼런스 목록 조회
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
      type,
      status,
      year,
      organization,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    }: ReferenceQueryParams = req.query;

    let filteredReferences = [...initialMockReferences];

    // 검색 필터링
    if (search) {
      filteredReferences = filteredReferences.filter(ref => 
        ref.projectName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 타입 필터링
    if (type) {
      filteredReferences = filteredReferences.filter(ref => ref.projectType === type);
    }

    // 상태 필터링
    if (status) {
      filteredReferences = filteredReferences.filter(ref => ref.status === status);
    }

    // 연도 필터링
    if (year) {
      filteredReferences = filteredReferences.filter(ref => ref.participationYear === year);
    }

    // 기관 필터링
    if (organization) {
      filteredReferences = filteredReferences.filter(ref => ref.organization === organization);
    }

    // 정렬
    filteredReferences.sort((a, b) => {
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
    const paginatedReferences = filteredReferences.slice(startIndex, endIndex);

    const response = createSuccessResponse({
      references: paginatedReferences,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredReferences.length,
        totalPages: Math.ceil(filteredReferences.length / Number(limit))
      }
    });

    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

// 레퍼런스 등록
router.post('/', [
  body('projectName').notEmpty().withMessage('사업명은 필수입니다.'),
  body('projectType').optional().isString().withMessage('사업유형은 문자열이어야 합니다.'),
  body('contractAmount').optional().isNumeric().withMessage('계약금액은 숫자여야 합니다.'),
  body('status').optional().isIn(['success', 'failure', 'ongoing']).withMessage('상태는 success, failure, ongoing 중 하나여야 합니다.')
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

    const referenceData: ReferenceCreateRequest = req.body;
    
    // Mock 레퍼런스 생성
    const newReference = {
      id: initialMockReferences.length + 1,
      ...referenceData,
      createdBy: 1, // Mock 사용자 ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response = createSuccessResponse({
      id: newReference.id,
      projectName: newReference.projectName,
      createdAt: newReference.createdAt
    }, '레퍼런스가 등록되었습니다.');

    res.status(201).json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

// 레퍼런스 수정
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('유효한 레퍼런스 ID를 입력해주세요.'),
  body('status').optional().isIn(['success', 'failure', 'ongoing']).withMessage('상태는 success, failure, ongoing 중 하나여야 합니다.')
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

    const referenceId = Number(req.params.id);
    const updateData: ReferenceUpdateRequest = req.body;

    const referenceIndex = initialMockReferences.findIndex(ref => ref.id === referenceId);
    if (referenceIndex === -1) {
      const errorResponse = createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '레퍼런스를 찾을 수 없습니다.'
      );
      return res.status(404).json(errorResponse);
    }

    // Mock 레퍼런스 업데이트
    const updatedReference = {
      ...initialMockReferences[referenceIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    const response = createSuccessResponse({
      id: updatedReference.id,
      updatedAt: updatedReference.updatedAt
    }, '레퍼런스가 수정되었습니다.');

    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

// 레퍼런스 삭제
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('유효한 레퍼런스 ID를 입력해주세요.')
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

    const referenceId = Number(req.params.id);
    const referenceIndex = initialMockReferences.findIndex(ref => ref.id === referenceId);
    
    if (referenceIndex === -1) {
      const errorResponse = createErrorResponse(
        'RESOURCE_NOT_FOUND',
        '레퍼런스를 찾을 수 없습니다.'
      );
      return res.status(404).json(errorResponse);
    }

    const response = createSuccessResponse(null, '레퍼런스가 삭제되었습니다.');
    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

// 유사 공고 매칭
router.get('/match', [
  query('bidNtceNo').notEmpty().withMessage('공고번호는 필수입니다.'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('매칭 결과 수는 1-20 사이여야 합니다.')
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

    const { bidNtceNo, limit = 5 }: ReferenceMatchQuery = req.query;

    // Mock 매칭 결과
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

    const response = createSuccessResponse({
      targetBid: {
        bidNtceNo,
        bidNtceNm: '스마트공장 구축 사업'
      },
      matches
    });

    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.'
    );
    res.status(500).json(errorResponse);
  }
});

export default router;
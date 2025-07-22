import { Router, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { FileUploadResponse } from '../types';

const router = Router();

// 파일 업로드 (Mock)
router.post('/upload', (req: Request, res: Response) => {
  try {
    // Mock 파일 업로드 응답
    const fileResponse: FileUploadResponse = {
      id: Math.floor(Math.random() * 1000) + 1,
      name: 'document.pdf',
      url: 'https://s3.amazonaws.com/ai-biz-eyes-files/mock-document.pdf',
      size: 2048576,
      mimeType: 'application/pdf',
      category: 'reference',
      uploadedAt: new Date().toISOString()
    };

    const response = createSuccessResponse(fileResponse, '파일이 업로드되었습니다.');
    return res.status(201).json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'FILE_UPLOAD_ERROR',
      '파일 업로드 중 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

// 파일 다운로드 (Mock)
router.get('/:id/download', [
  param('id').isInt({ min: 1 }).withMessage('유효한 파일 ID를 입력해주세요.')
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

    const fileId = Number(req.params.id);

    // Mock 파일 다운로드 응답
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
    res.setHeader('Content-Length', '2048576');
    
    // Mock 파일 데이터 (빈 버퍼)
    return res.send(Buffer.alloc(1024));
  } catch (error) {
    const errorResponse = createErrorResponse(
      'FILE_DOWNLOAD_ERROR',
      '파일 다운로드 중 오류가 발생했습니다.'
    );
    return res.status(500).json(errorResponse);
  }
});

export default router;
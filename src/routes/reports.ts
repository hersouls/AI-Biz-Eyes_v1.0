import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

const router = express.Router();

// Mock 리포트 데이터
const mockReports = [
  {
    id: 1,
    type: 'daily',
    title: '일간 리포트 (2024-07-22)',
    summary: {
      newBids: 45,
      deadlineBids: 12,
      missingBids: 3,
      duplicateBids: 2,
      successRate: 85
    },
    generatedAt: '2024-07-22T10:00:00Z',
    generatedBy: 1
  },
  {
    id: 2,
    type: 'weekly',
    title: '주간 리포트 (2024-07-15 ~ 2024-07-21)',
    summary: {
      newBids: 280,
      deadlineBids: 65,
      missingBids: 15,
      duplicateBids: 8,
      successRate: 82
    },
    generatedAt: '2024-07-21T18:00:00Z',
    generatedBy: 1
  },
  {
    id: 3,
    type: 'monthly',
    title: '월간 리포트 (2024-07-01 ~ 2024-07-31)',
    summary: {
      newBids: 1250,
      deadlineBids: 320,
      missingBids: 45,
      duplicateBids: 25,
      successRate: 88
    },
    generatedAt: '2024-07-31T23:59:00Z',
    generatedBy: 1
  }
];

// 리포트 목록 조회
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type
    } = req.query;

    let filteredReports = [...mockReports];

    // 타입 필터링
    if (type) {
      filteredReports = filteredReports.filter(r => r.type === type);
    }

    // 정렬 (최신순)
    filteredReports.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

    // 페이지네이션
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    const response = createSuccessResponse({
      reports: paginatedReports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredReports.length,
        totalPages: Math.ceil(filteredReports.length / Number(limit))
      }
    });

    return res.json(response);
  } catch (error) {
    console.error('리포트 목록 조회 실패:', error);
    return res.status(500).json({
      success: false,
      message: '리포트 목록을 불러오는데 실패했습니다.'
    });
  }
});

// 리포트 생성
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.body;
    const userId = (req as any).user?.id || 1;

    // Mock 리포트 데이터 생성
    const reportData = generateReportData(type, startDate, endDate);

    const newReport = {
      id: mockReports.length + 1,
      type,
      title: reportData.title,
      summary: reportData.summary,
      generatedAt: new Date().toISOString(),
      generatedBy: userId
    };

    mockReports.push(newReport);

    const response = createSuccessResponse(newReport, '리포트가 생성되었습니다.');
    return res.status(201).json(response);
  } catch (error) {
    console.error('리포트 생성 실패:', error);
    return res.status(500).json({
      success: false,
      message: '리포트 생성에 실패했습니다.'
    });
  }
});

// 리포트 다운로드
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'pdf' } = req.query;

    const report = mockReports.find(r => r.id === Number(id));

    if (!report) {
      return res.status(404).json({
        success: false,
        message: '리포트를 찾을 수 없습니다.'
      });
    }

    // Mock 파일 생성
    let content = '';
    let filename = `report-${id}.${format}`;
    let contentType = '';

    switch (format) {
      case 'pdf':
        contentType = 'application/pdf';
        content = generatePDFContent(report);
        break;
      case 'excel':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        content = generateExcelContent(report);
        break;
      case 'csv':
        contentType = 'text/csv';
        content = generateCSVContent(report);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: '지원하지 않는 형식입니다.'
        });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(content);
  } catch (error) {
    console.error('리포트 다운로드 실패:', error);
    return res.status(500).json({
      success: false,
      message: '리포트 다운로드에 실패했습니다.'
    });
  }
});

// 리포트 데이터 생성 함수
function generateReportData(type: string, startDate: string, endDate: string) {
  const mockData = {
    title: `${getReportTypeLabel(type)} 리포트 (${startDate} ~ ${endDate})`,
    summary: {
      newBids: Math.floor(Math.random() * 100) + 10,
      deadlineBids: Math.floor(Math.random() * 50) + 5,
      missingBids: Math.floor(Math.random() * 20) + 1,
      duplicateBids: Math.floor(Math.random() * 10),
      successRate: Math.floor(Math.random() * 30) + 70
    }
  };

  return mockData;
}

// 리포트 유형 라벨
function getReportTypeLabel(type: string) {
  switch (type) {
    case 'daily':
      return '일간';
    case 'weekly':
      return '주간';
    case 'monthly':
      return '월간';
    default:
      return type;
  }
}

// PDF 콘텐츠 생성 (Mock)
function generatePDFContent(report: any) {
  return `PDF Report Content for ${report.title}`;
}

// Excel 콘텐츠 생성 (Mock)
function generateExcelContent(report: any) {
  return `Excel Report Content for ${report.title}`;
}

// CSV 콘텐츠 생성
function generateCSVContent(report: any) {
  const summary = report.summary;
  return `항목,수치
신규 공고,${summary.newBids}
마감 공고,${summary.deadlineBids}
누락 공고,${summary.missingBids}
중복 공고,${summary.duplicateBids}
성공률,${summary.successRate}%`;
}

export default router;
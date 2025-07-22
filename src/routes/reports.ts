import express from 'express';
import { Pool } from 'pg';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// PostgreSQL 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ai_biz_eyes_db',
});

// 리포트 목록 조회
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    let whereConditions = ['1=1'];
    let params: any[] = [];
    let paramIndex = 1;

    if (type) {
      whereConditions.push(`type = $${paramIndex++}`);
      params.push(type);
    }

    // 전체 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM reports 
      WHERE ${whereConditions.join(' AND ')}
    `;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // 리포트 목록 조회
    const query = `
      SELECT * FROM reports 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY generated_at DESC 
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        reports: result.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('리포트 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '리포트 목록을 불러오는데 실패했습니다.'
    });
  }
});

// 리포트 생성
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.body;
    const userId = (req as any).user.id;

    // 리포트 데이터 생성 로직
    const reportData = await generateReportData(type, startDate, endDate);

    // 리포트 저장
    const insertQuery = `
      INSERT INTO reports (
        type, title, summary, charts, period_start, period_end, 
        generated_by, generated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      type,
      reportData.title,
      JSON.stringify(reportData.summary),
      JSON.stringify(reportData.charts),
      startDate,
      endDate,
      userId
    ]);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('리포트 생성 실패:', error);
    res.status(500).json({
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

    // 리포트 데이터 조회
    const query = `
      SELECT * FROM reports WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '리포트를 찾을 수 없습니다.'
      });
    }

    const report = result.rows[0];

    // 파일 생성 로직 (실제 구현에서는 PDF/Excel/CSV 생성 라이브러리 사용)
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
    res.send(content);
  } catch (error) {
    console.error('리포트 다운로드 실패:', error);
    res.status(500).json({
      success: false,
      message: '리포트 다운로드에 실패했습니다.'
    });
  }
});

// 리포트 데이터 생성 함수
async function generateReportData(type: string, startDate: string, endDate: string) {
  // 실제 구현에서는 데이터베이스에서 통계 데이터를 조회
  const mockData = {
    title: `${getReportTypeLabel(type)} 리포트 (${startDate} ~ ${endDate})`,
    summary: {
      newBids: Math.floor(Math.random() * 100) + 10,
      deadlineBids: Math.floor(Math.random() * 50) + 5,
      missingBids: Math.floor(Math.random() * 20) + 1,
      duplicateBids: Math.floor(Math.random() * 10),
      successRate: Math.floor(Math.random() * 30) + 70
    },
    charts: {
      bidTypeDistribution: [
        { type: '공사', count: Math.floor(Math.random() * 50) + 10 },
        { type: '용역', count: Math.floor(Math.random() * 30) + 5 },
        { type: '물품', count: Math.floor(Math.random() * 20) + 3 }
      ],
      statusDistribution: [
        { status: '진행중', count: Math.floor(Math.random() * 40) + 10 },
        { status: '완료', count: Math.floor(Math.random() * 30) + 5 },
        { status: '취소', count: Math.floor(Math.random() * 10) }
      ],
      weeklyTrend: generateWeeklyTrend(startDate, endDate)
    }
  };

  return mockData;
}

// 주간 트렌드 데이터 생성
function generateWeeklyTrend(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const weeks = [];
  
  let current = new Date(start);
  while (current <= end) {
    weeks.push({
      date: current.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 20) + 5
    });
    current.setDate(current.getDate() + 7);
  }
  
  return weeks;
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

// PDF 콘텐츠 생성 (실제 구현에서는 PDF 라이브러리 사용)
function generatePDFContent(report: any) {
  return `PDF Report Content for ${report.title}`;
}

// Excel 콘텐츠 생성 (실제 구현에서는 Excel 라이브러리 사용)
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
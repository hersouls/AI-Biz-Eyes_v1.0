import express from 'express';
import {
  checkG2BApiStatus,
  getBidList,
  getBidDetail,
  searchBidsByKeyword,
  getBidsByInstitution,
  getBidsByDateRange,
  getContractList,
  getContractDetail
} from '../controllers/g2bController';

const router = express.Router();

// 조달청 API 상태 확인
router.get('/status', checkG2BApiStatus);

// 입찰공고 관련 라우트
router.get('/bids', getBidList);
router.get('/bids/:bidNtceNo', getBidDetail);
router.get('/bids/search/:keyword', searchBidsByKeyword);
router.get('/bids/institution/:institutionName', getBidsByInstitution);
router.get('/bids/date-range/:fromDate/:toDate', getBidsByDateRange);

// 계약 정보 관련 라우트
router.get('/contracts', getContractList);
router.get('/contracts/:cntrctNo', getContractDetail);

export default router;
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { ValidationError, NotFoundError, ExternalAPIError } from '../errors';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import g2bApiService, { BidSearchParams, ContractSearchParams } from '../services/g2bApiService';

// 조달청 API 상태 확인
export const checkG2BApiStatus = asyncHandler(async (req: Request, res: Response) => {
  const isAvailable = await g2bApiService.checkApiStatus();
  const config = g2bApiService.getConfig();
  const isUsingMockData = g2bApiService.isUsingMockData();

  return res.json(createSuccessResponse({
    isAvailable,
    isUsingMockData,
    config,
    timestamp: new Date().toISOString()
  }));
});

// 입찰공고 목록 조회
export const getBidList = asyncHandler(async (req: Request, res: Response) => {
  const {
    pageNo = 1,
    numOfRows = 10,
    bidNtceNm,
    dminsttNm,
    bidMethdNm,
    fromDt,
    toDt
  } = req.query;

  // 유효성 검증
  const pageNoNum = Number(pageNo);
  const numOfRowsNum = Number(numOfRows);
  
  if (isNaN(pageNoNum) || pageNoNum < 1) {
    throw new ValidationError('페이지 번호는 1 이상의 숫자여야 합니다.');
  }
  
  if (isNaN(numOfRowsNum) || numOfRowsNum < 1 || numOfRowsNum > 100) {
    throw new ValidationError('페이지당 행 수는 1~100 사이의 숫자여야 합니다.');
  }

  const params: BidSearchParams = {
    pageNo: pageNoNum,
    numOfRows: numOfRowsNum,
    bidNtceNm: bidNtceNm as string,
    dminsttNm: dminsttNm as string,
    bidMethdNm: bidMethdNm as string,
    fromDt: fromDt as string,
    toDt: toDt as string
  };

  const result = await g2bApiService.getBidList(params);
  const isUsingMockData = g2bApiService.isUsingMockData();

  return res.json(createSuccessResponse({
    bids: result.response.body.items,
    pagination: {
      pageNo: result.response.body.pageNo,
      numOfRows: result.response.body.numOfRows,
      totalCount: result.response.body.totalCount
    },
    isUsingMockData,
    timestamp: new Date().toISOString()
  }));
});

// 입찰공고 상세 조회
export const getBidDetail = asyncHandler(async (req: Request, res: Response) => {
  const { bidNtceNo } = req.params;

  if (!bidNtceNo) {
    throw new ValidationError('입찰공고번호가 필요합니다.');
  }

  const result = await g2bApiService.getBidDetail(bidNtceNo);
  const isUsingMockData = g2bApiService.isUsingMockData();

  if (!result.response.body.item) {
    throw new NotFoundError('입찰공고');
  }

  return res.json(createSuccessResponse({
    bid: result.response.body.item,
    isUsingMockData,
    timestamp: new Date().toISOString()
  }));
});

// 키워드로 입찰공고 검색
export const searchBidsByKeyword = asyncHandler(async (req: Request, res: Response) => {
  const { keyword, pageNo = 1, numOfRows = 10 } = req.query;

  if (!keyword || typeof keyword !== 'string') {
    throw new ValidationError('검색 키워드가 필요합니다.');
  }

  if (keyword.length < 2) {
    throw new ValidationError('검색 키워드는 2자 이상이어야 합니다.');
  }

  const pageNoNum = Number(pageNo);
  const numOfRowsNum = Number(numOfRows);
  
  if (isNaN(pageNoNum) || pageNoNum < 1) {
    throw new ValidationError('페이지 번호는 1 이상의 숫자여야 합니다.');
  }

  const params: BidSearchParams = {
    pageNo: pageNoNum,
    numOfRows: numOfRowsNum,
    bidNtceNm: keyword
  };

  const result = await g2bApiService.getBidList(params);
  const isUsingMockData = g2bApiService.isUsingMockData();

  return res.json(createSuccessResponse({
    bids: result.response.body.items,
    pagination: {
      pageNo: result.response.body.pageNo,
      numOfRows: result.response.body.numOfRows,
      totalCount: result.response.body.totalCount
    },
    searchKeyword: keyword,
    isUsingMockData,
    timestamp: new Date().toISOString()
  }));
});

// 기관별 입찰공고 조회
export const getBidsByInstitution = asyncHandler(async (req: Request, res: Response) => {
  const { institution, pageNo = 1, numOfRows = 10 } = req.query;

  if (!institution || typeof institution !== 'string') {
    throw new ValidationError('기관명이 필요합니다.');
  }

  const pageNoNum = Number(pageNo);
  const numOfRowsNum = Number(numOfRows);
  
  if (isNaN(pageNoNum) || pageNoNum < 1) {
    throw new ValidationError('페이지 번호는 1 이상의 숫자여야 합니다.');
  }

  const params: BidSearchParams = {
    pageNo: pageNoNum,
    numOfRows: numOfRowsNum,
    dminsttNm: institution
  };

  const result = await g2bApiService.getBidList(params);
  const isUsingMockData = g2bApiService.isUsingMockData();

  return res.json(createSuccessResponse({
    bids: result.response.body.items,
    pagination: {
      pageNo: result.response.body.pageNo,
      numOfRows: result.response.body.numOfRows,
      totalCount: result.response.body.totalCount
    },
    institution,
    isUsingMockData,
    timestamp: new Date().toISOString()
  }));
});

// 계약 정보 목록 조회
export const getContractList = asyncHandler(async (req: Request, res: Response) => {
  const {
    pageNo = 1,
    numOfRows = 10,
    cntrctNm,
    dminsttNm,
    fromDt,
    toDt
  } = req.query;

  const pageNoNum = Number(pageNo);
  const numOfRowsNum = Number(numOfRows);
  
  if (isNaN(pageNoNum) || pageNoNum < 1) {
    throw new ValidationError('페이지 번호는 1 이상의 숫자여야 합니다.');
  }
  
  if (isNaN(numOfRowsNum) || numOfRowsNum < 1 || numOfRowsNum > 100) {
    throw new ValidationError('페이지당 행 수는 1~100 사이의 숫자여야 합니다.');
  }

  const params: ContractSearchParams = {
    pageNo: pageNoNum,
    numOfRows: numOfRowsNum,
    cntrctNm: cntrctNm as string,
    dminsttNm: dminsttNm as string,
    fromDt: fromDt as string,
    toDt: toDt as string
  };

  const result = await g2bApiService.getContractList(params);
  const isUsingMockData = g2bApiService.isUsingMockData();

  return res.json(createSuccessResponse({
    contracts: result.response.body.items,
    pagination: {
      pageNo: result.response.body.pageNo,
      numOfRows: result.response.body.numOfRows,
      totalCount: result.response.body.totalCount
    },
    isUsingMockData,
    timestamp: new Date().toISOString()
  }));
});

// 계약 정보 상세 조회
export const getContractDetail = asyncHandler(async (req: Request, res: Response) => {
  const { cntrctNo } = req.params;

  if (!cntrctNo) {
    throw new ValidationError('계약번호가 필요합니다.');
  }

  const result = await g2bApiService.getContractDetail(cntrctNo);
  const isUsingMockData = g2bApiService.isUsingMockData();

  if (!result.response.body.item) {
    throw new NotFoundError('계약정보');
  }

  return res.json(createSuccessResponse({
    contract: result.response.body.item,
    isUsingMockData,
    timestamp: new Date().toISOString()
  }));
});
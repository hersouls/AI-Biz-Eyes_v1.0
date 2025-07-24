import { Request, Response } from 'express';
import g2bApiService, { BidSearchParams, ContractSearchParams } from '../services/g2bApiService';

// 조달청 API 상태 확인
export const checkG2BApiStatus = async (req: Request, res: Response) => {
  try {
    const isAvailable = await g2bApiService.checkApiStatus();
    const config = g2bApiService.getConfig();
    const isUsingMockData = g2bApiService.isUsingMockData();

    res.json({
      success: true,
      data: {
        isAvailable,
        isUsingMockData,
        config,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'G2B_API_STATUS_CHECK_FAILED',
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// 입찰공고 목록 조회
export const getBidList = async (req: Request, res: Response) => {
  try {
    const {
      pageNo = 1,
      numOfRows = 10,
      bidNtceNm,
      dminsttNm,
      bidMethdNm,
      fromDt,
      toDt
    } = req.query;

    const params: BidSearchParams = {
      pageNo: Number(pageNo),
      numOfRows: Number(numOfRows),
      bidNtceNm: bidNtceNm as string,
      dminsttNm: dminsttNm as string,
      bidMethdNm: bidMethdNm as string,
      fromDt: fromDt as string,
      toDt: toDt as string
    };

    const result = await g2bApiService.getBidList(params);
    const isUsingMockData = g2bApiService.isUsingMockData();

    res.json({
      success: true,
      data: {
        bids: result.response.body.items,
        pagination: {
          pageNo: result.response.body.pageNo,
          numOfRows: result.response.body.numOfRows,
          totalCount: result.response.body.totalCount
        },
        isUsingMockData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'G2B_BID_LIST_FETCH_FAILED',
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// 입찰공고 상세 조회
export const getBidDetail = async (req: Request, res: Response) => {
  try {
    const { bidNtceNo } = req.params;

    if (!bidNtceNo) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BID_NOTICE_NO_REQUIRED',
          message: '입찰공고번호가 필요합니다.'
        },
        timestamp: new Date().toISOString()
      });
    }

    const result = await g2bApiService.getBidDetail(bidNtceNo);
    const isUsingMockData = g2bApiService.isUsingMockData();

    return res.json({
      success: true,
      data: {
        bid: result.response.body.items[0],
        isUsingMockData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'G2B_BID_DETAIL_FETCH_FAILED',
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// 키워드로 입찰공고 검색
export const searchBidsByKeyword = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.params;
    const {
      pageNo = 1,
      numOfRows = 10
    } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'KEYWORD_REQUIRED',
          message: '검색 키워드가 필요합니다.'
        },
        timestamp: new Date().toISOString()
      });
    }

    const params: BidSearchParams = {
      pageNo: Number(pageNo),
      numOfRows: Number(numOfRows)
    };

    const result = await g2bApiService.searchBidsByKeyword(keyword, params);
    const isUsingMockData = g2bApiService.isUsingMockData();

    return res.json({
      success: true,
      data: {
        keyword,
        bids: result.response.body.items,
        pagination: {
          pageNo: result.response.body.pageNo,
          numOfRows: result.response.body.numOfRows,
          totalCount: result.response.body.totalCount
        },
        isUsingMockData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'G2B_BID_SEARCH_FAILED',
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// 기관별 입찰공고 조회
export const getBidsByInstitution = async (req: Request, res: Response) => {
  try {
    const { institutionName } = req.params;
    const {
      pageNo = 1,
      numOfRows = 10
    } = req.query;

    if (!institutionName) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSTITUTION_NAME_REQUIRED',
          message: '기관명이 필요합니다.'
        },
        timestamp: new Date().toISOString()
      });
    }

    const params: BidSearchParams = {
      pageNo: Number(pageNo),
      numOfRows: Number(numOfRows)
    };

    const result = await g2bApiService.getBidsByInstitution(institutionName, params);
    const isUsingMockData = g2bApiService.isUsingMockData();

    return res.json({
      success: true,
      data: {
        institutionName,
        bids: result.response.body.items,
        pagination: {
          pageNo: result.response.body.pageNo,
          numOfRows: result.response.body.numOfRows,
          totalCount: result.response.body.totalCount
        },
        isUsingMockData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'G2B_INSTITUTION_BIDS_FETCH_FAILED',
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// 날짜 범위로 입찰공고 조회
export const getBidsByDateRange = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.params;
    const {
      pageNo = 1,
      numOfRows = 10
    } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DATE_RANGE_REQUIRED',
          message: '시작일과 종료일이 필요합니다.'
        },
        timestamp: new Date().toISOString()
      });
    }

    const params: BidSearchParams = {
      pageNo: Number(pageNo),
      numOfRows: Number(numOfRows)
    };

    const result = await g2bApiService.getBidsByDateRange(fromDate, toDate, params);
    const isUsingMockData = g2bApiService.isUsingMockData();

    return res.json({
      success: true,
      data: {
        fromDate,
        toDate,
        bids: result.response.body.items,
        pagination: {
          pageNo: result.response.body.pageNo,
          numOfRows: result.response.body.numOfRows,
          totalCount: result.response.body.totalCount
        },
        isUsingMockData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'G2B_DATE_RANGE_BIDS_FETCH_FAILED',
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// 계약 정보 목록 조회
export const getContractList = async (req: Request, res: Response) => {
  try {
    const {
      pageNo = 1,
      numOfRows = 10,
      cntrctNm,
      dminsttNm,
      fromDt,
      toDt
    } = req.query;

    const params: ContractSearchParams = {
      pageNo: Number(pageNo),
      numOfRows: Number(numOfRows),
      cntrctNm: cntrctNm as string,
      dminsttNm: dminsttNm as string,
      fromDt: fromDt as string,
      toDt: toDt as string
    };

    const result = await g2bApiService.getContractList(params);
    const isUsingMockData = g2bApiService.isUsingMockData();

    res.json({
      success: true,
      data: {
        contracts: result.response.body.items,
        pagination: {
          pageNo: result.response.body.pageNo,
          numOfRows: result.response.body.numOfRows,
          totalCount: result.response.body.totalCount
        },
        isUsingMockData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'G2B_CONTRACT_LIST_FETCH_FAILED',
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// 계약 정보 상세 조회
export const getContractDetail = async (req: Request, res: Response) => {
  try {
    const { cntrctNo } = req.params;

    if (!cntrctNo) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CONTRACT_NO_REQUIRED',
          message: '계약번호가 필요합니다.'
        },
        timestamp: new Date().toISOString()
      });
    }

    const result = await g2bApiService.getContractDetail(cntrctNo);
    const isUsingMockData = g2bApiService.isUsingMockData();

    return res.json({
      success: true,
      data: {
        contract: result.response.body.items[0],
        isUsingMockData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'G2B_CONTRACT_DETAIL_FETCH_FAILED',
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
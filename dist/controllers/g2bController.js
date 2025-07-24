"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractDetail = exports.getContractList = exports.getBidsByDateRange = exports.getBidsByInstitution = exports.searchBidsByKeyword = exports.getBidDetail = exports.getBidList = exports.checkG2BApiStatus = void 0;
const g2bApiService_1 = __importDefault(require("../services/g2bApiService"));
const checkG2BApiStatus = async (req, res) => {
    try {
        const isAvailable = await g2bApiService_1.default.checkApiStatus();
        const config = g2bApiService_1.default.getConfig();
        const isUsingMockData = g2bApiService_1.default.isUsingMockData();
        res.json({
            success: true,
            data: {
                isAvailable,
                isUsingMockData,
                config,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
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
exports.checkG2BApiStatus = checkG2BApiStatus;
const getBidList = async (req, res) => {
    try {
        const { pageNo = 1, numOfRows = 10, bidNtceNm, dminsttNm, bidMethdNm, fromDt, toDt } = req.query;
        const params = {
            pageNo: Number(pageNo),
            numOfRows: Number(numOfRows),
            bidNtceNm: bidNtceNm,
            dminsttNm: dminsttNm,
            bidMethdNm: bidMethdNm,
            fromDt: fromDt,
            toDt: toDt
        };
        const result = await g2bApiService_1.default.getBidList(params);
        const isUsingMockData = g2bApiService_1.default.isUsingMockData();
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
    }
    catch (error) {
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
exports.getBidList = getBidList;
const getBidDetail = async (req, res) => {
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
        const result = await g2bApiService_1.default.getBidDetail(bidNtceNo);
        const isUsingMockData = g2bApiService_1.default.isUsingMockData();
        return res.json({
            success: true,
            data: {
                bid: result.response.body.items[0],
                isUsingMockData,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
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
exports.getBidDetail = getBidDetail;
const searchBidsByKeyword = async (req, res) => {
    try {
        const { keyword } = req.params;
        const { pageNo = 1, numOfRows = 10 } = req.query;
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
        const params = {
            pageNo: Number(pageNo),
            numOfRows: Number(numOfRows)
        };
        const result = await g2bApiService_1.default.searchBidsByKeyword(keyword, params);
        const isUsingMockData = g2bApiService_1.default.isUsingMockData();
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
    }
    catch (error) {
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
exports.searchBidsByKeyword = searchBidsByKeyword;
const getBidsByInstitution = async (req, res) => {
    try {
        const { institutionName } = req.params;
        const { pageNo = 1, numOfRows = 10 } = req.query;
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
        const params = {
            pageNo: Number(pageNo),
            numOfRows: Number(numOfRows)
        };
        const result = await g2bApiService_1.default.getBidsByInstitution(institutionName, params);
        const isUsingMockData = g2bApiService_1.default.isUsingMockData();
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
    }
    catch (error) {
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
exports.getBidsByInstitution = getBidsByInstitution;
const getBidsByDateRange = async (req, res) => {
    try {
        const { fromDate, toDate } = req.params;
        const { pageNo = 1, numOfRows = 10 } = req.query;
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
        const params = {
            pageNo: Number(pageNo),
            numOfRows: Number(numOfRows)
        };
        const result = await g2bApiService_1.default.getBidsByDateRange(fromDate, toDate, params);
        const isUsingMockData = g2bApiService_1.default.isUsingMockData();
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
    }
    catch (error) {
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
exports.getBidsByDateRange = getBidsByDateRange;
const getContractList = async (req, res) => {
    try {
        const { pageNo = 1, numOfRows = 10, cntrctNm, dminsttNm, fromDt, toDt } = req.query;
        const params = {
            pageNo: Number(pageNo),
            numOfRows: Number(numOfRows),
            cntrctNm: cntrctNm,
            dminsttNm: dminsttNm,
            fromDt: fromDt,
            toDt: toDt
        };
        const result = await g2bApiService_1.default.getContractList(params);
        const isUsingMockData = g2bApiService_1.default.isUsingMockData();
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
    }
    catch (error) {
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
exports.getContractList = getContractList;
const getContractDetail = async (req, res) => {
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
        const result = await g2bApiService_1.default.getContractDetail(cntrctNo);
        const isUsingMockData = g2bApiService_1.default.isUsingMockData();
        return res.json({
            success: true,
            data: {
                contract: result.response.body.items[0],
                isUsingMockData,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
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
exports.getContractDetail = getContractDetail;
//# sourceMappingURL=g2bController.js.map
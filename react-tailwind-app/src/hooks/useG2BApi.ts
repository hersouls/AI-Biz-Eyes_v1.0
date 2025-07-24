import { useState, useEffect, useCallback } from 'react';
import g2bApiService, {
  BidInfo,
  ContractInfo,
  BidListResponse,
  ContractListResponse,
  G2BApiStatusResponse,
  BidSearchParams,
  ContractSearchParams
} from '../services/g2bApiService';

// 조달청 API 상태 훅
export const useG2BApiStatus = () => {
  const [status, setStatus] = useState<G2BApiStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await g2bApiService.checkApiStatus();
      setStatus(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return { status, loading, error, refetch: checkStatus };
};

// 입찰공고 목록 훅
export const useBidList = (params: BidSearchParams = {}) => {
  const [data, setData] = useState<BidListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBids = useCallback(async (searchParams: BidSearchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await g2bApiService.getBidList({ ...params, ...searchParams });
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return { data, loading, error, refetch: fetchBids };
};

// 입찰공고 상세 훅
export const useBidDetail = (bidNtceNo: string | null) => {
  const [data, setData] = useState<BidInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBidDetail = useCallback(async (noticeNo: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await g2bApiService.getBidDetail(noticeNo);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (bidNtceNo) {
      fetchBidDetail(bidNtceNo);
    }
  }, [bidNtceNo, fetchBidDetail]);

  return { data, loading, error, refetch: fetchBidDetail };
};

// 키워드 검색 훅
export const useBidSearch = (keyword: string | null, params: BidSearchParams = {}) => {
  const [data, setData] = useState<BidListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBids = useCallback(async (searchKeyword: string, searchParams: BidSearchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await g2bApiService.searchBidsByKeyword(searchKeyword, { ...params, ...searchParams });
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (keyword) {
      searchBids(keyword);
    }
  }, [keyword, searchBids]);

  return { data, loading, error, refetch: searchBids };
};

// 기관별 입찰공고 훅
export const useBidsByInstitution = (institutionName: string | null, params: BidSearchParams = {}) => {
  const [data, setData] = useState<BidListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBidsByInstitution = useCallback(async (institution: string, searchParams: BidSearchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await g2bApiService.getBidsByInstitution(institution, { ...params, ...searchParams });
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (institutionName) {
      fetchBidsByInstitution(institutionName);
    }
  }, [institutionName, fetchBidsByInstitution]);

  return { data, loading, error, refetch: fetchBidsByInstitution };
};

// 날짜 범위 입찰공고 훅
export const useBidsByDateRange = (fromDate: string | null, toDate: string | null, params: BidSearchParams = {}) => {
  const [data, setData] = useState<BidListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBidsByDateRange = useCallback(async (from: string, to: string, searchParams: BidSearchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await g2bApiService.getBidsByDateRange(from, to, { ...params, ...searchParams });
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchBidsByDateRange(fromDate, toDate);
    }
  }, [fromDate, toDate, fetchBidsByDateRange]);

  return { data, loading, error, refetch: fetchBidsByDateRange };
};

// 계약 정보 목록 훅
export const useContractList = (params: ContractSearchParams = {}) => {
  const [data, setData] = useState<ContractListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async (searchParams: ContractSearchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await g2bApiService.getContractList({ ...params, ...searchParams });
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return { data, loading, error, refetch: fetchContracts };
};

// 계약 정보 상세 훅
export const useContractDetail = (cntrctNo: string | null) => {
  const [data, setData] = useState<ContractInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContractDetail = useCallback(async (contractNo: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await g2bApiService.getContractDetail(contractNo);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cntrctNo) {
      fetchContractDetail(cntrctNo);
    }
  }, [cntrctNo, fetchContractDetail]);

  return { data, loading, error, refetch: fetchContractDetail };
};
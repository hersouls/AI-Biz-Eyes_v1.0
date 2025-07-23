import React, { useState } from 'react';
import { naraBidApiService, NaraBidItem } from '../services/naraBidApiService';

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp: Date;
}

const NaraBidApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    pageNo: 1,
    numOfRows: 10,
    inqryDiv: '1',
    inqryBgnDt: '',
    inqryEndDt: '',
    dminsttNm: '',
    bidNtceNm: ''
  });

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // 최대 10개 결과만 유지
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const result = await naraBidApiService.testConnection();
      addTestResult({
        success: result.success,
        message: result.message,
        data: result.data,
        timestamp: new Date()
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetBidList = async () => {
    setLoading(true);
    try {
      const result = await naraBidApiService.getBidList(searchParams);
      addTestResult({
        success: result.success,
        message: result.message,
        data: result.data,
        timestamp: new Date()
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByKeyword = async () => {
    if (!searchParams.bidNtceNm.trim()) {
      addTestResult({
        success: false,
        message: '검색 키워드를 입력해주세요.',
        timestamp: new Date()
      });
      return;
    }

    setLoading(true);
    try {
      const result = await naraBidApiService.searchBidByKeyword(searchParams.bidNtceNm, searchParams);
      addTestResult({
        success: result.success,
        message: result.message,
        data: result.data,
        timestamp: new Date()
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByInstitution = async () => {
    if (!searchParams.dminsttNm.trim()) {
      addTestResult({
        success: false,
        message: '기관명을 입력해주세요.',
        timestamp: new Date()
      });
      return;
    }

    setLoading(true);
    try {
      const result = await naraBidApiService.getBidListByInstitution(searchParams.dminsttNm, searchParams);
      addTestResult({
        success: result.success,
        message: result.message,
        data: result.data,
        timestamp: new Date()
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByDateRange = async () => {
    if (!searchParams.inqryBgnDt || !searchParams.inqryEndDt) {
      addTestResult({
        success: false,
        message: '시작일과 종료일을 모두 입력해주세요.',
        timestamp: new Date()
      });
      return;
    }

    setLoading(true);
    try {
      const result = await naraBidApiService.getBidListByDateRange(
        searchParams.inqryBgnDt,
        searchParams.inqryEndDt,
        searchParams
      );
      addTestResult({
        success: result.success,
        message: result.message,
        data: result.data,
        timestamp: new Date()
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const renderBidItems = (items: NaraBidItem[]) => {
    return items.map((item, index) => (
      <div key={index} className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-blue-600 text-sm">{item.bidNtceNm}</h4>
          <span className="text-xs text-gray-500">{item.bidNtceNo}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="font-medium">기관명:</span> {item.dminsttNm}</div>
          <div><span className="font-medium">공고일:</span> {item.bidNtceDt}</div>
          <div><span className="font-medium">개찰일:</span> {item.opengDt}</div>
          <div><span className="font-medium">추정가격:</span> {item.presmptPrce?.toLocaleString()}원</div>
        </div>
        {item.bidwinnrNm && (
          <div className="mt-2 text-xs">
            <span className="font-medium">낙찰자:</span> {item.bidwinnrNm}
            {item.bidwinnrPrce && (
              <span className="ml-2">
                <span className="font-medium">낙찰가:</span> {item.bidwinnrPrce.toLocaleString()}원
              </span>
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🏛️ 나라장터 입찰공고정보 API 테스트
        </h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">📡 API 정보</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div><strong>Endpoint:</strong> https://apis.data.go.kr/1230000/ad/BidPublicInfoService</div>
            <div><strong>데이터포맷:</strong> JSON</div>
            <div><strong>인증키:</strong> Encoding 방식 사용</div>
          </div>
        </div>

        {/* 검색 파라미터 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">페이지 번호</label>
            <input
              type="number"
              value={searchParams.pageNo}
              onChange={(e) => setSearchParams(prev => ({ ...prev, pageNo: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">페이지당 행 수</label>
            <input
              type="number"
              value={searchParams.numOfRows}
              onChange={(e) => setSearchParams(prev => ({ ...prev, numOfRows: parseInt(e.target.value) || 10 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">조회구분</label>
            <select
              value={searchParams.inqryDiv}
              onChange={(e) => setSearchParams(prev => ({ ...prev, inqryDiv: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">전체</option>
              <option value="2">입찰공고</option>
              <option value="3">입찰결과</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시작일 (YYYYMMDD)</label>
            <input
              type="text"
              value={searchParams.inqryBgnDt}
              onChange={(e) => setSearchParams(prev => ({ ...prev, inqryBgnDt: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="20241201"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">종료일 (YYYYMMDD)</label>
            <input
              type="text"
              value={searchParams.inqryEndDt}
              onChange={(e) => setSearchParams(prev => ({ ...prev, inqryEndDt: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="20241231"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">기관명</label>
            <input
              type="text"
              value={searchParams.dminsttNm}
              onChange={(e) => setSearchParams(prev => ({ ...prev, dminsttNm: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="조달청"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">입찰공고명 (키워드)</label>
            <input
              type="text"
              value={searchParams.bidNtceNm}
              onChange={(e) => setSearchParams(prev => ({ ...prev, bidNtceNm: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="시스템 구축"
            />
          </div>
        </div>

        {/* 테스트 버튼들 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔗 연결 테스트
          </button>
          <button
            onClick={handleGetBidList}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📋 입찰공고 목록 조회
          </button>
          <button
            onClick={handleSearchByKeyword}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍 키워드 검색
          </button>
          <button
            onClick={handleSearchByInstitution}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🏢 기관별 검색
          </button>
          <button
            onClick={handleSearchByDateRange}
            disabled={loading}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📅 기간별 검색
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">API 호출 중...</p>
          </div>
        )}
      </div>

      {/* 테스트 결과 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 테스트 결과</h3>
        
        {testResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            테스트를 실행하면 결과가 여기에 표시됩니다.
          </div>
        ) : (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                      {result.success ? '✅ 성공' : '❌ 실패'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'} mb-2`}>
                  {result.message}
                </p>

                {result.data && (
                  <div className="mt-3">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                        📄 응답 데이터 보기
                      </summary>
                      <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                        <pre>{JSON.stringify(result.data, null, 2)}</pre>
                      </div>
                    </details>

                    {/* 입찰공고 목록 렌더링 */}
                    {result.data?.response?.body?.items?.item && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-800 mb-2">
                          📋 입찰공고 목록 ({result.data.response.body.items.item.length}건)
                        </h4>
                        <div className="space-y-2">
                          {renderBidItems(result.data.response.body.items.item)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NaraBidApiTest;
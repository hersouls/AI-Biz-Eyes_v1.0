import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BidData } from '../../types/bid';
import Card from '../Card';
import Button from '../Button';
import { formatCurrency, formatDateTime, getStatusBadge, getBusinessTypeBadge, getUrgentBadge, getDeadlineNearBadge, getNewBadge, getParticipationStatusBadge } from '../../utils/formatters';

interface BidDetailProps {}

export const BidDetail: React.FC<BidDetailProps> = () => {
  const { bidNtceNo } = useParams<{ bidNtceNo: string }>();
  const navigate = useNavigate();
  const [bidData, setBidData] = useState<BidData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bidNtceNo) {
      fetchBidDetail(bidNtceNo);
    }
  }, [bidNtceNo]);

  const fetchBidDetail = async (bidNo: string) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/bid-detail/${bidNo}`);
      // const data = await response.json();
      
      // Mock data for development
      const mockData: BidData = {
        bidNtceNo: bidNo,
        bidNtceOrd: 1,
        bidNtceNm: "스마트공장 구축 사업 입찰공고",
        bidNtceSttusNm: "일반공고",
        bsnsDivNm: "용역",
        ntceInsttNm: "조달청",
        dmndInsttNm: "한국테크노파크",
        asignBdgtAmt: "500000000",
        presmptPrce: "450000000",
        bidNtceDate: "2024-07-15",
        bidNtceBgn: "10:00",
        bidClseDate: "2024-08-15",
        bidClseTm: "18:00",
        opengDate: "2024-08-16",
        opengTm: "10:00",
        elctrnBidYn: "Y",
        intrntnlBidYn: "N",
        cmmnCntrctYn: "N",
        cntrctCnclsSttusNm: "계약체결",
        cntrctCnclsMthdNm: "일반계약",
        bidwinrDcsnMthdNm: "최저가낙찰",
        rgnLmtYn: "N",
        indstrytyLmtYn: "N",
        presnatnOprtnYn: "Y",
        presnatnOprtnDate: "2024-07-25",
        presnatnOprtnTm: "14:00",
        presnatnOprtnPlce: "한국테크노파크 본사",
        ntceInsttOfclDeptNm: "조달정책과",
        ntceInsttOfclNm: "김철수",
        ntceInsttOfclTel: "02-1234-5678",
        ntceInsttOfclEmailAdrs: "kim@pps.go.kr",
        dmndInsttOfclDeptNm: "사업기획팀",
        dmndInsttOfclNm: "이영희",
        dmndInsttOfclTel: "031-9876-5432",
        dmndInsttOfclEmailAdrs: "lee@ktech.or.kr",
        bidNtceUrl: "https://www.g2b.go.kr:8101/ep/main/main.do",
        internalStatus: "검토중",
        isUrgent: false,
        isDeadlineNear: true,
        isNew: true,
        participationStatus: "미정",
        referenceMatchCount: 3,
        aiRecommendationScore: 85
      };
      
      setBidData(mockData);
    } catch (err) {
      setError('공고 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadges = (bid: BidData) => {
    return (
      <>
        {getUrgentBadge(bid.isUrgent || false)}
        {getDeadlineNearBadge(bid.isDeadlineNear || false)}
        {getNewBadge(bid.isNew || false)}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !bidData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">{error || '공고 정보를 찾을 수 없습니다.'}</div>
        <Button onClick={() => navigate('/bid-list')} variant="primary">
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{bidData.bidNtceNm}</h1>
          <div className="flex items-center space-x-2">
            {getStatusBadge(bidData.bidNtceSttusNm)}
            {getPriorityBadges(bidData)}
            <span className="text-sm text-gray-500">공고번호: {bidData.bidNtceNo}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => window.open(bidData.bidNtceUrl, '_blank')}>
            원문 바로가기
          </Button>
          <Button variant="primary">
            참여판단
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">업무구분</label>
                <div className="mt-1">{getBusinessTypeBadge(bidData.bsnsDivNm)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">공고차수</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.bidNtceOrd}차</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">공고기관</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.ntceInsttNm}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">수요기관</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.dmndInsttNm || '-'}</p>
              </div>
            </div>
          </Card>

          {/* Financial Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">예산 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">예산금액</label>
                <p className="mt-1 text-lg font-semibold text-blue-600">
                  {bidData.asignBdgtAmt ? formatCurrency(bidData.asignBdgtAmt) : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">추정가격</label>
                <p className="mt-1 text-lg font-semibold text-green-600">
                  {bidData.presmptPrce ? formatCurrency(bidData.presmptPrce) : '-'}
                </p>
              </div>
            </div>
          </Card>

          {/* Schedule Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">일정 정보</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">공고일시</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDateTime(bidData.bidNtceDate, bidData.bidNtceBgn)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">마감일시</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDateTime(bidData.bidClseDate, bidData.bidClseTm)}
                  </p>
                </div>
              </div>
              {bidData.opengDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">개찰일시</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDateTime(bidData.opengDate, bidData.opengTm)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Bidding Conditions */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">입찰 조건</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">전자입찰여부</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.elctrnBidYn === 'Y' ? '예' : '아니오'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">국제입찰여부</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.intrntnlBidYn === 'Y' ? '예' : '아니오'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">공동계약여부</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.cmmnCntrctYn === 'Y' ? '예' : '아니오'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">지역제한</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.rgnLmtYn === 'Y' ? '예' : '아니오'}</p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">담당자 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">공고기관 담당자</h3>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">부서:</span> {bidData.ntceInsttOfclDeptNm || '-'}</p>
                  <p className="text-sm"><span className="font-medium">이름:</span> {bidData.ntceInsttOfclNm || '-'}</p>
                  <p className="text-sm"><span className="font-medium">전화:</span> {bidData.ntceInsttOfclTel || '-'}</p>
                  <p className="text-sm"><span className="font-medium">이메일:</span> {bidData.ntceInsttOfclEmailAdrs || '-'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">수요기관 담당자</h3>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">부서:</span> {bidData.dmndInsttOfclDeptNm || '-'}</p>
                  <p className="text-sm"><span className="font-medium">이름:</span> {bidData.dmndInsttOfclNm || '-'}</p>
                  <p className="text-sm"><span className="font-medium">전화:</span> {bidData.dmndInsttOfclTel || '-'}</p>
                  <p className="text-sm"><span className="font-medium">이메일:</span> {bidData.dmndInsttOfclEmailAdrs || '-'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Presentation Information */}
          {bidData.presnatnOprtnYn === 'Y' && (
            <Card>
              <h2 className="text-lg font-semibold mb-4">설명회 정보</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">설명회 일시</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {bidData.presnatnOprtnDate && formatDateTime(bidData.presnatnOprtnDate, bidData.presnatnOprtnTm)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">설명회 장소</label>
                  <p className="mt-1 text-sm text-gray-900">{bidData.presnatnOprtnPlce || '-'}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Internal Status */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">내부 상태</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">참여 상태</label>
                <div className="mt-1">{getParticipationStatusBadge(bidData.participationStatus)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">레퍼런스 매칭</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.referenceMatchCount}건</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">AI 추천 점수</label>
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${bidData.aiRecommendationScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{bidData.aiRecommendationScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">빠른 액션</h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-center">
                레퍼런스 매칭
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                알림 설정
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                코멘트 추가
              </Button>
            </div>
          </Card>

          {/* Related Information */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">관련 정보</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">계약체결형태</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.cntrctCnclsSttusNm || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">계약체결방법</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.cntrctCnclsMthdNm || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">낙찰자결정방법</label>
                <p className="mt-1 text-sm text-gray-900">{bidData.bidwinrDcsnMthdNm || '-'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BidData } from '../../types/bid';
import { BidService } from '../../services/bidService';
import { formatCurrency, formatDateTime, getStatusBadge, getBusinessTypeBadge, getUrgentBadge, getDeadlineNearBadge, getNewBadge, getParticipationStatusBadge } from '../../utils/formatters';
import Card from '../Card';
import Button from '../Button';
import Badge from '../Badge';

interface BidDetailProps {}

export const BidDetail: React.FC<BidDetailProps> = () => {
  const { bidNo } = useParams<{ bidNo: string }>();
  const navigate = useNavigate();
  const [bidData, setBidData] = useState<BidData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bidNo) {
      fetchBidDetail(bidNo);
    }
  }, [bidNo]);

  const fetchBidDetail = async (bidNo: string) => {
    try {
      setLoading(true);
      const response = await BidService.getBidDetail(parseInt(bidNo));
      setBidData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '공고 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadges = (bid: BidData) => {
    const badges = [];
    
    if (bid.isUrgent) {
      const urgentBadge = getUrgentBadge(true);
      if (urgentBadge) {
        badges.push(<Badge key="urgent" variant={urgentBadge.color}>{urgentBadge.text}</Badge>);
      }
    }
    
    if (bid.isDeadlineNear) {
      const deadlineBadge = getDeadlineNearBadge(bid.bidClseDate);
      if (deadlineBadge) {
        badges.push(<Badge key="deadline" variant={deadlineBadge.color}>{deadlineBadge.text}</Badge>);
      }
    }
    
    if (bid.isNew) {
      const newBadge = getNewBadge(bid.bidNtceDate);
      if (newBadge) {
        badges.push(<Badge key="new" variant={newBadge.color}>{newBadge.text}</Badge>);
      }
    }
    
    return badges;
  };

  const renderStatusBadge = (status: string) => {
    const statusConfig = getStatusBadge(status);
    return <Badge variant={statusConfig.color}>{statusConfig.text}</Badge>;
  };

  const renderBusinessTypeBadge = (businessType: string) => {
    const typeConfig = getBusinessTypeBadge(businessType);
    return <Badge variant={typeConfig.color}>{typeConfig.text}</Badge>;
  };

  const renderParticipationStatusBadge = (status: string | undefined) => {
    const statusConfig = getParticipationStatusBadge(status);
    if (!statusConfig) return null;
    return <Badge variant={statusConfig.color}>{statusConfig.text}</Badge>;
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
            {renderStatusBadge(bidData.bidNtceSttusNm)}
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
                <div className="mt-1">{renderBusinessTypeBadge(bidData.bsnsDivNm)}</div>
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
                <div className="mt-1">{renderParticipationStatusBadge(bidData.participationStatus)}</div>
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
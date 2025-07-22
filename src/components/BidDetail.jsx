import React, { useState, useEffect } from 'react'
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentDuplicateIcon,
  BellIcon,
  EyeIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline'
import { ExternalLinkIcon } from '@heroicons/react/20/solid'

// Mock 데이터
const mockBidDetail = {
  id: '20240100001',
  bidNtceNo: '20240100001',
  bidNtceOrd: '1',
  bidNtceNm: 'AI 기반 스마트시티 구축 사업',
  bidNtceSttusNm: '일반공고',
  bsnsDivNm: '용역',
  ntceInsttNm: '과학기술정보통신부',
  dmndInsttNm: '한국정보통신기술협회',
  asignBdgtAmt: '2500000000',
  presmptPrce: '2300000000',
  bidNtceDate: '2024-01-15',
  bidNtceBgn: '09:00',
  bidClseDate: '2024-02-15',
  bidClseTm: '18:00',
  bidBeginDate: '2024-01-20',
  bidBeginTm: '09:00',
  opengDate: '2024-02-20',
  opengTm: '14:00',
  opengPlce: '서울특별시 강남구 테헤란로 123',
  presnatnOprtnYn: 'Y',
  presnatnOprtnDate: '2024-01-25',
  presnatnOprtnTm: '14:00',
  presnatnOprtnPlce: '서울특별시 강남구 테헤란로 123 4층',
  elctrnBidYn: 'Y',
  intrntnlBidYn: 'N',
  cmmnCntrctYn: 'N',
  cmmnReciptMethdNm: '일반입찰',
  cntrctCnclsSttusNm: '계약체결대기',
  cntrctCnclsMthdNm: '일반입찰',
  bidwinrDcsnMthdNm: '최저가결정',
  rgnLmtYn: 'N',
  prtcptPsblRgnNm: '전국',
  indstrytyLmtYn: 'N',
  bidprcPsblIndstrytyNm: '정보통신업',
  rsrvtnPrceDcsnMthdNm: '예정가격공개',
  bidNtceUrl: 'https://www.g2b.go.kr:8101/ep/main/main.do',
  internalStatus: '검토중',
  priority: 'high',
  similarity: 95,
  content: `
    <h2>사업 개요</h2>
    <p>본 사업은 AI 기술을 활용한 스마트시티 구축을 위한 종합적인 용역 사업입니다.</p>
    
    <h3>주요 사업 내용</h3>
    <ul>
      <li>AI 기반 교통 관리 시스템 구축</li>
      <li>스마트 에너지 관리 플랫폼 개발</li>
      <li>IoT 센서 네트워크 인프라 구축</li>
      <li>데이터 분석 및 시각화 시스템 개발</li>
    </ul>
    
    <h3>기술 요구사항</h3>
    <ul>
      <li>AI/ML 기술 보유 업체</li>
      <li>클라우드 인프라 구축 경험</li>
      <li>IoT 플랫폼 개발 경험</li>
      <li>대용량 데이터 처리 경험</li>
    </ul>
    
    <h3>사업 규모</h3>
    <p>총 사업비: 25억원 (예산금액)</p>
    <p>사업기간: 2024년 3월 ~ 2025년 12월 (22개월)</p>
  `,
  attachments: [
    {
      id: 1,
      name: '입찰공고서.pdf',
      size: '2.5MB',
      type: 'pdf',
    },
    {
      id: 2,
      name: '사업계획서_양식.hwp',
      size: '1.2MB',
      type: 'hwp',
    },
    {
      id: 3,
      name: '기술제안서_양식.docx',
      size: '3.1MB',
      type: 'docx',
    },
  ],
  contactInfo: {
    name: '김철수',
    position: '사업담당관',
    phone: '02-1234-5678',
    email: 'kim.cs@msit.go.kr',
    department: '정보통신정책과',
  },
  references: [
    {
      id: 1,
      title: '스마트시티 플랫폼 구축 사업',
      institution: '서울특별시',
      year: '2023',
      amount: '15억원',
      similarity: 92,
    },
    {
      id: 2,
      title: 'AI 기반 교통관리 시스템',
      institution: '부산광역시',
      year: '2022',
      amount: '8억원',
      similarity: 88,
    },
    {
      id: 3,
      title: 'IoT 센서 네트워크 구축',
      institution: '대구광역시',
      year: '2023',
      amount: '12억원',
      similarity: 85,
    },
  ],
}

function BidDetail() {
  const [activeTab, setActiveTab] = useState('overview')
  const [bidDetail] = useState(mockBidDetail)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      '일반공고': { color: 'bg-blue-100 text-blue-800', icon: DocumentTextIcon },
      '긴급공고': { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
      '정정공고': { color: 'bg-yellow-100 text-yellow-800', icon: DocumentDuplicateIcon },
      '재공고': { color: 'bg-purple-100 text-purple-800', icon: DocumentDuplicateIcon },
    }

    const config = statusConfig[status] || statusConfig['일반공고']
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status}
      </span>
    )
  }

  const getInternalStatusBadge = (status) => {
    const statusConfig = {
      '미검토': { color: 'bg-gray-100 text-gray-800' },
      '검토중': { color: 'bg-blue-100 text-blue-800' },
      '참여예정': { color: 'bg-green-100 text-green-800' },
      '확정': { color: 'bg-purple-100 text-purple-800' },
      '거절': { color: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status] || statusConfig['미검토']

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {status}
      </span>
    )
  }

  const tabs = [
    { id: 'overview', name: '개요', icon: DocumentTextIcon },
    { id: 'schedule', name: '일정', icon: CalendarIcon },
    { id: 'conditions', name: '조건', icon: BuildingOfficeIcon },
    { id: 'content', name: '공고문', icon: DocumentDuplicateIcon },
    { id: 'references', name: '레퍼런스', icon: ClipboardDocumentIcon },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{bidDetail.bidNtceNm}</h1>
            <p className="text-gray-600">공고번호: {bidDetail.bidNtceNo}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <ExternalLinkIcon className="w-4 h-4 mr-2 inline" />
            원문 보기
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            참여판단
          </button>
        </div>
      </div>

      {/* 상태 및 요약 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">공고 상태</p>
            <div className="mt-2">{getStatusBadge(bidDetail.bidNtceSttusNm)}</div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">내부 상태</p>
            <div className="mt-2">{getInternalStatusBadge(bidDetail.internalStatus)}</div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">예산</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(bidDetail.asignBdgtAmt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">유사도</p>
            <div className="flex items-center mt-2">
              <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${bidDetail.similarity}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-900">{bidDetail.similarity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* 개요 탭 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">공고기관</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.ntceInsttNm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">수요기관</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.dmndInsttNm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">업무구분</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.bsnsDivNm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">공고일</dt>
                      <dd className="text-sm text-gray-900">{formatDate(bidDetail.bidNtceDate)} {bidDetail.bidNtceBgn}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">마감일</dt>
                      <dd className="text-sm text-gray-900">{formatDate(bidDetail.bidClseDate)} {bidDetail.bidClseTm}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">담당자 정보</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">담당자</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.contactInfo.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">직책</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.contactInfo.position}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">부서</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.contactInfo.department}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">연락처</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.contactInfo.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">이메일</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.contactInfo.email}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">첨부파일</h3>
                <div className="space-y-2">
                  {bidDetail.attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        다운로드
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 일정 탭 */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">입찰 일정</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">입찰 시작</dt>
                      <dd className="text-sm text-gray-900">{formatDate(bidDetail.bidBeginDate)} {bidDetail.bidBeginTm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">입찰 마감</dt>
                      <dd className="text-sm text-gray-900">{formatDate(bidDetail.bidClseDate)} {bidDetail.bidClseTm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">개찰일</dt>
                      <dd className="text-sm text-gray-900">{formatDate(bidDetail.opengDate)} {bidDetail.opengTm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">개찰장소</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.opengPlce}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">설명회 정보</h3>
                  {bidDetail.presnatnOprtnYn === 'Y' ? (
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">설명회 일시</dt>
                        <dd className="text-sm text-gray-900">{formatDate(bidDetail.presnatnOprtnDate)} {bidDetail.presnatnOprtnTm}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">설명회 장소</dt>
                        <dd className="text-sm text-gray-900">{bidDetail.presnatnOprtnPlce}</dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="text-sm text-gray-500">설명회 없음</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 조건 탭 */}
          {activeTab === 'conditions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">입찰 조건</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">전자입찰 여부</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.elctrnBidYn === 'Y' ? '예' : '아니오'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">국제입찰 여부</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.intrntnlBidYn === 'Y' ? '예' : '아니오'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">공동계약 여부</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.cmmnCntrctYn === 'Y' ? '예' : '아니오'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">공동수급방식</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.cmmnReciptMethdNm}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">계약 조건</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">계약체결형태</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.cntrctCnclsSttusNm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">계약체결방법</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.cntrctCnclsMthdNm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">낙찰자결정방법</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.bidwinrDcsnMthdNm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">예정가격결정방법</dt>
                      <dd className="text-sm text-gray-900">{bidDetail.rsrvtnPrceDcsnMthdNm}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">참가 제한</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">지역 제한</dt>
                    <dd className="text-sm text-gray-900">
                      {bidDetail.rgnLmtYn === 'Y' ? bidDetail.prtcptPsblRgnNm : '제한 없음'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">업종 제한</dt>
                    <dd className="text-sm text-gray-900">
                      {bidDetail.indstrytyLmtYn === 'Y' ? bidDetail.bidprcPsblIndstrytyNm : '제한 없음'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 공고문 탭 */}
          {activeTab === 'content' && (
            <div>
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: bidDetail.content }} />
              </div>
            </div>
          )}

          {/* 레퍼런스 탭 */}
          {activeTab === 'references' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">유사 레퍼런스</h3>
              <div className="space-y-4">
                {bidDetail.references.map((ref) => (
                  <div key={ref.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{ref.title}</h4>
                      <span className="text-sm font-semibold text-blue-600">{ref.similarity}% 유사</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">기관:</span> {ref.institution}
                      </div>
                      <div>
                        <span className="font-medium">연도:</span> {ref.year}
                      </div>
                      <div>
                        <span className="font-medium">사업금액:</span> {formatCurrency(ref.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BidDetail
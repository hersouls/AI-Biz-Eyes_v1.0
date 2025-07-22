# B2G 공모사업 자동화 관리 웹서비스

정부/공공기관의 공모·입찰·사업 공고를 자동 수집·구조화·분석·알림까지 한 번에 처리하는 올인원 자동화 웹서비스입니다.

## 🚀 주요 기능

### 📊 대시보드
- 전체 공고 현황 및 KPI 실시간 모니터링
- 공고 유형별/기관별 분포 차트
- 마감 임박 공고 타임라인
- AI 기반 추천 공고
- 실시간 알림 센터

### 📋 공고 관리
- 나라장터 OpenAPI 연동 공고 수집
- 고급 검색 및 필터링 기능
- 공고 상세 정보 및 조건 확인
- 내부 상태 관리 (미검토/검토중/참여예정/확정/거절)
- Excel 내보내기 기능

### 📄 레퍼런스 관리
- 내부 참여 이력 및 성과 관리
- 기술 스택별 분류 및 통계
- 성공률 분석 및 추이
- 유사 레퍼런스 자동 매칭

### 🔔 알림 시스템
- 긴급공고/마감임박 실시간 알림
- 중복/누락 공고 감지
- 이메일/웹/모바일 알림 지원

## 🛠 기술 스택

### Frontend
- **React 18.x** - 사용자 인터페이스
- **TypeScript 5.x** - 타입 안정성
- **Tailwind CSS 3.x** - 스타일링
- **Headless UI** - 접근성 컴포넌트
- **Heroicons** - 아이콘 라이브러리

### Backend (계획)
- **Node.js 18.x** - 서버 런타임
- **Express.js 4.x** - 웹 프레임워크
- **PostgreSQL 15.x** - 메인 데이터베이스
- **Redis 7.x** - 캐싱 및 세션
- **Prisma 5.x** - ORM
- **JWT + bcrypt** - 인증 시스템

### 외부 연동
- **나라장터 OpenAPI** - 공고 데이터 수집
- **Google Sheets API** - 데이터 내보내기
- **이메일 서비스** - 알림 발송

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 환경 설정
```bash
# .env 파일 생성 (필요시)
cp .env.example .env

# 환경 변수 설정
VITE_API_URL=http://localhost:3000
VITE_OPENAPI_KEY=your_openapi_key
```

## 🏗 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Dashboard.jsx    # 대시보드
│   ├── BidList.jsx      # 공고 리스트
│   ├── BidDetail.jsx    # 공고 상세
│   └── ReferenceManager.jsx # 레퍼런스 관리
├── App.jsx             # 메인 앱 컴포넌트
├── main.jsx            # 앱 진입점
└── style.css           # 전역 스타일

Docs/                   # 개발 문서
├── API명세서.md        # API 명세
├── PRD                 # 제품 요구사항
├── 개발기술명세서.md    # 기술 스택
├── 데이터베이스설계서.md # DB 설계
├── 화면정의서          # UI/UX 정의
├── 개발일정표.md       # 프로젝트 일정
└── 디자인가이드        # 디자인 시스템
```

## 🎯 개발 단계

### 1단계: 프로토타입 (4주) ✅
- [x] Mock 데이터 기반 UI/UX 구현
- [x] 전체 플로우 시뮬레이션
- [x] 주요 기능 설계 및 피드백

### 2단계: 정식 버전 (8주) 🔄
- [ ] OpenAPI 연동 및 실데이터 수집
- [ ] 백엔드 API 개발
- [ ] 데이터베이스 구축
- [ ] 알림 시스템 구현

### 3단계: 고도화 (4주) 📋
- [ ] AI 분석 기능 추가
- [ ] 성능 최적화
- [ ] 보안 강화
- [ ] 모바일 대응

## 📱 주요 화면

### 대시보드
- KPI 카드 (전체 공고, 긴급 공고, 참여 현황, 신규 공고)
- 공고 유형별/기관별 분포 차트
- 마감 임박 공고 타임라인
- AI 추천 공고 섹션
- 실시간 알림 센터

### 공고 리스트
- 고급 검색 및 필터링
- 정렬 및 페이징
- 다중 선택 및 일괄 액션
- 내부 상태 관리
- Excel 내보내기

### 공고 상세
- 공고 기본 정보
- 입찰 일정 및 조건
- 공고문 내용
- 유사 레퍼런스 매칭
- 첨부파일 관리

### 레퍼런스 관리
- 참여 이력 및 성과 통계
- 기술 스택별 분류
- 성공률 분석
- 문서 관리

## 🔧 개발 가이드

### 컴포넌트 개발
```jsx
// 새로운 컴포넌트 생성
import React from 'react'

function NewComponent() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* 컴포넌트 내용 */}
    </div>
  )
}

export default NewComponent
```

### 스타일링 가이드
- Tailwind CSS 클래스 우선 사용
- 커스텀 스타일은 `style.css`에 추가
- 반응형 디자인 필수 적용
- 접근성 고려 (ARIA 라벨, 키보드 네비게이션)

### Mock 데이터 관리
- 각 컴포넌트별 Mock 데이터 파일 분리
- 실제 API 응답 구조와 일치하도록 설계
- 다양한 시나리오 커버

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**B2G 공모사업 자동화 관리 웹서비스** - 정부 공고 관리의 새로운 패러다임

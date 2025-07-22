# 레퍼런스 관리 기능

## 개요

레퍼런스 관리 기능은 조직의 사업 경험과 성과를 체계적으로 관리하고 분석할 수 있는 종합적인 시스템입니다. 이 기능을 통해 과거 참여 사업의 정보를 저장하고, AI 기반 유사 공고 매칭을 통해 새로운 사업 기회를 발굴할 수 있습니다.

## 주요 기능

### 1. 레퍼런스 목록 관리
- **전체 레퍼런스 조회**: 등록된 모든 레퍼런스를 테이블 형태로 표시
- **검색 및 필터링**: 사업명, 사업유형, 성과상태, 참여연도, 참여기관별 필터링
- **정렬 기능**: 다양한 기준으로 정렬 가능
- **페이징**: 대량 데이터의 효율적인 처리

### 2. 레퍼런스 등록/수정
- **새 레퍼런스 등록**: 사업 정보, 성과 정보, 첨부파일 등록
- **기존 레퍼런스 수정**: 등록된 정보 수정 및 업데이트
- **파일 첨부**: 사업 관련 문서 업로드 및 관리
- **유효성 검증**: 필수 필드 검증 및 데이터 무결성 보장

### 3. 레퍼런스 상세 보기
- **상세 정보 표시**: 모든 레퍼런스 정보를 체계적으로 표시
- **첨부파일 다운로드**: 등록된 파일 다운로드 기능
- **유사 공고 매칭**: AI 기반 유사 공고 추천 기능
- **메타 정보**: 등록일시, 수정일시 등 관리 정보 표시

### 4. 통계 및 분석
- **KPI 대시보드**: 전체 레퍼런스, 성공 사례, 진행중, 총 계약금액
- **연도별 통계**: 연도별 참여 건수 및 계약금액 분석
- **사업유형별 통계**: 사업유형별 성공률 및 분포 분석
- **성과 요약**: 평균 평가등급, 성공률, 평균 계약금액
- **상태별 분포**: 성공/진행중/실패 비율 시각화

## 기술 스택

### Frontend
- **React 18**: 최신 React 기능 활용
- **TypeScript**: 타입 안정성 보장
- **Tailwind CSS**: 모던하고 반응형 UI
- **React Hooks**: 상태 관리 및 사이드 이펙트 처리

### 주요 라이브러리
- **Custom Components**: 재사용 가능한 UI 컴포넌트
- **Fetch API**: RESTful API 통신
- **Form Validation**: 클라이언트 사이드 유효성 검증

## 컴포넌트 구조

```
src/components/Reference/
├── ReferenceManager.tsx    # 메인 관리 컴포넌트
├── ReferenceList.tsx       # 목록 표시 컴포넌트
├── ReferenceForm.tsx       # 등록/수정 폼 컴포넌트
├── ReferenceDetail.tsx     # 상세 보기 컴포넌트
├── ReferenceStats.tsx      # 통계 표시 컴포넌트
└── index.ts               # 컴포넌트 export
```

## 데이터 모델

### ReferenceData
```typescript
interface ReferenceData {
  id: number;                    // 고유 식별자
  projectName: string;           // 사업명
  projectType: string;           // 사업유형
  bidNtceNo?: string;            // 연계 공고번호
  organization: string;          // 참여기관
  participationYear: number;     // 참여연도
  contractAmount: number;        // 계약금액
  status: 'success' | 'failure' | 'ongoing'; // 성과상태
  score: 'A' | 'B' | 'C' | 'D'; // 평가등급
  files?: ReferenceFile[];       // 첨부파일 정보
  description?: string;          // 사업 설명
  createdBy: number;             // 등록자 ID
  createdAt: string;             // 생성 시간
  updatedAt: string;             // 수정 시간
}
```

### ReferenceStats
```typescript
interface ReferenceStats {
  totalCount: number;            // 전체 레퍼런스 수
  successCount: number;          // 성공 사례 수
  failureCount: number;          // 실패 사례 수
  ongoingCount: number;          // 진행중 사례 수
  totalAmount: number;           // 총 계약금액
  averageScore: string;          // 평균 평가등급
  yearlyStats: Array<{           // 연도별 통계
    year: number;
    count: number;
    amount: number;
  }>;
  typeStats: Array<{             // 사업유형별 통계
    type: string;
    count: number;
    successRate: number;
  }>;
}
```

## API 엔드포인트

### 레퍼런스 관리
- `GET /api/references` - 레퍼런스 목록 조회
- `POST /api/references` - 레퍼런스 등록
- `PUT /api/references/:id` - 레퍼런스 수정
- `DELETE /api/references/:id` - 레퍼런스 삭제
- `GET /api/references/:id` - 레퍼런스 상세 조회

### 통계 및 분석
- `GET /api/references/stats` - 레퍼런스 통계 조회
- `GET /api/references/:id/match` - 유사 공고 매칭

### 파일 관리
- `POST /api/upload` - 파일 업로드

## 사용 방법

### 1. 레퍼런스 목록 보기
1. 메인 화면에서 레퍼런스 목록을 확인
2. 검색어 입력으로 특정 사업 검색
3. 필터 옵션으로 원하는 조건 설정
4. 정렬 기준 선택으로 데이터 정렬

### 2. 새 레퍼런스 등록
1. "새 레퍼런스 등록" 버튼 클릭
2. 필수 정보 입력 (사업명, 사업유형, 참여기관, 참여연도, 계약금액)
3. 선택 정보 입력 (공고번호, 사업 설명)
4. 첨부파일 업로드 (선택사항)
5. "등록" 버튼 클릭

### 3. 레퍼런스 수정
1. 목록에서 "수정" 버튼 클릭
2. 수정할 정보 변경
3. "수정" 버튼 클릭

### 4. 레퍼런스 상세 보기
1. 목록에서 "상세" 버튼 클릭
2. 모든 레퍼런스 정보 확인
3. 첨부파일 다운로드
4. 유사 공고 매칭 기능 활용

### 5. 통계 보기
1. "통계 보기" 버튼 클릭
2. KPI 대시보드 확인
3. 연도별, 사업유형별 통계 분석
4. 성과 요약 및 상태별 분포 확인

## 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```

### 3. 빌드
```bash
npm run build
```

## 환경 변수

### .env 파일 설정
```
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

## 주요 특징

### 1. 반응형 디자인
- 모바일, 태블릿, 데스크톱 모든 디바이스 지원
- Tailwind CSS를 활용한 모던한 UI/UX

### 2. 타입 안정성
- TypeScript를 통한 컴파일 타임 타입 검증
- 인터페이스 정의로 데이터 구조 명확화

### 3. 에러 처리
- API 호출 실패 시 적절한 에러 메시지 표시
- Mock 데이터를 통한 개발 환경 지원

### 4. 성능 최적화
- 컴포넌트 분리로 불필요한 리렌더링 방지
- 페이징을 통한 대량 데이터 처리

### 5. 확장성
- 모듈화된 컴포넌트 구조
- 재사용 가능한 UI 컴포넌트
- API 서비스 레이어 분리

## 향후 개선 계획

### 1. 고급 기능
- [ ] AI 기반 유사 공고 매칭 알고리즘 구현
- [ ] 레퍼런스 템플릿 기능
- [ ] 대량 업로드 기능
- [ ] 엑셀 내보내기/가져오기

### 2. UI/UX 개선
- [ ] 드래그 앤 드롭 파일 업로드
- [ ] 실시간 검색 기능
- [ ] 차트 및 그래프 시각화 개선
- [ ] 다크 모드 지원

### 3. 성능 최적화
- [ ] 가상 스크롤링 구현
- [ ] 이미지 최적화
- [ ] 캐싱 전략 구현
- [ ] 코드 스플리팅

## 문제 해결

### 1. API 연결 문제
- 환경 변수 `REACT_APP_API_BASE_URL` 확인
- 네트워크 연결 상태 확인
- CORS 설정 확인

### 2. 파일 업로드 문제
- 파일 크기 제한 확인
- 지원 파일 형식 확인
- 서버 스토리지 설정 확인

### 3. 성능 문제
- 브라우저 개발자 도구로 성능 분석
- 컴포넌트 리렌더링 최적화
- API 응답 시간 확인

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
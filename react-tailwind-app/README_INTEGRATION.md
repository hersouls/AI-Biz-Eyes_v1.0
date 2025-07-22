# 외부 시스템 연동 (Integration/External Systems)

B2G(Business to Government) 공모사업 자동화 관리 시스템의 외부 시스템 연동 기능입니다. 나라장터 OpenAPI, ERP, 그룹웨어, Google Sheets 등 다양한 외부 서비스와의 데이터·알림·계정 연동을 통해 업무 효율과 자동화를 극대화합니다.

## 🎯 핵심 목적

- **나라장터 OpenAPI, ERP, 그룹웨어, Google Sheets, Slack/알림툴 등** 다양한 외부 서비스와의 데이터·알림·계정 연동
- "업무 효율/자동화/확장성" 극대화
- 실시간 데이터 동기화 및 모니터링

## 🚀 주요 기능

### 1. 연동 현황 대시보드
- **통계 카드**: 전체 시스템, 활성 시스템, 오류 시스템, 성공률
- **연동 시스템 현황**: 시스템별 상태 및 동기화 주기 표시
- **최근 연동 로그**: 실시간 연동 이력 및 오류 현황

### 2. 연동 시스템 관리
- **시스템 등록/수정/삭제**: OpenAPI, Excel, ERP, 그룹웨어, 메신저, Google Sheets
- **API 키/URL 관리**: 인증키, 요청 URL, 연동상태/유효기간 관리
- **동기화 주기 설정**: 5분~1일 단위 자동 동기화 또는 수동 동기화
- **연동 테스트**: 실시간 연동 상태 확인 및 오류 진단

### 3. 연동 로그 관리
- **로그 조회**: 시스템별, 타입별(성공/오류/경고) 필터링
- **상세 정보**: 소요시간, 데이터 건수, 오류 코드 표시
- **페이지네이션**: 대용량 로그 데이터 효율적 관리

### 4. 필드 매핑 관리
- **내부↔외부 필드 매핑**: 1:1 필드 연계 설정
- **필수/선택 필드 구분**: 데이터 무결성 보장
- **시스템별 매핑 관리**: 연동 시스템별 독립적 필드 매핑

## 📋 지원 연동 시스템

| 시스템 유형 | 설명 | 주요 기능 |
|------------|------|-----------|
| **OpenAPI** | 나라장터 OpenAPI | 공고 데이터 실시간 수집 |
| **Excel** | Excel 파일 연동 | 데이터 내보내기/가져오기 |
| **ERP** | ERP 시스템 연동 | 프로젝트/예산/성과 데이터 |
| **Groupware** | 그룹웨어 연동 | 전자결재/업무 프로세스 |
| **Messenger** | 메신저 연동 | Slack, 카카오톡 알림 |
| **GoogleSheets** | Google Sheets 연동 | 실시간 스프레드시트 동기화 |

## 🛠 기술 스택

### Backend
- **Node.js + Express**: RESTful API 서버
- **TypeScript**: 타입 안정성
- **Prisma ORM**: 데이터베이스 관리
- **JWT**: 인증/인가

### Frontend
- **React + TypeScript**: 사용자 인터페이스
- **Tailwind CSS**: 스타일링
- **Heroicons**: 아이콘 라이브러리
- **React Router**: 페이지 라우팅

## 📁 프로젝트 구조

```
src/
├── types/
│   └── integration.ts          # 연동 관련 타입 정의
├── controllers/
│   └── integrationController.ts # 연동 API 컨트롤러
├── routes/
│   └── integration.ts          # 연동 API 라우터
└── components/integration/
    ├── IntegrationPage.tsx     # 메인 연동 페이지
    ├── IntegrationDashboard.tsx # 연동 현황 대시보드
    ├── IntegrationSystemList.tsx # 연동 시스템 관리
    ├── IntegrationSystemForm.tsx # 연동 시스템 폼
    ├── IntegrationLogs.tsx     # 연동 로그 관리
    └── FieldMappingList.tsx    # 필드 매핑 관리
```

## 🔧 API 엔드포인트

### 연동 통계
- `GET /api/integration/stats` - 연동 통계 조회

### 연동 시스템 관리
- `GET /api/integration/systems` - 연동 시스템 목록 조회
- `GET /api/integration/systems/:id` - 연동 시스템 상세 조회
- `POST /api/integration/systems` - 연동 시스템 생성
- `PUT /api/integration/systems/:id` - 연동 시스템 수정
- `DELETE /api/integration/systems/:id` - 연동 시스템 삭제
- `POST /api/integration/systems/:id/test` - 연동 시스템 테스트

### 연동 로그
- `GET /api/integration/logs` - 연동 로그 조회 (필터링/페이지네이션)

### 필드 매핑
- `GET /api/integration/mappings` - 필드 매핑 목록 조회
- `POST /api/integration/mappings` - 필드 매핑 생성

## 🎨 UI/UX 특징

### 1. 직관적인 대시보드
- **KPI 카드**: 주요 지표를 한눈에 확인
- **실시간 상태**: 시스템별 연동 상태 시각화
- **알림 시스템**: 오류 발생 시 즉시 알림

### 2. 사용자 친화적 관리 인터페이스
- **탭 기반 네비게이션**: 기능별 명확한 구분
- **모달 폼**: 시스템 등록/수정 시 깔끔한 인터페이스
- **실시간 검증**: 입력 데이터 유효성 검사

### 3. 강력한 필터링 및 검색
- **다중 필터**: 시스템, 타입, 기간별 필터링
- **페이지네이션**: 대용량 데이터 효율적 처리
- **정렬 기능**: 최신순, 오류순 등 다양한 정렬

## 🔒 보안 고려사항

### 1. API 키 관리
- **환경변수**: 민감한 API 키 환경변수로 관리
- **암호화 저장**: 데이터베이스 저장 시 암호화
- **접근 제한**: 권한별 API 접근 제한

### 2. 데이터 보안
- **HTTPS 강제**: 모든 API 통신 암호화
- **입력 검증**: SQL Injection, XSS 방지
- **로깅**: 모든 연동 이력 기록 및 모니터링

## 📊 데이터 모델

### IntegrationSystem
```typescript
interface IntegrationSystem {
  id: string;
  name: string;
  type: 'OpenAPI' | 'Excel' | 'ERP' | 'Groupware' | 'Messenger' | 'GoogleSheets';
  status: 'active' | 'inactive' | 'error';
  apiKey?: string;
  url?: string;
  syncInterval: string;
  lastSyncAt?: Date;
  lastErrorAt?: Date;
  errorCode?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### IntegrationLog
```typescript
interface IntegrationLog {
  id: string;
  systemId: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  errorCode?: string;
  dataCount?: number;
  duration?: number;
  createdAt: Date;
}
```

### FieldMapping
```typescript
interface FieldMapping {
  id: string;
  systemId: string;
  internalField: string;
  externalField: string;
  description?: string;
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 사용 방법

### 1. 연동 시스템 등록
1. **시스템 관리** 탭으로 이동
2. **새 연동 시스템** 버튼 클릭
3. 시스템명, 유형, API URL, 키 입력
4. 동기화 주기 설정 후 저장

### 2. 연동 테스트
1. 등록된 시스템의 **테스트** 버튼 클릭
2. 연동 상태 및 응답 시간 확인
3. 오류 발생 시 로그에서 상세 내용 확인

### 3. 필드 매핑 설정
1. **필드 매핑** 탭으로 이동
2. 연동 시스템 선택
3. 내부 필드와 외부 필드 매핑 설정
4. 필수 필드 여부 지정

### 4. 로그 모니터링
1. **연동 로그** 탭에서 실시간 로그 확인
2. 시스템별, 타입별 필터링
3. 오류 발생 시 즉시 대응

## 🔧 개발 환경 설정

### 1. 백엔드 실행
```bash
cd src
npm install
npm run dev
```

### 2. 프론트엔드 실행
```bash
cd react-tailwind-app
npm install
npm start
```

### 3. 환경변수 설정
```bash
# .env
PORT=3001
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
```

## 📈 향후 개발 계획

### 1. 추가 연동 시스템
- **Slack Webhook**: 실시간 알림 연동
- **Microsoft Teams**: 팀 협업 도구 연동
- **Zapier**: 워크플로우 자동화 연동

### 2. 고급 기능
- **스케줄러**: 복잡한 동기화 스케줄링
- **데이터 변환**: 필드 매핑 외 데이터 변환 규칙
- **웹훅**: 외부 시스템에서 내부 시스템으로 데이터 전송

### 3. 모니터링 강화
- **대시보드 위젯**: 커스터마이징 가능한 대시보드
- **알림 설정**: 이메일, SMS, 푸시 알림
- **성능 분석**: 연동 성능 통계 및 최적화

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**문서 버전**: 1.0  
**최종 업데이트**: 2024년 1월 15일  
**작성자**: 개발팀
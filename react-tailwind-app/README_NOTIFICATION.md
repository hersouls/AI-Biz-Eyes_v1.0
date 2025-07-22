# 알림 & 리포트 기능

AI Biz Eyes 공모사업 자동화 관리 웹서비스의 알림 및 리포트 기능입니다.

## 📋 목차

- [기능 개요](#기능-개요)
- [주요 기능](#주요-기능)
- [컴포넌트 구조](#컴포넌트-구조)
- [API 명세](#api-명세)
- [데이터베이스 스키마](#데이터베이스-스키마)
- [설치 및 실행](#설치-및-실행)
- [사용법](#사용법)

## 🎯 기능 개요

알림 & 리포트 기능은 다음과 같은 목적을 제공합니다:

- **실시간 알림**: 신규공고, 긴급/마감임박, 누락/중복 등 실시간 업무 알림
- **주기적 리포트**: 일간/주간/월간 리포트를 통한 현황 분석
- **개인화 설정**: 사용자별 알림 유형, 채널, 주기 설정
- **상태 관리**: 알림 읽음/중요/완료 상태 관리 및 일괄 처리

## 🚀 주요 기능

### 1. 알림 관리

#### 알림 유형
- **긴급 (urgent)**: 즉시 조치가 필요한 중요한 공고
- **마감임박 (deadline)**: 마감일이 3일 이내인 공고
- **누락 (missing)**: 처리되지 않은 공고
- **중복 (duplicate)**: 유사한 공고가 이미 존재
- **신규 (new)**: 새로 등록된 공고
- **업데이트 (update)**: 기존 공고 정보 변경

#### 알림 상태
- **미읽음 (unread)**: 아직 읽지 않은 알림
- **읽음 (read)**: 읽은 알림
- **중요 (important)**: 중요 표시된 알림
- **완료 (completed)**: 처리 완료된 알림

#### 우선순위
- **긴급 (urgent)**: 최우선 처리 필요
- **높음 (high)**: 높은 우선순위
- **보통 (normal)**: 일반적인 우선순위
- **낮음 (low)**: 낮은 우선순위

### 2. 리포트 기능

#### 리포트 유형
- **일간 리포트**: 하루 동안의 공고 현황
- **주간 리포트**: 일주일 동안의 공고 현황
- **월간 리포트**: 한 달 동안의 공고 현황

#### 리포트 내용
- **요약 통계**: 신규/마감/누락/중복 공고 수, 성공률
- **차트 데이터**: 공고 유형 분포, 상태 분포, 주간 트렌드
- **다운로드**: PDF, Excel, CSV 형식 지원

### 3. 알림 설정

#### 알림 채널
- **이메일 알림**: 이메일을 통한 알림 수신
- **웹 알림**: 웹 브라우저 내 알림
- **푸시 알림**: 브라우저 푸시 알림

#### 설정 옵션
- **알림 유형별 ON/OFF**: 각 알림 유형별 수신 여부
- **알림 주기**: 즉시/일간/주간 수신 주기
- **개인화**: 사용자별 맞춤 설정

## 🏗️ 컴포넌트 구조

```
src/components/Notification/
├── NotificationList.tsx      # 알림 목록 컴포넌트
├── ReportList.tsx           # 리포트 목록 컴포넌트
├── NotificationSettings.tsx # 알림 설정 컴포넌트
├── NotificationDetail.tsx   # 알림 상세 모달
├── ReportDetail.tsx         # 리포트 상세 모달
├── NotificationPage.tsx     # 메인 알림/리포트 페이지
└── index.ts                 # 컴포넌트 export
```

### 컴포넌트 설명

#### NotificationList
- 알림 목록 표시 및 필터링
- 알림 상태 변경 (읽음/중요/완료)
- 일괄 처리 기능
- 페이지네이션

#### ReportList
- 리포트 목록 표시
- 새 리포트 생성
- 리포트 다운로드 (PDF/Excel/CSV)
- 리포트 유형별 필터링

#### NotificationSettings
- 이메일/웹/푸시 알림 설정
- 알림 유형별 ON/OFF
- 알림 주기 설정
- 설정 저장/불러오기

#### NotificationDetail
- 알림 상세 정보 표시
- 알림 상태 변경
- 관련 공고 링크

#### ReportDetail
- 리포트 상세 정보 표시
- 통계 데이터 시각화
- 다운로드 옵션

## 🔌 API 명세

### 알림 API

#### GET /api/notifications
알림 목록 조회

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `type` (string): 알림 유형
- `status` (string): 읽음 상태
- `priority` (string): 우선순위
- `startDate` (string): 시작일
- `endDate` (string): 종료일

#### PUT /api/notifications/:id
알림 상태 변경

**Request Body:**
```json
{
  "status": "read"
}
```

#### PUT /api/notifications/bulk
알림 일괄 처리

**Request Body:**
```json
{
  "ids": [1, 2, 3],
  "status": "read"
}
```

#### GET /api/notifications/stats
알림 통계 조회

#### GET /api/notifications/settings
알림 설정 조회

#### POST /api/notifications/settings
알림 설정 저장

**Request Body:**
```json
{
  "settings": {
    "emailNotifications": {
      "enabled": true,
      "types": ["urgent", "deadline"],
      "frequency": "immediate"
    },
    "webNotifications": {
      "enabled": true,
      "types": ["urgent", "deadline", "missing", "duplicate"]
    },
    "pushNotifications": {
      "enabled": false
    }
  }
}
```

### 리포트 API

#### GET /api/reports
리포트 목록 조회

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `type` (string): 리포트 유형

#### POST /api/reports/generate
리포트 생성

**Request Body:**
```json
{
  "type": "daily",
  "startDate": "2024-07-22",
  "endDate": "2024-07-22"
}
```

#### GET /api/reports/:id/download
리포트 다운로드

**Query Parameters:**
- `format` (string): 다운로드 형식 (pdf/excel/csv)

## 🗄️ 데이터베이스 스키마

### notifications 테이블
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('urgent', 'deadline', 'missing', 'duplicate', 'new', 'update')),
    bid_ntce_no VARCHAR(50) REFERENCES bids(bid_ntce_no),
    title VARCHAR(500) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'important', 'completed')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_to INTEGER REFERENCES users(id),
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### reports 테이블
```sql
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
    title VARCHAR(500) NOT NULL,
    summary JSONB NOT NULL,
    charts JSONB NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    generated_by INTEGER REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### user_notification_settings 테이블
```sql
CREATE TABLE user_notification_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    settings JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ 설치 및 실행

### 1. 의존성 설치
```bash
cd react-tailwind-app
npm install
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
REACT_APP_API_URL=https://bizeyes.moonwave.kr/api
```

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 백엔드 서버 실행
```bash
cd ../src
npm run dev
```

## 📖 사용법

### 알림 관리

1. **알림 목록 확인**
   - 알림 탭에서 모든 알림을 확인할 수 있습니다
   - 필터를 사용하여 특정 유형/상태/우선순위의 알림만 표시

2. **알림 상태 변경**
   - 개별 알림의 "읽음 처리", "중요 표시", "완료 처리" 버튼 클릭
   - 체크박스로 여러 알림 선택 후 일괄 처리

3. **알림 상세 보기**
   - 알림 클릭 시 상세 모달에서 자세한 정보 확인
   - 관련 공고로 바로 이동 가능

### 리포트 생성

1. **리포트 생성**
   - 리포트 탭에서 "새 리포트 생성" 버튼 클릭
   - 리포트 유형(일간/주간/월간) 선택
   - 시작일과 종료일 설정

2. **리포트 다운로드**
   - 리포트 목록에서 PDF/Excel/CSV 다운로드 버튼 클릭
   - 리포트 상세에서도 다운로드 가능

### 알림 설정

1. **설정 탭으로 이동**
   - 알림 & 리포트 페이지의 설정 탭 클릭

2. **채널별 설정**
   - 이메일/웹/푸시 알림 활성화 여부 설정
   - 각 채널별 알림 유형 선택

3. **설정 저장**
   - "설정 저장" 버튼 클릭하여 변경사항 저장

## 🔧 개발 가이드

### 새로운 알림 유형 추가

1. **타입 정의 수정**
   ```typescript
   // src/types/notification.ts
   export interface Notification {
     type: 'urgent' | 'deadline' | 'missing' | 'duplicate' | 'new' | 'update' | 'custom';
     // ...
   }
   ```

2. **데이터베이스 스키마 수정**
   ```sql
   ALTER TABLE notifications 
   DROP CONSTRAINT notifications_type_check;
   
   ALTER TABLE notifications 
   ADD CONSTRAINT notifications_type_check 
   CHECK (type IN ('urgent', 'deadline', 'missing', 'duplicate', 'new', 'update', 'custom'));
   ```

3. **컴포넌트 업데이트**
   - NotificationList.tsx의 getNotificationIcon 함수에 새 아이콘 추가
   - NotificationSettings.tsx의 알림 유형 옵션에 추가

### 새로운 리포트 유형 추가

1. **타입 정의 수정**
   ```typescript
   // src/types/notification.ts
   export interface Report {
     type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
     // ...
   }
   ```

2. **API 로직 수정**
   - src/routes/reports.ts의 generateReportData 함수에 새 로직 추가

3. **UI 업데이트**
   - ReportList.tsx의 리포트 유형 옵션에 추가

## 🐛 문제 해결

### 일반적인 문제

1. **알림이 표시되지 않는 경우**
   - 브라우저 알림 권한 확인
   - 알림 설정에서 해당 유형이 활성화되어 있는지 확인

2. **리포트 생성이 실패하는 경우**
   - 날짜 형식이 올바른지 확인 (YYYY-MM-DD)
   - 시작일이 종료일보다 이전인지 확인

3. **API 연결 오류**
   - 백엔드 서버가 실행 중인지 확인
   - 환경 변수 REACT_APP_API_URL이 올바르게 설정되었는지 확인

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.
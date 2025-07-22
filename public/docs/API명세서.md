# AI Biz Eyes 공모사업 자동화 관리 웹서비스 API 명세서

## 1. API 개요

### 1.1 기본 정보
- **Base URL**: `https://api.ai-biz-eyes.com/v1`
- **Content-Type**: `application/json`
- **인코딩**: UTF-8
- **인증 방식**: JWT Bearer Token

### 1.2 응답 형식
```json
{
  "success": true,
  "data": {},
  "message": "성공적으로 처리되었습니다.",
  "timestamp": "2024-07-22T10:30:00Z"
}
```

### 1.3 에러 응답 형식
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "필수 필드가 누락되었습니다.",
    "details": {
      "field": "email",
      "reason": "이메일 형식이 올바르지 않습니다."
    }
  },
  "timestamp": "2024-07-22T10:30:00Z"
}
```

### 1.4 HTTP 상태 코드
- `200`: 성공
- `201`: 생성됨
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 리소스 없음
- `422`: 유효성 검증 실패
- `500`: 서버 오류

## 2. 인증 API

### 2.1 로그인
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동",
      "organization": "테크컴퍼니",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  },
  "message": "로그인에 성공했습니다."
}
```

### 2.2 로그아웃
```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

### 2.3 토큰 갱신
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token_here",
    "refreshToken": "new_refresh_token_here"
  },
  "message": "토큰이 갱신되었습니다."
}
```

### 2.4 내 정보 조회
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "organization": "테크컴퍼니",
    "role": "user",
    "isActive": true,
    "lastLogin": "2024-07-22T10:30:00Z",
    "createdAt": "2024-07-01T00:00:00Z"
  }
}
```

## 3. 공고 API

### 3.1 공고 목록 조회
```http
GET /bids
```

**Query Parameters:**
- `page` (number): 페이지 번호 (기본값: 1)
- `limit` (number): 페이지당 항목 수 (기본값: 20, 최대: 100)
- `search` (string): 검색어 (공고명, 기관명)
- `status` (string): 공고 상태 (일반공고, 긴급공고, 정정공고 등)
- `type` (string): 업무구분 (공사, 용역, 물품)
- `institution` (string): 기관명
- `startDate` (string): 시작일 (YYYY-MM-DD)
- `endDate` (string): 종료일 (YYYY-MM-DD)
- `minBudget` (number): 최소 예산
- `maxBudget` (number): 최대 예산
- `sortBy` (string): 정렬 기준 (createdAt, bidNtceDate, bidClseDate, asignBdgtAmt)
- `sortOrder` (string): 정렬 순서 (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "bids": [
      {
        "id": 1,
        "bidNtceNo": "20240100001",
        "bidNtceNm": "스마트공장 구축 사업",
        "ntceInsttNm": "조달청",
        "dmndInsttNm": "한국산업기술진흥원",
        "bsnsDivNm": "용역",
        "bidNtceSttusNm": "일반공고",
        "asignBdgtAmt": 500000000,
        "presmptPrce": 450000000,
        "bidNtceDate": "2024-07-22",
        "bidClseDate": "2024-08-22",
        "bidNtceUrl": "https://www.g2b.go.kr/...",
        "createdAt": "2024-07-22T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### 3.2 공고 상세 조회
```http
GET /bids/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bidNtceNo": "20240100001",
    "bidNtceNm": "스마트공장 구축 사업",
    "ntceInsttNm": "조달청",
    "dmndInsttNm": "한국산업기술진흥원",
    "bsnsDivNm": "용역",
    "bidNtceSttusNm": "일반공고",
    "asignBdgtAmt": 500000000,
    "presmptPrce": 450000000,
    "bidNtceDate": "2024-07-22",
    "bidClseDate": "2024-08-22",
    "bidNtceBgn": "10:00",
    "bidClseTm": "18:00",
    "opengDate": "2024-08-23",
    "opengTm": "14:00",
    "opengPlce": "조달청 본관",
    "bidNtceUrl": "https://www.g2b.go.kr/...",
    "elctrnBidYn": "Y",
    "intrntnlBidYn": "N",
    "cmmnCntrctYn": "N",
    "rgnLmtYn": "Y",
    "prtcptPsblRgnNm": "서울특별시",
    "indstrytyLmtYn": "Y",
    "bidprcPsblIndstrytyNm": "정보처리서비스업",
    "presnatnOprtnYn": "Y",
    "presnatnOprtnDate": "2024-07-30",
    "presnatnOprtnTm": "14:00",
    "presnatnOprtnPlce": "조달청 세미나실",
    "ntceInsttOfclDeptNm": "조달정책과",
    "ntceInsttOfclNm": "김담당",
    "ntceInsttOfclTel": "02-1234-5678",
    "ntceInsttOfclEmailAdrs": "kim@g2b.go.kr",
    "dmndInsttOfclDeptNm": "사업기획팀",
    "dmndInsttOfclNm": "이담당",
    "dmndInsttOfclTel": "02-2345-6789",
    "dmndInsttOfclEmailAdrs": "lee@kiat.or.kr",
    "createdAt": "2024-07-22T10:30:00Z",
    "updatedAt": "2024-07-22T10:30:00Z"
  }
}
```

### 3.3 공고 동기화
```http
POST /bids/sync
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "startDate": "2024-07-22",
  "endDate": "2024-07-22",
  "force": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProcessed": 150,
    "newBids": 25,
    "updatedBids": 10,
    "errors": 0,
    "executionTime": 45.2
  },
  "message": "공고 동기화가 완료되었습니다."
}
```

### 3.4 공고 통계
```http
GET /bids/statistics
```

**Query Parameters:**
- `period` (string): 기간 (today, week, month, year)
- `startDate` (string): 시작일
- `endDate` (string): 종료일

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBids": 1250,
    "newBids": 45,
    "urgentBids": 12,
    "deadlineBids": 8,
    "byType": {
      "construction": 450,
      "service": 600,
      "goods": 200
    },
    "byStatus": {
      "normal": 1000,
      "urgent": 150,
      "correction": 100
    },
    "byInstitution": {
      "조달청": 300,
      "한국산업기술진흥원": 200,
      "중소기업진흥공단": 150
    },
    "budgetRange": {
      "under100M": 400,
      "100M-500M": 500,
      "500M-1B": 250,
      "over1B": 100
    }
  }
}
```

## 4. 레퍼런스 API

### 4.1 레퍼런스 목록 조회
```http
GET /references
```

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `search` (string): 검색어 (사업명)
- `type` (string): 사업유형
- `status` (string): 성과상태 (success, failure, ongoing)
- `year` (number): 참여연도
- `organization` (string): 참여기관
- `sortBy` (string): 정렬 기준
- `sortOrder` (string): 정렬 순서

**Response:**
```json
{
  "success": true,
  "data": {
    "references": [
      {
        "id": 1,
        "projectName": "스마트공장 구축 사업",
        "projectType": "용역",
        "bidNtceNo": "20230100001",
        "organization": "한국산업기술진흥원",
        "participationYear": 2023,
        "contractAmount": 500000000,
        "status": "success",
        "score": "A",
        "createdBy": 1,
        "createdAt": "2024-07-22T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### 4.2 레퍼런스 등록
```http
POST /references
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "projectName": "스마트공장 구축 사업",
  "projectType": "용역",
  "bidNtceNo": "20230100001",
  "organization": "한국산업기술진흥원",
  "participationYear": 2023,
  "contractAmount": 500000000,
  "status": "success",
  "score": "A",
  "description": "스마트공장 구축을 위한 종합 용역 사업",
  "files": [
    {
      "name": "사업완료보고서.pdf",
      "url": "https://s3.amazonaws.com/...",
      "size": 2048576
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "projectName": "스마트공장 구축 사업",
    "createdAt": "2024-07-22T10:30:00Z"
  },
  "message": "레퍼런스가 등록되었습니다."
}
```

### 4.3 레퍼런스 수정
```http
PUT /references/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "projectName": "스마트공장 구축 사업 (수정)",
  "contractAmount": 550000000,
  "status": "success",
  "score": "A+"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "updatedAt": "2024-07-22T10:30:00Z"
  },
  "message": "레퍼런스가 수정되었습니다."
}
```

### 4.4 레퍼런스 삭제
```http
DELETE /references/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "레퍼런스가 삭제되었습니다."
}
```

### 4.5 유사 공고 매칭
```http
GET /references/match
```

**Query Parameters:**
- `bidNtceNo` (string): 공고번호
- `limit` (number): 매칭 결과 수 (기본값: 5)

**Response:**
```json
{
  "success": true,
  "data": {
    "targetBid": {
      "bidNtceNo": "20240100001",
      "bidNtceNm": "스마트공장 구축 사업"
    },
    "matches": [
      {
        "referenceId": 1,
        "projectName": "스마트공장 구축 사업",
        "similarityScore": 0.95,
        "matchReason": "사업명 유사도 높음",
        "contractAmount": 500000000,
        "status": "success"
      },
      {
        "referenceId": 2,
        "projectName": "제조업 디지털화 사업",
        "similarityScore": 0.78,
        "matchReason": "업종 및 예산 범위 유사",
        "contractAmount": 450000000,
        "status": "success"
      }
    ]
  }
}
```

## 5. 알림 API

### 5.1 알림 목록 조회
```http
GET /notifications
```

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `type` (string): 알림 유형
- `status` (string): 읽음 상태
- `priority` (string): 우선순위
- `startDate` (string): 시작일
- `endDate` (string): 종료일

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "deadline",
        "bidNtceNo": "20240100001",
        "title": "마감임박 공고 알림",
        "message": "공고 \"스마트공장 구축 사업\"의 마감일이 2024-08-22입니다.",
        "status": "unread",
        "priority": "high",
        "assignedTo": 1,
        "createdAt": "2024-07-22T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

### 5.2 알림 상태 변경
```http
PUT /notifications/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "read"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "read",
    "readAt": "2024-07-22T10:30:00Z"
  },
  "message": "알림 상태가 변경되었습니다."
}
```

### 5.3 알림 설정
```http
POST /notifications/settings
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "emailNotifications": {
    "enabled": true,
    "types": ["urgent", "deadline", "new"],
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
```

**Response:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "emailNotifications": {
        "enabled": true,
        "types": ["urgent", "deadline", "new"],
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
  },
  "message": "알림 설정이 저장되었습니다."
}
```

## 6. 관리자 API

### 6.1 사용자 목록 조회
```http
GET /admin/users
```

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `search` (string): 검색어 (이름, 이메일)
- `role` (string): 권한 등급
- `isActive` (boolean): 활성화 상태
- `organization` (string): 소속 조직

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "name": "홍길동",
        "organization": "테크컴퍼니",
        "role": "user",
        "isActive": true,
        "lastLogin": "2024-07-22T10:30:00Z",
        "createdAt": "2024-07-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1
    }
  }
}
```

### 6.2 사용자 등록
```http
POST /admin/users
```

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "김신규",
  "organization": "테크컴퍼니",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "newuser@example.com",
    "name": "김신규",
    "createdAt": "2024-07-22T10:30:00Z"
  },
  "message": "사용자가 등록되었습니다."
}
```

### 6.3 사용자 수정
```http
PUT /admin/users/{id}
```

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "김신규 (수정)",
  "organization": "테크컴퍼니 (개발팀)",
  "role": "admin",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "updatedAt": "2024-07-22T10:30:00Z"
  },
  "message": "사용자 정보가 수정되었습니다."
}
```

### 6.4 시스템 로그 조회
```http
GET /admin/logs
```

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `level` (string): 로그 레벨
- `category` (string): 로그 카테고리
- `userId` (number): 사용자 ID
- `startDate` (string): 시작일
- `endDate` (string): 종료일

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "level": "info",
        "category": "user_activity",
        "message": "사용자 로그인",
        "details": {
          "userId": 1,
          "ipAddress": "192.168.1.100"
        },
        "userId": 1,
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2024-07-22T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1000,
      "totalPages": 50
    }
  }
}
```

### 6.5 시스템 통계
```http
GET /admin/statistics
```

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `period` (string): 기간 (today, week, month, year)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 15,
      "active": 12,
      "newThisMonth": 3
    },
    "bids": {
      "total": 1250,
      "newToday": 45,
      "syncSuccess": 98.5
    },
    "notifications": {
      "total": 250,
      "unread": 15,
      "urgent": 5
    },
    "system": {
      "uptime": "99.9%",
      "lastBackup": "2024-07-22T02:00:00Z",
      "diskUsage": "65%",
      "memoryUsage": "45%"
    }
  }
}
```

## 7. 파일 업로드 API

### 7.1 파일 업로드
```http
POST /files/upload
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary file data]
category: reference
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "document.pdf",
            "url": "https://s3.amazonaws.com/ai-biz-eyes-files/...",
    "size": 2048576,
    "mimeType": "application/pdf",
    "category": "reference",
    "uploadedAt": "2024-07-22T10:30:00Z"
  },
  "message": "파일이 업로드되었습니다."
}
```

### 7.2 파일 다운로드
```http
GET /files/{id}/download
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```
[Binary file data with appropriate headers]
```

## 8. 웹훅 API

### 8.1 웹훅 등록
```http
POST /webhooks
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["bid.created", "notification.sent"],
  "secret": "webhook_secret_key"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "url": "https://your-domain.com/webhook",
    "events": ["bid.created", "notification.sent"],
    "isActive": true,
    "createdAt": "2024-07-22T10:30:00Z"
  },
  "message": "웹훅이 등록되었습니다."
}
```

### 8.2 웹훅 목록 조회
```http
GET /webhooks
```

**Response:**
```json
{
  "success": true,
  "data": {
    "webhooks": [
      {
        "id": 1,
        "url": "https://your-domain.com/webhook",
        "events": ["bid.created", "notification.sent"],
        "isActive": true,
        "lastTriggered": "2024-07-22T10:30:00Z",
        "createdAt": "2024-07-22T10:30:00Z"
      }
    ]
  }
}
```

## 9. 에러 코드

### 9.1 인증 관련 에러
- `AUTH_INVALID_CREDENTIALS`: 잘못된 로그인 정보
- `AUTH_TOKEN_EXPIRED`: 토큰 만료
- `AUTH_TOKEN_INVALID`: 유효하지 않은 토큰
- `AUTH_INSUFFICIENT_PERMISSIONS`: 권한 부족

### 9.2 유효성 검증 에러
- `VALIDATION_ERROR`: 유효성 검증 실패
- `VALIDATION_REQUIRED_FIELD`: 필수 필드 누락
- `VALIDATION_INVALID_FORMAT`: 잘못된 형식
- `VALIDATION_DUPLICATE_EMAIL`: 중복된 이메일

### 9.3 리소스 관련 에러
- `RESOURCE_NOT_FOUND`: 리소스를 찾을 수 없음
- `RESOURCE_ALREADY_EXISTS`: 이미 존재하는 리소스
- `RESOURCE_DELETED`: 삭제된 리소스

### 9.4 시스템 에러
- `INTERNAL_SERVER_ERROR`: 내부 서버 오류
- `EXTERNAL_API_ERROR`: 외부 API 오류
- `DATABASE_ERROR`: 데이터베이스 오류
- `FILE_UPLOAD_ERROR`: 파일 업로드 오류

---

**문서 버전**: 1.0  
**작성일**: 2024년 7월 22일  
**작성자**: 개발팀
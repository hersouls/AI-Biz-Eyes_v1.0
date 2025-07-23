# AI Biz Eyes API 상세 문서

## 📋 목차
1. [API 개요](#1-api-개요)
2. [인증 API](#2-인증-api)
3. [공고 API](#3-공고-api)
4. [레퍼런스 API](#4-레퍼런스-api)
5. [알림 API](#5-알림-api)
6. [관리자 API](#6-관리자-api)
7. [파일 API](#7-파일-api)
8. [웹훅 API](#8-웹훅-api)
9. [에러 처리](#9-에러-처리)
10. [테스트 가이드](#10-테스트-가이드)

---

## 1. API 개요

### 1.1 기본 정보
- **Base URL**: `https://api.ai-biz-eyes.com/v1`
- **Content-Type**: `application/json`
- **인코딩**: UTF-8
- **인증 방식**: JWT Bearer Token
- **API 버전**: v1.0.0

### 1.2 응답 형식

#### 성공 응답
```json
{
  "success": true,
  "data": {},
  "message": "성공적으로 처리되었습니다.",
  "timestamp": "2024-07-22T10:30:00Z"
}
```

#### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": {
      "field": "email",
      "reason": "이메일 형식이 올바르지 않습니다."
    }
  },
  "timestamp": "2024-07-22T10:30:00Z"
}
```

### 1.3 HTTP 상태 코드
- `200`: 성공
- `201`: 생성됨
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 리소스 없음
- `422`: 유효성 검증 실패
- `429`: 요청 제한 초과
- `500`: 서버 오류

### 1.4 인증 헤더
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 2. 인증 API

### 2.1 로그인
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동",
      "organization": "테크컴퍼니",
      "role": "user",
      "isActive": true,
      "lastLogin": "2024-07-22T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 604800
  },
  "message": "로그인에 성공했습니다."
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
  }
}
```

### 2.2 로그아웃
```http
POST /api/auth/logout
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

### 2.3 토큰 갱신
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here",
    "refreshToken": "new_refresh_token_here",
    "expiresIn": 604800
  },
  "message": "토큰이 갱신되었습니다."
}
```

### 2.4 내 정보 조회
```http
GET /api/auth/me
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동",
      "organization": "테크컴퍼니",
      "role": "user",
      "isActive": true,
      "lastLogin": "2024-07-22T10:30:00Z",
      "createdAt": "2024-07-01T00:00:00Z",
      "updatedAt": "2024-07-22T10:30:00Z"
    }
  }
}
```

### 2.5 비밀번호 변경
```http
PUT /api/auth/password
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "비밀번호가 변경되었습니다."
}
```

---

## 3. 공고 API

### 3.1 공고 목록 조회
```http
GET /api/bids
```

**Query Parameters:**
- `page` (number): 페이지 번호 (기본값: 1)
- `limit` (number): 페이지당 항목 수 (기본값: 10, 최대: 100)
- `search` (string): 검색어
- `status` (string): 상태 필터 (all, active, closed, upcoming)
- `organization` (string): 기관명 필터
- `startDate` (string): 시작일 (YYYY-MM-DD)
- `endDate` (string): 종료일 (YYYY-MM-DD)
- `minAmount` (number): 최소 예산금액
- `maxAmount` (number): 최대 예산금액

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bids": [
      {
        "id": 1,
        "bidNtceNo": "2024-001",
        "bidNtceNm": "스마트공장 구축 사업",
        "ntceInsttNm": "중소기업진흥공단",
        "dmndInsttNm": "스마트팩토리센터",
        "bsnsDivNm": "용역",
        "bidNtceSttusNm": "공고중",
        "asignBdgtAmt": 500000000,
        "presmptPrce": 450000000,
        "bidNtceDate": "2024-07-15",
        "bidClseDate": "2024-08-15",
        "bidNtceUrl": "https://example.com/bid/2024-001",
        "createdAt": "2024-07-15T00:00:00Z",
        "updatedAt": "2024-07-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

### 3.2 공고 상세 조회
```http
GET /api/bids/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bid": {
      "id": 1,
      "bidNtceNo": "2024-001",
      "bidNtceNm": "스마트공장 구축 사업",
      "ntceInsttNm": "중소기업진흥공단",
      "dmndInsttNm": "스마트팩토리센터",
      "bsnsDivNm": "용역",
      "bidNtceSttusNm": "공고중",
      "asignBdgtAmt": 500000000,
      "presmptPrce": 450000000,
      "bidNtceDate": "2024-07-15",
      "bidClseDate": "2024-08-15",
      "bidNtceUrl": "https://example.com/bid/2024-001",
      "description": "스마트공장 구축을 위한 용역 사업입니다...",
      "requirements": [
        "스마트팩토리 구축 경험 3년 이상",
        "IoT 기술 전문성 보유",
        "ISO 9001 인증 보유"
      ],
      "attachments": [
        {
          "id": 1,
          "name": "사업계획서.pdf",
          "url": "https://example.com/files/plan.pdf",
          "size": 2048576
        }
      ],
      "createdAt": "2024-07-15T00:00:00Z",
      "updatedAt": "2024-07-15T00:00:00Z"
    }
  }
}
```

### 3.3 공고 동기화
```http
POST /api/bids/sync
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "force": false,
  "dateRange": {
    "startDate": "2024-07-01",
    "endDate": "2024-07-31"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "syncedCount": 25,
    "newBids": 15,
    "updatedBids": 10,
    "errors": 0,
    "syncTime": "2024-07-22T10:30:00Z"
  },
  "message": "공고 동기화가 완료되었습니다."
}
```

### 3.4 공고 통계
```http
GET /api/bids/statistics
```

**Query Parameters:**
- `period` (string): 기간 (today, week, month, year)
- `organization` (string): 기관명 필터

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalBids": 150,
    "activeBids": 45,
    "closedBids": 95,
    "upcomingBids": 10,
    "totalBudget": 75000000000,
    "averageBudget": 500000000,
    "topOrganizations": [
      {
        "name": "중소기업진흥공단",
        "count": 25,
        "totalBudget": 12500000000
      }
    ],
    "monthlyTrend": [
      {
        "month": "2024-07",
        "count": 45,
        "budget": 22500000000
      }
    ]
  }
}
```

### 3.5 공고 검색
```http
GET /api/bids/search
```

**Query Parameters:**
- `q` (string): 검색어 (필수)
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bids": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    },
    "searchTime": 0.15
  }
}
```

---

## 4. 레퍼런스 API

### 4.1 레퍼런스 목록 조회
```http
GET /api/references
```

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `search` (string): 검색어
- `projectType` (string): 프로젝트 타입
- `status` (string): 상태 필터
- `year` (number): 참여 연도
- `minAmount` (number): 최소 계약금액
- `maxAmount` (number): 최대 계약금액

**Response (200):**
```json
{
  "success": true,
  "data": {
    "references": [
      {
        "id": 1,
        "projectName": "스마트공장 구축 사업",
        "projectType": "용역",
        "bidNtceNo": "2023-001",
        "organization": "테크컴퍼니",
        "participationYear": 2023,
        "contractAmount": 500000000,
        "status": "success",
        "score": "A",
        "files": [
          {
            "id": 1,
            "name": "계약서.pdf",
            "url": "https://example.com/files/contract.pdf",
            "size": 1048576
          }
        ],
        "createdBy": 1,
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 4.2 레퍼런스 등록
```http
POST /api/references
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
projectName: 스마트공장 구축 사업
projectType: 용역
bidNtceNo: 2023-001
organization: 테크컴퍼니
participationYear: 2023
contractAmount: 500000000
status: success
score: A
description: 스마트공장 구축을 위한 용역 사업을 성공적으로 완료했습니다.
files: [file1, file2, ...]
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "reference": {
      "id": 1,
      "projectName": "스마트공장 구축 사업",
      "projectType": "용역",
      "bidNtceNo": "2023-001",
      "organization": "테크컴퍼니",
      "participationYear": 2023,
      "contractAmount": 500000000,
      "status": "success",
      "score": "A",
      "description": "스마트공장 구축을 위한 용역 사업을 성공적으로 완료했습니다.",
      "files": [
        {
          "id": 1,
          "name": "계약서.pdf",
          "url": "https://example.com/files/contract.pdf",
          "size": 1048576
        }
      ],
      "createdBy": 1,
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  },
  "message": "레퍼런스가 등록되었습니다."
}
```

### 4.3 레퍼런스 상세 조회
```http
GET /api/references/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reference": {
      "id": 1,
      "projectName": "스마트공장 구축 사업",
      "projectType": "용역",
      "bidNtceNo": "2023-001",
      "organization": "테크컴퍼니",
      "participationYear": 2023,
      "contractAmount": 500000000,
      "status": "success",
      "score": "A",
      "description": "스마트공장 구축을 위한 용역 사업을 성공적으로 완료했습니다.",
      "files": [
        {
          "id": 1,
          "name": "계약서.pdf",
          "url": "https://example.com/files/contract.pdf",
          "size": 1048576
        }
      ],
      "createdBy": 1,
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  }
}
```

### 4.4 레퍼런스 수정
```http
PUT /api/references/:id
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
projectName: 스마트공장 구축 사업 (수정)
projectType: 용역
contractAmount: 550000000
status: success
score: A+
description: 수정된 설명입니다.
files: [file1, file2, ...]
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reference": {
      "id": 1,
      "projectName": "스마트공장 구축 사업 (수정)",
      "projectType": "용역",
      "bidNtceNo": "2023-001",
      "organization": "테크컴퍼니",
      "participationYear": 2023,
      "contractAmount": 550000000,
      "status": "success",
      "score": "A+",
      "description": "수정된 설명입니다.",
      "files": [],
      "createdBy": 1,
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-07-22T10:30:00Z"
    }
  },
  "message": "레퍼런스가 수정되었습니다."
}
```

### 4.5 레퍼런스 삭제
```http
DELETE /api/references/:id
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "message": "레퍼런스가 삭제되었습니다."
}
```

### 4.6 유사 공고 매칭
```http
GET /api/references/match
```

**Query Parameters:**
- `bidId` (number): 공고 ID
- `limit` (number): 매칭 결과 수 (기본값: 5)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bid": {
      "id": 1,
      "bidNtceNo": "2024-001",
      "bidNtceNm": "스마트공장 구축 사업"
    },
    "matches": [
      {
        "reference": {
          "id": 1,
          "projectName": "스마트공장 구축 사업",
          "projectType": "용역",
          "status": "success",
          "score": "A"
        },
        "similarity": 0.95,
        "matchReason": "프로젝트명과 타입이 매우 유사합니다."
      }
    ]
  }
}
```

### 4.7 레퍼런스 통계
```http
GET /api/references/statistics
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalReferences": 50,
    "successCount": 35,
    "failureCount": 10,
    "ongoingCount": 5,
    "totalContractAmount": 25000000000,
    "averageContractAmount": 500000000,
    "topProjectTypes": [
      {
        "type": "용역",
        "count": 25,
        "successRate": 0.8
      }
    ],
    "yearlyTrend": [
      {
        "year": 2023,
        "count": 30,
        "successRate": 0.7
      }
    ]
  }
}
```

---

## 5. 알림 API

### 5.1 알림 목록 조회
```http
GET /api/notifications
```

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `status` (string): 상태 필터 (all, unread, read, important)
- `type` (string): 알림 타입 필터

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "urgent",
        "bidNtceNo": "2024-001",
        "title": "긴급 공고 마감 알림",
        "message": "스마트공장 구축 사업 공고가 3일 후 마감됩니다.",
        "status": "unread",
        "assignedTo": 1,
        "createdAt": "2024-07-22T10:30:00Z",
        "updatedAt": "2024-07-22T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 5.2 알림 상태 변경
```http
PUT /api/notifications/:id
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "status": "read"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": 1,
      "type": "urgent",
      "bidNtceNo": "2024-001",
      "title": "긴급 공고 마감 알림",
      "message": "스마트공장 구축 사업 공고가 3일 후 마감됩니다.",
      "status": "read",
      "assignedTo": 1,
      "createdAt": "2024-07-22T10:30:00Z",
      "updatedAt": "2024-07-22T10:35:00Z"
    }
  },
  "message": "알림 상태가 변경되었습니다."
}
```

### 5.3 알림 설정
```http
POST /api/notifications/settings
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "emailNotifications": true,
  "pushNotifications": true,
  "urgentAlerts": true,
  "deadlineAlerts": true,
  "matchingAlerts": true,
  "dailyDigest": false,
  "weeklyReport": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "settings": {
      "emailNotifications": true,
      "pushNotifications": true,
      "urgentAlerts": true,
      "deadlineAlerts": true,
      "matchingAlerts": true,
      "dailyDigest": false,
      "weeklyReport": true
    }
  },
  "message": "알림 설정이 저장되었습니다."
}
```

### 5.4 읽지 않은 알림 조회
```http
GET /api/notifications/unread
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 5,
    "notifications": [
      {
        "id": 1,
        "type": "urgent",
        "title": "긴급 공고 마감 알림",
        "createdAt": "2024-07-22T10:30:00Z"
      }
    ]
  }
}
```

---

## 6. 관리자 API

### 6.1 사용자 목록 조회
```http
GET /api/admin/users
```

**Headers:**
```http
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `search` (string): 검색어
- `role` (string): 역할 필터
- `status` (string): 상태 필터

**Response (200):**
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
        "createdAt": "2024-07-01T00:00:00Z",
        "updatedAt": "2024-07-22T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

### 6.2 사용자 등록
```http
POST /api/admin/users
```

**Headers:**
```http
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "김철수",
  "organization": "테크컴퍼니",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "email": "newuser@example.com",
      "name": "김철수",
      "organization": "테크컴퍼니",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-07-22T10:30:00Z",
      "updatedAt": "2024-07-22T10:30:00Z"
    }
  },
  "message": "사용자가 등록되었습니다."
}
```

### 6.3 사용자 수정
```http
PUT /api/admin/users/:id
```

**Headers:**
```http
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Request Body:**
```json
{
  "name": "김철수 (수정)",
  "organization": "테크컴퍼니",
  "role": "manager",
  "isActive": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "email": "newuser@example.com",
      "name": "김철수 (수정)",
      "organization": "테크컴퍼니",
      "role": "manager",
      "isActive": true,
      "updatedAt": "2024-07-22T10:35:00Z"
    }
  },
  "message": "사용자 정보가 수정되었습니다."
}
```

### 6.4 사용자 삭제
```http
DELETE /api/admin/users/:id
```

**Headers:**
```http
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "message": "사용자가 삭제되었습니다."
}
```

### 6.5 시스템 로그 조회
```http
GET /api/admin/logs
```

**Headers:**
```http
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Query Parameters:**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 항목 수
- `level` (string): 로그 레벨 (error, warn, info, debug)
- `startDate` (string): 시작일
- `endDate` (string): 종료일

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "level": "info",
        "message": "사용자 로그인",
        "userId": 1,
        "ip": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2024-07-22T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 6.6 시스템 통계
```http
GET /api/admin/statistics
```

**Headers:**
```http
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 15,
      "active": 12,
      "inactive": 3,
      "newThisMonth": 5
    },
    "bids": {
      "total": 150,
      "active": 45,
      "syncedToday": 25
    },
    "references": {
      "total": 50,
      "success": 35,
      "failure": 10,
      "ongoing": 5
    },
    "notifications": {
      "total": 25,
      "unread": 5,
      "urgent": 2
    },
    "system": {
      "uptime": 86400,
      "memoryUsage": 512,
      "cpuUsage": 15.5,
      "diskUsage": 75.2
    }
  }
}
```

---

## 7. 파일 API

### 7.1 파일 업로드
```http
POST /api/files/upload
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
file: [file]
category: reference
description: 레퍼런스 관련 파일
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": 1,
      "name": "document.pdf",
      "originalName": "계약서.pdf",
      "url": "https://example.com/files/document.pdf",
      "size": 1048576,
      "mimeType": "application/pdf",
      "category": "reference",
      "description": "레퍼런스 관련 파일",
      "uploadedBy": 1,
      "createdAt": "2024-07-22T10:30:00Z"
    }
  },
  "message": "파일이 업로드되었습니다."
}
```

### 7.2 파일 다운로드
```http
GET /api/files/:id/download
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```
[Binary file content]
```

### 7.3 파일 삭제
```http
DELETE /api/files/:id
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "message": "파일이 삭제되었습니다."
}
```

---

## 8. 웹훅 API

### 8.1 웹훅 등록
```http
POST /api/webhooks
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "url": "https://example.com/webhook",
  "events": ["bid.created", "bid.updated", "notification.created"],
  "secret": "webhook_secret_key",
  "description": "공고 및 알림 웹훅"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "webhook": {
      "id": 1,
      "url": "https://example.com/webhook",
      "events": ["bid.created", "bid.updated", "notification.created"],
      "secret": "webhook_secret_key",
      "description": "공고 및 알림 웹훅",
      "isActive": true,
      "createdBy": 1,
      "createdAt": "2024-07-22T10:30:00Z"
    }
  },
  "message": "웹훅이 등록되었습니다."
}
```

### 8.2 웹훅 목록 조회
```http
GET /api/webhooks
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "webhooks": [
      {
        "id": 1,
        "url": "https://example.com/webhook",
        "events": ["bid.created", "bid.updated", "notification.created"],
        "description": "공고 및 알림 웹훅",
        "isActive": true,
        "lastTriggered": "2024-07-22T10:30:00Z",
        "createdAt": "2024-07-22T10:30:00Z"
      }
    ]
  }
}
```

### 8.3 웹훅 수정
```http
PUT /api/webhooks/:id
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "url": "https://example.com/webhook/updated",
  "events": ["bid.created", "bid.updated"],
  "isActive": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "webhook": {
      "id": 1,
      "url": "https://example.com/webhook/updated",
      "events": ["bid.created", "bid.updated"],
      "description": "공고 및 알림 웹훅",
      "isActive": true,
      "updatedAt": "2024-07-22T10:35:00Z"
    }
  },
  "message": "웹훅이 수정되었습니다."
}
```

### 8.4 웹훅 삭제
```http
DELETE /api/webhooks/:id
```

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "message": "웹훅이 삭제되었습니다."
}
```

---

## 9. 에러 처리

### 9.1 에러 코드 목록

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `AUTH_INVALID_CREDENTIALS` | 401 | 잘못된 로그인 정보 |
| `AUTH_TOKEN_EXPIRED` | 401 | 토큰 만료 |
| `AUTH_TOKEN_INVALID` | 401 | 유효하지 않은 토큰 |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | 권한 부족 |
| `VALIDATION_ERROR` | 422 | 유효성 검증 실패 |
| `RESOURCE_NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `RATE_LIMIT_EXCEEDED` | 429 | 요청 제한 초과 |
| `INTERNAL_SERVER_ERROR` | 500 | 서버 오류 |

### 9.2 유효성 검증 에러 예시

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": [
      {
        "field": "email",
        "reason": "이메일 형식이 올바르지 않습니다."
      },
      {
        "field": "password",
        "reason": "비밀번호는 8자 이상이어야 합니다."
      }
    ]
  },
  "timestamp": "2024-07-22T10:30:00Z"
}
```

### 9.3 권한 에러 예시

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INSUFFICIENT_PERMISSIONS",
    "message": "이 작업을 수행할 권한이 없습니다.",
    "details": {
      "requiredRole": "admin",
      "currentRole": "user"
    }
  },
  "timestamp": "2024-07-22T10:30:00Z"
}
```

---

## 10. 테스트 가이드

### 10.1 테스트 계정

| 역할 | 이메일 | 비밀번호 | 권한 |
|------|--------|----------|------|
| 관리자 | admin@example.com | password123 | 모든 권한 |
| 일반 사용자 | user@example.com | password123 | 기본 권한 |
| 매니저 | manager@example.com | password123 | 관리자 권한 |

### 10.2 API 테스트 도구

#### cURL 예시

**로그인:**
```bash
curl -X POST https://api.ai-biz-eyes.com/v1/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**공고 목록 조회:**
```bash
curl -X GET "https://api.ai-biz-eyes.com/v1/api/bids?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**레퍼런스 등록:**
```bash
curl -X POST https://api.ai-biz-eyes.com/v1/api/references \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "스마트공장 구축 사업",
    "projectType": "용역",
    "contractAmount": 500000000,
    "status": "success"
  }'
```

#### Postman 컬렉션

Postman을 사용하는 경우 다음 환경 변수를 설정하세요:

```json
{
  "baseUrl": "https://api.ai-biz-eyes.com/v1",
  "token": "YOUR_JWT_TOKEN",
  "adminToken": "YOUR_ADMIN_JWT_TOKEN"
}
```

### 10.3 테스트 시나리오

#### 1. 인증 플로우 테스트
1. 로그인 → 토큰 획득
2. 토큰으로 보호된 API 호출
3. 토큰 만료 시 갱신
4. 로그아웃

#### 2. 공고 관리 테스트
1. 공고 목록 조회 (페이지네이션, 필터링)
2. 공고 상세 조회
3. 공고 동기화
4. 공고 통계 조회

#### 3. 레퍼런스 관리 테스트
1. 레퍼런스 등록 (파일 업로드 포함)
2. 레퍼런스 목록 조회
3. 레퍼런스 수정
4. 유사 공고 매칭
5. 레퍼런스 삭제

#### 4. 알림 시스템 테스트
1. 알림 목록 조회
2. 알림 상태 변경
3. 알림 설정 관리

#### 5. 관리자 기능 테스트
1. 사용자 관리 (CRUD)
2. 시스템 로그 조회
3. 시스템 통계 조회

### 10.4 성능 테스트

#### 부하 테스트
```bash
# Apache Bench를 사용한 부하 테스트
ab -n 1000 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
   https://api.ai-biz-eyes.com/v1/api/bids
```

#### 응답 시간 테스트
```bash
# 응답 시간 측정
curl -w "@curl-format.txt" -o /dev/null -s \
     "https://api.ai-biz-eyes.com/v1/api/bids"
```

### 10.5 보안 테스트

#### 인증 테스트
- 유효하지 않은 토큰으로 API 호출
- 만료된 토큰으로 API 호출
- 권한이 없는 사용자로 관리자 API 호출

#### 입력 검증 테스트
- SQL 인젝션 시도
- XSS 공격 시도
- 잘못된 데이터 형식 전송

---

## 📞 API 지원

### 기술 지원
- **이메일**: api-support@ai-biz-eyes.com
- **문서**: https://docs.ai-biz-eyes.com
- **GitHub**: https://github.com/ai-biz-eyes/api

### API 상태 확인
- **상태 페이지**: https://status.ai-biz-eyes.com
- **헬스 체크**: `GET /api/health`

### 변경 이력
- **v1.0.0** (2024-12-01): 초기 API 릴리스
- **v1.1.0** (2024-12-15): 웹훅 API 추가
- **v1.2.0** (2024-12-30): 파일 관리 API 개선

---

*이 문서는 AI Biz Eyes API의 완전한 참조 가이드입니다. API 변경사항이 있을 때마다 업데이트됩니다.*
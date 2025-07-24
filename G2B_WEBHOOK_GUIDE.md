# 조달청 API 웹훅 내보내기 도구 사용 가이드

## 📋 개요

이 도구는 조달청 API 데이터를 Power Automate 웹훅으로 자동 전송하는 HTML 기반 애플리케이션입니다. 입찰정보, 계약정보, 업체정보, 공고정보를 실시간으로 모니터링하고 Teams나 다른 플랫폼으로 알림을 보낼 수 있습니다.

## 🚀 시작하기

### 1. 파일 실행
```bash
# HTML 파일을 웹 브라우저에서 열기
open g2b-webhook-exporter.html
```

### 2. Power Automate 웹훅 설정
1. Power Automate에서 새 플로우 생성
2. "수신 웹후크를 사용하여 Teams 채팅에 게시" 템플릿 선택
3. 웹훅 URL 복사
4. HTML 도구의 웹훅 URL 필드에 붙여넣기

## ⚙️ 설정 방법

### 웹훅 설정
- **Power Automate 웹훅 URL**: Power Automate에서 생성된 웹훅 URL 입력
- **조달청 API 키**: 선택사항 (실제 API 사용 시 필요)

### API 설정
- **API 유형**: 
  - 입찰정보 (bid)
  - 계약정보 (contract)
  - 업체정보 (company)
  - 공고정보 (notice)
- **데이터 제한**: 10~1000건 선택
- **검색 키워드**: 특정 키워드로 필터링
- **날짜 범위**: 최근 1일~90일 선택

### 자동 실행 설정
- **실행 주기**:
  - 수동 실행
  - 매시간
  - 매일
  - 매주
- **실행 시간**: 매일/매주 실행 시 시간 설정
- **실행 요일**: 매주 실행 시 요일 선택

## 📊 JSON 스키마

### 기본 구조
```json
{
  "type": "string",
  "timestamp": "string (ISO 8601)",
  "data": [
    {
      // API 유형별 필드
    }
  ],
  "summary": {
    "totalCount": "number",
    "newCount": "number",
    "updatedCount": "number"
  }
}
```

### 입찰정보 스키마
```json
{
  "type": "bid",
  "timestamp": "2024-01-01T09:00:00Z",
  "data": [
    {
      "bidId": "BID-000001",
      "title": "입찰명",
      "agency": "수요기관",
      "bidType": "공개입찰",
      "budget": 100000000,
      "publishDate": "2024-01-01",
      "deadline": "2024-01-15",
      "category": "건설",
      "location": "서울",
      "status": "공고중",
      "url": "https://..."
    }
  ],
  "summary": {
    "totalCount": 1,
    "newCount": 1,
    "updatedCount": 0
  }
}
```

### 계약정보 스키마
```json
{
  "type": "contract",
  "timestamp": "2024-01-01T09:00:00Z",
  "data": [
    {
      "contractId": "CON-000001",
      "title": "계약명",
      "agency": "수요기관",
      "supplier": "공급업체",
      "contractAmount": 100000000,
      "contractDate": "2024-01-01",
      "completionDate": "2024-12-31",
      "category": "건설",
      "contractType": "공사",
      "status": "진행중",
      "url": "https://..."
    }
  ],
  "summary": {
    "totalCount": 1,
    "newCount": 1,
    "updatedCount": 0
  }
}
```

### 업체정보 스키마
```json
{
  "type": "company",
  "timestamp": "2024-01-01T09:00:00Z",
  "data": [
    {
      "companyId": "COM-000001",
      "companyName": "업체명",
      "businessNumber": "1234567890",
      "representative": "대표자명",
      "address": "주소",
      "phone": "02-1234-5678",
      "email": "contact@company.com",
      "category": "건설",
      "registrationDate": "2020-01-01",
      "status": "활성",
      "url": "https://..."
    }
  ],
  "summary": {
    "totalCount": 1,
    "newCount": 1,
    "updatedCount": 0
  }
}
```

### 공고정보 스키마
```json
{
  "type": "notice",
  "timestamp": "2024-01-01T09:00:00Z",
  "data": [
    {
      "noticeId": "NOT-000001",
      "title": "공고제목",
      "agency": "공고기관",
      "noticeType": "일반공고",
      "publishDate": "2024-01-01",
      "deadline": "2024-01-15",
      "content": "공고내용",
      "attachments": ["첨부파일1.pdf", "첨부파일2.xlsx"],
      "category": "공고분류",
      "status": "공고중",
      "url": "https://..."
    }
  ],
  "summary": {
    "totalCount": 1,
    "newCount": 1,
    "updatedCount": 0
  }
}
```

## 🔧 사용 방법

### 1. 웹훅 연결 테스트
1. 웹훅 URL 입력
2. "웹훅 연결 테스트" 버튼 클릭
3. 성공 메시지 확인

### 2. 데이터 내보내기 시작
1. API 설정 완료
2. 자동 실행 설정 (선택사항)
3. "데이터 내보내기 시작" 버튼 클릭
4. 로그에서 진행 상황 확인

### 3. 모니터링
- 실시간 로그 확인
- 전송 상태 모니터링
- 오류 발생 시 알림

## 🛠️ 고급 설정

### 실제 조달청 API 연동
현재는 모의 데이터를 사용하지만, 실제 조달청 API와 연동하려면:

1. **API 키 설정**
   - 조달청 API 키 발급
   - HTML 도구의 API 키 필드에 입력

2. **API 엔드포인트 수정**
   ```javascript
   // 실제 API 호출 함수 수정
   async function fetchG2BData(apiType, params) {
     const response = await fetch(`https://api.g2b.go.kr/${apiType}`, {
       headers: {
         'Authorization': `Bearer ${apiKey}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(params)
     });
     return response.json();
   }
   ```

### 커스텀 필터링
```javascript
// 검색 조건 추가
const searchConditions = {
  keyword: document.getElementById('searchKeyword').value,
  dateRange: document.getElementById('dateRange').value,
  category: document.getElementById('category').value,
  location: document.getElementById('location').value
};
```

## 📱 Power Automate 연동

### Teams 알림 설정
1. Power Automate에서 "Teams에 메시지 보내기" 액션 추가
2. 웹훅 데이터를 Teams 메시지로 변환
3. 조건부 알림 설정

### 예시 Teams 메시지
```json
{
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
          {
            "type": "TextBlock",
            "text": "새로운 입찰정보",
            "weight": "Bolder",
            "size": "Large"
          },
          {
            "type": "TextBlock",
            "text": "입찰명: {{title}}",
            "wrap": true
          },
          {
            "type": "TextBlock",
            "text": "수요기관: {{agency}}",
            "wrap": true
          },
          {
            "type": "TextBlock",
            "text": "예정가격: {{budget}}원",
            "wrap": true
          }
        ],
        "actions": [
          {
            "type": "Action.OpenUrl",
            "title": "상세보기",
            "url": "{{url}}"
          }
        ]
      }
    }
  ]
}
```

## 🔍 문제 해결

### 일반적인 문제들

1. **웹훅 연결 실패**
   - URL 형식 확인
   - Power Automate 플로우 활성화 상태 확인
   - 네트워크 연결 확인

2. **데이터 전송 실패**
   - JSON 스키마 형식 확인
   - 필수 필드 누락 확인
   - 웹훅 URL 유효성 확인

3. **자동 실행이 작동하지 않음**
   - 브라우저 탭이 활성 상태인지 확인
   - 브라우저 설정에서 자동 실행 허용 확인

### 로그 확인
- 브라우저 개발자 도구 콘솔에서 오류 메시지 확인
- 네트워크 탭에서 HTTP 요청/응답 확인

## 📞 지원

### 파일 구조
```
├── g2b-webhook-exporter.html    # 메인 HTML 도구
├── g2b-webhook-schemas.json     # JSON 스키마 정의
└── G2B_WEBHOOK_GUIDE.md        # 사용 가이드
```

### 추가 기능 요청
- GitHub Issues를 통해 기능 요청
- 버그 리포트 및 개선 사항 제안

## 📄 라이선스

이 도구는 MIT 라이선스 하에 배포됩니다.

---

**참고**: 이 도구는 교육 및 개발 목적으로 제작되었으며, 실제 운영 환경에서 사용하기 전에 충분한 테스트를 권장합니다.
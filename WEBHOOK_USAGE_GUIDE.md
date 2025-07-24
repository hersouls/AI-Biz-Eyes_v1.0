# 조달청 API Webhook 사용 가이드

## 개요

조달청 API 데이터를 webhook을 통해 실시간으로 전송하는 시스템입니다. 입찰공고, 사전공고, 계약현황 데이터를 지정된 webhook URL로 자동 전송합니다.

## 환경 설정

### 1. 환경 변수 설정

`.env` 파일에 다음 설정을 추가하세요:

```env
# Webhook 설정
WEBHOOK_URL=https://hook.us2.make.com/ininxqi617kvj5q89kt35ef5dfs0gwjt
WEBHOOK_API_KEY=moonwave-secret-key-2025
```

### 2. 조달청 API 설정 확인

```env
# 조달청 API 설정
G2B_API_KEY_DECODED=w8uFE+fALZiqCJBLK8lPowqGye3vCpMytaFBmfaq5uNGiyM/qByWrt9gZ406/ITajbX1Q8/ESHI1LDoADaTMcg==
G2B_API_ENDPOINT=https://apis.data.go.kr/1230000/ad/BidPublicInfoService
```

## API 엔드포인트

### 1. Webhook 연결 테스트

```http
GET /api/webhook/test
```

**응답 예시:**
```json
{
  "success": true,
  "message": "Webhook 연결이 정상입니다.",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### 2. 입찰공고 데이터 전송

```http
POST /api/webhook/bid-notice
```

**쿼리 파라미터:**
- `pageNo` (선택): 페이지 번호 (기본값: 1)
- `numOfRows` (선택): 페이지당 행 수 (기본값: 10)
- `fromDt` (선택): 조회 시작일 (YYYYMMDD 형식)
- `toDt` (선택): 조회 종료일 (YYYYMMDD 형식)

**응답 예시:**
```json
{
  "success": true,
  "message": "입찰공고 데이터가 webhook으로 성공적으로 전송되었습니다.",
  "data": {
    "totalCount": 100,
    "pageNo": 1,
    "numOfRows": 10,
    "items": 10
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### 3. 사전공고 데이터 전송

```http
POST /api/webhook/pre-notice
```

**쿼리 파라미터:** (입찰공고와 동일)

### 4. 계약현황 데이터 전송

```http
POST /api/webhook/contract
```

**쿼리 파라미터:** (입찰공고와 동일)

### 5. 모든 데이터 일괄 전송

```http
POST /api/webhook/all
```

**응답 예시:**
```json
{
  "success": true,
  "message": "2/3 개의 데이터가 webhook으로 전송되었습니다.",
  "results": {
    "bidNotice": true,
    "preNotice": false,
    "contract": true
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Webhook 페이로드 구조

전송되는 데이터는 다음과 같은 구조를 가집니다:

```json
{
  "timestamp": "2025-01-01T00:00:00.000Z",
  "source": "G2B_API",
  "data": {
    "totalCount": 100,
    "pageNo": 1,
    "numOfRows": 10,
    "items": [
      {
        "bidNo": "2025-001",
        "bidTitle": "입찰공고 제목",
        "bidDate": "2025-01-01",
        "bidAmount": "100000000"
      }
    ]
  },
  "metadata": {
    "type": "bid_notice",
    "totalCount": 100,
    "pageNo": 1,
    "numOfRows": 10
  }
}
```

## 사용 예시

### 1. cURL을 사용한 테스트

```bash
# Webhook 연결 테스트
curl -X GET http://localhost:3003/api/webhook/test

# 입찰공고 데이터 전송
curl -X POST "http://localhost:3003/api/webhook/bid-notice?pageNo=1&numOfRows=5&fromDt=20240101&toDt=20241231"

# 모든 데이터 일괄 전송
curl -X POST "http://localhost:3003/api/webhook/all?pageNo=1&numOfRows=3"
```

### 2. JavaScript/Node.js 예시

```javascript
const axios = require('axios');

// 입찰공고 데이터 전송
async function sendBidNoticeData() {
  try {
    const response = await axios.post('http://localhost:3003/api/webhook/bid-notice', {}, {
      params: {
        pageNo: 1,
        numOfRows: 10,
        fromDt: '20240101',
        toDt: '20241231'
      }
    });
    console.log('성공:', response.data);
  } catch (error) {
    console.error('오류:', error.response?.data);
  }
}

sendBidNoticeData();
```

### 3. Python 예시

```python
import requests

# 입찰공고 데이터 전송
def send_bid_notice_data():
    url = "http://localhost:3003/api/webhook/bid-notice"
    params = {
        "pageNo": 1,
        "numOfRows": 10,
        "fromDt": "20240101",
        "toDt": "20241231"
    }
    
    response = requests.post(url, params=params)
    if response.status_code == 200:
        print("성공:", response.json())
    else:
        print("오류:", response.json())

send_bid_notice_data()
```

## 테스트

### 1. 전체 테스트 실행

```bash
npm run test:webhook
```

### 2. 개별 테스트

```bash
# 서버 실행
npm run dev

# 새 터미널에서 테스트 실행
node test-webhook.js
```

## 오류 처리

### 1. 일반적인 오류

- **401 Unauthorized**: API 키가 잘못되었거나 누락됨
- **404 Not Found**: Webhook URL이 잘못됨
- **500 Internal Server Error**: 서버 내부 오류
- **Timeout**: 네트워크 연결 문제

### 2. 디버깅

1. 환경 변수 확인:
   ```bash
   echo $WEBHOOK_URL
   echo $WEBHOOK_API_KEY
   ```

2. 서버 로그 확인:
   ```bash
   npm run dev
   ```

3. Webhook 연결 테스트:
   ```bash
   curl -X GET http://localhost:3003/api/webhook/test
   ```

## 보안 고려사항

1. **API 키 보안**: API 키를 환경 변수로 관리하고 소스 코드에 하드코딩하지 마세요.
2. **HTTPS 사용**: 프로덕션 환경에서는 반드시 HTTPS를 사용하세요.
3. **요청 제한**: API 요청 제한을 설정하여 과도한 요청을 방지하세요.
4. **로깅**: 중요한 작업에 대한 로깅을 활성화하세요.

## 모니터링

### 1. 로그 모니터링

서버 로그에서 다음 패턴을 확인하세요:
- `✅ Webhook 전송 성공`
- `❌ Webhook 전송 실패`
- `🔍 조달청 API 호출 중...`
- `📤 Webhook으로 데이터 전송 중...`

### 2. 성능 모니터링

- 응답 시간 모니터링
- 전송 성공률 추적
- API 호출 횟수 모니터링

## 자동화

### 1. Cron Job 설정 (Linux/Mac)

```bash
# 매일 오전 9시에 입찰공고 데이터 전송
0 9 * * * curl -X POST "http://localhost:3003/api/webhook/bid-notice?pageNo=1&numOfRows=50"
```

### 2. Windows Task Scheduler

Windows 작업 스케줄러를 사용하여 정기적인 데이터 전송을 설정할 수 있습니다.

## 지원 및 문의

문제가 발생하거나 추가 기능이 필요한 경우:

1. 서버 로그 확인
2. 환경 변수 설정 확인
3. 네트워크 연결 상태 확인
4. 조달청 API 상태 확인

---

**버전**: 1.0.0  
**최종 업데이트**: 2025-01-01
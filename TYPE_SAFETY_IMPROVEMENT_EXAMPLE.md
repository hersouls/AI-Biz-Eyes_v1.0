# TypeScript 컨트롤러 타입 안정성 개선 사례

## 🎯 개선된 코드 예제

### 1. 타입 안전한 알림 설정 업데이트

#### ❌ 이전 코드 (타입 불안정)
```typescript
export const updateNotificationConfig = async (req: Request, res: Response) => {
  try {
    const configId = Number(req.params.id);
    const updateData = req.body; // any 타입

    if (configId === 0) {
      const newConfig = {
        id: mockNotificationConfigs.length + 1,
        type: updateData.type as 'new_bid' | 'urgent' | 'deadline', // 🚨 타입 단언
        channel: updateData.channel as 'web' | 'email' | 'push',    // 🚨 타입 단언
        frequency: updateData.frequency as 'immediate' | 'daily' | 'weekly',
        recipients: updateData.recipients as string[],
        isActive: updateData.isActive as boolean,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any; // 🚨 모든 타입 검증 무시!
      
      mockNotificationConfigs.push(newConfig);
    }
  } catch (error) {
    // ...
  }
};
```

#### ✅ 개선된 코드 (타입 안전)
```typescript
// 타입 안전한 Request 인터페이스 사용
export const updateNotificationConfig = async (
  req: TypedRequest<UpdateNotificationConfigDto, { id: string }>,
  res: Response
) => {
  try {
    const configId = Number(req.params.id);
    const updateData: UpdateNotificationConfigDto = req.body; // 타입이 보장됨

    if (configId === 0) {
      // ✅ 타입 안전한 객체 생성
      const newConfig = createNotificationConfig({
        ...updateData,
        id: mockNotificationConfigs.length + 1
      });
      
      // 이제 newConfig는 완벽하게 타입이 보장됨
      mockNotificationConfigs.push(newConfig);
      
      return res.status(201).json(
        createSuccessResponse(newConfig, '알림 설정이 생성되었습니다.')
      );
    }
  } catch (error) {
    console.error('Error updating notification config:', error);
    return res.status(500).json(
      createErrorResponse('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.')
    );
  }
};
```

### 2. 타입 가드 함수들

```typescript
// src/types/admin.ts
export const isValidNotificationType = (type: any): type is NotificationConfig['type'] => {
  return ['new_bid', 'urgent', 'deadline', 'achievement'].includes(type);
};

export const isValidChannel = (channel: any): channel is NotificationConfig['channel'] => {
  return ['web', 'email', 'push'].includes(channel);
};

export const isValidFrequency = (frequency: any): frequency is NotificationConfig['frequency'] => {
  return ['immediate', 'daily', 'weekly'].includes(frequency);
};
```

### 3. 안전한 팩토리 함수

```typescript
// src/types/admin.ts
export const createNotificationConfig = (data: Partial<NotificationConfig>): NotificationConfig => {
  return {
    id: data.id ?? 0,
    type: isValidNotificationType(data.type) ? data.type : 'new_bid',
    channel: isValidChannel(data.channel) ? data.channel : 'web',
    frequency: isValidFrequency(data.frequency) ? data.frequency : 'immediate',
    recipients: Array.isArray(data.recipients) ? data.recipients : [],
    isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString()
  };
};
```

### 4. 입력 데이터 검증 미들웨어

```typescript
// src/middleware/validation.ts
export const validateNotificationConfig = [
  body('type')
    .isIn(['new_bid', 'urgent', 'deadline', 'achievement'])
    .withMessage('유효하지 않은 알림 타입입니다.'),
  
  body('channel')
    .isIn(['web', 'email', 'push'])
    .withMessage('유효하지 않은 채널입니다.'),
  
  body('frequency')
    .isIn(['immediate', 'daily', 'weekly'])
    .withMessage('유효하지 않은 빈도입니다.'),
  
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('수신자는 최소 1개 이상의 배열이어야 합니다'),
  
  body('recipients.*')
    .isEmail()
    .withMessage('유효하지 않은 이메일 주소입니다'),
  
  body('isActive')
    .isBoolean()
    .withMessage('isActive는 boolean 값이어야 합니다'),
  
  handleValidationErrors
];
```

### 5. 라우터에서 미들웨어 적용

```typescript
// src/routes/admin.ts
router.put('/notification-configs/:id', 
  validateIdParam, 
  validateNotificationConfig, 
  updateNotificationConfig
);
```

## 🚀 사용 방법

### 1. 새로운 컨트롤러 함수 작성

```typescript
// 타입 안전한 컨트롤러 함수 작성
export const createNewFeature = async (
  req: TypedRequest<CreateFeatureDto, { category: string }>,
  res: Response
) => {
  try {
    const featureData: CreateFeatureDto = req.body;
    const category: string = req.params.category;

    // 타입이 보장된 데이터로 작업
    const newFeature = createFeature({
      ...featureData,
      category,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json(
      createSuccessResponse(newFeature, '기능이 생성되었습니다.')
    );
  } catch (error) {
    console.error('Error creating feature:', error);
    return res.status(500).json(
      createErrorResponse('INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다.')
    );
  }
};
```

### 2. 새로운 검증 미들웨어 추가

```typescript
// src/middleware/validation.ts
export const validateFeature = [
  body('name')
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('이름은 2-100자 사이의 문자열이어야 합니다'),
  
  body('description')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('설명은 500자 이하의 문자열이어야 합니다'),
  
  body('isEnabled')
    .isBoolean()
    .withMessage('isEnabled는 boolean 값이어야 합니다'),
  
  handleValidationErrors
];
```

### 3. 새로운 타입 가드 함수 추가

```typescript
// src/types/admin.ts
export const isValidFeatureType = (type: any): type is Feature['type'] => {
  return ['basic', 'premium', 'enterprise'].includes(type);
};

export const createFeature = (data: Partial<Feature>): Feature => {
  return {
    id: data.id ?? 0,
    name: typeof data.name === 'string' ? data.name : '',
    description: typeof data.description === 'string' ? data.description : undefined,
    type: isValidFeatureType(data.type) ? data.type : 'basic',
    isEnabled: typeof data.isEnabled === 'boolean' ? data.isEnabled : true,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString()
  };
};
```

## 🎯 핵심 개선 포인트

### 1. 타입 단언 제거
- `as any`, `as Type` 같은 타입 단언을 제거
- 대신 타입 가드와 검증 함수 사용

### 2. 런타임 검증 추가
- 컴파일 타임뿐만 아니라 런타임에서도 타입 검증
- express-validator를 통한 입력값 검증

### 3. 팩토리 패턴 사용
- `createNotificationConfig` 함수로 객체 생성 로직 캡슐화
- 기본값 처리와 타입 검증을 한 곳에서 관리

### 4. 에러 처리 개선
- 명확한 에러 메시지와 상태 코드
- 타입별 에러 처리 분기

### 5. 타입 안전한 Request 인터페이스
- `TypedRequest`를 사용하여 요청 데이터의 타입 보장
- 제네릭을 활용한 유연한 타입 정의

## 🔧 테스트 방법

### 1. 유효한 데이터로 테스트
```bash
curl -X PUT http://localhost:3000/admin/notification-configs/0 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "new_bid",
    "channel": "email",
    "frequency": "immediate",
    "recipients": ["user@example.com"],
    "isActive": true
  }'
```

### 2. 잘못된 데이터로 테스트 (검증 확인)
```bash
curl -X PUT http://localhost:3000/admin/notification-configs/0 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "invalid_type",
    "channel": "invalid_channel",
    "frequency": "invalid_frequency",
    "recipients": "not_an_array",
    "isActive": "not_boolean"
  }'
```

이렇게 하면 타입 안정성이 크게 향상되고, 런타임 오류를 사전에 방지할 수 있습니다.
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { 
  ValidationError, 
  NotFoundError, 
  ConflictError, 
  AuthenticationError, 
  AuthorizationError,
  BusinessLogicError,
  TokenError,
  ExternalAPIError 
} from '../errors';
import { createSuccessResponse } from '../utils/response';

// 1. 유효성 검증 에러 예시
export const createUserExample = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // 이메일 유효성 검증
  if (!email || !email.includes('@')) {
    throw new ValidationError('유효한 이메일 주소를 입력해주세요.');
  }

  // 비밀번호 유효성 검증
  if (!password || password.length < 8) {
    throw new ValidationError('비밀번호는 8자 이상이어야 합니다.', {
      field: 'password',
      minLength: 8
    });
  }

  // 이름 유효성 검증
  if (!name || name.trim().length < 2) {
    throw new ValidationError('이름은 2자 이상이어야 합니다.');
  }

  // 사용자 생성 로직...
  const user = { id: 1, email, name };

  return res.status(201).json(createSuccessResponse(user, '사용자가 생성되었습니다.'));
});

// 2. 리소스 없음 에러 예시
export const getUserExample = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = Number(id);

  if (isNaN(userId)) {
    throw new ValidationError('유효한 사용자 ID를 입력해주세요.');
  }

  // 사용자 조회 로직...
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError('사용자');
  }

  return res.json(createSuccessResponse(user));
});

// 3. 충돌 에러 예시
export const createProjectExample = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  // 프로젝트명 중복 체크
  const existingProject = await getProjectByName(name);
  if (existingProject) {
    throw new ConflictError(`'${name}' 프로젝트는 이미 존재합니다.`);
  }

  // 프로젝트 생성 로직...
  const project = { id: 1, name, description };

  return res.status(201).json(createSuccessResponse(project, '프로젝트가 생성되었습니다.'));
});

// 4. 인증 에러 예시
export const getProfileExample = asyncHandler(async (req: Request, res: Response) => {
  // 사용자 인증 체크
  if (!req.user) {
    throw new AuthenticationError('로그인이 필요합니다.');
  }

  const profile = await getUserProfile(req.user.id);
  return res.json(createSuccessResponse(profile));
});

// 5. 권한 에러 예시
export const deleteUserExample = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const targetUserId = Number(id);

  // 관리자 권한 체크
  if (!req.user?.isAdmin) {
    throw new AuthorizationError('관리자 권한이 필요합니다.');
  }

  // 자기 자신 삭제 방지
  if (req.user.id === targetUserId) {
    throw new BusinessLogicError('자기 자신을 삭제할 수 없습니다.', 'SELF_DELETE_NOT_ALLOWED');
  }

  const deletedUser = await deleteUser(targetUserId);
  return res.json(createSuccessResponse(deletedUser, '사용자가 삭제되었습니다.'));
});

// 6. 토큰 에러 예시
export const refreshTokenExample = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new TokenError('missing');
  }

  try {
    // 토큰 검증 로직...
    const isValid = await validateRefreshToken(refreshToken);
    
    if (!isValid) {
      throw new TokenError('invalid');
    }

    const newAccessToken = await generateNewAccessToken(refreshToken);
    return res.json(createSuccessResponse({ accessToken: newAccessToken }));
  } catch (error) {
    if (error instanceof TokenError) {
      throw error;
    }
    throw new TokenError('expired');
  }
});

// 7. 외부 API 에러 예시
export const fetchExternalDataExample = asyncHandler(async (req: Request, res: Response) => {
  try {
    const externalData = await fetchFromExternalAPI();
    return res.json(createSuccessResponse(externalData));
  } catch (error: any) {
    // 외부 API 에러를 커스텀 에러로 변환
    throw new ExternalAPIError('외부 데이터 서비스', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
});

// 8. 비즈니스 로직 에러 예시
export const processPaymentExample = asyncHandler(async (req: Request, res: Response) => {
  const { amount, paymentMethod } = req.body;

  // 잔액 체크
  const balance = await getUserBalance(req.user!.id);
  if (balance < amount) {
    throw new BusinessLogicError('잔액이 부족합니다.', 'INSUFFICIENT_BALANCE');
  }

  // 결제 방법 체크
  if (!isValidPaymentMethod(paymentMethod)) {
    throw new ValidationError('유효하지 않은 결제 방법입니다.');
  }

  // 결제 처리 로직...
  const payment = await processPayment(amount, paymentMethod);

  return res.json(createSuccessResponse(payment, '결제가 완료되었습니다.'));
});

// 9. 복합 에러 처리 예시
export const complexOperationExample = asyncHandler(async (req: Request, res: Response) => {
  const { userId, action, data } = req.body;

  // 1. 인증 체크
  if (!req.user) {
    throw new AuthenticationError();
  }

  // 2. 권한 체크
  if (!req.user.isAdmin && req.user.id !== userId) {
    throw new AuthorizationError('자신의 데이터만 수정할 수 있습니다.');
  }

  // 3. 사용자 존재 체크
  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError('사용자');
  }

  // 4. 데이터 유효성 검증
  if (action === 'update' && (!data || Object.keys(data).length === 0)) {
    throw new ValidationError('수정할 데이터가 필요합니다.');
  }

  // 5. 비즈니스 로직 검증
  if (action === 'delete' && user.isAdmin) {
    throw new BusinessLogicError('관리자는 삭제할 수 없습니다.', 'ADMIN_DELETE_NOT_ALLOWED');
  }

  // 6. 외부 서비스 호출
  try {
    const result = await performComplexOperation(userId, action, data);
    return res.json(createSuccessResponse(result, '작업이 완료되었습니다.'));
  } catch (error: any) {
    throw new ExternalAPIError('외부 처리 서비스', error);
  }
});

// Mock 함수들 (실제 구현에서는 실제 서비스 함수를 사용)
async function getUserById(id: number) {
  // Mock implementation
  return id === 1 ? { id: 1, name: 'Test User' } : null;
}

async function getProjectByName(name: string) {
  // Mock implementation
  return name === 'existing-project' ? { id: 1, name } : null;
}

async function getUserProfile(userId: number) {
  // Mock implementation
  return { userId, profile: 'user profile data' };
}

async function deleteUser(userId: number) {
  // Mock implementation
  return { id: userId, deleted: true };
}

async function validateRefreshToken(token: string) {
  // Mock implementation
  return token === 'valid-token';
}

async function generateNewAccessToken(refreshToken: string) {
  // Mock implementation
  return 'new-access-token';
}

async function fetchFromExternalAPI() {
  // Mock implementation
  throw new Error('External API error');
}

async function getUserBalance(userId: number) {
  // Mock implementation
  return 1000;
}

function isValidPaymentMethod(method: string) {
  // Mock implementation
  return ['card', 'bank'].includes(method);
}

async function processPayment(amount: number, method: string) {
  // Mock implementation
  return { id: 1, amount, method, status: 'completed' };
}

async function performComplexOperation(userId: number, action: string, data: any) {
  // Mock implementation
  return { userId, action, data, completed: true };
}
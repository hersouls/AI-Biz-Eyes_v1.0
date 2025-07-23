// 테스트 환경 설정
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

// 전역 테스트 설정
beforeAll(() => {
  console.log('🧪 테스트 환경 초기화 완료');
});

afterAll(() => {
  console.log('🧹 테스트 환경 정리 완료');
});
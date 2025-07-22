// 테스트 환경 설정
process.env.NODE_ENV = 'test';

// Jest 타임아웃 설정
jest.setTimeout(10000);

// 전역 테스트 설정
beforeAll(() => {
  // 테스트 시작 전 실행할 코드
});

afterAll(() => {
  // 테스트 종료 후 실행할 코드
});

// 각 테스트 전후 실행
beforeEach(() => {
  // 각 테스트 전 실행할 코드
});

afterEach(() => {
  // 각 테스트 후 실행할 코드
});
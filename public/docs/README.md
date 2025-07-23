# AI Biz Eyes 문서 가이드

## 📋 문서 목차

### 🚀 시작하기
- [통합 개발문서](개발문서_통합.md) - 프로젝트 전체 개요 및 개발 가이드
- [빠른 시작 가이드](QUICK_START_TEST.md) - 5분 만에 프로젝트 실행하기

### 📚 기술 문서
- [개발 기술명세서](개발기술명세서.md) - 상세한 기술 스택 및 아키텍처
- [API 명세서](API명세서.md) - 기존 API 명세서
- [API 상세 문서](API_문서_상세.md) - 완전한 API 참조 가이드
- [데이터베이스 설계서](데이터베이스설계서.md) - DB 스키마 및 관계

### 🎨 디자인 및 UI
- [디자인 가이드](디자인가이드) - UI/UX 디자인 가이드라인
- [화면정의서](화면정의서) - 각 화면별 상세 정의

### 📊 프로젝트 관리
- [개발일정표](개발일정표.md) - 프로젝트 일정 및 마일스톤
- [PRD](PRD) - Product Requirements Document

### 🚀 배포 및 운영
- [배포 가이드](배포_가이드.md) - 완전한 배포 가이드 (Docker, AWS)
- [통합 테스트 가이드](integration-test-guide.md) - 테스트 방법론

### 🧪 테스트 문서
- [통합 기능 요약](INTEGRATION_FEATURE_SUMMARY.md) - 테스트된 기능 목록
- [프론트엔드 컴포넌트 문서](react-tailwind-app/README_UI_COMPONENTS.md) - UI 컴포넌트 가이드

### 📖 프론트엔드 문서
- [대시보드 가이드](react-tailwind-app/README_DASHBOARD.md)
- [공고 목록 가이드](react-tailwind-app/README_BIDLIST.md)
- [공고 상세 가이드](react-tailwind-app/README_BIDDETAIL.md)
- [레퍼런스 관리 가이드](react-tailwind-app/README_REFERENCE.md)
- [알림 시스템 가이드](react-tailwind-app/README_NOTIFICATION.md)
- [통계 페이지 가이드](react-tailwind-app/README_STATISTICS.md)
- [관리자 페이지 가이드](react-tailwind-app/README_ADMIN.md)
- [통합 테스트 가이드](react-tailwind-app/README_INTEGRATION.md)
- [품질 감사 가이드](react-tailwind-app/README_QUALITY_AUDIT.md)

## 🔍 문서 검색

### 개발자용 문서
- **새로 시작하는 개발자**: [통합 개발문서](개발문서_통합.md) → [빠른 시작 가이드](QUICK_START_TEST.md)
- **백엔드 개발자**: [개발 기술명세서](개발기술명세서.md) → [API 상세 문서](API_문서_상세.md)
- **프론트엔드 개발자**: [디자인 가이드](디자인가이드) → [UI 컴포넌트 문서](react-tailwind-app/README_UI_COMPONENTS.md)
- **DevOps 엔지니어**: [배포 가이드](배포_가이드.md) → [개발 기술명세서](개발기술명세서.md)

### 관리자용 문서
- **프로젝트 매니저**: [PRD](PRD) → [개발일정표](개발일정표.md) → [통합 기능 요약](INTEGRATION_FEATURE_SUMMARY.md)
- **QA 엔지니어**: [통합 테스트 가이드](integration-test-guide.md) → [품질 감사 가이드](react-tailwind-app/README_QUALITY_AUDIT.md)

## 📝 문서 작성 가이드

### 문서 구조
```
public/docs/
├── README.md                    # 이 파일 (문서 가이드)
├── 개발문서_통합.md              # 통합 개발문서
├── API_문서_상세.md              # API 상세 문서
├── 배포_가이드.md                # 배포 가이드
├── 개발기술명세서.md              # 기술 명세서
├── API명세서.md                  # 기존 API 명세서
├── 데이터베이스설계서.md          # DB 설계서
├── 개발일정표.md                 # 개발 일정
├── 디자인가이드                  # 디자인 가이드
├── 화면정의서                    # 화면 정의서
├── PRD                          # 요구사항 문서
├── integration-test-guide.md    # 통합 테스트 가이드
├── INTEGRATION_FEATURE_SUMMARY.md # 통합 기능 요약
└── QUICK_START_TEST.md          # 빠른 시작 가이드
```

### 문서 업데이트 규칙
1. **버전 관리**: 모든 문서는 버전 정보를 포함
2. **최신성 유지**: 코드 변경 시 관련 문서도 함께 업데이트
3. **일관성**: 문서 간 용어와 형식 통일
4. **검증**: 문서 내용의 정확성 검증

### 문서 템플릿
```markdown
# 문서 제목

## 📋 목차
1. [섹션 1](#1-섹션-1)
2. [섹션 2](#2-섹션-2)

## 1. 섹션 1

### 1.1 하위 섹션

## 2. 섹션 2

---

## 📞 문의 및 지원
- **문서 버전**: v1.0.0
- **최종 업데이트**: 2024년 12월
- **담당자**: [담당자 정보]

---

*이 문서는 [문서 목적]을 위한 가이드입니다.*
```

## 🔗 관련 링크

### 외부 문서
- [GitHub Repository](https://github.com/ai-biz-eyes)
- [라이브 데모](https://bizeyes.moonwave.kr)
- [API 문서](https://docs.ai-biz-eyes.com)
- [상태 페이지](https://status.ai-biz-eyes.com)

### 개발 도구
- [Postman Collection](https://www.postman.com/collections/ai-biz-eyes-api)
- [Swagger UI](http://localhost:3001/api-docs)
- [Storybook](http://localhost:6006)

---

## 📊 문서 통계

- **총 문서 수**: 15개
- **총 페이지 수**: 약 500페이지
- **마지막 업데이트**: 2024년 12월
- **다음 검토 예정**: 2025년 1월

---

*이 문서는 AI Biz Eyes 프로젝트의 모든 문서에 대한 가이드입니다. 문서 추가나 수정이 필요할 때마다 이 파일도 함께 업데이트해주세요.*
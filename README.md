# B2G 공모사업 자동화 관리 웹서비스

B2G 공모사업 자동화 관리 웹서비스 - 나라장터 공고 통합 관리 대시보드

## 🚀 GitHub Pages 자동 배포

이 프로젝트는 GitHub Actions를 통해 GitHub Pages에 자동으로 배포됩니다.

### 배포 설정 방법

1. **GitHub 저장소 설정**
   - GitHub 저장소의 Settings > Pages로 이동
   - Source를 "GitHub Actions"로 설정

2. **package.json 수정**
   - `homepage` 필드를 실제 GitHub 사용자명과 저장소명으로 수정:
   ```json
   "homepage": "https://[YOUR_GITHUB_USERNAME].github.io/[YOUR_REPOSITORY_NAME]"
   ```

3. **자동 배포**
   - `main` 또는 `master` 브랜치에 푸시하면 자동으로 배포됩니다
   - GitHub Actions 탭에서 배포 진행 상황을 확인할 수 있습니다

### 배포 워크플로우

- **트리거**: `main`/`master` 브랜치에 푸시 또는 PR
- **빌드**: Node.js 18 환경에서 React 앱 빌드
- **배포**: `gh-pages` 브랜치에 빌드된 파일 배포

### 로컬 개발

```bash
cd react-tailwind-app
npm install
npm start
```

### 빌드

```bash
cd react-tailwind-app
npm run build
```

## 🎨 주요 컴포넌트

### 사이드바 (Sidebar)
- 데스크톱에서는 고정 사이드바
- 모바일에서는 오버레이 사이드바
- 문서 카테고리별 분류
- 현재 선택된 문서 하이라이트

### 헤더 (Header)
- 검색 기능
- 알림 버튼
- 사용자 프로필 드롭다운
- 모바일 메뉴 토글

### 메인 콘텐츠 영역
- 문서 제목 및 설명
- 마크다운 렌더링
- 반응형 레이아웃

## 📱 반응형 디자인

- **데스크톱 (lg+)**: 고정 사이드바 + 메인 콘텐츠
- **태블릿 (md-lg)**: 접을 수 있는 사이드바
- **모바일 (sm-md)**: 오버레이 사이드바

## 🎯 사용법

1. **문서 선택**: 왼쪽 사이드바에서 원하는 문서를 클릭
2. **검색**: 상단 검색바를 사용하여 문서 검색
3. **네비게이션**: 사이드바를 통해 다른 문서로 이동
4. **모바일**: 햄버거 메뉴를 통해 사이드바 열기/닫기

## 🔧 커스터마이징

### 새로운 문서 추가
`src/App.vue` 파일의 `technicalDocs` 배열에 새로운 문서 객체를 추가:

```javascript
{
  name: '문서명',
  href: '#',
  current: false,
  description: '문서 설명',
  content: `
    <h1>문서 제목</h1>
    <p>문서 내용...</p>
  `
}
```

### 스타일 수정
`src/style.css` 파일에서 마크다운 스타일을 커스터마이징할 수 있습니다.

## 📄 라이선스

MIT License

## 🤝 기여

프로젝트에 기여하고 싶으시다면 Pull Request를 보내주세요!

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

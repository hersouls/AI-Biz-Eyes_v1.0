# React + Tailwind CSS 개발 환경

이 프로젝트는 React와 Tailwind CSS를 사용하여 현대적이고 반응형인 웹 애플리케이션을 개발할 수 있는 완벽한 개발 환경입니다.

## 🚀 기술 스택

- **React 18** - 현대적인 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안전성을 위한 정적 타입 언어
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Heroicons** - 아름다운 SVG 아이콘 라이브러리
- **Headless UI** - 접근성이 뛰어난 UI 컴포넌트
- **React Router** - 클라이언트 사이드 라우팅

## 📦 설치된 패키지

### 핵심 패키지
- `react` - React 라이브러리
- `typescript` - TypeScript 지원
- `tailwindcss` - CSS 프레임워크
- `postcss` - CSS 후처리기
- `autoprefixer` - CSS 벤더 프리픽스 자동 추가

### UI 및 유틸리티
- `@heroicons/react` - React용 Heroicons
- `@headlessui/react` - 접근성 좋은 UI 컴포넌트
- `react-router-dom` - 라우팅 라이브러리

## 🛠️ 개발 환경 설정

### 1. 프로젝트 설치
```bash
cd react-tailwind-app
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```
브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 빌드
```bash
npm run build
```

### 4. 테스트
```bash
npm test
```

## 📁 프로젝트 구조

```
react-tailwind-app/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── App.tsx                    # 메인 애플리케이션 컴포넌트
│   ├── index.tsx                  # 앱 진입점
│   ├── index.css                  # Tailwind CSS 설정
│   ├── components/                # 재사용 가능한 컴포넌트
│   │   ├── Reference/             # 레퍼런스 관리 컴포넌트
│   │   │   ├── ReferenceManager.tsx
│   │   │   ├── ReferenceList.tsx
│   │   │   ├── ReferenceForm.tsx
│   │   │   ├── ReferenceDetail.tsx
│   │   │   ├── ReferenceStats.tsx
│   │   │   └── index.ts
│   │   ├── BidList/               # 공고 목록 컴포넌트
│   │   ├── BidDetail/             # 공고 상세 컴포넌트
│   │   ├── Dashboard/             # 대시보드 컴포넌트
│   │   └── Layout/                # 레이아웃 컴포넌트
│   ├── types/                     # TypeScript 타입 정의
│   │   ├── bid.ts                 # 공고 관련 타입
│   │   └── reference.ts           # 레퍼런스 관련 타입
│   ├── services/                  # API 서비스
│   │   └── referenceService.ts    # 레퍼런스 API 서비스
│   └── utils/                     # 유틸리티 함수
├── tailwind.config.js             # Tailwind CSS 설정
├── postcss.config.js              # PostCSS 설정
└── package.json
```

## 🚀 주요 기능

### 레퍼런스 관리 시스템
- **레퍼런스 목록 관리**: 조직의 사업 경험과 성과를 체계적으로 관리
- **등록/수정/삭제**: CRUD 기능을 통한 완전한 레퍼런스 관리
- **검색 및 필터링**: 다양한 조건으로 레퍼런스 검색
- **통계 및 분석**: KPI 대시보드와 상세 통계 제공
- **파일 첨부**: 사업 관련 문서 업로드 및 관리
- **AI 기반 매칭**: 유사 공고 자동 매칭 기능

### 공고 관리 시스템
- **공고 목록**: 나라장터 OpenAPI 연동 공고 목록
- **공고 상세**: 상세 정보 및 참여 판단 지원
- **대시보드**: 실시간 현황 및 알림 관리

## 🎨 Tailwind CSS 사용법

### 기본 클래스 예제
```jsx
// 버튼 스타일링
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  클릭하세요
</button>

// 카드 레이아웃
<div className="max-w-sm rounded overflow-hidden shadow-lg">
  <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2">카드 제목</div>
    <p className="text-gray-700 text-base">카드 내용...</p>
  </div>
</div>

// 반응형 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 그리드 아이템들 */}
</div>
```

### 반응형 디자인
```jsx
// 모바일 우선 반응형 클래스
<div className="text-base md:text-lg lg:text-xl">
  반응형 텍스트
</div>

// 화면 크기별 표시/숨김
<div className="hidden md:block">
  데스크톱에서만 표시
</div>
```

## 🧩 컴포넌트 예제

### 재사용 가능한 Button 컴포넌트
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick 
}) => {
  const baseClasses = 'font-semibold rounded transition duration-200';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-blue-600 text-blue-600 hover:bg-blue-50'
  };
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## 🎯 주요 기능

### 1. 반응형 디자인
- 모바일, 태블릿, 데스크톱 모든 화면 크기 지원
- 모바일 우선 디자인 접근법

### 2. 모던 UI 컴포넌트
- 그라디언트 배경
- 박스 섀도우와 호버 효과
- 부드러운 전환 애니메이션

### 3. 접근성
- 의미론적 HTML 구조
- ARIA 속성 지원
- 키보드 네비게이션

### 4. 성능 최적화
- CSS 퍼지 기능으로 미사용 스타일 제거
- 자동 벤더 프리픽스
- 최적화된 빌드 출력

## 🔧 커스터마이징

### Tailwind CSS 설정 수정
`tailwind.config.js`에서 테마를 커스터마이징할 수 있습니다:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

### 커스텀 CSS 컴포넌트
`src/index.css`에 커스텀 클래스를 추가할 수 있습니다:

```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}
```

## 📚 유용한 리소스

### 프로젝트 문서
- [레퍼런스 관리 기능 상세 가이드](./README_REFERENCE.md)
- [공고 목록 기능 가이드](./README_BIDLIST.md)
- [공고 상세 기능 가이드](./README_BIDDETAIL.md)
- [대시보드 기능 가이드](./README_DASHBOARD.md)
- [UI 컴포넌트 가이드](./README_UI_COMPONENTS.md)

### 외부 문서
- [React 공식 문서](https://reactjs.org/)
- [Tailwind CSS 문서](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Headless UI](https://headlessui.com/)
- [TypeScript 문서](https://www.typescriptlang.org/)

## 🤝 기여하기

1. 프로젝트를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**Happy Coding! 🚀**

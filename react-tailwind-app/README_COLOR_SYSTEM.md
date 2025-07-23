# 🎨 새로운 컬러 시스템 가이드

## 📋 개요

AI Biz Eyes 공모사업 자동화 관리 웹서비스에 적용된 새로운 컬러 시스템입니다. CSS Custom Properties와 Tailwind CSS를 활용하여 브랜드 중심의 일관된 디자인을 제공합니다.

## 🎯 컬러 팔레트

### 기본 컬러

| 컬러명 | HEX 코드 | CSS 변수 | 용도 |
|--------|----------|----------|------|
| Primary | #005BAC | `--primary` | 브랜드 중심 강조 |
| Navy | #1B2233 | `--navy` | 정보 밀도 높은 배경 |
| Sky | #0073CE | `--sky` | 전환 유도용 강조 배경 |
| Gray | #D0D4DA | `--gray` | 보조 텍스트/라인 |
| Red | #ED1C24 | `--red` | 주의/제휴/경고용 태그 |
| Purple | #4A3AFF | `--purple` | 관리자/개발자 UI 태그 |
| Black | #000000 | `--black` | 보조 CTA 버튼 배경 |
| White | #FFFFFF | `--white` | 기본 텍스트/배경 |

## 🛠️ 기술적 구현

### CSS Custom Properties

```css
:root {
  /* 🎯 브랜드 중심 강조 (Primary) */
  --primary: #005BAC;

  /* 🧭 정보 밀도 높은 배경 (Dark Background) */
  --navy: #1B2233;

  /* 🌤 긍정·전환 유도 배경 (Light Accent) */
  --sky: #0073CE;

  /* 📰 문서성, 보조 정보 전달용 (Sub Text / Border) */
  --gray: #D0D4DA;

  /* 📢 주의/긴급/제휴 강조 태그 (Alert / Badge) */
  --red: #ED1C24;

  /* 🧪 관리자/개발자 전용 UI 태그 */
  --purple: #4A3AFF;

  /* ⬛ 진중한 선택 유도 버튼 (Secondary CTA) */
  --black: #000000;

  /* 🧾 가독성 중심 텍스트 및 배경 */
  --white: #FFFFFF;
}
```

### Tailwind CSS 확장

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        navy: 'var(--navy)',
        sky: 'var(--sky)',
        gray: 'var(--gray)',
        red: 'var(--red)',
        purple: 'var(--purple)',
        black: 'var(--black)',
        white: 'var(--white)',
      }
    }
  }
}
```

## 🔘 컴포넌트별 적용

### Button 컴포넌트

```tsx
// 🎯 브랜드 중심 강조
<Button variant="primary">Primary Button</Button>

// 🌤 전환 유도용 강조
<Button variant="secondary">Secondary Button</Button>

// ⬛ 진중한 선택 유도
<Button variant="outline">Outline Button</Button>

// 📰 보조 정보 전달
<Button variant="ghost">Ghost Button</Button>

// 📢 주의/경고 액션
<Button variant="danger">Danger Button</Button>

// 🧪 관리자/개발자 전용
<Button variant="admin">Admin Button</Button>
```

### Badge 컴포넌트

```tsx
// 🎯 브랜드 중심 강조
<Badge variant="primary">Primary</Badge>

// 🌤 전환 유도용 강조
<Badge variant="secondary">Secondary</Badge>

// 📢 주의/경고
<Badge variant="danger">Danger</Badge>

// 🧪 관리자/개발자 전용
<Badge variant="admin">Admin</Badge>

// 📰 보조 정보
<Badge variant="gray">Gray</Badge>
```

### Card 컴포넌트

```tsx
// 🧾 기본 카드 스타일
<Card variant="default">
  <CardHeader title="기본 카드" />
  <CardContent>콘텐츠</CardContent>
</Card>

// 🧭 네비게이션 카드 스타일
<Card variant="nav">
  <CardHeader title="네비게이션 카드" />
  <CardContent>콘텐츠</CardContent>
</Card>
```

## 🎨 사용 가이드

### 컬러 선택 기준

1. **Primary (#005BAC)**: 메인 버튼, 브랜드 로고, 주요 액션
2. **Navy (#1B2233)**: 네비게이션, 사이드바, 다크 모드 배경
3. **Sky (#0073CE)**: 호버 상태, 링크, 정보성 강조
4. **Gray (#D0D4DA)**: 보조 텍스트, 테두리, 비활성 상태
5. **Red (#ED1C24)**: 에러, 경고, 삭제 액션
6. **Purple (#4A3AFF)**: 관리자 기능, 개발자 도구
7. **Black (#000000)**: 보조 버튼, 모달 오버레이
8. **White (#FFFFFF)**: 기본 텍스트, 카드 배경

### 접근성 고려사항

- 모든 컬러 조합은 WCAG 2.1 AA 기준을 충족
- 텍스트와 배경 간의 대비비 최소 4.5:1 유지
- 색맹 사용자를 위한 아이콘과 텍스트 라벨 병행 사용

## 🚀 데모 확인

새로운 컬러 시스템을 확인하려면:

1. 개발 서버 실행: `npm start`
2. 브라우저에서 `http://localhost:3000/color-demo` 접속
3. 각 컴포넌트의 다양한 스타일 확인

## 📝 마이그레이션 가이드

### 기존 코드에서 새로운 컬러 시스템으로 변경

```tsx
// 이전
<div className="bg-primary-700 text-white">내용</div>

// 이후
<div className="bg-primary text-white">내용</div>
```

```tsx
// 이전
<Button className="bg-red-600 hover:bg-red-700">버튼</Button>

// 이후
<Button variant="danger">버튼</Button>
```

## 🔧 커스터마이징

### 새로운 컬러 추가

1. `src/index.css`의 `:root`에 CSS 변수 추가
2. `tailwind.config.js`의 colors에 Tailwind 클래스 추가
3. 필요한 컴포넌트에 variant 추가

### 다크 모드 지원

```css
@media (prefers-color-scheme: dark) {
  :root {
    --primary: #0073CE;
    --navy: #FFFFFF;
    --gray: #4A5568;
    /* 기타 다크 모드 컬러 */
  }
}
```

## 📚 참고 자료

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG 2.1 접근성 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)

---

**마지막 업데이트**: 2024년 12월
**버전**: 2.0.0
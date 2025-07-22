# AI Biz Eyes 공모사업 자동화 관리 시스템 - UI 컴포넌트 라이브러리

## 📋 개요

이 프로젝트는 AI Biz Eyes 공모사업 자동화 관리 웹서비스를 위한 기본 및 공통 UI 컴포넌트 라이브러리입니다. 디자인 가이드에 따라 Tailwind CSS와 React를 기반으로 구현되었습니다.

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: `#031B4B` (메인 브랜드 색상)
- **Secondary**: `#119891` (보조 브랜드 색상)
- **State Colors**: 
  - Red: `#EC193A` (에러, 위험)
  - Violet: `#6d8be1` (정보, 링크)

### 타이포그래피
- **폰트**: Pretendard
- **크기 체계**:
  - Heading0: 38px (FO 타이틀)
  - Heading1: 30px (페이지 타이틀)
  - Heading2: 26px (페이지 타이틀)
  - Heading3: 24px (페이지 타이틀)
  - Subtitle1: 20px (서브 타이틀)
  - Subtitle2: 18px (서브 타이틀)
  - Body1: 16px (주요 본문)
  - Body2: 15px (주요 본문/구성요소)
  - Body3: 14px (주요 본문/구성요소)
  - Detail1: 13px (부가 설명)
  - Detail2: 12px (부가 설명)

### 레이아웃
- **전체 화면**: 1025px ~ 1920px 기준 반응형
- **LNB 너비**: 240~260px
- **Border Radius**: 0px (기본), 3px, 5px, 12px (최대)

## 🧩 구현된 컴포넌트

### 1. Button 컴포넌트

다양한 스타일과 크기의 버튼을 제공합니다.

```tsx
import { Button } from './components';

// 기본 사용법
<Button variant="primary" size="md" onClick={handleClick}>
  버튼 텍스트
</Button>

// Props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}
```

**사용 예시:**
```tsx
// 다양한 스타일
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>

// 다양한 크기
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// 아이콘과 함께
<Button 
  leftIcon={<PlusIcon />}
  rightIcon={<ArrowIcon />}
>
  아이콘 버튼
</Button>

// 로딩 상태
<Button loading>Loading...</Button>
```

### 2. Card 컴포넌트

콘텐츠를 담는 카드 컨테이너입니다.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from './components';

// 기본 사용법
<Card>
  <CardHeader title="카드 제목" subtitle="카드 부제목" />
  <CardContent>
    카드 내용
  </CardContent>
  <CardFooter>
    카드 푸터
  </CardFooter>
</Card>

// Props
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}
```

**사용 예시:**
```tsx
// 기본 카드
<Card>
  <CardContent>
    <p>간단한 카드 내용</p>
  </CardContent>
</Card>

// 헤더와 푸터가 있는 카드
<Card>
  <CardHeader 
    title="공고 현황" 
    subtitle="2024년 1월 기준"
    action={<Button size="sm">더보기</Button>}
  />
  <CardContent>
    <p>공고 통계 내용</p>
  </CardContent>
  <CardFooter>
    <span>총 156건</span>
  </CardFooter>
</Card>

// 배지가 있는 카드
<Card
  badge={<Badge variant="success">New</Badge>}
  clickable
  onClick={() => console.log('카드 클릭')}
>
  <CardContent>
    클릭 가능한 카드
  </CardContent>
</Card>
```

### 3. Table 컴포넌트

데이터를 표 형태로 표시하는 테이블입니다.

```tsx
import { Table, TableHeader, TableFooter, Badge } from './components';

// 기본 사용법
<Table
  data={data}
  columns={columns}
  selectable
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
  rowKey="id"
  hover
  striped
/>

// Props
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  rowKey?: keyof T | ((row: T) => string);
  hover?: boolean;
  striped?: boolean;
  compact?: boolean;
}
```

**사용 예시:**
```tsx
// 컬럼 정의
const columns = [
  {
    key: 'bidNtceNo',
    header: '공고번호',
    width: '120px'
  },
  {
    key: 'bidNtceNm',
    header: '공고명',
    render: (value: string) => (
      <span className="font-medium text-primary hover:text-primary-700 cursor-pointer">
        {value}
      </span>
    )
  },
  {
    key: 'status',
    header: '상태',
    align: 'center',
    render: (value: string) => (
      <Badge variant="success">{value}</Badge>
    )
  }
];

// 테이블 사용
<Table
  data={bidData}
  columns={columns}
  selectable
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
  rowKey="id"
  hover
  striped
  onRowClick={(row) => console.log('행 클릭:', row)}
/>
```

### 4. Badge 컴포넌트

상태나 카테고리를 표시하는 배지입니다.

```tsx
import { Badge } from './components';

// 기본 사용법
<Badge variant="success" size="md">
  성공
</Badge>

// Props
interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | 'md';
}
```

**사용 예시:**
```tsx
// 다양한 스타일
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="default">Default</Badge>

// 다양한 크기
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### 5. Input 컴포넌트

텍스트 입력 필드입니다.

```tsx
import { Input } from './components';

// 기본 사용법
<Input
  label="공고명"
  placeholder="공고명을 입력하세요"
  value={value}
  onChange={setValue}
  required
/>

// Props
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
}
```

**사용 예시:**
```tsx
// 기본 입력 필드
<Input
  label="공고명"
  placeholder="공고명을 입력하세요"
  value={value}
  onChange={setValue}
  required
/>

// 아이콘이 있는 입력 필드
<Input
  label="검색"
  placeholder="키워드를 입력하세요"
  leftIcon={<SearchIcon />}
/>

// 에러 상태
<Input
  label="에러 필드"
  placeholder="에러가 있는 입력 필드"
  error="이 필드는 필수입니다."
/>
```

### 6. Select 컴포넌트

드롭다운 선택 필드입니다.

```tsx
import { Select } from './components';

// 기본 사용법
<Select
  label="업무구분"
  options={options}
  value={value}
  onChange={setValue}
  required
/>

// Props
interface SelectProps {
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  name?: string;
  id?: string;
  multiple?: boolean;
  searchable?: boolean;
}
```

**사용 예시:**
```tsx
// 기본 선택 필드
const options = [
  { value: '', label: '선택해주세요' },
  { value: '공사', label: '공사' },
  { value: '용역', label: '용역' },
  { value: '물품', label: '물품' }
];

<Select
  label="업무구분"
  options={options}
  value={value}
  onChange={setValue}
  required
/>

// 다중 선택
<Select
  label="다중 선택"
  options={options}
  multiple
/>
```

## 🚀 시작하기

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build
```

### 컴포넌트 사용

```tsx
import { Button, Card, Table, Badge, Input, Select } from './components';

function MyComponent() {
  return (
    <Card>
      <CardHeader title="내 컴포넌트" />
      <CardContent>
        <Input label="입력 필드" />
        <Button variant="primary">버튼</Button>
      </CardContent>
    </Card>
  );
}
```

## 📱 반응형 디자인

모든 컴포넌트는 모바일부터 데스크톱까지 반응형으로 설계되었습니다:

- **모바일**: 320px ~ 768px
- **태블릿**: 768px ~ 1024px  
- **데스크톱**: 1024px ~ 1920px

## 🎯 접근성 (Accessibility)

- 모든 컴포넌트는 ARIA 속성을 지원합니다
- 키보드 네비게이션을 지원합니다
- 스크린 리더 호환성을 고려했습니다
- 색상 대비를 WCAG 2.1 AA 기준에 맞춰 설계했습니다

## 🔧 커스터마이징

### Tailwind 설정 확장

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#031B4B',
          // ... 색상 팔레트
        }
      },
      fontFamily: {
        'pretendard': ['Pretendard', 'sans-serif'],
      },
      fontSize: {
        'heading0': ['38px', { lineHeight: '150%', fontWeight: '700' }],
        // ... 타이포그래피
      }
    }
  }
}
```

### 컴포넌트 스타일 오버라이드

```tsx
// className prop을 통한 스타일 오버라이드
<Button className="bg-red-500 hover:bg-red-600">
  커스텀 버튼
</Button>

<Card className="border-blue-500 shadow-lg">
  커스텀 카드
</Card>
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
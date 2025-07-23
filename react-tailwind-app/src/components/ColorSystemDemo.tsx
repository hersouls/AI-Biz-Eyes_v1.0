import React from 'react';
import Button from './Button';
import Badge from './Badge';
import Card, { CardHeader, CardContent } from './Card';

const ColorSystemDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-heading1 text-primary mb-4">🎨 새로운 컬러 시스템 데모</h1>
        <p className="text-body2 text-grayscale-border">Tailwind Custom Color 적용/확장</p>
      </div>

      {/* 컬러 팔레트 */}
      <Card>
        <CardHeader title="🎯 컬러 팔레트" subtitle="브랜드 중심의 일관된 컬러 시스템" />
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-5 flex items-center justify-center text-white font-bold">
                Primary
              </div>
              <div className="text-center">
                <p className="text-body3 font-medium text-primary">#031B4B</p>
                <p className="text-detail2 text-grayscale-border">브랜드 중심 강조</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-20 bg-secondary rounded-5 flex items-center justify-center text-white font-bold">
                Secondary
              </div>
              <div className="text-center">
                <p className="text-body3 font-medium text-primary">#119891</p>
                <p className="text-detail2 text-grayscale-border">전환 유도용 강조</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-20 bg-state-red rounded-5 flex items-center justify-center text-white font-bold">
                State Red
              </div>
              <div className="text-center">
                <p className="text-body3 font-medium text-primary">#EC193A</p>
                <p className="text-detail2 text-grayscale-border">주의/경고용 태그</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-20 bg-state-violet rounded-5 flex items-center justify-center text-white font-bold">
                State Violet
              </div>
              <div className="text-center">
                <p className="text-body3 font-medium text-primary">#6d8be1</p>
                <p className="text-detail2 text-grayscale-border">관리자/개발자 UI</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-20 bg-grayscale-light rounded-5 flex items-center justify-center text-primary font-bold">
                Grayscale Light
              </div>
              <div className="text-center">
                <p className="text-body3 font-medium text-primary">#edeff5</p>
                <p className="text-detail2 text-grayscale-border">보조 배경</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-20 bg-grayscale-border rounded-5 flex items-center justify-center text-primary font-bold">
                Grayscale Border
              </div>
              <div className="text-center">
                <p className="text-body3 font-medium text-primary">#e5e7eb</p>
                <p className="text-detail2 text-grayscale-border">테두리/라인</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-20 bg-black rounded-5 flex items-center justify-center text-white font-bold">
                Black
              </div>
              <div className="text-center">
                <p className="text-body3 font-medium text-primary">#000000</p>
                <p className="text-detail2 text-grayscale-border">보조 CTA 버튼</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-20 bg-white border border-grayscale-border rounded-5 flex items-center justify-center text-primary font-bold">
                White
              </div>
              <div className="text-center">
                <p className="text-body3 font-medium text-primary">#ffffff</p>
                <p className="text-detail2 text-grayscale-border">기본 텍스트/배경</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 버튼 컴포넌트 */}
      <Card>
        <CardHeader title="🔘 버튼 컴포넌트" subtitle="용도별 버튼 스타일" />
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="admin">Admin Button</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="xl">Extra Large</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading>Loading</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" fullWidth>Full Width</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 배지 컴포넌트 */}
      <Card>
        <CardHeader title="🏷️ 배지 컴포넌트" subtitle="상태 및 카테고리 표시" />
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="gray">Gray</Badge>
              <Badge variant="admin">Admin</Badge>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary" size="sm">Small</Badge>
              <Badge variant="primary" size="md">Medium</Badge>
              <Badge variant="primary" size="lg">Large</Badge>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary" removable>Removable</Badge>
              <Badge variant="danger" removable>Danger Removable</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카드 컴포넌트 */}
      <Card>
        <CardHeader title="🃏 카드 컴포넌트" subtitle="다양한 카드 스타일" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default" hover>
              <CardHeader title="기본 카드" subtitle="일반적인 콘텐츠 표시용" />
              <CardContent>
                <p className="text-body3 text-grayscale-border">
                  기본 카드는 흰색 배경에 회색 테두리를 사용하여 콘텐츠를 명확하게 구분합니다.
                </p>
              </CardContent>
            </Card>
            
            <Card variant="nav" hover>
              <CardHeader title="네비게이션 카드" subtitle="사이드바 및 네비게이션용" />
              <CardContent>
                <p className="text-body3 text-white/80">
                  네비게이션 카드는 어두운 배경을 사용하여 메뉴 항목을 강조합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* CSS 변수 정보 */}
      <Card>
        <CardHeader title="💻 CSS Custom Properties" subtitle=":root에 정의된 변수들" />
        <CardContent>
          <div className="bg-primary text-white p-4 rounded-5 font-mono text-body3">
            <pre className="whitespace-pre-wrap">
{`:root {
  /* 🎯 Primary 컬러 */
  --primary: #031B4B;

  /* 🌊 Secondary 컬러 */
  --secondary: #119891;

  /* 📊 State 컬러 */
  --state-red: #EC193A;
  --state-violet: #6d8be1;

  /* 🎨 Grayscale/Border/BG 컬러 */
  --grayscale-light: #edeff5;
  --grayscale-border: #e5e7eb;
  --grayscale-bg: #f9fafb;

  /* 기존 호환성을 위한 별칭 */
  --navy: #031B4B;
  --sky: #119891;
  --red: #EC193A;
  --purple: #6d8be1;
  --gray: #edeff5;
  --black: #000000;
  --white: #ffffff;
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorSystemDemo;
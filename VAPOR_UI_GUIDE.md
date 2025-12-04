# Vapor UI 완벽 가이드

> Vapor UI 공식 문서를 분석한 종합 가이드입니다.

## 📚 목차

1. [개요](#개요)
2. [설치 및 설정](#설치-및-설정)
3. [레이아웃 컴포넌트](#레이아웃-컴포넌트)
4. [UI 컴포넌트](#ui-컴포넌트)
5. [Tailwind CSS v4 통합](#tailwind-css-v4-통합)

---

## 개요

Vapor UI는 구름(Goorm)의 공식 디자인 시스템으로, 25개 이상의 컴포넌트를 제공합니다.

### 주요 특징

- ✅ 접근성(Accessibility) 준수
- ✅ 키보드 네비게이션 지원
- ✅ Tailwind CSS v4 완벽 호환
- ✅ 라이트/다크 모드 지원
- ✅ TypeScript 지원

---

## 설치 및 설정

### 기본 설치

```bash
npm install @vapor-ui/core
```

### Tailwind CSS v4 설정

**1. 패키지 설치**

```bash
npm install -D tailwindcss@next @tailwindcss/vite@next
```

**2. CSS 파일 설정 (src/tailwind.css)**

```css
/* 1. 스타일 우선순위 정의 */
@layer tw-theme, vapor, tw-utilities;
@import '@vapor-ui/core/tailwind.css';

/* 2. Tailwind CSS 연결 */
@import 'tailwindcss/theme.css' layer(tw-theme);
@import 'tailwindcss/utilities.css' layer(tw-utilities);
```

**3. Vite 설정 (vite.config.ts)**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**4. 앱에 적용 (main.tsx)**

```tsx
import { ThemeProvider } from '@vapor-ui/core';
import './tailwind.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
```

---

## 레이아웃 컴포넌트

### Box

기본 컨테이너 컴포넌트로 모든 레이아웃의 기반

**주요 Props:**

- `display`: block, inline, flex, grid
- `padding`, `margin`: 간격 제어 (예: `padding="$400"`)
- `backgroundColor`: 배경색 (예: `$primary-200`, `$blue-500`)
- `borderRadius`: 둥근 모서리
- `width`, `height`: 크기 제어

```tsx
<Box padding='$400' backgroundColor='$blue-100' borderRadius='$200'>
  콘텐츠
</Box>
```

### Flex

Flexbox 레이아웃 컴포넌트

**주요 Props:**

- `direction`: row, column, row-reverse, column-reverse
- `gap`: 아이템 간 간격
- `justifyContent`: 주축 정렬
- `alignItems`: 교차축 정렬

```tsx
<Flex direction='row' gap='$200' justifyContent='center'>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Flex>
```

### VStack / HStack

수직/수평 스택 레이아웃 (Flex의 편의 버전)

```tsx
<VStack gap='$300'>
  <Card>Card 1</Card>
  <Card>Card 2</Card>
</VStack>
```

---

## UI 컴포넌트

### Button

사용자 액션을 위한 버튼 컴포넌트

**Color Palettes:**

- `primary`, `secondary`, `success`, `warning`, `danger`, `contrast`

**Sizes:**

- `sm`, `md`, `lg`, `xl`

**Variants:**

- `fill` (기본): 배경색 채움
- `outline`: 테두리만
- `ghost`: 배경 없음

```tsx
<Button colorPalette="primary" size="lg">
  완료
</Button>

<Button variant="outline" colorPalette="danger">
  취소
</Button>

// 아이콘과 함께
<Button>
  <CheckCircleIcon />
  저장
</Button>
```

### Card

콘텐츠 컨테이너 카드

**구조:**

```tsx
<Card.Root>
  <Card.Header>제목</Card.Header>
  <Card.Body>본문 내용</Card.Body>
  <Card.Footer>
    <Button>액션</Button>
  </Card.Footer>
</Card.Root>
```

**선택적 사용:**

- Body만 사용 가능
- Header + Body
- Body + Footer
- 모든 조합 가능

### TextInput

텍스트 입력 필드

**Sizes:** `sm`, `md`, `lg`, `xl`

**Types:** `text`, `email`, `password`

**States:**

- `disabled`: 비활성화
- `invalid`: 유효성 검증 실패
- `readOnly`: 읽기 전용

```tsx
<TextInput
  placeholder="이메일을 입력하세요"
  type="email"
  size="md"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<TextInput
  invalid
  placeholder="오류 상태"
/>
```

### Badge

상태 표시 뱃지

**Color Palettes:**

- `primary`, `hint`, `danger`, `success`, `warning`, `contrast`

**Shapes:**

- `square`: 사각형 (기본)
- `pill`: 둥근 캡슐형

**Sizes:** `sm`, `md`, `lg`

```tsx
<Badge colorPalette="success" shape="pill">
  완료
</Badge>

<Badge colorPalette="danger" size="sm">
  오류
</Badge>
```

### Avatar

프로필 이미지/텍스트 표시

**Sizes:** `sm`, `md`, `lg`, `xl`
**Shapes:** `circle`, `square`

```tsx
<Avatar.Root size='lg' shape='circle'>
  <Avatar.ImagePrimitive src='/profile.jpg' alt='사용자' />
  <Avatar.FallbackPrimitive>김</Avatar.FallbackPrimitive>
</Avatar.Root>
```

### Checkbox

다중 선택 체크박스

**Sizes:** `md`, `lg`

**States:**

- `disabled`: 비활성화
- `invalid`: 유효성 검증 실패
- `readOnly`: 읽기 전용
- `indeterminate`: 부분 선택 (부모-자식 관계)

```tsx
<Checkbox.Root
  checked={checked}
  onCheckedChange={setChecked}
>
  <Checkbox.IndicatorPrimitive />
</Checkbox.Root>

// Indeterminate 예시
<Checkbox.Root
  checked={allChecked}
  indeterminate={someChecked}
  onCheckedChange={handleSelectAll}
>
  <Checkbox.IndicatorPrimitive />
</Checkbox.Root>
```

### Select

드롭다운 선택 컴포넌트

**Sizes:** `sm`, `md`, `lg`, `xl`

**Positioning:** `top`, `right`, `bottom`, `left`

```tsx
<Select.Root value={value} onValueChange={setValue}>
  <Select.Trigger />
  <Select.Popup>
    <Select.Item value='option1'>옵션 1</Select.Item>
    <Select.Item value='option2'>옵션 2</Select.Item>

    <Select.Group>
      <Select.GroupLabel>그룹</Select.GroupLabel>
      <Select.Item value='option3'>옵션 3</Select.Item>
    </Select.Group>
  </Select.Popup>
</Select.Root>
```

### Dialog

모달 대화상자

**Sizes:** `md`, `lg`, `xl`

**Key Props:**

- `modal`: true면 포커스 제한, false면 배경 클릭 가능
- `closeOnClickOverlay`: 오버레이 클릭 시 닫기

```tsx
<Dialog.Root>
  <Dialog.Trigger render={<Button>열기</Button>} />
  <Dialog.Popup>
    <Dialog.Header>
      <Dialog.Title>제목</Dialog.Title>
      <Dialog.Description>설명</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>내용</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close render={<Button>닫기</Button>} />
      <Button colorPalette='primary'>확인</Button>
    </Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>
```

### Toast

알림 메시지 (토스트 알림)

**Color Palettes:** `info`, `success`, `danger`

**사용 방법:**

1. Toast.Provider로 앱 감싸기
2. useToastManager() 훅 사용

```tsx
// Provider 설정
const toastManager = createToastManager()

<Toast.Provider value={toastManager}>
  <App />
</Toast.Provider>

// 컴포넌트에서 사용
function MyComponent() {
  const toast = useToastManager()

  const showToast = () => {
    toast.add({
      title: '성공!',
      description: '작업이 완료되었습니다',
      colorPalette: 'success'
    })
  }

  // Promise 기반 사용
  toast.promise(asyncFunction(), {
    loading: { title: '로딩 중...' },
    success: { title: '완료!' },
    error: { title: '오류 발생' }
  })
}
```

### Menu

드롭다운 메뉴

```tsx
<Menu.Root>
  <Menu.Trigger render={<Button>메뉴</Button>} />
  <Menu.Popup>
    <Menu.Item>항목 1</Menu.Item>
    <Menu.Item disabled>비활성화</Menu.Item>
    <Menu.Separator />

    <Menu.CheckboxItem checked={checked} onCheckedChange={setChecked}>
      체크박스 항목
    </Menu.CheckboxItem>

    <Menu.RadioGroup value={value} onValueChange={setValue}>
      <Menu.RadioItem value='1'>옵션 1</Menu.RadioItem>
      <Menu.RadioItem value='2'>옵션 2</Menu.RadioItem>
    </Menu.RadioGroup>

    {/* 중첩 메뉴 */}
    <Menu.SubmenuRoot>
      <Menu.SubmenuTriggerItem>더보기</Menu.SubmenuTriggerItem>
      <Menu.SubmenuPopup>
        <Menu.Item>서브 항목</Menu.Item>
      </Menu.SubmenuPopup>
    </Menu.SubmenuRoot>
  </Menu.Popup>
</Menu.Root>
```

### Tabs

탭 인터페이스

**Sizes:** `sm`, `md`, `lg`, `xl`
**Variants:** `line`, `plain`
**Orientation:** `horizontal`, `vertical`

```tsx
<Tabs.Root value={activeTab} onValueChange={setActiveTab}>
  <Tabs.List>
    <Tabs.Trigger value='tab1'>탭 1</Tabs.Trigger>
    <Tabs.Trigger value='tab2'>탭 2</Tabs.Trigger>
    <Tabs.Trigger value='tab3' disabled>
      비활성화
    </Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>

  <Tabs.Panel value='tab1'>탭 1 내용</Tabs.Panel>
  <Tabs.Panel value='tab2'>탭 2 내용</Tabs.Panel>
</Tabs.Root>
```

---

## Tailwind CSS v4 통합

### Vapor 유틸리티 클래스

Vapor UI는 `v-` 접두사가 붙은 전용 유틸리티 클래스를 제공합니다.

**디자인 토큰 클래스:**

```tsx
// 색상
className = 'bg-v-blue-500 text-v-red-300 border-v-gray-900';

// 간격
className = 'p-v-100 m-v-200 gap-v-400 w-v-400';

// 둥근 모서리
className = 'rounded-v-200 rounded-t-v-400';

// 폰트 굵기
className = 'font-v-400 font-v-700';
```

**시맨틱 유틸리티:**

```tsx
// 배경색
className = 'bg-v-primary bg-v-secondary bg-v-success bg-v-warning bg-v-danger';

// 텍스트색
className = 'text-v-primary text-v-success text-v-warning text-v-danger text-v-accent';

// 테두리색
className = 'border-v-primary border-v-success border-v-warning border-v-danger';
```

### Tailwind와 조합

```tsx
<Card.Root className='hover:shadow-lg transition-shadow'>
  <Card.Body className='flex items-center gap-4'>
    <Avatar className='bg-v-primary' />
    <div className='flex-1'>
      <h3 className='text-lg font-bold'>제목</h3>
      <p className='text-sm text-gray-600'>설명</p>
    </div>
  </Card.Body>
</Card.Root>
```

### 스타일 우선순위

CSS Layer 순서:

1. Vapor 컴포넌트 기본 스타일 (가장 낮음)
2. Vapor 유틸리티 클래스
3. **Tailwind 유틸리티** (가장 높음)

→ Tailwind 클래스로 Vapor 컴포넌트를 직접 커스터마이징 가능!

---

## 디자인 토큰

### 색상 시스템

- `$blue-{100-900}`: 파란색 팔레트
- `$red-{100-900}`: 빨간색 팔레트
- `$gray-{100-900}`: 회색 팔레트
- `$primary-{100-900}`: 주요 브랜드 색상
- `$success`, `$warning`, `$danger`: 시맨틱 색상

### 간격 (Spacing)

- `$100`, `$200`, `$300`, `$400`, `$500`, `$600`, `$800`: 간격 단위

### 크기 (Size)

- 컴포넌트 크기: `sm`, `md`, `lg`, `xl`
- 레이아웃 크기: `$400`, `$800` 등

---

## 추가 리소스

- **아이콘**: `@vapor-ui/icons` 패키지
- **Figma**: 디자인 파일 제공
- **Theme Playground**: 테마 커스터마이징 도구
- **UI Blocks**: 미리 만들어진 UI 블록 컬렉션

---

## 참고사항

1. **접근성**: 모든 컴포넌트는 WAI-ARIA 표준 준수
2. **키보드**: Tab, Enter, Space, Arrow 키 네비게이션 지원
3. **반응형**: 모든 컴포넌트는 반응형 디자인 지원
4. **타입스크립트**: 완벽한 타입 지원으로 개발 경험 향상

---

## 프로젝트 구조 권장사항

```
src/
  ├── components/        # 커스텀 컴포넌트
  ├── pages/            # 페이지 컴포넌트
  ├── tailwind.css      # Tailwind + Vapor CSS
  ├── index.css         # 전역 스타일
  └── main.tsx          # 앱 진입점
```

---

생성일: 2024-12-04
문서 버전: Vapor UI Beta 7

# 넥스트파트너 Design System — CLAUDE.md

## 프로젝트 개요

**넥스트파트너** 시니어 구직 플랫폼의 디자인 시스템 문서 사이트.  
기존 Vanilla HTML/CSS 버전을 **Tailwind CSS v3** 기반으로 재구축하는 작업.

- 목적: 디자인 토큰·컴포넌트를 시각적으로 문서화하는 정적 HTML 사이트
- 사용자: 디자이너·개발자 내부 참조용
- 언어: 한국어 UI, 코드는 영어
- 각 컴포넌트 항목의 타이틀은 한글(영어)로 통일

---

## 기술 스택

| 항목 | 현재 | 목표 |
|------|------|------|
| CSS | Vanilla CSS + CSS 변수 | Tailwind CSS v3 |
| 빌드 | `build.js` (Node.js, fetch loader) | Vite + Tailwind CLI |
| 구조 | `sections/` 분리 HTML + `loader.js` | 동일 구조 유지 |
| 폰트 | Pretendard Variable (CDN) | 동일 |


---

## Tailwind 설정 원칙

### tailwind.config.js 구조

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './scripts/**/*.js'],
  theme: {
    extend: {
      // 아래 "디자인 토큰" 섹션 참고
    },
  },
  plugins: [],
}
```

### 핵심 규칙

1. **토큰 = Tailwind theme 확장** — CSS 변수 대신 `tailwind.config.js`의 `theme.extend`에 모든 토큰 정의
2. **컴포넌트 클래스는 `@apply`로** — `.np-btn`, `.np-chip` 등 기존 BEM 클래스명 유지, `src/index.css`에 `@apply`로 구현
3. **유틸리티 우선** — 레이아웃·간격·색상은 Tailwind 유틸리티 클래스 직접 사용
4. **`!important` 금지** — 특이성 문제는 클래스 구조로 해결

---

## 디자인 토큰 → Tailwind 매핑

### Colors (`theme.extend.colors`)

```js
colors: {
  primary: {
    500: '#ff7f65',
    400: '#ff9a7a',
    300: '#ffb89f',
    100: '#ffe3dc',
    50:  '#fff4f1',
  },
  neutral: {
    900: '#1a1a1a',
    800: '#333333',
    600: '#666666',
    400: '#999999',
    200: '#e5e5e5',
    100: '#f0f0f0',
    50:  '#f5f5f5',
    0:   '#ffffff',
  },
  'warm-grey': {
    300: '#e5d1c9',
    200: '#ecded9',
    100: '#f5edeb',
    50:  '#f8f4f3',
    25:  '#fbf9f9',
  },
  success: { 500: '#4caf50', 100: '#e8f5e9' },
  warning: { 500: '#ff9800', 100: '#fff3e0' },
  error:   { 500: '#f44336', 100: '#ffebee' },
  info:    { 500: '#2196f3', 100: '#e3f2fd' },
}
```

### Spacing (`theme.extend.spacing`)

```js
spacing: {
  1: '4px',    // --space-1
  2: '8px',    // --space-2
  3: '12px',   // --space-3
  4: '16px',   // --space-4
  5: '20px',   // --space-5
  6: '24px',   // --space-6
  8: '32px',   // --space-8
  10: '40px',  // --space-10
  12: '48px',  // --space-12
  16: '64px',  // --space-16
}
```

> Tailwind 기본 spacing 스케일을 `theme.spacing`으로 완전히 교체하지 말고 **extend** 사용.

### Border Radius (`theme.extend.borderRadius`)

```js
borderRadius: {
  button: '8px',   // --radius-button
  card:   '8px',   // --radius-card
  search: '24px',  // --radius-search
  badge:  '4px',   // --radius-badge
  pill:   '999px', // --radius-pill
}
```

### Icon Sizes (`theme.extend.width`, `theme.extend.height`)

```js
width:  { 'icon-sm': '24px', 'icon-md': '32px', 'icon-lg': '36px' }
height: { 'icon-sm': '24px', 'icon-md': '32px', 'icon-lg': '36px' }
```

### Font Family (`theme.extend.fontFamily`)

```js
fontFamily: {
  base: [
    'Pretendard Variable', 'Pretendard',
    '-apple-system', 'BlinkMacSystemFont',
    'Apple SD Gothic Neo', 'sans-serif',
  ],
}
```

---

## 컴포넌트 목록

### Phase 1 — 초기 구축 대상 (필수)

**Foundation** (색상·타이포·간격·반경·아이콘은 Tailwind 토큰으로 대체되므로 문서 페이지만 유지)

| 파일 | 내용 |
|------|------|
| `sections/foundation/color.html` | 색상 팔레트 |
| `sections/foundation/typography.html` | 타이포그래피 |

**Components — 범용 필수**

| 파일 | 주요 변형 |
|------|----------|
| `sections/components/button.html` | Primary / Secondary / Ghost / Grey / Grey Stroke + SM(40) / MD(48) / LG(56) + Icon Button + FAB |
| `sections/components/textfield.html` | Default / Error / Disabled |
| `sections/components/chip.html` | — |
| `sections/components/badge.html` | — |
| `sections/components/divider.html` | — |

### Phase 2 — 페이지 작업 시 추가

나머지 컴포넌트는 실제 페이지를 작업하면서 필요할 때 추가한다.  
아래 목록을 참조하되, 구현 순서는 페이지 요구에 따라 결정한다.

- `card.html` (Job Card)
- `header.html`
- `bottom-nav.html`
- `checkbox.html`
- `dropdown.html`
- `search.html`
- `dialog.html`
- `bottom-sheet.html`
- `toast.html`
- `progress.html`
- `segmented.html`
- `input-stepper.html`
- `section-container.html`

---

## 프로젝트 구조 (목표)

```
nextpartnerds/
├── CLAUDE.md
├── index.html                        ← 셸 HTML (사이드바 + data-include 플레이스홀더)
├── tailwind.config.js
├── src/
│   └── index.css                     ← @tailwind 디렉티브 + @layer components (@apply)
├── dist/
│   └── index.css                     ← Tailwind 빌드 아웃풋 (gitignore)
├── scripts/
│   ├── loader.js                     ← fetch 기반 섹션 로더 (유지)
│   └── interactions.js               ← Job Card 등 동적 렌더러 (유지)
├── sections/
│   ├── foundation/
│   └── components/
└── package.json
```

---

## CSS 작성 방식

### 1) 레이아웃·간격 — 유틸리티 직접 사용

```html
<div class="flex items-center gap-2 px-4 py-3">
```

### 2) 컴포넌트 클래스 — `@layer components` + `@apply`

`src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .np-btn {
    @apply inline-flex items-center justify-content-center gap-2
           font-base font-bold text-[18px]
           rounded-button border-none cursor-pointer
           transition-all duration-[120ms] ease-out
           whitespace-nowrap relative;
  }
  .np-btn:focus-visible {
    @apply outline-none shadow-[0_0_0_3px_rgba(255,184,159,0.35)];
  }
  .np-btn-primary {
    @apply bg-primary-500 text-neutral-0
           hover:bg-primary-400 active:bg-primary-300;
  }
  /* ... */
}
```

### 3) 커스텀 값 — 임의값(`[]`) 허용, 단 반복되면 토큰화

```html
<div class="w-[220px]">         <!-- 사이드바 너비처럼 재사용 없으면 OK -->
<div class="shadow-[0_1px_4px_rgba(0,0,0,0.08)]">  <!-- 그림자 -->
```

---

## 개발 서버 및 빌드

```bash
# 의존성 설치
npm install

# 개발 (Tailwind watch + Live Server)
npx tailwindcss -i ./src/index.css -o ./dist/index.css --watch

# 프로덕션 빌드
npx tailwindcss -i ./src/index.css -o ./dist/index.css --minify
node build.js   # HTML 번들
```

`index.html`에서 `dist/index.css` 링크:

```html
<link rel="stylesheet" href="dist/index.css" />
```

---

## 코드 스타일

- 클래스 순서: **레이아웃 → 크기 → 간격 → 색상 → 타이포 → 기타**
- 컴포넌트 클래스명 접두사: `np-` 유지 (기존 명칭과 연속성)
- `@apply` 내에서 줄바꿈 시 논리 그룹별로 정렬 (레이아웃 / 색상 / 인터랙션)
- HTML 섹션 파일에는 `<style>` 블록 없음 — 모든 스타일은 `src/index.css`에서 관리

---

## 반응형 (Responsive Design)

### 브레이크포인트

Tailwind 기본 브레이크포인트를 그대로 사용한다.

| 이름 | 최소 너비 | 환경 |
|------|-----------|------|
| (기본) | < 768px | 모바일 |
| `md` | ≥ 768px | 태블릿 |
| `lg` | ≥ 1024px | 데스크탑 |

### 콘텐츠 최대 너비

데스크탑에서 콘텐츠는 **1212px** 중앙 정렬. `tailwind.config.js`에 커스텀 토큰 추가:

```js
maxWidth: { content: '1212px' }
```

```html
<!-- 사용법 -->
<div class="w-full max-w-content mx-auto px-4 md:px-6">
  <!-- 콘텐츠 -->
</div>
```

### 레이아웃 패턴

- **모바일**: 단일 컬럼, 좌우 패딩 `px-4`
- **태블릿(md)**: 2컬럼 허용, 좌우 패딩 `md:px-6`
- **데스크탑(lg)**: `max-w-content` 중앙 정렬, 좌우 패딩 `lg:px-8`

### 헤더·푸터

- 배경/보더는 전체 너비(`w-full`)
- 내부 콘텐츠는 `np-header-inner` / `np-footer-inner` 래퍼로 `max-w-content` 적용
- 헤더 네비게이션: 모바일에서 숨김(`hidden md:flex`), 태블릿+ 표시
- 모바일 헤더: 로고 + 햄버거 버튼만 노출

---

## 시니어 UX 원칙

넥스트파트너의 주 사용자는 **50세 이상 시니어**. 아래 원칙을 디자인·개발 결정 시 최우선으로 적용한다.

### 1. 간결한 정보 구조
- 한 화면에 핵심 정보 1~2개만 노출
- 불필요한 선택지·옵션 제거
- CTA(Call to Action)는 화면당 최대 1개

### 2. 명료한 문구
- 짧고 직접적인 단어 사용 (전문 용어 지양)
- 버튼·레이블은 동작을 명확히 표현 ("확인" → "지원하기", "저장하기")
- 오류·안내 메시지는 해결 방법 포함

### 3. 시각적 단순함
- 사용 색상 최소화: **neutral 계열 + primary 강조** 2가지만 기본 사용
- semantic 색상(success/warning/error/info)은 명확한 피드백 상황에만 사용
- 장식적 요소 금지 — 목적 없는 그라디언트·아이콘·그림자 지양

### 4. 충분한 터치 영역
- 버튼 최소 높이: **MD(48px)** 이상 권장, 모바일에서는 **LG(56px)** 우선
- 탭 가능 요소 간 최소 간격: 8px 이상

### 5. 읽기 편한 타이포그래피
- 본문 최소: `text-base` (16px) 이상
- 중요 정보: `text-lg` (18px) 또는 `text-xl` (20px)
- 줄 간격: `leading-relaxed` 기본

---

## 주의 사항

- **Tailwind v3** (v4 아님) — `content`, `theme.extend`, `@layer` 문법 사용
- Tailwind 기본 reset(`preflight`)과 기존 `* { box-sizing: border-box }` 충돌 없음 — preflight 활성화 유지
- `sections/` 파일들은 `<style>` 블록 제거 후 순수 HTML만 유지
- `loader.js`의 `<style>` 추출 로직은 더 이상 필요 없으므로 단순화 가능
- Pretendard CDN 링크는 `index.html` `<head>`에 유지 (Tailwind가 폰트 파일을 번들하지 않음)

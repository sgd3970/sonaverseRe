# 로고 설정 완료 ✅

## 📁 로고 파일 위치

**디렉토리**: `C:\Users\cse39\Desktop\sonaverseRe\public\logo`

### 준비된 파일

✅ **한국어 로고**: `ko_logo.png` (12.4 KB)
✅ **영문 로고**: `en_logo.png` (1.49 MB) ⚠️ 크기가 큽니다 - 최적화 권장
✅ **심볼 로고**: `symbol_logo.png` (10.6 KB)

---

## 🎨 Logo 컴포넌트 사용법

### 1. Header에서 사용 (자동 언어 전환)

```tsx
import { Logo } from "@/shared/components/ui/Logo";

// 현재 언어에 따라 ko_logo.png 또는 en_logo.png 자동 전환
<Logo type="full" size="md" linkToHome priority />
```

### 2. Footer에서 사용

```tsx
// 링크 없이 로고만 표시
<Logo type="full" size="md" linkToHome={false} />
```

### 3. 심볼 로고 사용

```tsx
// 모바일이나 파비콘 등에서
<Logo type="symbol" size="sm" />
```

---

## 🔧 Logo 컴포넌트 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | `"full"` \| `"symbol"` | `"full"` | 전체 로고 또는 심볼만 |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | 로고 크기 |
| `linkToHome` | `boolean` | `true` | 클릭 시 홈으로 이동 여부 |
| `priority` | `boolean` | `false` | 이미지 우선 로딩 (LCP 최적화) |
| `className` | `string` | - | 추가 CSS 클래스 |

### 크기별 dimensions

**전체 로고 (`type="full"`)**:
- `sm`: 96 x 32px (모바일)
- `md`: 120 x 40px (데스크톱 기본)
- `lg`: 160 x 53px (대형)

**심볼 로고 (`type="symbol"`)**:
- `sm`: 32 x 32px
- `md`: 40 x 40px
- `lg`: 56 x 56px

---

## 🌐 언어별 자동 전환

Logo 컴포넌트는 `useLocale()` 훅을 사용하여 현재 언어를 감지하고 자동으로 로고를 전환합니다.

```tsx
// 한국어(ko) → /logo/ko_logo.png
// 영어(en) → /logo/en_logo.png
<Logo type="full" size="md" />
```

---

## ⚠️ 이미지 최적화 권장사항

### en_logo.png 최적화 필요

현재 `en_logo.png` 파일 크기가 **1.49 MB**로 매우 큽니다.

**최적화 방법**:

1. **TinyPNG 사용** (https://tinypng.com/)
   - 품질 손실 없이 70-80% 압축 가능

2. **ImageOptim 사용** (Mac)
   - 드래그 앤 드롭으로 간편 최적화

3. **Squoosh 사용** (https://squoosh.app/)
   - 브라우저에서 바로 최적화

4. **목표 파일 크기**: 50KB 이하

### SVG 변환 권장

가능하다면 로고를 SVG 형식으로 변환하는 것을 권장합니다:
- 파일 크기 대폭 감소 (보통 5-20KB)
- 확대/축소 시 선명도 유지
- 다크모드 대응 용이

**변환 도구**:
- Adobe Illustrator
- Inkscape (무료)
- Vectorizer.AI (자동 변환)

---

## 📱 적용된 위치

### ✅ Header 컴포넌트
파일: `src/shared/components/layout/Header.tsx`

```tsx
<Logo type="full" size="md" linkToHome priority className="shrink-0" />
```

**특징**:
- 언어 전환 시 자동으로 로고 변경
- `priority` prop으로 LCP 최적화
- 클릭 시 홈으로 이동

### ✅ Footer 컴포넌트
파일: `src/shared/components/layout/Footer.tsx`

```tsx
<Logo type="full" size="md" linkToHome={false} />
```

**특징**:
- 언어 전환 시 자동으로 로고 변경
- 링크 없이 로고만 표시

---

## 🎯 Fallback 로고

로고 이미지 로드에 실패할 경우 자동으로 텍스트 기반 폴백 로고가 표시됩니다:

```tsx
import { FallbackLogo } from "@/shared/components/ui/Logo";

// 아이콘 + 텍스트 조합
<FallbackLogo linkToHome />
```

---

## 📦 파일 구조

```
public/logo/
├── ko_logo.png          # 한국어 로고 (12.4 KB) ✅
├── en_logo.png          # 영문 로고 (1.49 MB) ⚠️ 최적화 필요
├── symbol_logo.png      # 심볼 로고 (10.6 KB) ✅
└── README.md            # 로고 사용 가이드
```

---

## 🚀 Next Steps (선택사항)

### 1. en_logo.png 최적화
```bash
# TinyPNG API 사용 예시
npx tinify public/logo/en_logo.png
```

### 2. SVG 버전 추가
SVG 파일이 있다면 같은 폴더에 추가:
```
public/logo/
├── ko_logo.svg
├── en_logo.svg
└── symbol_logo.svg
```

Logo 컴포넌트가 자동으로 SVG를 우선 사용하도록 업데이트 가능합니다.

### 3. WebP 버전 추가 (차세대 포맷)
```
public/logo/
├── ko_logo.webp
├── en_logo.webp
└── symbol_logo.webp
```

Next.js Image 컴포넌트가 자동으로 최적 포맷을 선택합니다.

---

## ✨ 완료!

로고 시스템이 성공적으로 설정되었습니다!
- ✅ 언어별 자동 전환
- ✅ Header & Footer 적용 완료
- ✅ 반응형 크기 지원
- ✅ 이미지 최적화 (Next/Image)

**작성일**: 2024-12-18

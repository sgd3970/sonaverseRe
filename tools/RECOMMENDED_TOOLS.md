# Sonaverse 홈페이지 추천 도구 및 플러그인

> **목적**: Sonaverse 홈페이지 리뉴얼 프로젝트에 적용하면 좋을 도구와 플러그인을 정리  
> **원칙**: 성능 최우선, 모듈화, 개발 경험 향상, 유지보수성 개선

---

## 📋 목차

1. [성능 최적화 도구](#1-성능-최적화-도구)
2. [이미지 최적화 도구](#2-이미지-최적화-도구)
3. [개발 경험 향상 도구](#3-개발-경험-향상-도구)
4. [코드 품질 및 정적 분석 도구](#4-코드-품질-및-정적-분석-도구)
5. [모니터링 및 분석 도구](#5-모니터링-및-분석-도구)
6. [보안 도구](#6-보안-도구)
7. [빌드 및 배포 도구](#7-빌드-및-배포-도구)
8. [데이터베이스 도구](#8-데이터베이스-도구)
9. [테스팅 도구](#9-테스팅-도구)
10. [SEO 및 접근성 도구](#10-seo-및-접근성-도구)

---

## 1. 성능 최적화 도구

### 1.1 번들 분석 도구

#### `@next/bundle-analyzer`
- **목적**: Next.js 번들 크기 분석 및 최적화
- **설치**: `npm install -D @next/bundle-analyzer`
- **사용법**:
```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... 기존 설정
})
```
- **장점**: 큰 의존성 식별, 중복 코드 발견, 트리 쉐이킹 검증
- **우선순위**: ⭐⭐⭐⭐⭐ (필수)

#### `webpack-bundle-analyzer`
- **목적**: 상세한 번들 분석 (시각화)
- **설치**: `npm install -D webpack-bundle-analyzer`
- **사용법**: `npm run build -- --stats-json && npx webpack-bundle-analyzer .next/analyze/client.json`
- **장점**: 인터랙티브 시각화, 모듈별 크기 분석

### 1.2 성능 측정 도구

#### `@vercel/speed-insights`
- **목적**: Vercel 배포 시 실시간 성능 메트릭 수집
- **설치**: `npm install @vercel/speed-insights`
- **사용법**:
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```
- **장점**: Core Web Vitals 자동 수집, 대시보드 제공
- **우선순위**: ⭐⭐⭐⭐⭐ (Vercel 배포 시 필수)

#### `@vercel/analytics`
- **목적**: 페이지뷰, 사용자 행동 분석
- **설치**: `npm install @vercel/analytics`
- **사용법**:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```
- **장점**: 프라이버시 친화적, GDPR 준수, 무료

#### `lighthouse-ci`
- **목적**: CI/CD 파이프라인에서 자동 성능 테스트
- **설치**: `npm install -g @lhci/cli`
- **설정**:
```javascript
// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
}
```
- **장점**: 자동화된 성능 검증, PR 체크 가능
- **우선순위**: ⭐⭐⭐⭐

### 1.3 코드 스플리팅 도구

#### `next/dynamic` (내장)
- **목적**: 동적 임포트로 코드 스플리팅
- **사용법**:
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // 클라이언트 전용 컴포넌트
})
```
- **장점**: 초기 번들 크기 감소, 지연 로딩

#### `@loadable/component`
- **목적**: React 컴포넌트 지연 로딩 (대안)
- **설치**: `npm install @loadable/component`
- **장점**: 서버 사이드 렌더링 지원, 프리로딩 기능

---

## 2. 이미지 최적화 도구

### 2.1 이미지 CDN 및 최적화

#### `next/image` (내장)
- **목적**: Next.js 내장 이미지 최적화
- **장점**: 자동 WebP/AVIF 변환, 반응형 이미지, Lazy loading
- **우선순위**: ⭐⭐⭐⭐⭐ (필수 사용)

#### `sharp`
- **목적**: 서버 사이드 이미지 처리 (Next.js 기본 사용)
- **설치**: `npm install sharp` (선택, Next.js가 자동 설치)
- **장점**: 빠른 이미지 리사이징, 포맷 변환

#### `@vercel/blob` (이미 사용 중)
- **목적**: 파일 스토리지 및 CDN
- **현재 상태**: ✅ 이미 사용 중
- **추가 활용**: 이미지 업로드 API에서 자동 최적화 파이프라인 구축

### 2.2 이미지 최적화 라이브러리

#### `plaiceholder`
- **목적**: 이미지 플레이스홀더 생성 (Blur-up 효과)
- **설치**: `npm install plaiceholder`
- **사용법**:
```typescript
import { getPlaiceholder } from 'plaiceholder'

export async function getBlurDataURL(src: string) {
  const buffer = await fetch(src).then((res) => res.arrayBuffer())
  const { base64 } = await getPlaiceholder(Buffer.from(buffer))
  return base64
}
```
- **장점**: CLS 개선, 사용자 경험 향상
- **우선순위**: ⭐⭐⭐⭐

#### `lqip` (Low Quality Image Placeholder)
- **목적**: 저품질 이미지 플레이스홀더
- **설치**: `npm install lqip`
- **장점**: 빠른 초기 로딩, CLS 방지

### 2.3 이미지 압축 도구

#### `imagemin` + 플러그인
- **목적**: 빌드 타임 이미지 압축
- **설치**: `npm install -D imagemin imagemin-webp imagemin-avif`
- **사용법**:
```javascript
// scripts/optimize-images.js
const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp')
const imageminAvif = require('imagemin-avif')

imagemin(['public/images/**/*.{jpg,png}'], {
  destination: 'public/images-optimized',
  plugins: [
    imageminWebp({ quality: 80 }),
    imageminAvif({ quality: 70 }),
  ],
})
```
- **장점**: 빌드 시 자동 최적화, 파일 크기 감소
- **우선순위**: ⭐⭐⭐

---

## 3. 개발 경험 향상 도구

### 3.1 타입 안정성

#### `zod`
- **목적**: 런타임 타입 검증 및 스키마 정의
- **설치**: `npm install zod`
- **사용법**:
```typescript
import { z } from 'zod'

const InquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
})

// API 라우트에서 사용
export async function POST(req: Request) {
  const body = await req.json()
  const validated = InquirySchema.parse(body) // 자동 타입 추론
}
```
- **장점**: API 검증, 폼 검증, 타입 안정성
- **우선순위**: ⭐⭐⭐⭐⭐ (API 검증 필수)

#### `@hookform/resolvers` + `zod`
- **목적**: React Hook Form과 Zod 통합
- **설치**: `npm install @hookform/resolvers`
- **사용법**:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const form = useForm({
  resolver: zodResolver(InquirySchema),
})
```
- **장점**: 타입 안전한 폼 관리

### 3.2 폼 관리

#### `react-hook-form`
- **목적**: 성능 최적화된 폼 관리
- **설치**: `npm install react-hook-form`
- **장점**: 리렌더링 최소화, 성능 우수
- **우선순위**: ⭐⭐⭐⭐⭐ (폼이 많은 프로젝트)

### 3.3 상태 관리

#### `zustand`
- **목적**: 가벼운 상태 관리 (필요 시)
- **설치**: `npm install zustand`
- **장점**: 번들 크기 작음, TypeScript 친화적
- **우선순위**: ⭐⭐⭐ (복잡한 전역 상태가 필요한 경우만)

#### React Context (내장)
- **목적**: 간단한 전역 상태 (언어 설정 등)
- **현재 상태**: ✅ 이미 사용 중 (LanguageProvider)
- **권장**: 간단한 상태는 Context 유지

### 3.4 개발 도구

#### `eslint-config-next`
- **목적**: Next.js 공식 ESLint 설정
- **설치**: `npm install -D eslint-config-next`
- **설정**:
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```
- **우선순위**: ⭐⭐⭐⭐⭐ (필수)

#### `prettier`
- **목적**: 코드 포맷팅
- **설치**: `npm install -D prettier eslint-config-prettier`
- **설정**:
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```
- **우선순위**: ⭐⭐⭐⭐⭐ (코드 일관성)

#### `husky` + `lint-staged`
- **목적**: Git 훅으로 자동 린트/테스트
- **설치**: `npm install -D husky lint-staged`
- **설정**:
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```
- **우선순위**: ⭐⭐⭐⭐

---

## 4. 코드 품질 및 정적 분석 도구

### 4.1 정적 분석

#### `typescript-eslint`
- **목적**: TypeScript 전용 ESLint 규칙
- **설치**: `npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin`
- **우선순위**: ⭐⭐⭐⭐⭐ (TypeScript 프로젝트 필수)

#### `eslint-plugin-react-hooks`
- **목적**: React Hooks 규칙 검증
- **설치**: `npm install -D eslint-plugin-react-hooks`
- **우선순위**: ⭐⭐⭐⭐⭐ (React 프로젝트 필수)

#### `eslint-plugin-import`
- **목적**: Import/Export 규칙 검증
- **설치**: `npm install -D eslint-plugin-import`
- **장점**: 순환 의존성 감지, 정렬 검증

### 4.2 코드 복잡도 분석

#### `complexity-report`
- **목적**: 코드 복잡도 측정
- **설치**: `npm install -D complexity-report`
- **사용법**: `npx complexity-report src/`
- **장점**: 순환 복잡도, 유지보수성 지수 측정

#### `jscpd` (이미 문서에 언급됨)
- **목적**: 코드 중복 감지
- **설치**: `npm install -D jscpd`
- **사용법**: `npx jscpd ./src`
- **우선순위**: ⭐⭐⭐

### 4.3 타입 체크

#### `tsc --noEmit`
- **목적**: 타입 체크만 수행 (빌드 없이)
- **사용법**: `npm run type-check` (package.json에 추가)
- **우선순위**: ⭐⭐⭐⭐⭐ (CI/CD에 필수)

---

## 5. 모니터링 및 분석 도구

### 5.1 에러 추적

#### `@sentry/nextjs`
- **목적**: 에러 추적 및 성능 모니터링
- **설치**: `npm install @sentry/nextjs`
- **설정**:
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```
- **장점**: 실시간 에러 알림, 스택 트레이스, 성능 모니터링
- **우선순위**: ⭐⭐⭐⭐ (프로덕션 필수)

#### `logtail` (Better Stack)
- **목적**: 구조화된 로깅
- **설치**: `npm install @logtail/node @logtail/browser`
- **장점**: 실시간 로그 수집, 검색 가능

### 5.2 사용자 분석

#### Google Analytics 4 (GA4)
- **목적**: 사용자 행동 분석
- **설치**: `npm install @next/third-parties`
- **사용법**:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```
- **우선순위**: ⭐⭐⭐ (비즈니스 요구사항에 따라)

#### `@vercel/analytics` (이미 추천됨)
- **목적**: 프라이버시 친화적 분석
- **우선순위**: ⭐⭐⭐⭐ (GA4 대안)

---

## 6. 보안 도구

### 6.1 의존성 보안

#### `npm audit` (내장)
- **목적**: 취약점 스캔
- **사용법**: `npm audit` / `npm audit fix`
- **우선순위**: ⭐⭐⭐⭐⭐ (정기적 실행 필수)

#### `snyk`
- **목적**: 고급 보안 스캔
- **설치**: `npm install -g snyk`
- **사용법**: `snyk test` / `snyk monitor`
- **장점**: CI/CD 통합, 자동 알림

#### `dependabot` (GitHub)
- **목적**: 자동 의존성 업데이트
- **설정**: `.github/dependabot.yml`
- **우선순위**: ⭐⭐⭐⭐

### 6.2 API 보안

#### `rate-limiter-flexible`
- **목적**: API Rate Limiting
- **설치**: `npm install rate-limiter-flexible`
- **사용법**:
```typescript
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
})

// API 라우트에서 사용
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  try {
    await rateLimiter.consume(ip)
    // ... 처리
  } catch {
    return new Response('Too Many Requests', { status: 429 })
  }
}
```
- **우선순위**: ⭐⭐⭐⭐ (공개 API 필수)

#### `helmet` (Next.js는 자체 보안 헤더 제공)
- **목적**: 보안 헤더 설정
- **참고**: Next.js는 `next.config.ts`에서 보안 헤더 설정 가능
- **우선순위**: ⭐⭐⭐ (필요 시)

---

## 7. 빌드 및 배포 도구

### 7.1 환경 변수 관리

#### `.env` 파일 (내장)
- **목적**: 환경 변수 관리
- **우선순위**: ⭐⭐⭐⭐⭐ (필수)

#### `dotenv-cli`
- **목적**: 스크립트 실행 시 환경 변수 로드
- **설치**: `npm install -D dotenv-cli`
- **사용법**: `dotenv -e .env.local -- npm run dev`

### 7.2 배포

#### Vercel (이미 사용 중)
- **현재 상태**: ✅ 이미 사용 중
- **추가 기능**: Preview Deployments, Analytics, Speed Insights

#### GitHub Actions
- **목적**: CI/CD 파이프라인
- **설정**: `.github/workflows/ci.yml`
- **우선순위**: ⭐⭐⭐⭐

---

## 8. 데이터베이스 도구

### 8.1 ODM/ORM

#### `mongoose` (이미 사용 중)
- **현재 상태**: ✅ 이미 사용 중
- **추가 활용**: 스키마 검증 강화, 인덱스 최적화

### 8.2 마이그레이션

#### `migrate-mongo`
- **목적**: MongoDB 마이그레이션 관리
- **설치**: `npm install -D migrate-mongo`
- **사용법**:
```bash
migrate-mongo create add-admin-user-index
migrate-mongo up
```
- **우선순위**: ⭐⭐⭐⭐ (스키마 변경 시 필수)

### 8.3 데이터베이스 GUI

#### MongoDB Compass
- **목적**: MongoDB 시각적 관리
- **우선순위**: ⭐⭐⭐ (개발 환경)

#### Studio 3T
- **목적**: 고급 MongoDB 관리 도구
- **우선순위**: ⭐⭐ (선택)

---

## 9. 테스팅 도구

### 9.1 단위 테스트

#### `vitest`
- **목적**: 빠른 단위 테스트 프레임워크
- **설치**: `npm install -D vitest @vitest/ui`
- **설정**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
```
- **장점**: Vite 기반, 빠른 실행, TypeScript 지원
- **우선순위**: ⭐⭐⭐⭐

#### `@testing-library/react`
- **목적**: React 컴포넌트 테스트
- **설치**: `npm install -D @testing-library/react @testing-library/jest-dom`
- **우선순위**: ⭐⭐⭐⭐

### 9.2 E2E 테스트

#### `playwright`
- **목적**: E2E 테스트
- **설치**: `npm install -D @playwright/test`
- **장점**: 빠른 실행, 여러 브라우저 지원
- **우선순위**: ⭐⭐⭐

#### `cypress` (대안)
- **목적**: E2E 테스트
- **설치**: `npm install -D cypress`
- **장점**: 개발자 친화적 UI

### 9.3 시각적 회귀 테스트

#### `chromatic` (Storybook 기반)
- **목적**: 컴포넌트 시각적 회귀 테스트
- **우선순위**: ⭐⭐ (디자인 시스템이 복잡한 경우)

---

## 10. SEO 및 접근성 도구

### 10.1 SEO

#### `next-seo`
- **목적**: SEO 메타데이터 관리
- **설치**: `npm install next-seo`
- **사용법**:
```typescript
import { NextSeo } from 'next-seo'

<NextSeo
  title="Sonaverse - 시니어테크 스타트업"
  description="..."
  openGraph={{
    url: 'https://sonaverse.kr',
    images: [{ url: '...' }],
  }}
/>
```
- **우선순위**: ⭐⭐⭐⭐

#### `sitemap-generator`
- **목적**: 사이트맵 자동 생성
- **설치**: `npm install -D next-sitemap`
- **설정**:
```javascript
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://sonaverse.kr',
  generateRobotsTxt: true,
}
```
- **우선순위**: ⭐⭐⭐

### 10.2 접근성

#### `@axe-core/react`
- **목적**: 접근성 검사 (개발 환경)
- **설치**: `npm install -D @axe-core/react`
- **사용법**:
```typescript
// app/layout.tsx (개발 환경만)
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000)
  })
}
```
- **우선순위**: ⭐⭐⭐

#### `eslint-plugin-jsx-a11y`
- **목적**: 접근성 린트 규칙
- **설치**: `npm install -D eslint-plugin-jsx-a11y`
- **우선순위**: ⭐⭐⭐⭐

---

## 📊 우선순위 요약

### 필수 (즉시 적용)
1. ✅ `@next/bundle-analyzer` - 번들 분석
2. ✅ `@vercel/speed-insights` - 성능 모니터링 (Vercel 배포 시)
3. ✅ `zod` - API 검증
4. ✅ `react-hook-form` - 폼 관리
5. ✅ `eslint-config-next` + `prettier` - 코드 품질
6. ✅ `plaiceholder` - 이미지 플레이스홀더
7. ✅ `rate-limiter-flexible` - API 보안

### 높은 우선순위 (1주일 내)
8. ⭐⭐⭐⭐ `lighthouse-ci` - 자동 성능 테스트
9. ⭐⭐⭐⭐ `@sentry/nextjs` - 에러 추적
10. ⭐⭐⭐⭐ `vitest` + `@testing-library/react` - 테스트
11. ⭐⭐⭐⭐ `migrate-mongo` - 데이터베이스 마이그레이션
12. ⭐⭐⭐⭐ `next-seo` - SEO 최적화

### 중간 우선순위 (1개월 내)
13. ⭐⭐⭐ `imagemin` - 이미지 압축
14. ⭐⭐⭐ `playwright` - E2E 테스트
15. ⭐⭐⭐ `snyk` - 보안 스캔
16. ⭐⭐⭐ `eslint-plugin-jsx-a11y` - 접근성

### 선택적 (필요 시)
17. ⭐⭐ `zustand` - 상태 관리 (필요한 경우만)
18. ⭐⭐ `chromatic` - 시각적 회귀 테스트
19. ⭐⭐ `logtail` - 구조화된 로깅

---

## 🚀 적용 가이드

### 1단계: 필수 도구 설치 (1일)
```bash
npm install -D @next/bundle-analyzer zod react-hook-form @hookform/resolvers
npm install -D eslint-config-next prettier eslint-config-prettier
npm install plaiceholder rate-limiter-flexible
```

### 2단계: 설정 파일 생성 (1일)
- `.eslintrc.json` - ESLint 설정
- `.prettierrc` - Prettier 설정
- `next.config.ts` - Bundle Analyzer 통합
- `vitest.config.ts` - 테스트 설정

### 3단계: CI/CD 통합 (2일)
- GitHub Actions 워크플로우
- Lighthouse CI 설정
- 자동 테스트 파이프라인

### 4단계: 모니터링 설정 (1일)
- Sentry 통합
- Vercel Analytics 설정
- 에러 추적 설정

---

**작성일**: 2025년 1월  
**목적**: Sonaverse 홈페이지 리뉴얼 프로젝트 도구 선정 가이드  
**상태**: 추천 완료 (구현 대기)


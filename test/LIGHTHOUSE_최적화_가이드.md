# Lighthouse 성능 최적화 가이드

> **작성일**: 2025-01-21  
> **대상 환경**: 데스크톱, 모바일  
> **분석 도구**: Google Lighthouse  
> **목표**: 성능 점수 향상 및 Core Web Vitals 개선

---

## 📊 목차

1. [환경별 성능 현황 요약](#환경별-성능-현황-요약)
2. [데스크톱 환경 최적화 작업](#데스크톱-환경-최적화-작업)
3. [모바일 환경 최적화 작업](#모바일-환경-최적화-작업)
4. [이미지 최적화 상세 분석](#이미지-최적화-상세-분석)
5. [우선순위별 작업 체크리스트](#우선순위별-작업-체크리스트)

---

## 환경별 성능 현황 요약

### 데스크톱 환경

| 측정항목 | 현재 값 | 목표 값 | 상태 |
|---------|--------|--------|------|
| **성능 점수** | - | 90+ | 개선 필요 |
| **LCP** | 1.2초 | < 2.5초 | ✅ 통과 |
| **FCP** | 1.1초 | < 1.8초 | ✅ 통과 |
| **TBT** | 200ms | < 200ms | ✅ 통과 |
| **CLS** | 0.01 | < 0.1 | ✅ 통과 |
| **Speed Index** | 1.0초 | < 3.4초 | ✅ 통과 |
| **INP** | 188ms | < 200ms | ✅ 통과 |

**코어 웹 바이탈**: ✅ 통과

### 모바일 환경

| 측정항목 | 현재 값 | 목표 값 | 상태 |
|---------|--------|--------|------|
| **성능 점수** | 68 | 90+ | ⚠️ 개선 필요 |
| **LCP** | 6.8초 | < 2.5초 | ❌ 개선 필요 |
| **FCP** | 2.3초 | < 1.8초 | ❌ 개선 필요 |
| **TBT** | 270ms | < 200ms | ⚠️ 개선 필요 |
| **CLS** | 0 | < 0.1 | ✅ 통과 |
| **Speed Index** | 3.5초 | < 3.4초 | ⚠️ 개선 필요 |
| **INP** | 174ms | < 200ms | ✅ 통과 |

**코어 웹 바이탈**: ✅ 통과 (하지만 LCP가 매우 높음)

---

## 데스크톱 환경 최적화 작업

### 🔴 긴급 (High Priority)

#### 1. 렌더링 차단 요청 최적화
**현황**: 280ms 절감 가능  
**문제점**: CSS 파일들이 렌더링을 차단하고 있음

**영향을 받는 리소스**:
- `2f41719c84185e1c.css` (77.3 KiB, 400ms)
- `0a8e9ea43e37c0cc.css` (24.1 KiB, 160ms)
- `f05607d6b67c44ee.css` (23.4 KiB, 240ms)
- `8b82b198ec976d2f.css` (21.0 KiB, 120ms)
- `c69b4761d9377ba6.css` (24.7 KiB, 240ms)
- `40344f6720694f0f.css` (24.0 KiB, 160ms)
- `535a624a9ff38975.css` (8.6 KiB, 160ms)
- `a6f5ac9da2acd5db.css` (4.1 KiB, 120ms)
- `ad643eac1f82b82a.css` (3.4 KiB, -)

**해결 방안**:

1. **Critical CSS 인라인화**
   ```typescript
   // next.config.ts에 추가
   const nextConfig: NextConfig = {
     // ... 기존 설정
     experimental: {
       optimizeCss: true, // CSS 최적화 활성화
     },
   };
   ```

2. **CSS 코드 스플리팅**
   - 페이지별 CSS 분리
   - 동적 import로 CSS 지연 로딩
   - `@next/bundle-analyzer`로 CSS 번들 분석

3. **CSS 미니파이 및 압축**
   - Production 빌드에서 자동 적용 확인
   - Gzip/Brotli 압축 활성화

**작업 파일**:
- `next.config.ts`
- 각 페이지 컴포넌트의 CSS import 구조 검토

---

#### 2. 사용하지 않는 CSS 제거
**현황**: 171KiB 절감 가능 (170.7 KiB)

**주요 파일**:
- `2f41719c84185e1c.css`: 73.1 KiB 절감 가능
- `c69b4761d9377ba6.css`: 21.7 KiB 절감 가능
- `0a8e9ea43e37c0cc.css`: 21.1 KiB 절감 가능
- `40344f6720694f0f.css`: 20.1 KiB 절감 가능
- `8b82b198ec976d2f.css`: 18.0 KiB 절감 가능
- `f05607d6b67c44ee.css`: 16.7 KiB 절감 가능

**해결 방안**:

1. **PurgeCSS 설정**
   ```typescript
   // postcss.config.mjs 또는 별도 설정
   module.exports = {
     plugins: {
       '@fullhuman/postcss-purgecss': {
         content: [
           './src/**/*.{js,jsx,ts,tsx}',
           './src/app/**/*.{js,jsx,ts,tsx}',
         ],
         defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
         safelist: ['html', 'body'], // 필수 클래스 보호
       },
     },
   };
   ```

2. **Tailwind CSS 최적화** (사용 중인 경우)
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       './src/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     // 사용하지 않는 스타일 제거
   };
   ```

3. **CSS 모듈 사용 검토**
   - 전역 CSS 대신 CSS 모듈 사용
   - 컴포넌트별 스타일 분리

**작업 파일**:
- `postcss.config.mjs`
- `tailwind.config.js` (있는 경우)
- 각 컴포넌트의 CSS import 검토

---

#### 3. 사용하지 않는 JavaScript 제거
**현황**: 302KiB 절감 가능 (235.7 KiB 퍼스트 파티 + 66.6 KiB 서드 파티)

**주요 파일**:
- `5968c97b83bb5c15.js`: 44.8 KiB 절감
- `ccc4f06f125f85d6.js`: 34.5 KiB 절감
- `94034f13e7906826.js`: 31.0 KiB 절감
- `33381189e2d0e0ab.js`: 29.8 KiB 절감
- `b6f22359355ee06d.js`: 26.7 KiB 절감
- `52626b562024ee21.js`: 24.3 KiB 절감
- `4d9e93e3e99c07d0.js`: 23.2 KiB 절감
- `d78c79c61064d8f3.js`: 21.3 KiB 절감
- Google GSI Client: 66.6 KiB 절감

**해결 방안**:

1. **Tree Shaking 최적화**
   ```typescript
   // next.config.ts
   const nextConfig: NextConfig = {
     webpack: (config) => {
       config.optimization = {
         ...config.optimization,
         usedExports: true, // 사용하지 않는 export 제거
         sideEffects: false, // 사이드 이펙트 없는 모듈 최적화
       };
       return config;
     },
   };
   ```

2. **동적 Import 활용**
   ```typescript
   // 컴포넌트 지연 로딩
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>,
     ssr: false, // 필요시 SSR 비활성화
   });
   ```

3. **번들 분석 및 최적화**
   ```bash
   # 번들 분석 실행
   ANALYZE=true npm run build
   ```

4. **서드 파티 라이브러리 최적화**
   - Google GSI: 필요한 경우에만 로드
   - Sentry: Production에서만 로드
   - 불필요한 polyfill 제거

**작업 파일**:
- `next.config.ts`
- 각 페이지의 import 구조 검토
- 서드 파티 라이브러리 사용처 확인

---

### 🟡 중요 (Medium Priority)

#### 4. 레거시 JavaScript 제거
**현황**: 27KiB 절감 가능

**문제점**: 최신 브라우저에서 불필요한 polyfill 포함
- `Array.prototype.at`
- `Array.prototype.flat`
- `Array.prototype.flatMap`
- `Object.fromEntries`
- `Object.hasOwn`
- `String.prototype.trimEnd`
- `String.prototype.trimStart`
- `Object.keys`

**해결 방안**:

1. **Babel 설정 최적화**
   ```javascript
   // .babelrc 또는 babel.config.js
   {
     "presets": [
       [
         "next/babel",
         {
           "preset-env": {
             "targets": {
               "browsers": ["> 1%", "last 2 versions", "not dead"]
             },
             "useBuiltIns": "usage",
             "corejs": 3
           }
         }
       ]
     ]
   }
   ```

2. **Next.js 컴파일러 설정**
   ```typescript
   // next.config.ts
   const nextConfig: NextConfig = {
     compiler: {
       // 최신 브라우저 타겟팅
     },
   };
   ```

3. **TypeScript 타겟 설정**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "target": "ES2020", // 최신 타겟으로 변경
       "lib": ["ES2020", "DOM", "DOM.Iterable"]
     }
   }
   ```

**작업 파일**:
- `tsconfig.json`
- `next.config.ts`
- `.babelrc` (있는 경우)

---

#### 5. 캐시 수명 최적화
**현황**: 17KiB 절감 가능

**문제점**: Vercel CDP 플러그인들의 캐시 TTL이 1시간으로 짧음

**영향을 받는 파일**:
- `rsa-plugins-legacyEncryptionUtils.min.js` (5 KiB)
- `rsa-plugins-RetryQueue.min.js` (4 KiB)
- `rsa-plugins-common.min.js` (4 KiB)
- 기타 플러그인들 (각 1-2 KiB)

**해결 방안**:

1. **Vercel 설정 확인**
   - Vercel 대시보드에서 캐시 헤더 설정
   - 정적 자산의 캐시 정책 확인

2. **Next.js 헤더 설정**
   ```typescript
   // next.config.ts 또는 middleware.ts
   const nextConfig: NextConfig = {
     async headers() {
       return [
         {
           source: '/_next/static/:path*',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=31536000, immutable',
             },
           ],
         },
       ];
     },
   };
   ```

**작업 파일**:
- `next.config.ts`
- Vercel 대시보드 설정

---

#### 6. 강제 리플로우 최적화
**현황**: 총 68ms 리플로우 시간

**주요 원인**:
- `b77bcbe404d75132.js`: 23ms
- `[출처 불명]`: 45ms
- `e3ed965dc5803377.js`: 15ms

**해결 방안**:

1. **DOM 읽기/쓰기 배치 처리**
   ```typescript
   // 나쁜 예
   element.style.width = '100px';
   const width = element.offsetWidth; // 강제 리플로우
   
   // 좋은 예
   const width = element.offsetWidth; // 먼저 읽기
   element.style.width = '100px'; // 나중에 쓰기
   ```

2. **requestAnimationFrame 활용**
   ```typescript
   requestAnimationFrame(() => {
     // DOM 조작
   });
   ```

3. **CSS Transform 활용**
   - `transform`과 `opacity`는 리플로우 없이 애니메이션 가능
   - `left`, `top` 대신 `transform: translate()` 사용

**작업 파일**:
- 모든 클라이언트 컴포넌트의 DOM 조작 코드 검토
- 애니메이션 관련 코드 검토

---

#### 7. 네트워크 종속 항목 트리 최적화
**현황**: 최상 경로 최대 지연 시간 859ms

**문제점**: CSS 파일들이 순차적으로 로드됨

**해결 방안**:

1. **CSS 병렬 로딩**
   - Critical CSS는 인라인
   - 나머지 CSS는 비동기 로드

2. **리소스 우선순위 설정**
   ```html
   <link rel="preload" href="/critical.css" as="style">
   <link rel="stylesheet" href="/critical.css">
   ```

3. **HTTP/2 Server Push** (Vercel에서 자동 지원)

**작업 파일**:
- `src/app/layout.tsx`
- 각 페이지의 메타데이터 설정

---

### 🟢 개선 (Low Priority)

#### 8. 사전 연결 최적화
**현황**: 미사용 연결 2개 발견
- `https://avatars.githubusercontent.com`
- `https://assets.vercel.com`

**해결 방안**:

1. **사전 연결 제거 또는 실제 사용 확인**
   ```typescript
   // src/app/layout.tsx
   export default function RootLayout() {
     return (
       <html>
         <head>
           {/* 실제 사용하는 경우에만 유지 */}
           {/* <link rel="preconnect" href="https://avatars.githubusercontent.com" /> */}
         </head>
         <body>{children}</body>
       </html>
     );
   }
   ```

2. **필요한 경우에만 추가**
   - 이미지 CDN
   - 폰트 CDN
   - API 엔드포인트

**작업 파일**:
- `src/app/layout.tsx`
- `src/middleware.ts`

---

#### 9. 접근성 개선
**현황**: 여러 접근성 문제 발견

**문제점**:
1. **Viewport 설정**
   - `maximum-scale=1` 제한으로 확대/축소 불가
   - 저시력 사용자에게 문제

2. **색상 대비**
   - "Sign Up" 링크 대비율 부족
   - "Terms", "Privacy Policy" 링크 대비율 부족

3. **메타 설명 누락**
   - SEO를 위한 메타 설명 없음

**해결 방안**:

1. **Viewport 수정**
   ```tsx
   // src/app/layout.tsx
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   // maximum-scale 제거
   ```

2. **색상 대비 개선**
   ```css
   /* 최소 대비율 4.5:1 (일반 텍스트), 3:1 (큰 텍스트) */
   .link-module__Q1NRQq__link {
     color: #0066cc; /* 더 진한 색상 사용 */
   }
   ```

3. **메타 설명 추가**
   ```typescript
   // 각 페이지의 generateMetadata
   export async function generateMetadata(): Promise<Metadata> {
     return {
       description: '페이지에 대한 상세한 설명',
     };
   }
   ```

**작업 파일**:
- `src/app/layout.tsx`
- 각 페이지의 `generateMetadata`
- CSS 파일 (색상 대비)

---

#### 10. 콘솔 오류 해결
**현황**: 여러 브라우저 오류 발견

**오류 목록**:
1. **Google GSI FedCM 오류**
   - `NetworkError: Error retrieving a token`
   - FedCM config 파일 fetch 실패

2. **React 오류**
   - Minified React error #418
   - HTML 관련 오류

3. **Sentry 오류**
   - 429 Too Many Requests
   - Rate limiting 문제

**해결 방안**:

1. **Google GSI 오류 처리**
   ```typescript
   // 에러 바운더리 추가
   try {
     // Google 로그인 초기화
   } catch (error) {
     console.error('Google GSI initialization failed:', error);
     // 폴백 처리
   }
   ```

2. **React 오류 디버깅**
   - Development 모드에서 상세 오류 확인
   - React DevTools로 문제 추적

3. **Sentry Rate Limiting**
   - Sentry 설정에서 샘플링 비율 조정
   - Development 환경에서 Sentry 비활성화

**작업 파일**:
- Google 로그인 관련 컴포넌트
- `sentry.client.config.ts`
- 에러 바운더리 컴포넌트

---

## 모바일 환경 최적화 작업

### 🔴 긴급 (High Priority)

모바일 환경은 데스크톱보다 훨씬 심각한 성능 문제를 보입니다. 특히 **LCP가 6.8초**로 매우 높습니다.

#### 1. LCP (Largest Contentful Paint) 최적화
**현황**: 6.8초 (목표: < 2.5초)  
**문제점**: 데스크톱(1.2초) 대비 5.6배 느림

**해결 방안**:

1. **이미지 최적화 (아래 이미지 섹션 참조)**
   - LCP 이미지에 `priority` 속성 추가
   - 적절한 크기로 리사이징
   - WebP/AVIF 포맷 사용

2. **서버 응답 시간 개선**
   - TTFB: 0.9초 → 0.5초 이하 목표
   - 서버 사이드 렌더링 최적화
   - 데이터베이스 쿼리 최적화

3. **리소스 우선순위 설정**
   ```tsx
   // LCP 이미지에 priority 추가
   <Image
     src={lcpImageSrc}
     alt="Hero image"
     priority
     sizes="100vw"
   />
   ```

4. **폰트 최적화**
   - 폰트 preload
   - `font-display: swap` 사용
   - 시스템 폰트 폴백

**작업 파일**:
- LCP 요소를 포함하는 페이지 컴포넌트
- `src/app/layout.tsx` (폰트 설정)
- 이미지 컴포넌트

---

#### 2. 렌더링 차단 요청 최적화 (모바일)
**현황**: 1,500ms 절감 가능 (데스크톱 대비 5.4배)

**주요 차단 리소스**:
- `0a8e9ea43e37c0cc.css`: 900ms
- `2f41719c84185e1c.css`: 1,950ms
- `40344f6720694f0f.css`: 900ms
- `f05607d6b67c44ee.css`: 1,200ms
- `8b82b198ec976d2f.css`: 600ms
- `c69b4761d9377ba6.css`: 1,200ms

**해결 방안**:

1. **Critical CSS 인라인화** (데스크톱과 동일)
2. **모바일 전용 CSS 분리**
   ```css
   /* 모바일에서만 필요한 CSS */
   @media (max-width: 768px) {
     /* 모바일 스타일 */
   }
   ```

3. **CSS 미디어 쿼리 최적화**
   - 모바일 우선 접근 방식
   - 데스크톱 스타일은 지연 로드

**작업 파일**:
- `next.config.ts`
- CSS 파일들
- `src/app/layout.tsx`

---

#### 3. 기본 스레드 작업 최소화 (모바일)
**현황**: 2.2초 소요

**세부 내역**:
- Script Evaluation: 1,276ms
- Script Parsing & Compilation: 426ms
- Other: 222ms
- Style & Layout: 193ms
- Parse HTML & CSS: 49ms
- Garbage Collection: 17ms
- Rendering: 8ms

**해결 방안**:

1. **JavaScript 코드 스플리팅**
   - 페이지별 코드 분리
   - 동적 import 활용

2. **Web Workers 활용**
   ```typescript
   // 무거운 계산을 Web Worker로 이동
   const worker = new Worker('/workers/heavy-calculation.js');
   worker.postMessage(data);
   ```

3. **React 최적화**
   - `React.memo` 활용
   - 불필요한 리렌더링 방지
   - `useMemo`, `useCallback` 적절히 사용

**작업 파일**:
- 모든 클라이언트 컴포넌트
- 무거운 계산이 있는 컴포넌트

---

#### 4. 긴 기본 스레드 작업 최적화 (모바일)
**현황**: 긴 작업 7개 발견

**주요 작업**:
- `52626b562024ee21.js`: 179ms (10,064ms 시작)
- `4d9e93e3e99c07d0.js`: 124ms (12,751ms 시작)
- `821d7c8cfe811628.js`: 90ms (4,373ms 시작)
- `d78c79c61064d8f3.js`: 78ms (11,701ms 시작)

**해결 방안**:

1. **작업 분할 (Task Splitting)**
   ```typescript
   // 긴 작업을 작은 단위로 분할
   function processLargeData(data: any[]) {
     const chunkSize = 100;
     let index = 0;
     
     function processChunk() {
       const chunk = data.slice(index, index + chunkSize);
       // 처리
       index += chunkSize;
       
       if (index < data.length) {
         setTimeout(processChunk, 0); // 다음 이벤트 루프에서 실행
       }
     }
     
     processChunk();
   }
   ```

2. **requestIdleCallback 활용**
   ```typescript
   if ('requestIdleCallback' in window) {
     requestIdleCallback(() => {
       // 낮은 우선순위 작업
     });
   }
   ```

3. **Intersection Observer로 지연 로딩**
   ```typescript
   const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         // 필요한 경우에만 로드
       }
     });
   });
   ```

**작업 파일**:
- 무거운 데이터 처리 컴포넌트
- 리스트 렌더링 컴포넌트

---

### 🟡 중요 (Medium Priority)

모바일 환경의 나머지 최적화 항목은 데스크톱과 동일하지만, 모바일 네트워크 환경을 고려해야 합니다.

#### 5. 네트워크 최적화 (모바일 특화)

1. **이미지 지연 로딩**
   - Above-the-fold 이미지만 즉시 로드
   - 나머지는 lazy loading

2. **데이터 사용량 최소화**
   - 불필요한 리소스 제거
   - 압축 최적화

3. **오프라인 지원**
   - Service Worker 활용
   - 캐싱 전략

---

## 이미지 최적화 상세 분석

### 📸 현재 이미지 상태 분석

Lighthouse 이미지 감사 결과를 바탕으로 한 상세 분석:

#### 전체 통계

| 항목 | 통과 | 실패 | 총계 |
|------|------|------|------|
| **TITLE 속성** | 0 | 12 | 12 |
| **LOADING 속성** | 8 | 4 | 12 |
| **WIDTH/HEIGHT 속성** | 2 | 10 | 12 |

---

### 🔴 긴급 수정 필요 항목

#### 1. TITLE 속성 누락 (12개 이미지 모두)

**문제점**: 
- 모든 이미지에 `title` 속성이 없음
- 접근성 및 SEO에 부정적 영향
- 사용자 경험 저하 (툴팁 없음)

**영향을 받는 이미지**:
1. 소나버스 로고 (`/logo/ko_logo.png`)
2. Happy senior lifestyle 이미지 (Unsplash)
3. Manbo 이미지 (Picsum)
4. Bodeum 이미지 (Picsum)
5. 만보 워크메이트 개발 비하인드 이미지 (Picsum)
6. 기타 7개 이미지

**해결 방안**:

```tsx
// src/shared/components/ui/OptimizedImage.tsx 수정
export function OptimizedImage({
  src,
  alt,
  title, // 새로 추가
  // ... 기타 props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      title={title || alt} // title 추가
      // ... 기타 props
    />
  );
}
```

**작업 파일**:
- `src/shared/components/ui/OptimizedImage.tsx`
- 모든 이미지 사용처에서 `title` prop 전달

---

#### 2. WIDTH/HEIGHT 속성 누락 (10개 이미지)

**문제점**: 
- HTML에 width/height가 지정되지 않아 레이아웃 시프트 발생 가능
- CLS (Cumulative Layout Shift) 증가
- 이미지 로딩 중 레이아웃 점프

**영향을 받는 이미지**:
1. Happy senior lifestyle (2070x1398, HTML: - x -)
2. Manbo (800x600, HTML: - x -)
3. Bodeum (800x600, HTML: - x -)
4. 만보 워크메이트 개발 비하인드 (800x600, HTML: - x -)
5. 기타 6개 이미지

**해결 방안**:

```tsx
// OptimizedImage 컴포넌트 수정
export function OptimizedImage({
  src,
  alt,
  width, // 필수로 변경
  height, // 필수로 변경
  fill = false,
  // ...
}: OptimizedImageProps) {
  // fill이 false인 경우 width, height 필수
  if (!fill && (!width || !height)) {
    console.warn('OptimizedImage: width and height are required when fill is false');
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      // ...
    />
  );
}
```

**작업 파일**:
- `src/shared/components/ui/OptimizedImage.tsx`
- 모든 이미지 사용처에서 `width`, `height` 명시

---

#### 3. LOADING 속성 누락 (4개 이미지)

**문제점**: 
- Lazy loading이 적용되지 않아 초기 로드 시간 증가
- 불필요한 리소스 로딩

**해결 방안**:

```tsx
// OptimizedImage 컴포넌트 수정
export function OptimizedImage({
  src,
  alt,
  priority = false, // Hero 이미지용
  // ...
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority} // priority가 false면 자동으로 lazy loading
      loading={priority ? undefined : 'lazy'} // 명시적 설정
      // ...
    />
  );
}
```

**작업 파일**:
- `src/shared/components/ui/OptimizedImage.tsx`
- Hero 이미지에만 `priority={true}` 설정
- 나머지는 기본 lazy loading

---

### 🟡 중요 개선 항목

#### 4. 이미지 크기 최적화

**현황 분석**:

| 이미지 | 실제 크기 | HTML 크기 | 비율 | 상태 |
|--------|----------|-----------|------|------|
| 소나버스 로고 | 571x191 | 120x40 | 적절 | ✅ |
| Happy senior lifestyle | 2070x1398 | - x - | 미지정 | ❌ |
| Manbo | 800x600 | - x - | 미지정 | ❌ |
| Bodeum | 800x600 | - x - | 미지정 | ❌ |
| 만보 워크메이트 | 800x600 | - x - | 미지정 | ❌ |

**문제점**:
- 실제 이미지 크기가 HTML에 지정된 크기보다 훨씬 큼
- 불필요한 대역폭 사용
- 로딩 시간 증가

**해결 방안**:

1. **반응형 이미지 크기 설정**
   ```tsx
   <OptimizedImage
     src={imageSrc}
     alt="Description"
     width={800}
     height={600}
     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
   />
   ```

2. **Next.js Image 최적화 활용**
   - 자동 리사이징
   - WebP/AVIF 변환
   - 적절한 quality 설정

3. **이미지 변형 생성**
   - 썸네일: 300x300
   - 중간: 800x600
   - 큰: 1920x1080
   - 각 용도에 맞는 크기 사용

**작업 파일**:
- `src/shared/components/ui/OptimizedImage.tsx`
- 이미지 업로드 API (`src/app/api/upload/route.ts`)
- 이미지 사용 컴포넌트들

---

#### 5. FETCH PRIORITY 설정

**현황**: 모든 이미지에 fetch priority가 설정되지 않음

**해결 방안**:

```tsx
// LCP 이미지에 높은 우선순위
<OptimizedImage
  src={lcpImageSrc}
  alt="Hero"
  priority
  // Next.js Image는 자동으로 fetchpriority="high" 설정
/>

// Below-the-fold 이미지는 낮은 우선순위
<OptimizedImage
  src={belowFoldImageSrc}
  alt="Content"
  loading="lazy"
  // fetchpriority="low" (명시적 설정 불가, lazy loading으로 대체)
/>
```

**작업 파일**:
- Hero 이미지 컴포넌트
- LCP 요소를 포함하는 페이지

---

#### 6. 이미지 포맷 최적화

**현황**: 
- 일부 이미지가 PNG/JPG 포맷 사용
- WebP/AVIF 변환 필요

**해결 방안**:

1. **Next.js Image 자동 변환 활용**
   ```typescript
   // next.config.ts (이미 설정됨)
   images: {
     formats: ['image/avif', 'image/webp'],
   }
   ```

2. **이미지 업로드 시 자동 변환**
   ```typescript
   // 이미지 업로드 API에서 WebP/AVIF 변환
   import sharp from 'sharp';
   
   const webpBuffer = await sharp(imageBuffer)
     .webp({ quality: 85 })
     .toBuffer();
   ```

**작업 파일**:
- `src/app/api/upload/route.ts`
- 이미지 최적화 스크립트

---

### 🟢 개선 권장 항목

#### 7. 이미지 메타데이터 관리

**현황**: 
- 이미지 메타데이터가 데이터베이스에 저장되지만 활용 부족
- alt 텍스트, 캡션 등이 일관되게 관리되지 않음

**해결 방안**:

1. **이미지 메타데이터 활용**
   ```typescript
   // Image 모델에서 메타데이터 가져오기
   const image = await Image.findById(imageId);
   
   <OptimizedImage
     src={image.url}
     alt={image.alt_text.ko || image.alt_text.en}
     title={image.caption?.ko || image.caption?.en}
     width={image.width}
     height={image.height}
   />
   ```

2. **이미지 사용 추적**
   - `ImageUsage` 모델 활용
   - 사용되지 않는 이미지 정리

**작업 파일**:
- 이미지를 사용하는 모든 컴포넌트
- `src/lib/models/Image.ts`

---

## 우선순위별 작업 체크리스트

### 🔴 Phase 1: 긴급 (1주일 내)

#### 데스크톱 + 모바일 공통
- [ ] **이미지 최적화**
  - [ ] OptimizedImage 컴포넌트에 `title` prop 추가
  - [ ] 모든 이미지에 `width`, `height` 명시
  - [ ] Hero 이미지에 `priority` 설정
  - [ ] Below-the-fold 이미지에 lazy loading 적용

- [ ] **CSS 최적화**
  - [ ] Critical CSS 인라인화
  - [ ] PurgeCSS 설정 (사용하지 않는 CSS 제거)
  - [ ] CSS 코드 스플리팅

- [ ] **JavaScript 최적화**
  - [ ] Tree shaking 최적화
  - [ ] 동적 import 활용
  - [ ] 서드 파티 라이브러리 최적화

#### 모바일 특화
- [ ] **LCP 최적화**
  - [ ] LCP 이미지 식별 및 priority 설정
  - [ ] 서버 응답 시간 개선 (TTFB)
  - [ ] 폰트 최적화

- [ ] **기본 스레드 작업 최소화**
  - [ ] 긴 작업 분할
  - [ ] Web Workers 활용
  - [ ] React 최적화

---

### 🟡 Phase 2: 중요 (2주일 내)

- [ ] **레거시 JavaScript 제거**
  - [ ] Babel/TypeScript 타겟 설정
  - [ ] Polyfill 최적화

- [ ] **캐시 최적화**
  - [ ] 정적 자산 캐시 헤더 설정
  - [ ] Vercel 캐시 설정 확인

- [ ] **강제 리플로우 최적화**
  - [ ] DOM 조작 코드 검토
  - [ ] CSS Transform 활용

- [ ] **접근성 개선**
  - [ ] Viewport 설정 수정
  - [ ] 색상 대비 개선
  - [ ] 메타 설명 추가

---

### 🟢 Phase 3: 개선 (1개월 내)

- [ ] **사전 연결 최적화**
  - [ ] 미사용 preconnect 제거
  - [ ] 필요한 경우에만 추가

- [ ] **콘솔 오류 해결**
  - [ ] Google GSI 오류 처리
  - [ ] React 오류 디버깅
  - [ ] Sentry Rate Limiting 해결

- [ ] **이미지 메타데이터 관리**
  - [ ] 이미지 메타데이터 활용
  - [ ] 사용되지 않는 이미지 정리

---

## 예상 성능 개선 효과

### 데스크톱 환경

| 측정항목 | 현재 | 목표 | 개선율 |
|---------|------|------|--------|
| **LCP** | 1.2초 | 1.0초 | 17% |
| **FCP** | 1.1초 | 0.9초 | 18% |
| **TBT** | 200ms | 150ms | 25% |
| **번들 크기** | - | -171KiB CSS<br>-302KiB JS | - |

### 모바일 환경

| 측정항목 | 현재 | 목표 | 개선율 |
|---------|------|------|--------|
| **LCP** | 6.8초 | 2.5초 | 63% |
| **FCP** | 2.3초 | 1.5초 | 35% |
| **TBT** | 270ms | 200ms | 26% |
| **Speed Index** | 3.5초 | 2.5초 | 29% |
| **성능 점수** | 68 | 85+ | 25% |

---

## 참고 자료

- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [Core Web Vitals](https://web.dev/vitals/)

---

## 작업 진행 시 주의사항

1. **단계별 진행**: 한 번에 모든 최적화를 진행하지 말고 단계별로 진행
2. **테스트 필수**: 각 최적화 후 Lighthouse 재실행하여 효과 측정
3. **롤백 계획**: 문제 발생 시 빠르게 롤백할 수 있도록 Git 브랜치 활용
4. **모니터링**: Vercel Analytics 또는 다른 도구로 실제 사용자 성능 모니터링

---

**작성자**: AI Assistant  
**최종 수정일**: 2025-01-21  
**다음 검토일**: 최적화 작업 완료 후


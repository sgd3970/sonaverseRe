# Lighthouse 성능 문제 상세 분석 및 해결 방안

> **작성일**: 2025-01-21  
> **분석 대상**: 최신 Lighthouse 결과 (데스크톱 + 모바일)  
> **상태**: 이전 최적화 후에도 심각한 성능 문제 지속  
> **목표**: 모든 문제를 체계적으로 분석하고 즉시 적용 가능한 해결책 제시

---

## 📊 현재 성능 현황 (최신 측정)

### 데스크톱 환경

| 측정항목 | 현재 값 | 목표 값 | 상태 | 이전 대비 |
|---------|--------|--------|------|----------|
| **FCP** | **3.7초** | < 1.8초 | ❌ **매우 나쁨** | ⬇️ 2.6초 악화 |
| **LCP** | **4.2초** | < 2.5초 | ❌ **나쁨** | ⬇️ 3.0초 악화 |
| **TBT** | 0ms | < 200ms | ✅ 통과 | ✅ 개선 |
| **CLS** | 0.007 | < 0.1 | ✅ 통과 | ✅ 개선 |
| **Speed Index** | **3.7초** | < 3.4초 | ⚠️ 약간 나쁨 | ⬇️ 2.7초 악화 |

**결론**: 이전 최적화가 적용되지 않았거나, 새로운 문제가 발생했습니다.

### 모바일 환경

| 측정항목 | 현재 값 | 목표 값 | 상태 | 이전 대비 |
|---------|--------|--------|------|----------|
| **FCP** | **21.4초** | < 1.8초 | ❌ **매우 심각** | ⬇️ 19.1초 악화 |
| **LCP** | **24.2초** | < 2.5초 | ❌ **매우 심각** | ⬇️ 17.4초 악화 |
| **TBT** | 0ms | < 200ms | ✅ 통과 | ✅ 개선 |
| **CLS** | 0.002 | < 0.1 | ✅ 통과 | ✅ 개선 |
| **Speed Index** | **21.4초** | < 3.4초 | ❌ **매우 심각** | ⬇️ 17.9초 악화 |

**결론**: 모바일 성능이 극도로 악화되었습니다. 즉시 조치 필요.

---

## 🔴 긴급 문제 분석 (우선순위 1)

### 문제 1: Google Fonts Material Symbols - 3,740 KiB (3.7MB) 🚨

**현황**:
- `fonts.gstatic.com/v303/kJEhBvYX7….woff2`: **3,740 KiB**
- 전체 네트워크 페이로드의 **69%** 차지
- 폰트 표시 지연: 90ms (데스크톱), 50ms (모바일)
- 네트워크 종속 항목 체인에서 최대 지연: 6,583ms (데스크톱), 2,493ms (모바일)

**원인 분석**:
1. Material Symbols 폰트가 외부 Google Fonts에서 로드됨
2. `layout.tsx`에서 외부 링크로 로드: `fonts.googleapis.com/css2?family=Material+Symbols+Outlined...`
3. 이미 `material-symbols` npm 패키지가 설치되어 있음에도 외부에서 중복 로드
4. 폰트 파일이 비정상적으로 큼 (일반 Material Symbols는 수백 KB)

**해결 방안**:

#### 즉시 적용: Material Symbols 외부 로드 제거

```tsx
// src/app/layout.tsx
// 기존 코드 (제거 필요):
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />

// 이미 material-symbols 패키지가 설치되어 있고 import되어 있으므로
// 외부 링크는 완전히 제거 가능
```

**작업 파일**: `src/app/layout.tsx`

---

### 문제 2: 외부 이미지 - 990 KiB (unsplash + picsum) 🚨

**현황**:
- `images.unsplash.com`: **661 KiB** (Hero 이미지)
- `picsum.photos`: **329 KiB** (제품 이미지들)
- 총 **990 KiB**의 외부 이미지
- 모바일에서 매우 느린 로딩

**영향을 받는 파일**:
1. `HomeHero.tsx`: unsplash 이미지 (661 KiB)
2. `ProductSection.tsx`: picsum 이미지 2개
3. `StoryHighlight.tsx`: picsum 이미지 3개
4. `PressSection.tsx`: picsum 이미지 4개
5. `ManboHero.tsx`: picsum 이미지
6. `BodumeHero.tsx`: picsum 이미지
7. `BodumeLineup.tsx`: picsum 이미지 4개
8. `ManboSpecs.tsx`: picsum 이미지 2개

**해결 방안**:

#### 즉시 적용: 로컬 이미지로 교체

로컬 이미지가 있다면 사용하고, 없다면 placeholder 이미지 사용:

```tsx
// HomeHero.tsx - 로컬 이미지 사용
src="/images/hero/home-hero.webp" // 또는 placeholder

// ProductSection.tsx - 로컬 이미지 사용
src="/images/product/manbo/product2.webp"
src="/images/product/bodume/product1.webp"
```

**작업 파일**: 모든 외부 이미지 사용 컴포넌트

---

### 문제 3: 모바일 FCP/LCP 극도로 느림 (21.4초 / 24.2초) 🚨

**현황**:
- FCP: 21.4초 (목표: <1.8초) - **12배 느림**
- LCP: 24.2초 (목표: <2.5초) - **10배 느림**
- Speed Index: 21.4초 (목표: <3.4초) - **6배 느림**

**원인 분석**:
1. 큰 폰트 파일 (3.7MB)이 모바일 네트워크에서 매우 느리게 로드
2. 외부 이미지 (990KB)가 추가 지연
3. 렌더링 차단 리소스 (CSS)가 1,700ms 지연
4. 네트워크 종속 항목 체인: 최대 2,493ms

**해결 방안**:

1. **폰트 최적화** (위 문제 1 해결)
2. **외부 이미지 제거** (위 문제 2 해결)
3. **Critical CSS 인라인화**
4. **리소스 우선순위 설정**

---

## 🟡 중요 문제 분석 (우선순위 2)

### 문제 4: 렌더링 차단 요청

**데스크톱**: 40ms 절감 가능
- `cbbcf1416de158a3.css`: 15.4 KiB, 250ms
- `90bc4d6c63fa628f.css`: 24.1 KiB, 250ms
- `73510d220598e4e4.css`: 1.5 KiB, 60ms

**모바일**: **1,700ms 절감 가능** (매우 심각)
- `cbbcf1416de158a3.css`: 15.4 KiB, 680ms
- `90bc4d6c63fa628f.css`: 24.1 KiB, 850ms
- `73510d220598e4e4.css`: 1.5 KiB, 170ms

**해결 방안**:

1. **Critical CSS 인라인화**
2. **CSS 코드 스플리팅**
3. **비동기 CSS 로딩**

---

### 문제 5: 사용하지 않는 JavaScript - 150KiB (데스크톱), 156KiB (모바일)

**주요 파일**:
- `commons-5e40a2b6368d2da0.js`: 106.1 KiB (데스크톱), 111.6 KiB (모바일)
- `7038bb93-072b37932a3cda7d.js`: 23.0 KiB
- `3794-92dd28a8d143ad5e.js`: 21.1 KiB

**해결 방안**:
- Tree shaking 최적화 (이미 설정됨)
- 동적 import 활용
- 코드 스플리팅

---

### 문제 6: 사용하지 않는 CSS - 23KiB

**파일**: `90bc4d6c63fa628f.css`: 23.4 KiB (100% 미사용)

**해결 방안**:
- PurgeCSS 설정
- Tailwind CSS 최적화

---

### 문제 7: 레거시 JavaScript - 12KiB

**문제**: 최신 브라우저에서 불필요한 polyfill
- Array.prototype.at, flat, flatMap
- Object.fromEntries, hasOwn
- String.prototype.trimEnd, trimStart

**해결 방안**:
- TypeScript 타겟이 ES2020으로 설정됨 (이미 적용)
- Babel 설정 확인 필요

---

## 🟢 개선 권장 사항 (우선순위 3)

### 문제 8: 색상 대비 부족 (접근성)

**문제 요소**:
1. `PREMIUM CARE DIAPER` - `text-bodume-green-dark`
2. `INSIGHTS & HERITAGE` - `text-primary/40`
3. 날짜 텍스트 - `text-gray-400`

**해결 방안**:
- 색상 대비율 4.5:1 이상으로 조정
- CSS 변수 수정

---

### 문제 9: 터치 영역 부족 (모바일 접근성)

**문제 요소**:
- 모든 버튼과 링크 (제품 보러가기, 브랜드 스토리, VIEW DETAIL 등)

**해결 방안**:
- 최소 44x44px 터치 영역 확보
- CSS로 padding/min-height 조정

---

### 문제 10: 사전 연결 없음

**현황**: 사전 연결된 출처가 없음

**해결 방안**:
- 중요한 외부 리소스에 preconnect 추가
- fonts.gstatic.com (폰트, 제거 예정이므로 불필요)
- images.unsplash.com (이미지, 제거 예정이므로 불필요)

---

## 📋 즉시 적용 가능한 해결 방안

### Phase 1: 긴급 조치 (즉시 적용)

1. **Material Symbols 외부 로드 제거** ✅
2. **외부 이미지를 로컬 이미지로 교체** ✅
3. **폰트 preload 추가** ✅
4. **사전 연결 추가** ✅

### Phase 2: 중요 개선 (1일 내)

5. **Critical CSS 인라인화**
6. **사용하지 않는 CSS 제거**
7. **색상 대비 개선**
8. **터치 영역 개선**

### Phase 3: 지속적 개선 (1주일 내)

9. **JavaScript 코드 스플리팅**
10. **이미지 최적화 강화**

---

## 🔧 상세 작업 가이드

각 문제에 대한 구체적인 코드 수정 방법은 다음 섹션에서 제공됩니다.

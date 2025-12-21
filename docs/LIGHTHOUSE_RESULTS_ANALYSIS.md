# Lighthouse 측정 결과 분석

## 📊 측정 결과 요약

### 성능 지표 (Performance Metrics)

현재 측정 결과:

| 메트릭 | 목표 | 현재 값 | 상태 |
|--------|------|---------|------|
| **FCP** (First Contentful Paint) | ≤ 2000ms | 3912ms | ⚠️ 개선 필요 |
| **LCP** (Largest Contentful Paint) | ≤ 2500ms | 4419ms | ⚠️ 개선 필요 |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 측정 필요 | - |
| **TBT** (Total Blocking Time) | ≤ 200ms | 측정 필요 | - |

**측정 세션**:
- FCP 평균: ~4039ms (3회 측정: 4078ms, 3912ms, 4128ms)
- LCP 평균: ~4487ms (3회 측정: 4479ms, 4419ms, 4561ms)

---

## 🔍 문제 분석

### 1. FCP (First Contentful Paint) 지연

**원인 가능성**:
- 초기 JavaScript 번들 크기가 큼
- 폰트 로딩 지연
- 이미지 최적화 부족
- 서버 사이드 렌더링(SSR) 지연
- 개발 모드에서 실행 (최적화되지 않은 상태)

### 2. LCP (Largest Contentful Paint) 지연

**원인 가능성**:
- 큰 이미지나 비디오 로딩
- 폰트 렌더링 차단
- 클라이언트 사이드 렌더링(CSR) 지연
- 느린 서버 응답 시간

---

## ✅ 개선 방법

### 1. 이미지 최적화

```typescript
// next.config.ts에 이미 설정되어 있음
images: {
  formats: ['image/avif', 'image/webp'],
}

// 컴포넌트에서 사용
import Image from 'next/image'

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero"
  priority // LCP 요소인 경우
  placeholder="blur" // plaiceholder 사용
/>
```

### 2. 폰트 최적화

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 폰트 로딩 중에도 텍스트 표시
  preload: true,
})
```

### 3. 코드 스플리팅

```typescript
// 큰 컴포넌트는 동적 임포트
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // 필요시만
})
```

### 4. 리소스 우선순위 설정

```typescript
// LCP 요소에 priority 추가
<Image priority src="/hero.jpg" ... />
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" />
```

### 5. 프로덕션 빌드로 측정

**개발 모드는 느립니다**. 정확한 성능 측정을 위해:

```bash
# 1. 프로덕션 빌드
npm run build

# 2. 프로덕션 서버 시작
npm run start

# 3. Lighthouse 측정 (새 터미널)
npm run lighthouse:prod
```

---

## 📈 목표 달성 로드맵

### 단기 목표 (1주일 내)
- [ ] 프로덕션 빌드로 재측정
- [ ] 이미지 최적화 적용 (AVIF/WebP 변환)
- [ ] 폰트 최적화 (next/font 사용)
- [ ] FCP < 3000ms 달성

### 중기 목표 (1개월 내)
- [ ] 코드 스플리팅 적용
- [ ] 불필요한 JavaScript 제거
- [ ] LCP < 3500ms 달성
- [ ] 모든 Core Web Vitals "Good" 등급 달성

### 장기 목표 (3개월 내)
- [ ] FCP < 2000ms 달성
- [ ] LCP < 2500ms 달성
- [ ] Performance 점수 90+ 달성

---

## 🔗 유용한 링크

- [Lighthouse 리포트](https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1766296660815-63771.report.html) (측정 시 생성된 링크)
- [Web.dev 성능 가이드](https://web.dev/performance/)
- [Next.js 성능 최적화](https://nextjs.org/docs/app/building-your-application/optimizing)

---

## 📝 참고사항

1. **개발 모드 vs 프로덕션 모드**
   - 개발 모드는 소스맵, 핫 리로드 등으로 느립니다
   - 프로덕션 빌드로 측정해야 실제 성능을 확인할 수 있습니다

2. **네트워크 조건**
   - Lighthouse는 기본적으로 느린 3G 네트워크를 시뮬레이션합니다
   - 실제 사용자는 더 빠른 네트워크를 사용할 수 있습니다

3. **정기적 측정**
   - 코드 변경 후 정기적으로 측정하여 회귀 방지
   - CI/CD 파이프라인에 통합 고려


# 도구 가이드 – Vercel Analytics & Speed Insights

> **대상 프로젝트**: `sonaverse_re` 리뉴얼용 Next.js 15 / App Router  
> **목적**: 별도 스크립트 없이 **페이지 뷰·Core Web Vitals**를 수집해 성능 추이를 모니터링

---

## 1. 도구 개요

- **도구명**:
  - `@vercel/analytics`
  - `@vercel/speed-insights`
- **역할**:
  - 가벼운 페이지뷰 분석 (쿠키리스·프라이버시 친화적)
  - LCP/FID/CLS 등 Core Web Vitals 수집

---

## 2. 설치

```bash
npm install @vercel/analytics @vercel/speed-insights
```

---

## 3. Root Layout 통합 예시

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

> Vercel에 배포하면, 대시보드에서 바로 트래픽·성능 데이터를 확인할 수 있다.

---

## 4. 리뉴얼 프로젝트에서의 활용 포인트

- 리뉴얼 전/후 성능 비교
- 특정 페이지(예: `/inquiry`, `/products/manbo-walker`)의 **체류 시간·이탈률** 확인
- Core Web Vitals가 목표치(LCP < 2.5s, CLS < 0.1)를 만족하는지 모니터링

---

## 5. 체크리스트

- [ ] Root Layout에 `Analytics`와 `SpeedInsights`가 추가되어 있는가?
- [ ] Vercel 프로젝트에 Analytics/SI 기능이 활성화되어 있는가?
- [ ] 성능 개선 작업 전/후 지표를 비교하고 있는가?



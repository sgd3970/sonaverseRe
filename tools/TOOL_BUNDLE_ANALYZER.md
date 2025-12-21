# 도구 가이드 – Next.js 번들 분석 (`@next/bundle-analyzer`)

> **대상 프로젝트**: `sonaverse_re` 기반 Next.js 15 / App Router 리뉴얼 프로젝트  
> **목적**: 페이지 초기 로딩 속도 최적화를 위해 **번들 크기와 구성 요소를 시각적으로 분석**하기 위함

---

## 1. 도구 개요

- **도구명**: `@next/bundle-analyzer`
- **역할**:
  - 각 페이지별 JS 번들 크기 분석
  - 어떤 라이브러리·컴포넌트가 번들을 무겁게 만드는지 시각화
  - 코드 스플리팅·동적 임포트 대상 선정 근거 제공

---

## 2. 설치 (리뉴얼 프로젝트에서 사용할 패키지)

```bash
npm install -D @next/bundle-analyzer
```

> 실제 리뉴얼 코드베이스를 만들 때, **Next.js 프로젝트 루트(`package.json`이 있는 위치)**에서 설치한다.

---

## 3. Next.js 설정 예시

리뉴얼 프로젝트의 `next.config.ts` (또는 `next.config.mjs`)에서 번들 분석을 켜고 끌 수 있도록 래퍼를 적용한다.

```ts
// next.config.ts 예시
import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // 기존 Next.js 설정들...
}

export default withBundleAnalyzer(nextConfig)
```

---

## 4. npm 스크립트 예시

`package.json`에 번들 분석 전용 스크립트를 추가한다.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "analyze": "ANALYZE=true next build"
  }
}
```

실행 방법:

```bash
npm run analyze
```

실행 후 `.next` 내부 또는 브라우저에서 번들 분석 리포트를 확인할 수 있다(Next.js 버전에 따라 출력 위치는 약간 달라질 수 있음).

---

## 5. 번들 분석 시 확인 포인트

- **페이지별 번들 크기**
  - 핵심 랜딩 페이지 (`/`, `/products/**`, `/sonaverse-story`, `/press`, `/inquiry`)의 번들이 **200KB 미만(gzipped 기준)**이 되도록 목표 설정
- **공통 번들(Shared Chunk)**
  - 여러 페이지에서 공유되는 큰 의존성(예: `swiper`, `tiptap`)이 공통 번들에 얼마나 포함되는지 확인
- **동적 임포트 후보**
  - 관리자 전용 UI, 무거운 에디터, 그래프 라이브러리 등은 **초기 렌더에서 제외 가능한지** 검토

---

## 6. 리뉴얼 프로젝트에서의 활용 가이드

1. **초기 설계 단계**
   - 기본 페이지들을 구현한 후 `npm run analyze`를 실행해 **초기 성능 스냅샷**을 남긴다.
2. **기능 추가 단계**
   - 큰 라이브러리(에디터, 차트, 슬라이더)를 추가한 뒤 다시 분석하여 번들 변화를 추적한다.
3. **최적화 단계**
   - 번들 분석 결과를 기반으로:
     - 무거운 모듈을 **동적 임포트**로 분리
     - 사용하지 않는 코드/라이브러리 제거
     - 공통 컴포넌트 분리 여부 검토

---

## 7. 체크리스트

- [ ] 리뉴얼 Next.js 프로젝트에 `@next/bundle-analyzer`가 devDependencies로 설치되어 있는가?
- [ ] `next.config`에 `withBundleAnalyzer` 래퍼가 적용되어 있는가?
- [ ] `npm run analyze` 스크립트가 존재하는가?
- [ ] 핵심 페이지 번들 크기를 정기적으로 확인하고 있는가?
- [ ] 번들 분석 결과를 바탕으로 코드 스플리팅/동적 임포트를 설계했는가?



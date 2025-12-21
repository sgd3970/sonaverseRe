# Sonaverse 리뉴얼 – 폴더 구조 가이드 (Feature-based)

> **목적**: 리뉴얼 Next.js 프로젝트에서 **일관된 폴더 구조**를 유지해, 성능·모듈화·유지보수성을 동시에 확보하기 위함  
> **전제**: Next.js 15 App Router, TypeScript, Tailwind, MongoDB (Mongoose)

---

## 1. 최상위 구조

```text
src/
  app/            # App Router 라우트 엔트리 (페이지/레이아웃 중심)
  features/       # 도메인(기능) 단위 모듈
  shared/         # 완전 공용 UI/유틸/훅
  lib/            # 인프라/외부 연동/low-level 헬퍼
  types/          # 전역 타입 정의
```

---

## 2. `app/` 구조 (라우트 중심)

```text
src/app/
  layout.tsx              # RootLayout
  page.tsx                # 홈 (/)

  products/
    manbo-walker/
      page.tsx            # /products/manbo-walker
    bodeum-diaper/
      page.tsx            # /products/bodeum-diaper

  sonaverse-story/
    page.tsx              # /sonaverse-story (리스트)
    [slug]/
      page.tsx            # /sonaverse-story/[slug] (상세, 필요 시)

  press/
    page.tsx              # /press (리스트)
    [slug]/
      page.tsx            # /press/[slug] (상세, 필요 시)

  inquiry/
    page.tsx              # /inquiry

  admin/
    login/
      page.tsx            # /admin/login
    layout.tsx            # 관리자 공통 레이아웃
    page.tsx              # /admin (대시보드)
    press/
      page.tsx            # /admin/press
      new/
        page.tsx
      [id]/
        page.tsx
    stories/
      page.tsx
    products/
      page.tsx
    inquiries/
      page.tsx

  api/
    inquiry/
      route.ts            # POST /api/inquiry
    inquiry/
      upload/
        route.ts          # POST /api/inquiry/upload
    admin/
      login/
        route.ts          # POST /api/admin/login
      press/
        route.ts          # /api/admin/press (GET/POST)
        [id]/
          route.ts        # /api/admin/press/[id] (GET/PUT/DELETE)
```

> `app/`에는 **페이지와 최소한의 glue 코드만** 두고, 실제 비즈니스 로직·UI는 `features/`로 위임하는 것을 원칙으로 한다.

---

## 3. `features/` 구조 (도메인 중심)

```text
src/features/
  home/
    components/
    hooks/
    services/
    types.ts

  products/
    components/
    hooks/
    services/
    types.ts

  story/           # Sonaverse Story
    components/
    hooks/
    services/
    schemas.ts     # zod 스키마
    types.ts

  press/
    components/
    hooks/
    services/
    schemas.ts
    types.ts

  inquiry/
    components/
    hooks/
    services/
    schemas.ts     # InquirySchema (zod)
    types.ts

  admin/
    dashboard/
    press/
    stories/
    products/
    inquiries/
    account/
      schemas.ts   # AdminLoginSchema 등
      components/
      services/
```

### 원칙

- **한 feature 폴더 = 한 도메인/기능**
- **UI/상태/비즈니스 로직 분리**
  - `components/`: 순수 UI 컴포넌트 중심
  - `hooks/`: React 훅 (상태/데이터 페칭)
  - `services/`: API 호출, 리포지토리 패턴, 서버 로직
  - `schemas.ts`: zod 스키마
  - `types.ts`: 도메인 전용 타입

---

## 4. `shared/` 구조 (완전 공용 레벨)

```text
src/shared/
  components/
    layout/
      Header.tsx
      Footer.tsx
      SectionHeader.tsx
    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
      Modal.tsx
      Input.tsx
      Textarea.tsx
      Select.tsx
  hooks/
    useIntersectionObserver.ts
    useMediaQuery.ts
  images/
    getBlurDataURL.ts      # plaiceholder 유틸
  security/
    rateLimiter.ts         # rate-limiter-flexible 설정
  utils/
    formatDate.ts
    formatCurrency.ts
```

> `shared/`에는 **어떤 feature에도 종속되지 않는** 진짜 공용 요소만 둔다.

---

## 5. `lib/` 구조 (인프라/외부 연동)

```text
src/lib/
  db/
    mongoose.ts        # MongoDB 연결
    models/            # Mongoose 모델 (필요 시)
  api/
    client.ts          # Axios/Fetch 래퍼
  sentry/
    client.ts
    server.ts
```

---

## 6. `types/` 구조 (전역 타입)

```text
src/types/
  env.d.ts
  next.d.ts
  common.ts      # 공용 타입 (예: Locale, Pagination 등)
```

---

## 7. 체크리스트

- [ ] `app/`에는 페이지/레이아웃·최소한의 glue 코드만 두었는가?
- [ ] 도메인 로직은 `features/**`로 이동했는가?
- [ ] 공용 UI/유틸은 `shared/**`에만 존재하는가?
- [ ] DB·외부 연동 코드는 `lib/**` 아래로 모였는가?
- [ ] 타입 정의가 `types/**` 또는 각 feature의 `types.ts`로 정리되어 있는가?



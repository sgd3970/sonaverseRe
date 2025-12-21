정리했어요. 팀이 바로 써먹기 쉽도록 "핵심 원칙 → 실무 체크리스트" 구조로 압축했습니다.

# Sonaverse 홈페이지 개발 규칙 – 요약판(v4.0)

> **소나버스 공식 홈페이지 리뉴얼 프로젝트 전용 개발 규칙**  
> **핵심 가치**: 프로젝트 관리의 편의성, 유연성, 클린코드, 모듈화, 빠른 속도처리, 빠른 이미지 관리, 로딩없는 환경  
> **인증 정책**: 일반 사용자에게는 로그인 기능 제공하지 않음 (관리자만 `/admin/login` 접근 가능)  
> **데이터베이스**: 모듈화된 스키마 구조 (DATABASE_SCHEMA.md 참조)

## 0. 작업 전 필수 체크(재작업·중복·삭제 사고 방지)

- 파일/함수 만들기 전 반드시 **검색 후 생성**(grep/find), 삭제 전 **참조 확인**.
- 미들웨어·라우트 추가 시 **중복 등록 금지**, 기존 것 **개선·교체 우선**.
- "파일 생성/함수 추가/삭제" 각각 체크리스트로 점검.

## 0-a. 변경 범위 원칙

- 수정 가능: `src/app/**`, `src/features/**`, `src/shared/**`.
- 공개 시그니처 변경 시 **compat 래퍼** 제공, **하위 호환 보장**.

## 1. 크기 규율

- 파일 ≤ 400~600줄, 함수 ≤ 120줄. **의미 단위로만 분리**, 과도한 쪼개기 금지.

## 2. 재사용·모듈화

- **순수 함수 우선**, 반복 로직은 `utils/`·도메인별 `helpers/`, 분기 많으면 **전략 맵**.
- 기능별 모듈화 (`features/`) 우선, 공통 모듈은 `shared/`에 배치.

## 3. 성능 최우선 원칙

### 3-1. 이미지 관리 (빠른 이미지 관리)

> **목표**: 이미지 로딩 지연 최소화, 빠른 이미지 관리 및 최적화

#### 3-1-1. 이미지 최적화 필수

- **Next.js Image 컴포넌트 필수 사용**
  - 모든 이미지는 `next/image` 컴포넌트 사용
  - WebP/AVIF 포맷 우선 사용 (자동 변환)
  - `sizes` 속성으로 반응형 이미지 제공
  - Lazy loading 기본 적용 (Hero 이미지 제외, `priority` 속성 사용)
  
- **이미지 데이터베이스 관리**
  - 모든 이미지 메타데이터는 `Image` 테이블에 저장 (DATABASE_SCHEMA.md 참조)
  - 이미지 사용처는 `ImageUsage` 테이블로 추적
  - 이미지 변형(썸네일, 작은 크기 등)은 `ImageVariant` 테이블로 관리
  - 중복 이미지 방지 및 재사용성 향상

#### 3-1-2. 이미지 저장소 구조

```
public/
├── images/              # 일반 이미지
│   ├── hero/           # 히어로 이미지
│   ├── products/       # 제품 이미지
│   ├── stories/        # 스토리 이미지
│   ├── press/          # 언론보도 이미지
│   └── common/         # 공통 이미지
├── product/            # 제품별 이미지
│   ├── manbo/         # 만보 제품 이미지
│   │   ├── hero/      # 히어로 이미지
│   │   ├── features/  # 기능 이미지
│   │   └── gallery/   # 갤러리 이미지
│   └── bodeum/        # 보듬 제품 이미지
│       ├── hero/
│       ├── products/  # 제품 라인업 이미지
│       └── gallery/
└── logo/               # 로고 이미지
    ├── ko_logo.png    # 한국어 로고
    ├── en_logo.png    # 영어 로고
    └── symbol_logo.png # 심볼 로고
```

#### 3-1-3. 이미지 파일명 규칙

- **일반 이미지**: `{category}-{name}-{size}.{ext}`
  - 예: `hero-home-1920.webp`, `product-manbo-thumb-768.webp`
- **제품 이미지**: `{product}-{type}-{variant}-{size}.{ext}`
  - 예: `manbo-walker-hero-1920.webp`, `bodeum-diaper-panty-m-768.webp`

#### 3-1-4. 이미지 CDN 및 최적화

- **CDN 활용**
  - Vercel Image Optimization 또는 Cloudinary 등 CDN 사용
  - 자동 리사이징 및 포맷 변환
  - 글로벌 CDN으로 전송 속도 향상
  
- **이미지 업로드 API (관리자 전용)**
  - 이미지 업로드 시 자동 최적화 (WebP/AVIF 변환)
  - 여러 크기 자동 생성 (썸네일, 작은, 중간, 큰)
  - 메타데이터 자동 추출 (너비, 높이, 파일 크기)
  - `Image` 테이블에 메타데이터 저장

#### 3-1-5. 이미지 로딩 전략

- **Hero 이미지**: `priority` 속성 사용, 즉시 로드
- **Above-the-fold 이미지**: `priority` 속성 사용
- **Below-the-fold 이미지**: `loading="lazy"` 기본 적용
- **갤러리 이미지**: Intersection Observer 기반 지연 로딩

### 3-2. 로딩 없는 환경 구성

> **목표**: 사용자가 로딩 스피너를 보지 않고 즉시 콘텐츠를 볼 수 있는 환경

#### 3-2-1. SSG (Static Site Generation) 우선

- **빌드 타임 정적 생성**
  - 가능한 모든 페이지는 빌드 타임에 정적 생성
  - 홈페이지, 제품 상세, 스토리 목록 등은 SSG 사용
  - ISR (Incremental Static Regeneration) 활용하여 주기적 갱신
  
- **동적 콘텐츠 최소화**
  - 실시간 데이터가 필요한 경우만 SSR 사용
  - 관리자 페이지는 SSR 사용 (인증 필요)
  - 공개 페이지는 최대한 SSG로 구성

#### 3-2-2. 스트리밍 및 Suspense

- **React Suspense 활용**
  - 점진적 렌더링으로 초기 로딩 시간 단축
  - 스트리밍 SSR로 Above-the-fold 콘텐츠 우선 렌더링
  - 로딩 스피너 대신 스켈레톤 UI 사용
  
- **스켈레톤 UI 패턴**
  ```typescript
  // ❌ 나쁜 예
  {loading && <Spinner />}
  {data && <Content data={data} />}
  
  // ✅ 좋은 예
  <Suspense fallback={<ContentSkeleton />}>
    <Content data={data} />
  </Suspense>
  ```

#### 3-2-3. 코드 스플리팅

- **페이지별 동적 임포트**
  - 페이지별 자동 코드 스플리팅 (Next.js App Router 기본)
  - 무거운 컴포넌트는 `next/dynamic`으로 지연 로딩
  - 관리자 페이지, 모달, 차트 등은 필요 시에만 로드
  
- **초기 번들 크기 최소화**
  - 목표: 초기 JS 번들(홈 기준, gzip) **200KB 이하**
  - 트리 쉐이킹 적용
  - 불필요한 라이브러리 제거
  - 큰 라이브러리는 동적 임포트

#### 3-2-4. 프리로딩 전략

- **Critical Resources 프리로드**
  - Hero 이미지: `<link rel="preload">` 사용
  - 중요 폰트: `<link rel="preload">` 사용
  - Critical CSS: 인라인 또는 프리로드
  
- **리소스 힌트 활용**
  - DNS 프리페치: `<link rel="dns-prefetch">`
  - 프리커넥트: `<link rel="preconnect">`
  - 프리페치: `<link rel="prefetch">` (다음 페이지 예상)

### 3-3. 빠른 속도 처리

> **목표**: Core Web Vitals 목표 달성, 초기 로딩 시간 최소화

#### 3-3-1. Core Web Vitals 목표

- **LCP (Largest Contentful Paint)**: < 2.5초
  - Hero 이미지 최적화 (WebP/AVIF, 적절한 크기)
  - Critical CSS 인라인
  - 폰트 프리로드
  
- **CLS (Cumulative Layout Shift)**: < 0.1
  - 이미지에 명시적 width/height 지정
  - 동적 콘텐츠 삽입 시 레이아웃 예약 공간 확보
  - 폰트 로딩 전략 (font-display: swap)
  
- **TBT (Total Blocking Time)**: < 200ms
  - 긴 작업을 작은 청크로 분할
  - Web Workers 활용 (필요 시)
  - 코드 스플리팅으로 초기 번들 크기 최소화

#### 3-3-2. 번들 크기 최적화

- **초기 JS 번들 목표**: 200KB 이하 (gzip)
  - 번들 분석 도구 사용 (`@next/bundle-analyzer`)
  - 트리 쉐이킹 적용
  - 불필요한 라이브러리 제거
  - 큰 라이브러리는 동적 임포트

#### 3-3-3. 캐싱 전략

- **정적 자산 캐싱**
  - 이미지, 폰트, CSS, JS: 1년 캐싱 (31536000초)
  - 파일명에 해시 포함하여 버전 관리
  
- **API 응답 캐싱**
  - ISR (Incremental Static Regeneration) 활용
  - 재검증 시간 설정 (예: 60초)
  - Next.js 캐싱 헤더 활용
  
- **브라우저 캐싱 최적화**
  - Cache-Control 헤더 설정
  - ETag 활용
  - Service Worker (선택적, PWA 구현 시)

#### 3-3-4. 데이터베이스 쿼리 최적화

- **인덱스 활용**
  - 자주 조회되는 필드에 인덱스 생성
  - 복합 인덱스 활용 (DATABASE_SCHEMA.md 참조)
  - 쿼리 성능 모니터링
  
- **데이터 페칭 최적화**
  - 필요한 필드만 선택 (Projection)
  - 페이지네이션 적용
  - 무한 스크롤 대신 "더보기" 버튼 (SEO 고려)

## 4. 인증 및 권한 관리

### 4-1. 일반 사용자 로그인 없음 (필수 원칙)

> **⚠️ 중요**: 소나버스 홈페이지는 일반 사용자에게 로그인 기능을 제공하지 않습니다.  
> 관리자만 `/admin/login` 경로를 통해 접근할 수 있으며, 공개 페이지에는 로그인 관련 UI가 전혀 노출되지 않아야 합니다.

#### 4-1-1. 공개 페이지 규칙

- **헤더/네비게이션**: 로그인 버튼/링크 완전 제거
- **푸터**: 로그인 관련 링크 제거
- **API 엔드포인트**: 일반 사용자용 로그인 API 제공하지 않음
- **접근 제한**: `/admin/login` 경로만 관리자 접근 가능

#### 4-1-2. 구현 체크리스트

- [ ] 헤더 컴포넌트에서 로그인 버튼 제거 확인
- [ ] 네비게이션 메뉴에서 로그인 링크 제거 확인
- [ ] 푸터에서 로그인 관련 링크 제거 확인
- [ ] 공개 API에서 로그인 엔드포인트 제거 확인
- [ ] 클라이언트 사이드에서 로그인 관련 코드 제거 확인

### 4-2. 관리자 인증 (관리자 전용)

#### 4-2-1. 관리자 전용 경로

- **접근 가능 경로**: `/admin/login` (공개 접근)
- **인증 필요 경로**: `/admin/**` (로그인 제외 모든 경로)
- **접근 제어**: 미들웨어에서 JWT 토큰 검증

#### 4-2-2. 인증 미들웨어 구현

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 관리자 경로 접근 제어
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token');
    
    if (!token) {
      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      // 토큰 검증
      const decoded = verifyToken(token.value);
      if (!decoded) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch (error) {
      // 토큰 검증 실패 시 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // 일반 사용자가 관리자 경로에 직접 접근 시도 시 404
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token');
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

#### 4-2-3. 관리자 세션 관리

- **JWT 토큰**: 액세스 토큰 (15분 만료)
- **리프레시 토큰**: 갱신 토큰 (7일 만료)
- **세션 저장**: `AdminSession` 테이블에 저장 (DATABASE_SCHEMA.md 참조)
- **자동 로그아웃**: 토큰 만료 시 자동 로그아웃

#### 4-2-4. 보안 고려사항

- **Rate Limiting**: 로그인 시도 횟수 제한 (5회 실패 시 계정 잠금)
- **IP 추적**: 로그인 IP 주소 기록
- **세션 타임아웃**: 비활성 시간 30분 초과 시 자동 로그아웃
- **CSRF 보호**: 관리자 API 요청 시 CSRF 토큰 검증

## 5. 변경 표기

- 파일 상단 `@modified` 규격 주석, 교체 시 `@deprecated`와 마이그레이션 노트.

## 6. 커밋/PR 규칙

- 커밋은 **의도 단위**로, 접두어 `homepage|admin|api|shared:`.
- PR 본문: **위험도/영향/롤백/테스트 시나리오(≥3)** 필수.

## 7. 안전 리팩토링 체크리스트

- 공개 시그니처 유지 or compat, 스타일 전파 범위, 메타데이터 전파, ENV 토글로 원복 가능 등.

## 8~12. 클린코드·일관성(SoT·에러·주석·린트)

- **환경값 단일 출처**: `shared/config.ts`만 사용(직접 `process.env` 접근 금지).
- **하드코딩 금지**(URL/토큰/매직넘버).
- **safeFetch/safeCall** 의무화, ErrorBoundary/로딩·에러 UI 기본.
- 레이어드 구조(API→Services→Hooks→Components), 네이밍 규칙 일관, 린트 규칙 엄격 적용.

## 13. 모듈 로딩·코드 스플리팅

- 동일 모듈 **정적/동적 혼용 금지**.
- `apiClient`는 **정적 임포트 통일** 기본, 혼용 방지 ESLint 규칙·마이그레이션 가이드 제공.

## 14~16. 네이밍/상수·상태관리·컴포넌트

- camelCase/PascalCase/UPPER_SNAKE_CASE, 상수는 객체로 그룹화.
- 상태는 로컬 우선, 공유는 상위로, 서버상태 분리.
- 컴포넌트는 단일 책임, 100줄 넘기면 하위로 분리, 조건부 렌더는 Early return.

## 17. 타입 규칙

- **Interface**: 확장 가능한 객체, **Type**: Union/Utility.
- 도메인 타입은 `shared/types`, 엄격 타입으로 오타·남용 차단.

## 18. 주석·문서화

- 코드가 설명하는 What 대신 **Why**를 주석으로.
- JSDoc·파일 헤더 규격, TODO/FIXME 사용 지침.

## 19. Zod + Result 통합

- **경계에서만 검증**, 내부는 검증된 타입만.
- `safeValidate/parseWith/ensure/is` 패턴, **예외 대신 Result** 반환.

## 20. REST 메서드 규정

- GET/POST/PUT/PATCH/DELETE **정의·예시·오용 금지 사례** 명시.

## P0 블록(필수 운영 품질)

- **멱등성/동시성**: POST `Idempotency-Key`, 변경/삭제는 **ETag/If-Match**, PATCH는 set 기반.
- **관측성**: 전 구간 **Request-ID**, 구조화 로깅 스키마, 에러 표준화.
- **CI 게이트**: 머지 전 `lint + typecheck + unit + e2e(smoke)` 필수, PR 템플릿.
- **실시간 탄력성**: 지수 백오프+지터, 이벤트 de-dup/ACK, **event.version**.
- **비밀/자격증명**: 시크릿 커밋 금지·스캔, 중앙 보관·로테이션, 프런트 번들 포함 금지.
- **i18n/a11y**: 키 네이밍 스키마, 키보드·포커스·ARIA·대비 준수.
- **성능 예산**: 초기 JS < 200KB(gzip), LCP<2.5s, TBT<200ms, CLS<0.1. 번들 분석·예산 체크 스크립트.

## 21. 복잡도 회귀 방지

- 목표: **Cyclomatic ≤10**, 함수 ≤120줄, 파일 ≤500줄.
- Early return, 전략 맵, 훅·하위컴포넌트 분리, CI에서 초과 시 Fail.
- 복잡도 초과 시: 조건문 → 전략 맵, 중첩 루프 → 헬퍼 함수, 긴 switch → 객체 매핑.

## 22. 하드코딩 제거 & 동적 데이터

- 채널/설정은 **DB에서 동적 로드**가 기본.
- 기본값·폴백 하드코딩 금지, "데이터 없음" UI 명시 처리, 리뷰 차단 패턴 제공.
- **매직 넘버 금지**: 모든 숫자는 명명된 상수로 정의 (`TIMEOUT_MS`, `MAX_RETRIES` 등).

## 22-1. 린트 예방 필수 규칙 (Zero Tolerance)

### 📋 코드 작성 시 필수 체크리스트

**1. 매직 넘버 (Magic Numbers) 금지**
```typescript
// ❌ 나쁜 예
setTimeout(callback, 3000);
if (items.length > 100) return;

// ✅ 좋은 예
const TIMEOUT_MS = 3000;
const MAX_ITEMS = 100;
setTimeout(callback, TIMEOUT_MS);
if (items.length > MAX_ITEMS) return;
```

**2. 미사용 변수/임포트 금지**
```typescript
// ❌ 나쁜 예
import { A, B, C } from 'module'; // C는 미사용
const unusedVar = 123;

// ✅ 좋은 예
import { A, B } from 'module';
// 의도적으로 무시: const _unusedParam = data;
```

**3. console.log 금지**
```typescript
// ❌ 나쁜 예
console.log('Debug info:', data);

// ✅ 좋은 예
logger.debug(LogCategory.COMPONENT, LogAction.RENDER, 'Debug info', { data });
```

**4. any 타입 금지**
```typescript
// ❌ 나쁜 예
const data: any = await fetchData();

// ✅ 좋은 예
interface FetchData { id: string; name: string; }
const data: FetchData = await fetchData();
```

**5. React Hooks Dependencies 관리**
```typescript
// ❌ 나쁜 예
useEffect(() => {
  fetchData(userId);
}, []); // userId 누락

// ✅ 좋은 예
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

**6. 복잡도 관리 (Cyclomatic Complexity ≤ 10)**
```typescript
// ❌ 나쁜 예 (복잡도 15)
function processData(data, type, status, role) {
  if (type === 'A') {
    if (status === 'active') {
      if (role === 'admin') { /* ... */ }
      else if (role === 'user') { /* ... */ }
    } else if (status === 'inactive') { /* ... */ }
  } else if (type === 'B') { /* ... */ }
}

// ✅ 좋은 예 (복잡도 3)
const PROCESSORS = {
  A: { active: processAActive, inactive: processAInactive },
  B: { active: processBActive, inactive: processBInactive }
};

function processData(data, type, status) {
  const processor = PROCESSORS[type]?.[status];
  if (!processor) return handleUnknown(data);
  return processor(data);
}
```

### 🔍 커밋 전 필수 확인 (Pre-commit Checklist)

```bash
# 1. 린트 실행 (에러 0개 확인)
npm run lint

# 2. 타입 체크
npm run typecheck

# 3. 빌드 확인
npm run build

# 4. 린트 에러 자동 수정 시도
npm run lint -- --fix
```

### 📊 린트 경고 허용 기준

**절대 허용 불가 (Must Fix):**
- ❌ Parsing errors
- ❌ Type errors
- ❌ 미사용 변수 (`no-unused-vars`)
- ❌ console 사용 (`no-console`)
- ❌ any 타입 (`@typescript-eslint/no-explicit-any`)

**조건부 허용 (Justify Required):**
- ⚠️ 복잡도 초과: 리팩토링 TODO 이슈 생성 후 허용
- ⚠️ 파일 길이 초과: 분리 계획 명시 후 허용
- ⚠️ Magic numbers: 의미가 명확한 경우 (예: `Math.PI`, 배열 인덱스 0)

## 23. 이미지 관리 규칙 (소나버스 홈페이지 전용)

### 23-1. 이미지 저장소 구조

**폴더 구조:**
```
public/
├── images/              # 일반 이미지
│   ├── hero/           # 히어로 이미지
│   ├── products/       # 제품 이미지
│   ├── stories/        # 스토리 이미지
│   ├── press/          # 언론보도 이미지
│   └── common/         # 공통 이미지
├── product/            # 제품별 이미지
│   ├── manbo/         # 만보 제품 이미지
│   │   ├── hero/      # 히어로 이미지
│   │   ├── features/  # 기능 이미지
│   │   └── gallery/   # 갤러리 이미지
│   └── bodeum/        # 보듬 제품 이미지
│       ├── hero/
│       ├── products/  # 제품 라인업 이미지
│       └── gallery/
└── logo/               # 로고 이미지
    ├── ko_logo.png    # 한국어 로고
    ├── en_logo.png    # 영어 로고
    └── symbol_logo.png # 심볼 로고
```

### 23-2. 이미지 파일명 규칙

**일반 이미지:**
- 형식: `{category}-{name}-{size}.{ext}`
- 예: `hero-home-1920.webp`, `product-manbo-thumb-768.webp`

**제품 이미지:**
- 형식: `{product}-{type}-{variant}-{size}.{ext}`
- 예: `manbo-walker-hero-1920.webp`, `bodeum-diaper-panty-m-768.webp`

### 23-3. 이미지 최적화 필수 사항

- **포맷**: WebP/AVIF 우선 사용
- **Lazy Loading**: Hero 이미지 제외 모든 이미지에 적용
- **반응형**: `srcset` 및 `sizes` 속성 사용
- **Next.js Image**: `next/image` 컴포넌트 필수 사용
- **품질**: 적절한 품질 설정 (80-90% 권장)

### 23-4. 이미지 업로드 API (관리자 전용)

**이미지 업로드 (관리자 전용):**
```http
POST /api/admin/upload/image
Content-Type: multipart/form-data
Authorization: Bearer {admin_token}

Form Data:
- image: 파일 (10MB 제한, 이미지만)
- category: 이미지 카테고리 (hero, product, story, press, common)
- alt: 대체 텍스트 (선택)
```

### 23-5. 이미지 서빙

**정적 파일 서빙:**
- URL: `/images/{category}/{filename}`
- 예: `/images/hero/home-1920.webp`
- 캐시: 1년 (31536000초)
- CDN: Vercel Image Optimization 또는 Cloudinary

---

## 24. Sonaverse 홈페이지(웹) 전용 개발 규칙

> 이 섹션은 **소나버스 공식 홈페이지(Next.js 15 / App Router 기반)** 리뉴얼 작업에만 적용되는 추가 개발 규칙입니다.  
> 공통 규칙을 바탕으로, **성능·모듈화·일관된 UI/UX** 에 초점을 둡니다.

### 24-1. 기술 스택 전제

- **Next.js 15 (App Router)**, **React 19**, **TypeScript 5**, **Tailwind CSS 4**.
- i18n: `next-i18next` + `LanguageContext` (ko/en) 사용.
- 데이터: MongoDB(Mongoose) + Next.js API Routes.

### 24-2. 라우팅·폴더 구조 원칙

- App Router는 다음과 같이 **공개/관리자 그룹**으로 나눕니다.
  - `(public)` : 홈페이지, 제품, 스토리, 언론보도, 문의 등
  - `(admin)` : 관리자 대시보드 및 CMS 기능
- 기능(Feature) 단위로 보조 폴더를 구성합니다.
  - 예: `features/home`, `features/products/manbo`, `features/products/bodeum`, `features/stories`, `features/press`, `features/inquiry`
- 도메인 전용 로직·컴포넌트는 해당 도메인 폴더 안에서 최대한 자급자족하도록 구성합니다.

#### 24-2-1. 상세 폴더 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # 공개 페이지 그룹
│   │   ├── page.tsx             # 홈페이지
│   │   ├── products/
│   │   │   ├── manbo-walker/
│   │   │   └── bodeum-diaper/
│   │   ├── press/
│   │   ├── sonaverse-story/
│   │   └── inquiry/
│   └── (admin)/                  # 관리자 페이지 그룹
│       └── admin/
│           ├── login/           # 관리자 로그인 (공개 접근 가능)
│           ├── page.tsx         # 관리자 대시보드 (인증 필요)
│           └── ...
│
├── features/                     # 기능별 모듈화
│   ├── home/                     # 홈페이지 기능
│   │   ├── components/           # 홈 전용 컴포넌트
│   │   ├── hooks/                # 홈 전용 훅
│   │   └── lib/                  # 홈 전용 유틸리티
│   ├── products/                 # 제품 기능
│   │   ├── manbo/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── lib/
│   │   └── bodeum/
│   ├── stories/                  # 스토리 기능
│   ├── press/                    # 언론보도 기능
│   └── inquiry/                  # 문의 기능
│
├── shared/                       # 공유 모듈
│   ├── components/               # 공통 컴포넌트
│   │   ├── ui/                   # 기본 UI 컴포넌트
│   │   ├── layout/               # 레이아웃 컴포넌트
│   │   └── common/               # 공통 기능 컴포넌트
│   ├── hooks/                    # 공통 훅
│   ├── lib/                      # 공통 유틸리티
│   └── types/                    # 공통 타입
```

#### 24-2-2. API 레이어 구조

```
lib/
├── api/
│   ├── client.ts                 # API 클라이언트 설정
│   ├── press.ts                  # 언론보도 API
│   ├── stories.ts                # 스토리 API
│   ├── products.ts               # 제품 API
│   ├── inquiries.ts              # 문의 API
│   └── admin/                    # 관리자 API
│       ├── press.ts
│       └── stories.ts
```

- 클라이언트에서 직접 `/api/*` 호출 대신, 도메인별 API 래퍼 함수 사용
- API 함수는 `lib/api/<domain>.ts`에 위치
- 타입 안정성을 위해 TypeScript 인터페이스 정의 필수

### 24-3. 성능·이미지 최적화 규칙

- 모든 페이지는 **성능 예산**을 만족해야 합니다.
  - 초기 JS 번들(홈 기준, gzip) **200KB 이하**.
  - LCP < 2.5s, CLS < 0.1, TBT < 200ms.
- 이미지 관련:
  - `next/image` 사용을 기본으로 하고, `sizes` / `priority` / `loading` 을 명시합니다.
  - Hero 등 LCP에 영향을 주는 이미지만 `priority` / `preload` 사용.
  - 그 외 이미지는 `loading="lazy"` + Intersection Observer 기반 노출.
  - 이미지 리소스는 `public/images/**`, `public/product/**`, `public/logo/**` 등으로 일관되게 관리.

### 24-4. 데이터 페칭·API 연동

- 클라이언트에서 직접 `/api/*` 를 호출하기보다, **도메인별 API 래퍼**를 사용합니다.
  - 예: `lib/api/press.ts`, `lib/api/stories.ts`, `lib/api/products.ts`, `lib/api/inquiries.ts`
- 데이터 페칭 훅(`usePressList`, `useStories`, `useInquiryForm` 등)은:
  - 컴포넌트와 분리된 파일(`features/<domain>/hooks`)에 위치.
  - 로딩/에러 상태를 일관된 형태로 반환.
- 서버 컴포넌트/클라이언트 컴포넌트 역할을 명확히 나눕니다.
  - SSR/SSG 가능한 곳은 최대한 서버 컴포넌트 사용.
  - 사용자 상호작용이 많은 영역만 클라이언트 컴포넌트로 한정.

### 24-5. UI/UX 모듈화 규칙

- 공통 UI 요소는 `shared/components/ui` 또는 `shared/components/layout` 에서 관리합니다.
  - 버튼, 배지, 카드, 섹션 헤더, 레이아웃 래퍼 등.
- 도메인 전용 UI는 `features/<domain>/components` 에 두고, 필요 시 공통 컴포넌트로 승격(refactor) 합니다.
- 페이지 레벨 컴포넌트는 **섹션 단위 서브 컴포넌트**로 분리합니다.
  - 예: `HomeHeroSection`, `HomeProblemsSection`, `HomeProductsSection`, `HomeStoriesSection`, `HomePressSection`, `HomeTimelineSection`.

### 24-6. i18n·콘텐츠 관리

- 모든 사용자 노출 텍스트는 **다국어 구조**를 우선 고려합니다.
  - `public/locales/ko/common.json`, `public/locales/en/common.json` 등의 키 기반 관리.
  - 페이지/섹션별 주요 카피는 별도의 네임스페이스를 고려할 수 있습니다.
- 임시/테스트용 문구가 아닌 경우, 실제 서비스에서 사용하는 카피(예: "시니어의 더 나은 일상을 위해")를 그대로 사용합니다.

### 24-7. 페이지별 개발 가이드 (요약)

- **홈페이지 (`/`)**
  - 섹션: Hero, 우리가 해결하는 문제, 제품(만보/보듬), 소나버스 스토리, 회사 연혁, 언론보도.
  - Hero는 LCP 최적화 대상, 배경 이미지는 WebP/AVIF + 적절한 품질 설정.
  - 스토리/언론보도 섹션은 캐러셀/슬라이더 사용 시, JS 양을 최소화하고 CSS 전환 우선.

- **제품 – 만보 워크메이트 (`/products/manbo-walker`)**
  - Hero, 기존 보행기 문제 정의, 기능/특징, 스마트 기능, 개발 타임라인, CTA, 관련 스토리.
  - 제품 이미지는 동일 비율 유지, 모바일에서 세로 스크롤에 방해되지 않도록 구성.

- **제품 – 보듬 기저귀 (`/products/bodeum-diaper`)**
  - Hero, 제품 라인업, 카테고리 필터, 제품 카드, 관련 스토리.
  - 필터/정렬 로직은 전용 훅으로 분리(`useDiaperFilter` 등).

- **소나버스 스토리 (`/sonaverse-story`)**
  - 카테고리 필터, 메인 스토리 1개, 리스트 + "더보기", YouTube 썸네일/아이콘 처리.
  - 무한 스크롤 대신 "더보기" 버튼 우선, SEO에 유리한 SSR/SSG 고려.

- **언론보도 (`/press`)**
  - 카드 리스트 + 상세 페이지, 외부 링크 처리.
  - 모바일에서는 리스트 뷰, 데스크톱에서는 2~3열 그리드.

- **문의 (`/inquiry`)**
  - 문의 카테고리 선택(버튼 그룹), 폼 필드, 첨부파일, 개인정보 동의.
  - 유효성 검증은 클라이언트·서버 모두에서 수행, 에러 메시지는 명확한 한국어/영어 제공.

### 24-8. PR·코드 리뷰 시 추가로 볼 것 (홈페이지 전용)

- [ ] 이미지 용량/개수를 불필요하게 늘리지 않았는가?
- [ ] Hero 및 Above-the-fold 섹션이 Core Web Vitals 기준을 만족하는가?
- [ ] 새로운 컴포넌트/훅이 기능 단위 폴더 구조를 잘 따르고 있는가?
- [ ] i18n 키/텍스트가 하드코딩되지 않았는가?
- [ ] 접근성(a11y) 기본 규칙(키보드, ARIA, 대비 등)을 위반하지 않았는가?
- [ ] 일반 사용자에게 로그인 기능이 노출되지 않았는가?
- [ ] 관리자 경로 접근 제어가 올바르게 구현되었는가?

---

## PR·배포 직전 15가지 스냅 체크

1. 중복/삭제 참조 점검 ✅  2) @modified/@deprecated 표기 ✅  3) 파일·함수 길이 기준 ✅
2. env 접근은 `config.ts` 경유 ✅  5) safeFetch/에러 UI ✅  6) 상수·매직넘버 제거 ✅
3. REST 메서드 규정 준수 ✅  8) 타입 엄격·any 지양 ✅  9) 전략 맵/분리 적용 ✅
4. i18n/a11y 적용 ✅  11) 번들 예산 통과 ✅  12) 성능 예산 통과 ✅
5. 이미지 최적화 확인 ✅  14) 로그인 기능 제거 확인 ✅  15) CI 4종 통과 + 테스트 증빙 ✅

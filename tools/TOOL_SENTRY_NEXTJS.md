# 도구 가이드 – 에러·성능 모니터링 (`@sentry/nextjs`)

> **대상 프로젝트**: `sonaverse_re` 리뉴얼용 Next.js 15 / App Router  
> **목적**: 프로덕션 환경에서 발생하는 **에러·성능 이슈를 실시간으로 수집·분석**

---

## 1. 도구 개요

- **도구명**: `@sentry/nextjs`
- **역할**:
  - 서버/클라이언트 에러 자동 캡처
  - 성능 트레이싱(슬로우 API, 느린 페이지 전환) 수집
  - 에러 발생 시 알림(Slack/Email) 연동

---

## 2. 설치

```bash
npm install @sentry/nextjs
```

---

## 3. 기본 설정 구조 (Next.js 15 기준)

설치 후 Sentry CLI를 사용하거나, 수동으로 아래 파일들을 구성한다.

```text
sentry.client.config.ts
sentry.server.config.ts
sentry.edge.config.ts (필요시)
```

### 3.1 클라이언트 설정 예시

```ts
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

### 3.2 서버 설정 예시

```ts
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

---

## 4. 에러 로깅 패턴

```ts
import * as Sentry from '@sentry/nextjs'

try {
  // 위험한 로직
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

---

## 5. 리뉴얼 프로젝트 적용 권장 범위

- **관리자 영역**
  - `/admin/**` 페이지의 런타임 에러
  - 관리자 API (`/api/admin/**`) 내부 예외
- **공개 영역**
  - 문의 API 실패
  - 이미지 처리/파일 업로드 실패

> 에러 로그에는 PII(개인 식별 정보)를 최소한으로 포함하도록 주의한다.

---

## 6. 체크리스트

- [ ] Sentry DSN이 `.env`에 안전하게 설정되어 있는가?
- [ ] 프로덕션/스테이징 환경에서만 활성화되도록 설정했는가?
- [ ] 주요 비즈니스 로직에서 치명적인 에러를 `captureException`으로 남기고 있는가?



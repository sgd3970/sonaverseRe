# 도구 가이드 – API 요청 제한 (`rate-limiter-flexible`)

> **대상 프로젝트**: `sonaverse_re` 리뉴얼용 Next.js 15 / App Router  
> **목적**: 문의 API, 관리자 로그인 API 등에서 **과도한 트래픽·봇 공격을 방어**하기 위함

---

## 1. 도구 개요

- **도구명**: `rate-limiter-flexible`
- **역할**:
  - IP/토큰별 요청 횟수를 제한
  - DDoS/Brute-force 공격을 1차적으로 차단

---

## 2. 설치

```bash
npm install rate-limiter-flexible
```

---

## 3. 메모리 기반 Rate Limiter 예시

```ts
// src/shared/security/rateLimiter.ts
import { RateLimiterMemory } from 'rate-limiter-flexible'

export const inquiryRateLimiter = new RateLimiterMemory({
  points: 5, // 허용 요청 수
  duration: 60, // 초 단위 (여기서는 1분)
})
```

---

## 4. Next.js App Router – API 라우트 적용 예시

```ts
// app/api/inquiry/route.ts
import { inquiryRateLimiter } from '@/shared/security/rateLimiter'

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for') ??
    req.headers.get('x-real-ip') ??
    'unknown'

  try {
    await inquiryRateLimiter.consume(ip)
  } catch {
    return new Response('Too Many Requests', { status: 429 })
  }

  // 정상 처리 로직...
}
```

---

## 5. 리뉴얼 프로젝트 적용 권장 엔드포인트

- **공개 API**
  - `POST /api/inquiry` (문의 등록)
  - `POST /api/inquiry/upload` (파일 업로드)
- **관리자 API**
  - `POST /api/admin/login` (로그인 시도)

> 스팸/봇 공격 가능성이 높은 엔드포인트에 우선 적용.

---

## 6. 체크리스트

- [ ] 문의/로그인 등 민감 API에 Rate Limiting이 적용되어 있는가?
- [ ] 429 응답 시 사용자에게 적절한 메시지를 제공하는가?
- [ ] IP 추출 로직이 배포 환경(Vercel/프록시)과 맞게 설정되어 있는가?



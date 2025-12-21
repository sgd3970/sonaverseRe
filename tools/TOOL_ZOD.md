# 도구 가이드 – 타입·입력 검증 (`zod`)

> **대상 프로젝트**: `sonaverse_re` 리뉴얼용 Next.js 15 / App Router  
> **목적**: API 요청·응답, 폼 데이터에 대해 **런타임 타입 검증 + TypeScript 타입 동기화**를 제공

---

## 1. 도구 개요

- **도구명**: `zod`
- **역할**:
  - API 라우트에서 요청 Body/Query를 검증
  - DB 스키마(`DATABASE_SCHEMA.md`)와 API 스키마를 코드로 표현
  - 폼 입력값 검증 규칙을 한 곳에서 관리

---

## 2. 설치

리뉴얼 Next.js 프로젝트 루트에서:

```bash
npm install zod
```

---

## 3. 기본 사용 패턴

### 3.1 스키마 정의 + 타입 생성

```ts
import { z } from 'zod'

export const InquirySchema = z.object({
  inquiry_type: z.enum(['service_introduction', 'partnership', 'purchase']),
  name: z.string().min(1),
  position: z.string().optional(),
  company_name: z.string().optional(),
  phone_number: z.string().min(8),
  email: z.string().email(),
  message: z.string().min(10),
  privacy_consented: z.literal(true),
})

export type InquiryInput = z.infer<typeof InquirySchema>
```

### 3.2 Next.js App Router – API 라우트에서 사용

```ts
// app/api/inquiry/route.ts
import { InquirySchema } from '@/features/inquiry/schemas'

export async function POST(req: Request) {
  const json = await req.json()
  const parsed = InquirySchema.parse(json) // 실패 시 400 에러 처리

  // parsed는 타입 안전한 InquiryInput
}
```

---

## 4. 리뉴얼 프로젝트 적용 권장 위치

- `features/**/schemas.ts` 또는 `features/**/validation.ts` 파일에 스키마 모아두기
- 주요 도메인:
  - 문의 (`InquirySchema`)
  - 언론보도 등록/수정 (`PressReleaseSchema`)
  - 스토리 등록/수정 (`SonaverseStorySchema`)
  - 관리자 로그인 (`AdminLoginSchema`)

---

## 5. 체크리스트

- [ ] 모든 **POST/PUT/PATCH API**에 대해 `zod` 스키마가 정의되어 있는가?
- [ ] 스키마에서 유도된 타입(`z.infer`)을 서비스/리포지토리 계층에서 재사용하고 있는가?
- [ ] 오류 응답에서 어떤 필드가 왜 실패했는지 클라이언트에 전달하고 있는가?



# 도구 가이드 – 폼 상태 관리 (`react-hook-form` + `@hookform/resolvers`)

> **대상 프로젝트**: `sonaverse_re` 리뉴얼용 Next.js 15 / App Router  
> **목적**: 문의/관리자 폼에서 **최소 리렌더링, 높은 성능, 타입 안전한 폼 검증**을 제공

---

## 1. 도구 개요

- **도구명**:
  - `react-hook-form`
  - `@hookform/resolvers` (Zod 연동)
- **역할**:
  - 입력값, 에러, 제출 상태를 가볍게 관리
  - `zod` 스키마와 연결해 검증 로직을 재사용

---

## 2. 설치

```bash
npm install react-hook-form @hookform/resolvers
```

---

## 3. 기본 사용 패턴 (문의 폼 예시)

```ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InquirySchema, type InquiryInput } from '@/features/inquiry/schemas'

export function InquiryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(InquirySchema),
  })

  const onSubmit = async (data: InquiryInput) => {
    // API 호출
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <textarea {...register('message')} />
      {errors.message && <p>{errors.message.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        문의 보내기
      </button>
    </form>
  )
}
```

---

## 4. 리뉴얼 프로젝트 적용 권장 위치

- **공개 페이지**
  - `/inquiry` 문의 폼
- **관리자 페이지**
  - 언론보도 등록/수정 폼
  - 스토리 등록/수정 폼
  - 제품 등록/수정 폼
  - 관리자 계정 생성/수정 폼

구조 예시:

```text
src/
  features/
    inquiry/
      components/InquiryForm.tsx
      schemas.ts       # Zod 스키마
```

---

## 5. 체크리스트

- [ ] 주요 폼이 `react-hook-form` 기반으로 구현되어 있는가?
- [ ] 폼 검증 로직이 `zod` 스키마와 공유되고 있는가?
- [ ] 에러 메시지가 사용자 친화적인 한국어/영어로 제공되는가?
- [ ] 불필요한 리렌더링 없이 성능이 유지되고 있는가?



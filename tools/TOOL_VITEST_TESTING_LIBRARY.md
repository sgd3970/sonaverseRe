# 도구 가이드 – 테스트 (`vitest` + `@testing-library/react`)

> **대상 프로젝트**: `sonaverse_re` 리뉴얼용 Next.js 15 / App Router  
> **목적**: 핵심 컴포넌트·도메인 로직에 대해 **빠르고 가벼운 자동 테스트 환경**을 제공

---

## 1. 도구 개요

- **도구명**:
  - `vitest` / `@vitest/ui`
  - `@testing-library/react` / `@testing-library/jest-dom`
- **역할**:
  - Vitest: Vite 기반 테스트 러너 (Jest 대체)
  - Testing Library: 사용자 관점의 컴포넌트 테스트

---

## 2. 설치

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
```

---

## 3. 기본 설정 예시 (`vitest.config.ts`)

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

### 3.1 `vitest.setup.ts` 예시

```ts
import '@testing-library/jest-dom'
```

---

## 4. 컴포넌트 테스트 예시

```tsx
// src/features/inquiry/components/InquiryForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InquiryForm } from './InquiryForm'

test('이름과 이메일이 없으면 에러 메시지를 표시한다', async () => {
  render(<InquiryForm />)

  await userEvent.click(screen.getByRole('button', { name: /문의 보내기/i }))

  expect(screen.getByText(/이름을 입력해 주세요/i)).toBeInTheDocument()
  expect(screen.getByText(/이메일을 입력해 주세요/i)).toBeInTheDocument()
})
```

---

## 5. 리뉴얼 프로젝트에서 우선 테스트 대상

- 문의 폼 검증 로직
- 관리자 로그인 폼
- 핵심 레이아웃(헤더/푸터) 렌더링 여부
- 주요 목록 페이지(언론보도, 스토리)가 API 응답 형태에 맞게 렌더링되는지

---

## 6. 체크리스트

- [ ] `npm test` 또는 `npm run test` 스크립트가 구성되어 있는가?
- [ ] 핵심 경로(문의/관리자/제품 페이지)에 최소 1개 이상 테스트가 존재하는가?
- [ ] 회귀 버그가 발생했을 때, 관련 테스트 케이스가 추가되고 있는가?



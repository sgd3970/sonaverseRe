# 도구 가이드 – 자동 성능 측정 (`@lhci/cli` – Lighthouse CI)

> **대상 프로젝트**: `sonaverse_re` 리뉴얼용 Next.js 15 / App Router  
> **목적**: PR/배포 시마다 **성능·접근성·SEO 점수**를 자동으로 측정하고 기준 미달 시 감지

---

## 1. 도구 개요

- **도구명**: `@lhci/cli`
- **역할**:
  - Lighthouse를 CI 환경에서 자동 실행
  - 성능 점수·Core Web Vitals를 히스토리로 관리

---

## 2. 설치

```bash
npm install -D @lhci/cli
```

---

## 3. 기본 설정 파일 예시 (`.lighthouserc.js`)

```js
// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'started server',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
}
```

> 실제 프로젝트에서는 URL 목록에 `/`, `/products/**`, `/sonaverse-story`, `/press`, `/inquiry` 등을 추가한다.

---

## 4. npm 스크립트 예시

```json
{
  "scripts": {
    "lhci": "lhci autorun"
  }
}
```

실행:

```bash
npm run lhci
```

---

## 5. 리뉴얼 프로젝트에서의 활용 포인트

- **PR 검증**:
  - GitHub Actions 등에서 `lhci autorun`을 실행해, 성능 점수가 일정 기준 아래로 떨어지면 빌드를 실패시키는 용도
- **장기 추세 관리**:
  - 주요 페이지 LCP/FID/CLS 점수 변화를 릴리즈별로 추적

---

## 6. 체크리스트

- [ ] `.lighthouserc.js`에 최소한의 URL과 점수 기준이 정의되어 있는가?
- [ ] CI에서 `lhci autorun`이 주기적으로 실행되고 있는가?
- [ ] 성능 회귀가 발견되었을 때, 원인을 분석하고 문서화하고 있는가?



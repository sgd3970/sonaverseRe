# 도구 가이드 – 이미지 플레이스홀더 (`plaiceholder`)

> **대상 프로젝트**: `sonaverse_re` 리뉴얼용 Next.js 15 / App Router  
> **목적**: **Blur-up 플레이스홀더**를 사용해 LCP/CLS를 개선하고, 이미지 로딩 중에도 자연스러운 UX 제공

---

## 1. 도구 개요

- **도구명**: `plaiceholder`
- **역할**:
  - 원본 이미지로부터 Base64 Blur 데이터 생성
  - `next/image`의 `placeholder="blur"` + `blurDataURL` 값으로 사용

---

## 2. 설치

```bash
npm install plaiceholder
```

---

## 3. 유틸리티 함수 예시

```ts
// src/shared/images/getBlurDataURL.ts
import { getPlaiceholder } from 'plaiceholder'

export async function getBlurDataURL(imageUrl: string) {
  const buffer = await fetch(imageUrl).then(res => res.arrayBuffer())
  const { base64 } = await getPlaiceholder(Buffer.from(buffer))
  return base64
}
```

---

## 4. 서버 컴포넌트에서의 사용 예시

```tsx
// src/features/press/components/PressThumbnail.tsx
import Image from 'next/image'
import { getBlurDataURL } from '@/shared/images/getBlurDataURL'

export async function PressThumbnail({ src, alt }: { src: string; alt: string }) {
  const blurDataURL = await getBlurDataURL(src)

  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={250}
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  )
}
```

---

## 5. 리뉴얼 프로젝트 적용 권장 위치

- 메인 히어로 이미지 (`/`, `/products/**`)
- 스토리/언론보도 썸네일 (`/sonaverse-story`, `/press`)
- 갤러리/슬라이더 내 주요 이미지

> 단, 모든 이미지에 적용하기보다는 **Above-the-fold + 주요 썸네일**에만 선별 적용해 성능과 복잡도 밸런스를 맞춘다.

---

## 6. 체크리스트

- [ ] 주요 LCP 이미지에 Blur 플레이스홀더가 적용되어 있는가?
- [ ] 플레이스홀더 생성이 빌드 타임 또는 서버에서 효율적으로 처리되고 있는가?
- [ ] CLS를 유발하지 않도록 width/height가 명시되어 있는가?



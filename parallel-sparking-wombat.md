# 소나버스 프로젝트 종합 분석 및 개선 계획

## 분석 완료 항목

### 1. PC/모바일 환경 화면구성 일치성 ✅
**결론**: 데이터와 컨텐츠는 100% 일치, 레이아웃은 반응형으로 최적화

- **단일 컴포넌트 반응형 설계** 사용 (별도 PC/모바일 컴포넌트 분리 없음)
- Tailwind CSS 브레이크포인트 적극 활용 (292개 사용)
- 동일한 API 엔드포인트와 데이터 구조 사용
- 콘텐츠 패리티 보장 (숨겨진 페이지/기능 없음)

**개선 권장사항**:
- JavaScript 기반 반응형 로직(`isMobile` state)을 CSS로 대체
- 일부 하드코딩된 브레이크포인트 값(768px)을 Tailwind 토큰으로 변경

### 2. 데이터 스키마와 구현 코드 일치성 ✅
**심각한 불일치 발견**

**치명적 문제**:
1. **레거시 스키마 혼용**: 공개 Stories API는 레거시 스키마, 관리자 API는 신규 스키마 사용
2. **created_by 필수 필드 미처리**: 모든 POST API에서 임시 ObjectId 사용
3. **관리자 대시보드 전체 하드코딩**: 실제 데이터 대신 모조 데이터 표시
4. **제품 데이터 하드코딩**: Product 모델과 API 존재하나 사용하지 않음

**중간 문제**:
- 이미지 URL 변환 로직 누락
- Inquiry enum 불일치 (Zod 스키마가 모델보다 5개 타입 적음)
- updated_by 필드 미사용

### 3. CRUD 코드 상세 분석 ✅
**완성도**: 평균 72% (Inquiry 95%, Stories/Press 60-70%)

**치명적 보안 결함**:
- Admin API 전체에 인증 체크 없음 (누구나 생성/수정/삭제 가능)
- 한글 slug 생성 실패 (빈 문자열 생성)
- Race condition (History order 중복 가능)

**성능 이슈**:
- select() 미사용 (불필요한 필드 조회)
- skip 기반 페이지네이션 (대용량 데이터 시 느림)
- 인덱스 누락 (History.deleted_at)

### 4. 컨텐츠/이미지 로딩 최적화 ✅
**현재 상태**: 30% 최적화 (인프라는 준비, 실제 활용도 낮음)

**적용된 최적화**:
- Next.js Image 최적화 설정 (AVIF, WebP)
- OptimizedImage 컴포넌트 구현 (사용률 낮음)
- SWR 캐싱 (기본 설정)
- Bundle Analyzer 설정

**부족한 최적화**:
- 대부분 일반 `<img>` 태그 사용 (약 15개 이상)
- unoptimized={true} 설정으로 Next.js 최적화 비활성화
- above-the-fold 이미지에 priority 미설정
- ISR 미사용 (모든 페이지 동적 렌더링)
- Code splitting 없음 (동적 import 미사용)

### 5. 에디터 이미지 삽입 기능 ✅
**결론**: 현재 불가능, 하지만 백엔드는 준비됨

- **현재**: plain text textarea만 사용
- **모델**: ContentBlock 구조로 이미지 블록 지원 준비됨
- **API**: 이미지 업로드 API 구현 완료
- **필요**: 블록 에디터 라이브러리 도입 (Editor.js, TipTap 등)

### 6. 프로젝트 복잡도 및 클린코드 분석 ✅
**종합 점수**: 65/100 (운영 환경 조건부 적합)

**강점**:
- Feature-first 아키텍처 우수 (85점)
- 타입 안정성 양호 (80점)
- 모던한 기술 스택

**약점**:
- **테스트 전무** (0점) - 치명적
- 일부 컴포넌트 과도하게 비대 (InquiryForm 540줄)
- 에러 바운더리 없음
- Console.log 남용 (38개)

---

## 개선 계획 (우선순위별)

### Phase 1: Critical (즉시 수정 필요)

#### 1.1 보안 - Admin API 인증 추가
**파일**:
- `src/app/api/admin/stories/route.ts`
- `src/app/api/admin/press/route.ts`
- `src/app/api/admin/history/route.ts`

**수정 내용**:
```typescript
// 모든 Admin API 시작 부분에 추가
const session = await getSession();
if (!session) {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}
```

#### 1.2 데이터 무결성 - created_by/updated_by 필드 처리
**파일**: 모든 POST/PATCH API
**수정**: 임시 ObjectId 대신 세션의 userId 사용

#### 1.3 한글 slug 생성 수정
**파일**:
- `src/app/api/admin/stories/route.ts` (라인 111)
- `src/app/api/admin/press/route.ts` (라인 112)

**수정**: transliteration 라이브러리 또는 UUID 기반 slug 사용

#### 1.4 레거시 API 제거
**파일**: `src/app/api/stories/route.ts`
**수정**: LegacyStorySchema 제거, SonaverseStory 모델로 통합

### Phase 2: High Priority (1-2주 내)

#### 2.1 대시보드 실제 데이터 연동
**파일**:
- `src/app/admin/(dashboard)/page.tsx`
- `src/app/admin/(dashboard)/analytics/page.tsx`

**수정**: 하드코딩 데이터 제거, 실제 API 호출

#### 2.2 제품 페이지 동적 데이터 로딩
**파일**:
- `src/features/products/manbo/components/*.tsx`
- `src/features/products/bodume/components/*.tsx`

**수정**: Product API 연동, 하드코딩 제거

#### 2.3 이미지 최적화 적용
**파일**: 모든 `<img>` 태그 사용 컴포넌트

**수정**:
- `<img>` → `<OptimizedImage>` 또는 Next.js `<Image>` 변경
- unoptimized={true} 제거
- above-the-fold 이미지에 priority 추가

#### 2.4 테스트 코드 작성 (최소)
**파일**: 신규 생성
- `src/lib/hooks/__tests__/useInquiry.test.ts`
- `src/app/api/admin/auth/__tests__/login.test.ts`

**내용**: 핵심 API와 인증 로직 단위 테스트

#### 2.5 비대한 컴포넌트 리팩토링
**파일**:
- `src/features/inquiry/components/InquiryForm.tsx` (540줄)
- `src/app/admin/(dashboard)/analytics/page.tsx` (304줄)

**수정**: 역할별로 컴포넌트 분리 (200줄 이하 목표)

### Phase 3: Medium Priority (1개월 내)

#### 3.1 성능 최적화
- ISR 설정 (revalidate: 3600)
- Dynamic import로 code splitting
- SWRConfig 전역 설정
- Suspense 경계 추가

#### 3.2 에러 처리 개선
- ErrorBoundary 컴포넌트 구현
- 로깅 라이브러리 도입 (winston/pino)
- Console.log 제거 또는 환경별 분기

#### 3.3 블록 에디터 도입
**파일**:
- `src/app/admin/(dashboard)/stories/new/page.tsx`
- `src/app/admin/(dashboard)/press/new/page.tsx`

**라이브러리**: Editor.js 또는 TipTap
**기능**: 텍스트 중간 이미지 삽입 지원

#### 3.4 문서화
- JSDoc 주석 추가
- README 업데이트
- API 문서 자동 생성 (Swagger/OpenAPI)

### Phase 4: Low Priority (2-3개월 내) ✅

## 📊 테스트 실행 결과 (2025-12-21)

### E2E 테스트 결과
- **총 테스트**: 50개
- **통과**: 35개 (70%)
- **실패**: 15개
- **브라우저**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

**통과**: 홈페이지, 관리자 로그인, Press/Stories 목록, 메타 태그
**실패**: Press 상세 페이지(데이터 부재), 제품 페이지 H1 중복

#### 4.1 E2E 테스트 ✅
- ✅ Playwright 설정 완료 (chromium, firefox, webkit, mobile)
- ✅ 기본 E2E 테스트 완료:
  - `admin-dashboard.spec.ts` - 관리자 대시보드 네비게이션 (6개 테스트)
  - `admin-login.spec.ts` - 로그인 플로우 (2개 테스트)
  - `inquiry-flow.spec.ts` - 문의 제출 플로우 (3개 테스트)
  - `stories.spec.ts` - 스토리 페이지 (3개 테스트)
  - `press.spec.ts` - 보도자료 페이지 (3개 테스트)
  - `products.spec.ts` - 제품 페이지 (2개 테스트)
  - `home.spec.ts` - 홈페이지
- ✅ Admin CRUD 테스트 추가:
  - `admin-stories-crud.spec.ts` - Stories 생성/수정/삭제/검색
  - `admin-press-crud.spec.ts` - Press 생성/수정/삭제
- ✅ 접근성 자동화 테스트 추가:
  - `accessibility.spec.ts` - WCAG 2.1 AA 준수 (@axe-core/playwright)
  - 키보드 네비게이션 테스트
  - 스크린 리더 지원 테스트 (alt text, labels, headings)
  - 색상 대비 테스트
- ✅ 테스트 스크립트 추가 (package.json):
  - `npm run test:e2e` - 모든 E2E 테스트 실행
  - `npm run test:e2e:ui` - UI 모드로 테스트
  - `npm run test:a11y` - 접근성 테스트만 실행

#### 4.2 접근성 및 SEO ✅
- ✅ a11y 검토 및 개선:
  - eslint-plugin-jsx-a11y 설정 완료
  - @axe-core/react 개발 환경 통합 (A11yChecker 컴포넌트)
  - @axe-core/playwright E2E 접근성 테스트
- ✅ 구조화된 데이터 (Schema.org):
  - `StructuredData.tsx` 컴포넌트 생성
  - OrganizationSchema - 메인 layout에 적용
  - ProductSchema - 제품 페이지용
  - ArticleSchema - Stories/Press 페이지용
  - BreadcrumbSchema - 네비게이션용
  - FAQSchema - FAQ 페이지용
- ✅ Meta tags 최적화:
  - 동적 메타데이터 생성 (layout.tsx)
  - Open Graph 태그 (og:image, og:title, og:description)
  - Twitter Card 태그
  - robots meta tags
- ✅ 사이트맵 및 robots.txt:
  - `sitemap.ts` - 동적 사이트맵 (Stories, Press 포함)
  - `robots.txt` - SEO 크롤링 최적화

#### 4.3 모니터링 ✅
- ✅ Sentry 에러 추적:
  - `sentry.client.config.ts` 설정 완료
  - `sentry.server.config.ts` 설정 완료
  - `sentry.edge.config.ts` 설정 완료
  - Replay 기능 활성화 (에러 시 화면 녹화)
- ✅ Vercel Analytics & Speed Insights:
  - layout.tsx에 통합 완료
  - 실시간 성능 모니터링
- ✅ Google Analytics 4:
  - @next/third-parties/google 사용
  - 페이지뷰 자동 추적
  - layout.tsx에 통합 완료

---

## 운영 배포 체크리스트

### 필수 (Must Have)
- [ ] Admin API 인증 추가
- [ ] created_by/updated_by 필드 처리
- [ ] 한글 slug 생성 수정
- [ ] 레거시 API 제거
- [ ] 최소 테스트 코드 작성
- [ ] Console.log 제거
- [ ] ErrorBoundary 구현
- [ ] Rate limiting 추가

### 권장 (Should Have)
- [ ] 대시보드 실제 데이터 연동
- [ ] 제품 페이지 동적 로딩
- [ ] 이미지 최적화 적용
- [ ] 비대한 컴포넌트 리팩토링
- [ ] 로깅 라이브러리 도입

### 선택 (Nice to Have)
- [ ] ISR 설정
- [ ] Code splitting
- [ ] 블록 에디터 도입
- [ ] E2E 테스트
- [ ] 접근성 개선

---

## 예상 일정

```
Week 1-2:  Phase 1 (Critical) 완료
Week 3-4:  Phase 2 (High) 일부 완료
Week 5-8:  Phase 2 완료 + Phase 3 시작
Week 9-12: Phase 3 완료 + Phase 4 시작
```

---

## 주요 파일 경로 참조

### 보안 관련
- 인증: `src/lib/auth/index.ts`
- Admin API: `src/app/api/admin/**/*.ts`

### 데이터 모델
- Stories: `src/lib/models/SonaverseStory.ts`
- Press: `src/lib/models/PressRelease.ts`
- Inquiry: `src/lib/models/Inquiry.ts`
- History: `src/lib/models/History.ts`

### 이미지 최적화
- OptimizedImage: `src/shared/components/ui/OptimizedImage.tsx`
- 사용처: `src/app/stories/[id]/page.tsx`

### 비대한 컴포넌트
- InquiryForm: `src/features/inquiry/components/InquiryForm.tsx`
- AdminAnalytics: `src/app/admin/(dashboard)/analytics/page.tsx`

### 에디터
- Stories 생성: `src/app/admin/(dashboard)/stories/new/page.tsx`
- Press 생성: `src/app/admin/(dashboard)/press/new/page.tsx`

---

## 최종 권장사항

**현재 상태**: 프로토타입 단계에서 운영 전환 직전 (65/100점)

**운영 배포 가능 여부**: ⚠️ 조건부 가능
- Phase 1 (Critical) 항목 해결 후 배포 가능
- 테스트 없이 배포는 매우 위험
- 최소 2-3주의 품질 개선 기간 권장

**개선 후 예상 점수**: 80-85/100점 (운영 환경 적합)

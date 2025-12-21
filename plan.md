소나버스 프로젝트 종합 분석 및 개선 계획
분석 완료 항목
1. PC/모바일 환경 화면구성 일치성 ✅
결론: 데이터와 컨텐츠는 100% 일치, 레이아웃은 반응형으로 최적화
단일 컴포넌트 반응형 설계 사용 (별도 PC/모바일 컴포넌트 분리 없음)
Tailwind CSS 브레이크포인트 적극 활용 (292개 사용)
동일한 API 엔드포인트와 데이터 구조 사용
콘텐츠 패리티 보장 (숨겨진 페이지/기능 없음)
개선 권장사항:
JavaScript 기반 반응형 로직(isMobile state)을 CSS로 대체
일부 하드코딩된 브레이크포인트 값(768px)을 Tailwind 토큰으로 변경
2. 데이터 스키마와 구현 코드 일치성 ✅
심각한 불일치 발견 치명적 문제:
레거시 스키마 혼용: 공개 Stories API는 레거시 스키마, 관리자 API는 신규 스키마 사용
created_by 필수 필드 미처리: 모든 POST API에서 임시 ObjectId 사용
관리자 대시보드 전체 하드코딩: 실제 데이터 대신 모조 데이터 표시
제품 데이터 하드코딩: Product 모델과 API 존재하나 사용하지 않음
중간 문제:
이미지 URL 변환 로직 누락
Inquiry enum 불일치 (Zod 스키마가 모델보다 5개 타입 적음)
updated_by 필드 미사용
3. CRUD 코드 상세 분석 ✅
완성도: 평균 72% (Inquiry 95%, Stories/Press 60-70%) 치명적 보안 결함:
Admin API 전체에 인증 체크 없음 (누구나 생성/수정/삭제 가능)
한글 slug 생성 실패 (빈 문자열 생성)
Race condition (History order 중복 가능)
성능 이슈:
select() 미사용 (불필요한 필드 조회)
skip 기반 페이지네이션 (대용량 데이터 시 느림)
인덱스 누락 (History.deleted_at)
4. 컨텐츠/이미지 로딩 최적화 ✅
현재 상태: 30% 최적화 (인프라는 준비, 실제 활용도 낮음) 적용된 최적화:
Next.js Image 최적화 설정 (AVIF, WebP)
OptimizedImage 컴포넌트 구현 (사용률 낮음)
SWR 캐싱 (기본 설정)
Bundle Analyzer 설정
부족한 최적화:
대부분 일반 <img> 태그 사용 (약 15개 이상)
unoptimized={true} 설정으로 Next.js 최적화 비활성화
above-the-fold 이미지에 priority 미설정
ISR 미사용 (모든 페이지 동적 렌더링)
Code splitting 없음 (동적 import 미사용)
5. 에디터 이미지 삽입 기능 ✅
결론: 현재 불가능, 하지만 백엔드는 준비됨
현재: plain text textarea만 사용
모델: ContentBlock 구조로 이미지 블록 지원 준비됨
API: 이미지 업로드 API 구현 완료
필요: 블록 에디터 라이브러리 도입 (Editor.js, TipTap 등)
6. 프로젝트 복잡도 및 클린코드 분석 ✅
종합 점수: 65/100 (운영 환경 조건부 적합) 강점:
Feature-first 아키텍처 우수 (85점)
타입 안정성 양호 (80점)
모던한 기술 스택
약점:
테스트 전무 (0점) - 치명적
일부 컴포넌트 과도하게 비대 (InquiryForm 540줄)
에러 바운더리 없음
Console.log 남용 (38개)
개선 계획 (우선순위별)
Phase 1: Critical (즉시 수정 필요)
1.1 보안 - Admin API 인증 추가
파일:
src/app/api/admin/stories/route.ts
src/app/api/admin/press/route.ts
src/app/api/admin/history/route.ts
수정 내용:

// 모든 Admin API 시작 부분에 추가
const session = await getSession();
if (!session) {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}
1.2 데이터 무결성 - created_by/updated_by 필드 처리
파일: 모든 POST/PATCH API 수정: 임시 ObjectId 대신 세션의 userId 사용
1.3 한글 slug 생성 수정
파일:
src/app/api/admin/stories/route.ts (라인 111)
src/app/api/admin/press/route.ts (라인 112)
수정: transliteration 라이브러리 또는 UUID 기반 slug 사용
1.4 레거시 API 제거
파일: src/app/api/stories/route.ts 수정: LegacyStorySchema 제거, SonaverseStory 모델로 통합
Phase 2: High Priority (1-2주 내)
2.1 대시보드 실제 데이터 연동
파일:
src/app/admin/(dashboard)/page.tsx
src/app/admin/(dashboard)/analytics/page.tsx
수정: 하드코딩 데이터 제거, 실제 API 호출
2.2 제품 페이지 동적 데이터 로딩
파일:
src/features/products/manbo/components/*.tsx
src/features/products/bodume/components/*.tsx
수정: Product API 연동, 하드코딩 제거
2.3 이미지 최적화 적용
파일: 모든 <img> 태그 사용 컴포넌트 수정:
<img> → <OptimizedImage> 또는 Next.js <Image> 변경
unoptimized={true} 제거
above-the-fold 이미지에 priority 추가
2.4 테스트 코드 작성 (최소)
파일: 신규 생성
src/lib/hooks/__tests__/useInquiry.test.ts
src/app/api/admin/auth/__tests__/login.test.ts
내용: 핵심 API와 인증 로직 단위 테스트
2.5 비대한 컴포넌트 리팩토링
파일:
src/features/inquiry/components/InquiryForm.tsx (540줄)
src/app/admin/(dashboard)/analytics/page.tsx (304줄)
수정: 역할별로 컴포넌트 분리 (200줄 이하 목표)
Phase 3: Medium Priority (1개월 내)
3.1 성능 최적화
ISR 설정 (revalidate: 3600)
Dynamic import로 code splitting
SWRConfig 전역 설정
Suspense 경계 추가
3.2 에러 처리 개선
ErrorBoundary 컴포넌트 구현
로깅 라이브러리 도입 (winston/pino)
Console.log 제거 또는 환경별 분기
3.3 블록 에디터 도입
파일:
src/app/admin/(dashboard)/stories/new/page.tsx
src/app/admin/(dashboard)/press/new/page.tsx
라이브러리: Editor.js 또는 TipTap 기능: 텍스트 중간 이미지 삽입 지원
3.4 문서화
JSDoc 주석 추가
README 업데이트
API 문서 자동 생성 (Swagger/OpenAPI)
Phase 4: Low Priority (2-3개월 내)
4.1 E2E 테스트
Playwright 또는 Cypress 도입
주요 플로우 테스트 (문의 제출, 로그인 등)
4.2 접근성 및 SEO
a11y 검토 및 개선
구조화된 데이터 (Schema.org)
Meta tags 최적화
4.3 모니터링
Sentry 에러 추적
Vercel Analytics 성능 모니터링
실시간 통계 (Google Analytics 4)
운영 배포 체크리스트
필수 (Must Have)
 Admin API 인증 추가
 created_by/updated_by 필드 처리
 한글 slug 생성 수정
 레거시 API 제거
 최소 테스트 코드 작성
 Console.log 제거
 ErrorBoundary 구현
 Rate limiting 추가
권장 (Should Have)
 대시보드 실제 데이터 연동
 제품 페이지 동적 로딩
 이미지 최적화 적용
 비대한 컴포넌트 리팩토링
 로깅 라이브러리 도입
선택 (Nice to Have)
 ISR 설정
 Code splitting
 블록 에디터 도입
 E2E 테스트
 접근성 개선
예상 일정

Week 1-2:  Phase 1 (Critical) 완료
Week 3-4:  Phase 2 (High) 일부 완료
Week 5-8:  Phase 2 완료 + Phase 3 시작
Week 9-12: Phase 3 완료 + Phase 4 시작
주요 파일 경로 참조
보안 관련
인증: src/lib/auth/index.ts
Admin API: src/app/api/admin/**/*.ts
데이터 모델
Stories: src/lib/models/SonaverseStory.ts
Press: src/lib/models/PressRelease.ts
Inquiry: src/lib/models/Inquiry.ts
History: src/lib/models/History.ts
이미지 최적화
OptimizedImage: src/shared/components/ui/OptimizedImage.tsx
사용처: src/app/stories/[id]/page.tsx
비대한 컴포넌트
InquiryForm: src/features/inquiry/components/InquiryForm.tsx
AdminAnalytics: src/app/admin/(dashboard)/analytics/page.tsx
에디터
Stories 생성: src/app/admin/(dashboard)/stories/new/page.tsx
Press 생성: src/app/admin/(dashboard)/press/new/page.tsx
최종 권장사항
현재 상태: 프로토타입 단계에서 운영 전환 직전 (65/100점) 운영 배포 가능 여부: ⚠️ 조건부 가능
Phase 1 (Critical) 항목 해결 후 배포 가능
테스트 없이 배포는 매우 위험
최소 2-3주의 품질 개선 기간 권장
개선 후 예상 점수: 80-85/100점 (운영 환경 적합)
User approved the plan
완벽합니다! 모든 분석이 완료되었고 상세한 개선 계획이 수립되었습니다. 분석 결과를 요약하면:
📊 종합 분석 결과
현재 프로젝트 상태: 65/100점
✅ 잘된 점:
Feature-first 아키텍처 우수
타입 안정성 양호 (TypeScript strict mode)
모던한 기술 스택 (Next.js 16, React 19)
PC/모바일 반응형 설계 일관성
🚨 치명적 문제:
Admin API 전체 인증 부재 (누구나 수정 가능!)
테스트 코드 전무 (0%)
대시보드/제품 페이지 하드코딩
한글 slug 생성 실패
레거시 API 혼용
운영 배포 가능 여부: ⚠️ 조건부 가능
Phase 1 (Critical) 항목만 해결하면 배포 가능
최소 2-3주의 개선 기간 필요
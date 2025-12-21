# 환경 변수 설정 가이드 (Phase 4)

Phase 4에서 추가된 환경 변수들의 설정 방법을 안내합니다.

## 📋 필수 환경 변수

### 1. `NEXT_PUBLIC_SITE_URL`

**설명**: 사이트의 기본 URL입니다. SEO 메타데이터, 사이트맵, 구조화된 데이터에서 사용됩니다.

**설정 방법**:

#### 로컬 개발 환경
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 프로덕션 환경
```env
# 실제 배포된 도메인으로 설정
NEXT_PUBLIC_SITE_URL=https://sonaverse.kr

# 또는 Vercel 배포 시
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**참고**: 
- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트 사이드에서도 접근 가능합니다
- 프로토콜(`https://`)을 포함한 전체 URL을 입력하세요
- 마지막에 슬래시(`/`)는 붙이지 마세요

---

### 2. `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN`

**설명**: Sentry 에러 추적 서비스의 DSN(Data Source Name)입니다. 프로덕션 환경에서 발생하는 에러를 추적합니다.

**설정 방법**:

#### 1단계: Sentry 계정 생성 및 프로젝트 생성
1. [Sentry.io](https://sentry.io)에 가입
2. 새 프로젝트 생성 (Next.js 선택)
3. 프로젝트 설정에서 DSN 복사

#### 2단계: 환경 변수 설정
```env
# 클라이언트 사이드용 (브라우저에서 실행되는 코드)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# 서버 사이드용 (서버에서 실행되는 코드)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

**참고**:
- 보통 두 값은 동일합니다
- DSN 형식: `https://[키]@[조직].ingest.sentry.io/[프로젝트ID]`
- Sentry는 프로덕션 환경에서만 활성화됩니다 (개발 환경에서는 비활성화)

**예시**:
```env
NEXT_PUBLIC_SENTRY_DSN=https://abc123def456@o1234567.ingest.sentry.io/1234567
SENTRY_DSN=https://abc123def456@o1234567.ingest.sentry.io/1234567
```

---

### 3. `NEXT_PUBLIC_GA_ID`

**설명**: Google Analytics 4 (GA4) 측정 ID입니다. 사용자 행동 분석에 사용됩니다.

**설정 방법**:

#### 1단계: Google Analytics 4 프로퍼티 생성
1. [Google Analytics](https://analytics.google.com)에 로그인
2. 관리 → 속성 만들기
3. 속성 설정에서 측정 ID 복사 (G-로 시작)

#### 2단계: 환경 변수 설정
```env
# Google Analytics 4 측정 ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**예시**:
```env
NEXT_PUBLIC_GA_ID=G-ABC123DEF4
```

**참고**:
- 측정 ID는 `G-`로 시작하는 10자리 문자열입니다
- 이 변수가 설정되지 않으면 Google Analytics는 로드되지 않습니다
- 개인정보 보호를 위해 GDPR 준수 설정을 확인하세요

---

### 4. `ADMIN_TEST_EMAIL` / `ADMIN_TEST_PASSWORD`

**설명**: E2E 테스트(Playwright)에서 사용할 관리자 계정 정보입니다.

**설정 방법**:

#### 옵션 1: 실제 관리자 계정 사용 (권장하지 않음)
```env
ADMIN_TEST_EMAIL=admin@sonaverse.kr
ADMIN_TEST_PASSWORD=실제비밀번호
```

#### 옵션 2: 테스트 전용 계정 생성 (권장)
```env
# 테스트 전용 관리자 계정 생성 후
ADMIN_TEST_EMAIL=test-admin@sonaverse.kr
ADMIN_TEST_PASSWORD=test-password-1234
```

**참고**:
- 이 계정은 E2E 테스트에서만 사용됩니다
- 프로덕션 환경에서는 사용하지 않는 것이 좋습니다
- `.env.local` 파일에만 저장하고 Git에 커밋하지 마세요
- 테스트 계정은 실제 데이터에 영향을 주지 않도록 주의하세요

**예시**:
```env
ADMIN_TEST_EMAIL=test@example.com
ADMIN_TEST_PASSWORD=Test1234!
```

---

## 📝 전체 환경 변수 예시

### `.env.local` (로컬 개발용)

```env
# 사이트 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Sentry (선택사항 - 개발 환경에서는 비활성화 가능)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=

# Google Analytics (선택사항 - 개발 환경에서는 비활성화 가능)
NEXT_PUBLIC_GA_ID=

# E2E 테스트용 관리자 계정
ADMIN_TEST_EMAIL=test-admin@sonaverse.kr
ADMIN_TEST_PASSWORD=test-password-1234

# 기존 환경 변수들
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
# ... 기타 변수들
```

### 프로덕션 환경 (Vercel)

Vercel 대시보드 → Project Settings → Environment Variables에서 설정:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://sonaverse.kr` | Production |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://...@...ingest.sentry.io/...` | Production |
| `SENTRY_DSN` | `https://...@...ingest.sentry.io/...` | Production |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Production |
| `ADMIN_TEST_EMAIL` | (테스트용 계정) | Production (선택) |
| `ADMIN_TEST_PASSWORD` | (테스트용 비밀번호) | Production (선택) |

---

## 🔒 보안 주의사항

1. **절대 Git에 커밋하지 마세요**
   - `.env.local` 파일은 `.gitignore`에 포함되어 있습니다
   - 실제 비밀번호나 API 키를 Git에 올리지 마세요

2. **환경별 분리**
   - 개발 환경과 프로덕션 환경의 값은 다르게 설정하세요
   - 특히 `ADMIN_TEST_PASSWORD`는 프로덕션에서 사용하지 않는 것이 좋습니다

3. **권한 관리**
   - Sentry와 Google Analytics는 적절한 권한으로만 접근 가능하도록 설정하세요

---

## ✅ 설정 확인 방법

### 1. 환경 변수 로드 확인
```bash
# 개발 서버 실행 후 브라우저 콘솔에서
console.log(process.env.NEXT_PUBLIC_SITE_URL)
```

### 2. Sentry 동작 확인
- 프로덕션 환경에서 의도적으로 에러 발생
- Sentry 대시보드에서 에러 확인

### 3. Google Analytics 동작 확인
- Google Analytics 실시간 보고서에서 방문자 확인
- 브라우저 개발자 도구 → Network 탭에서 `gtag` 요청 확인

### 4. E2E 테스트 실행
```bash
npx playwright test e2e/admin-dashboard.spec.ts
```

---

## 🆘 문제 해결

### Sentry가 작동하지 않는 경우
- DSN이 올바른지 확인
- `NODE_ENV=production`인지 확인
- Sentry 프로젝트 설정에서 Next.js SDK가 활성화되어 있는지 확인

### Google Analytics가 작동하지 않는 경우
- 측정 ID가 `G-`로 시작하는지 확인
- 브라우저에서 광고 차단기가 비활성화되어 있는지 확인
- Google Analytics 실시간 보고서에서 확인

### E2E 테스트가 실패하는 경우
- 관리자 계정이 실제로 존재하는지 확인
- 비밀번호가 올바른지 확인
- 데이터베이스 연결이 정상인지 확인





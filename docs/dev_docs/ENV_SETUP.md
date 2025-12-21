# 환경 변수 설정 가이드

> **목적**: 리뉴얼 프로젝트(sonaverseRe)에서 사용할 환경 변수 목록 및 설정 방법

---

## 1. MongoDB URI

### 새 데이터베이스 URI

```env
MONGODB_URI=mongodb+srv://sonaverse-admin:sqtB1kkDjONgEJeR@sonaverse.zc4opeo.mongodb.net/sonaverseRe?retryWrites=true&w=majority&appName=sonaverse
```

### 주요 변경점

| 구분 | 기존 (sonaverse) | 신규 (sonaverseRe) |
|------|------------------|---------------------|
| 데이터베이스명 | `sonaverse` | `sonaverseRe` |
| URI 경로 | `.net/sonaverse?` | `.net/sonaverseRe?` |

---

## 2. 전체 환경 변수 목록

### 필수 (Required)

```env
# MongoDB
MONGODB_URI=mongodb+srv://sonaverse-admin:sqtB1kkDjONgEJeR@sonaverse.zc4opeo.mongodb.net/sonaverseRe?retryWrites=true&w=majority&appName=sonaverse

# JWT 인증
JWT_SECRET=your-jwt-secret-key-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-here

# 앱 기본
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 선택 (Optional)

```env
# 이메일 (Resend)
RESEND_API_KEY=your-resend-api-key

# 이메일 (Nodemailer - 대안)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# 파일 스토리지 (Vercel Blob)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Sentry (에러 추적)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 사이트 URL (SEO 및 메타데이터용)
NEXT_PUBLIC_SITE_URL=https://sonaverse.kr

# E2E 테스트용 관리자 계정
ADMIN_TEST_EMAIL=test-admin@sonaverse.kr
ADMIN_TEST_PASSWORD=test-password-1234

# Vercel Analytics (Vercel 배포 시 자동)
# VERCEL_ANALYTICS_ID=auto
```

---

## 3. 로컬 개발 환경 설정

### 3.1 `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 위 변수들을 추가합니다.

```bash
# .env.local 예시
MONGODB_URI=mongodb+srv://sonaverse-admin:sqtB1kkDjONgEJeR@sonaverse.zc4opeo.mongodb.net/sonaverseRe?retryWrites=true&w=majority&appName=sonaverse
JWT_SECRET=dev-jwt-secret-12345
JWT_REFRESH_SECRET=dev-jwt-refresh-secret-67890
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2 `.env.example` 파일 (팀 공유용)

실제 값 없이 변수 이름만 포함한 템플릿을 만들어 Git에 커밋합니다.

```env
# .env.example
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
NEXT_PUBLIC_APP_URL=
RESEND_API_KEY=
BLOB_READ_WRITE_TOKEN=
SENTRY_DSN=
```

---

## 4. Vercel 배포 환경 설정

Vercel 대시보드 → Project Settings → Environment Variables에서 설정합니다.

### Production 환경

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGODB_URI` | (실제 URI) | Production |
| `JWT_SECRET` | (강력한 랜덤 문자열) | Production |
| `JWT_REFRESH_SECRET` | (강력한 랜덤 문자열) | Production |
| `NEXT_PUBLIC_APP_URL` | `https://www.sonaverse.kr` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://www.sonaverse.kr` | Production |
| `NEXT_PUBLIC_SENTRY_DSN` | (Sentry DSN) | Production |
| `SENTRY_DSN` | (Sentry DSN) | Production |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Production |
| `RESEND_API_KEY` | (실제 API 키) | Production |
| `BLOB_READ_WRITE_TOKEN` | (Vercel Blob 토큰) | Production |
| `SENTRY_DSN` | (Sentry DSN) | Production |

### Preview 환경 (PR 미리보기)

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGODB_URI` | (테스트용 DB URI) | Preview |
| `JWT_SECRET` | (테스트용) | Preview |
| `NEXT_PUBLIC_APP_URL` | `https://sonaverse-preview.vercel.app` | Preview |

---

## 5. JWT 시크릿 생성 방법

### Node.js로 생성

```javascript
// 터미널에서 실행
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### OpenSSL로 생성

```bash
openssl rand -hex 64
```

### 권장 길이

- `JWT_SECRET`: 64자 이상
- `JWT_REFRESH_SECRET`: 64자 이상 (JWT_SECRET과 다른 값)

---

## 6. 컬렉션 목록 (sonaverseRe)

`MONGODB_URI`에 연결된 데이터베이스에 다음 22개 컬렉션이 생성되어 있습니다:

| # | 컬렉션 | 설명 |
|---|--------|------|
| 1 | `adminusers` | 관리자 계정 |
| 2 | `adminsessions` | 관리자 세션 |
| 3 | `pressreleases` | 언론보도 |
| 4 | `sonaversestories` | 소나버스 스토리 |
| 5 | `categories` | 카테고리 |
| 6 | `tags` | 태그 |
| 7 | `companyhistories` | 회사 연혁 |
| 8 | `seos` | SEO 메타데이터 |
| 9 | `products` | 제품 |
| 10 | `productcategories` | 제품 카테고리 |
| 11 | `productvariants` | 제품 변형 |
| 12 | `productimages` | 제품 이미지 |
| 13 | `images` | 이미지 메타데이터 |
| 14 | `imagevariants` | 이미지 변형 |
| 15 | `imageusages` | 이미지 사용처 |
| 16 | `inquiries` | 문의 |
| 17 | `inquiryfiles` | 문의 첨부파일 |
| 18 | `visitorlogs` | 방문자 로그 (90일 TTL) |
| 19 | `pageviews` | 페이지 뷰 (90일 TTL) |
| 20 | `analytics` | 분석 데이터 |
| 21 | `systemsettings` | 시스템 설정 |
| 22 | `files` | 파일 관리 |

---

**작성일**: 2025년 1월  
**상태**: 환경 변수 가이드 완료

